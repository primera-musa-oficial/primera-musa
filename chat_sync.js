window.abrirSoporte = async function() {
  ver("vChat");
  const b = (window.MIS_BOTS && window.MIS_BOTS.at(window.IDX || 0)) || { usuario: "Zoe305" };
  const u = String(b.usuario || "Zoe305").trim();
  let arr = window._chatArr || [{ from: "admin", txt: "Hola @" + u + "! ¿En que podemos ayudarte hoy?", time: "Ahora" }];
  try {
    const res = await sb("mensajes_chat?usuario=ilike." + encodeURIComponent(u) + "&order=id.asc&_t=" + Date.now());
    const r = Array.isArray(res) ? res : (res && typeof res.json === "function" && res.ok ? await res.json() : []);
    if (Array.isArray(r) && r.length) {
      arr = r.map(x => ({ from: x.remitente === "admin" ? "admin" : "client", txt: x.mensaje, time: x.hora || "" }));
    }
  } catch (e) {}
  window._chatArr = arr;
  cMsgs.innerHTML = arr.map(m => `<div style="align-self:${m.from === "client" ? "flex-end" : "flex-start"};max-width:80%;background:${m.from === "client" ? "#4c1d3d" : "#1f1b29"};padding:8px 12px;border-radius:10px;font-size:12.5px"><div>${m.txt}</div><div style="font-size:10px;color:#alaaaa;margin-top:3px;text-align:right">${m.time}</div></div>`).join("");
  cMsgs.scrollTop = cMsgs.scrollHeight;
};

window.mandarMsg = async function() {
  if (!cInp.value.trim()) return;
  const b = (window.MIS_BOTS && window.MIS_BOTS.at(window.IDX || 0)) || { usuario: "Zoe305" };
  const u = String(b.usuario || "Zoe305").trim();
  const txt = cInp.value.trim();
  cInp.value = "";
  const d = new Date(), p = n => String(n).padStart(2, "0");
  const fch = p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear() + ", " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  window._chatArr = window._chatArr || [{ from: "admin", txt: "Hola @" + u + "! ¿En que podemos ayudarte hoy?", time: "Ahora" }];
  window._chatArr.push({ from: "client", txt, time: fch });
  cMsgs.innerHTML += `<div style="align-self:flex-end;max-width:80%;background:#4c1d3d;padding:8px 12px;border-radius:10px;font-size:12.5px"><div>${txt}</div><div style="font-size:10px;color:#alaaaa;margin-top:3px;text-align:right">${fch}</div></div>`;
  cMsgs.scrollTop = cMsgs.scrollHeight;
  try {
    const pr = await sb("mensajes_chat", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ usuario: u, remitente: "client", mensaje: txt, hora: fch })
    });
    if (pr && pr.ok === false) alert("Error chat: " + await pr.text());
  } catch (e) { alert("Error red: " + e.message); }
};

window.cargarChatsNube = async function() {
  try {
    const res = await sb("mensajes_chat?select=*&order=id.asc&_t=" + Date.now());
    const rows = Array.isArray(res) ? res : (res && typeof res.json === "function" && res.ok ? await res.json() : []);
    const nuevo = {};
    (rows || []).forEach(m => {
      const u = String(m.usuario || "").trim();
      if (!u) return;
      if (!nuevo.hasOwnProperty(u)) nuevo[u] = [];
      nuevo[u].push({ from: m.remitente === "admin" ? "admin" : "client", txt: m.mensaje, time: m.hora || "" });
    });
    CHATS = nuevo;
    const ks = Object.keys(nuevo);
    if ((!CHAT_SEL || !nuevo.hasOwnProperty(CHAT_SEL)) && ks.length) CHAT_SEL = ks.at(0);
    if (window._curTab === "men") {
      const inp = document.getElementById("inpChat");
      const cur = inp ? inp.value : "";
      const foc = inp && document.activeElement === inp;
      renderMen();
      const inp2 = document.getElementById("inpChat");
      if (inp2) { inp2.value = cur; if (foc) inp2.focus(); }
    }
  } catch (e) { console.error("cargarChatsNube:", e); }
};

window.syncChatsNube = function() { window.cargarChatsNube(); };

setTimeout(() => {
  const ci = document.getElementById("cInp");
  if (ci) {
    ci.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); window.mandarMsg(); } };
    const btn = ci.parentElement && ci.parentElement.querySelector("button");
    if (btn) btn.onclick = e => { e.preventDefault(); window.mandarMsg(); };
  }
  document.querySelectorAll("button").forEach(b => {
    const oc = b.getAttribute("onclick") || "";
    if (oc.includes("abrirSoporte")) b.onclick = () => window.abrirSoporte();
    if (oc.includes("'men'") || oc.includes('"men"')) {
      b.addEventListener("click", () => { window._curTab = "men"; if (typeof renderMen === "function") renderMen(); window.cargarChatsNube(); });
    }
  });
  if (document.getElementById("nMen")) window.cargarChatsNube();
}, 300);