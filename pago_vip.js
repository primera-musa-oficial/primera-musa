(function(){
  const U="https://supabase.co";
  const K="sb_publishable_cYTRqB0q933Y23txZK2-wg_NYkJ7OL0";
  function usr(){
    const el=document.querySelector("[data-usuario-vip],#nombreUsuarioHeader");
    const h=el?el.innerText.replace(/[^a-zA-Z0-9_-]/g,""):"";
    return String(window.usuarioLogueadoVIP||localStorage.getItem("musa_cli_u")||localStorage.getItem("usuario_musa_logueado")||h||"").trim();
  }
  async function leerReps(){
    const r=await fetch(U+"?clave=eq.reportes_clientes_local&select=datos",{headers:{apikey:K,Authorization:"Bearer "+K},cache:"no-store"});
    const f=await r.json();
    const d=Array.isArray(f)&&f.length?f.at(0).datos:[];
    return Array.isArray(d)?d:(typeof d==="string"?JSON.parse(d):[]);
  }
  async function guardarReps(a){
    const r=await fetch(U+"?on_conflict=clave",{method:"POST",headers:{apikey:K,Authorization:"Bearer "+K,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},body:JSON.stringify({clave:"reportes_clientes_local",datos:a})});
    return r.ok;
  }
  function comp(f,cb){
    const r=new FileReader();
    r.onload=e=>{const i=new Image();i.onload=()=>{const c=document.createElement("canvas"),s=i.width>420?420/i.width:1;c.width=i.width*s;c.height=i.height*s;c.getContext("2d").drawImage(i,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",0.65));};i.src=e.target.result;};
    r.readAsDataURL(f);
  }
  window.abrirChatPagoEnVivo=function(usuario){
    const u=usuario||usr(); if(!u) return alert("Inicia sesion primero");
    document.getElementById("modalChatPagoVivoVIP")?.remove();
    const m=document.createElement("div"); m.id="modalChatPagoVivoVIP";
    m.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;padding:14px;z-index:999999;font-family:Arial,sans-serif;";
    m.innerHTML='<div class="card" style="max-width:390px;width:100%;padding:20px;text-align:center;position:relative;background:#07130e;border:2px solid #eab308;color:#fff;"><button id="bClP" style="position:absolute;top:10px;right:10px;background:none;border:1px solid #fde047;color:#fde047;border-radius:50%;width:26px;height:26px;cursor:pointer;">✕</button><div id="zP1"><h4 style="color:#fde047;margin:0 0 8px;">🎄 RENOVAR RENTA VIP</h4><select id="sPl" style="width:100%;padding:9px;margin-bottom:12px;background:#000;color:#fde047;border:1px solid #fde047;border-radius:8px;"><option value="1 Día">1 Día</option><option value="1 Semana" selected>1 Semana</option><option value="1 Mes">1 Mes</option></select><button id="bPd" class="btn-xmas" style="width:100%;padding:10px;">📩 Pedir dónde enviar el dinero</button></div><div id="zP2" style="display:none;"><h4 style="color:#fde047;margin:0 0 8px;">🎄 MÉTODO LISTO</h4><div id="tMet" style="background:#000;border:1px solid #fde047;padding:10px;border-radius:8px;color:#fef08a;font-weight:bold;margin-bottom:10px;"></div><input type="file" id="iFt" accept="image/*" style="width:100%;margin-bottom:10px;"><button id="bSb" class="btn-xmas" style="width:100%;padding:10px;">✅ Enviar Captura</button></div></div>';
    document.body.appendChild(m);
    let p=null; const cl=()=>{if(p)clearInterval(p);m.remove();}; document.getElementById("bClP").onclick=cl;
    const esMio=x=>x&&x.tipo==="pago_vip"&&String(x.usuario||"").trim().toLowerCase()===u.toLowerCase()&&!x.vista_confirmada;
    const draw=l=>{
      const x=l.slice().reverse().find(esMio); if(!x) return;
      const z1=document.getElementById("zP1"),z2=document.getElementById("zP2"); if(!z1||!z2) return;
      if(x.pago_estado==="esperando_metodo"){z2.style.display="none";z1.style.display="block";z1.innerHTML='<div class="aro-carga-vip"></div><h4>Revisando solicitud ('+(x.pago_plan||"")+')...</h4><button id="bE1" class="btn-xmas">Cerrar</button>';document.getElementById("bE1").onclick=cl;}
      else if(x.pago_estado==="metodo_enviado"&&x.pago_metodo){z1.style.display="none";z2.style.display="block";document.getElementById("tMet").innerText=x.pago_metodo;}
      else if(x.pago_estado==="comprobante_enviado"){z2.style.display="none";z1.style.display="block";z1.innerHTML='<div class="aro-carga-vip"></div><h4>Confirmando tu pago...</h4><button id="bE2" class="btn-xmas">Esperar en panel</button>';document.getElementById("bE2").onclick=cl;}
      else if(x.pago_estado==="completado"){z2.style.display="none";z1.style.display="block";z1.innerHTML='<div style="font-size:34px;">👑✅</div><h4 style="color:#34d399;">¡Pago Completado!</h4><button id="bOk" class="btn-xmas">Volver al Panel</button>';document.getElementById("bOk").onclick=async()=>{const a=await leerReps(),r=a.find(k=>String(k.id)===String(x.id));if(r){r.vista_confirmada=true;r.resuelto=true;await guardarReps(a);}cl();location.reload();};}
    };
    leerReps().then(draw).catch(()=>{}); p=setInterval(()=>leerReps().then(draw).catch(()=>{}),3000);
    document.getElementById("bPd").onclick=async()=>{const pl=document.getElementById("sPl").value,b=document.getElementById("bPd");b.disabled=true;b.innerText="⏳...";try{const a=await leerReps();a.push({id:Date.now(),tipo:"pago_vip",resuelto:true,usuario:u,pago_plan:pl,pago_estado:"esperando_metodo",pago_metodo:"",pago_foto:"",vista_confirmada:false,ts:Date.now()});if(!await guardarReps(a)){alert("Error al enviar");b.disabled=false;return;}fetch("https://ntfy.sh",{method:"POST",headers:{Title:"SOLICITUD PAGO",Priority:"urgent"},body:"@"+u+" pide pagar "+pl}).catch(()=>{});draw(a);}catch(e){alert("Error: "+e.message);b.disabled=false;}};
    document.getElementById("bSb").onclick=()=>{const f=document.getElementById("iFt").files;if(!f||!f.length)return alert("Sube la foto");const b=document.getElementById("bSb");b.disabled=true;b.innerText="⏳...";comp(f.item(0),async img=>{const a=await leerReps(),x=a.slice().reverse().find(esMio);if(x){x.pago_foto=img;x.pago_estado="comprobante_enviado";await guardarReps(a);}fetch("https://ntfy.sh",{method:"POST",headers:{Title:"CAPTURA PAGO",Priority:"urgent"},body:"@"+u+" envio captura"}).catch(()=>{});draw(a);});};
  };
  document.addEventListener("click",function(e){const btn=e.target.closest("#btnPagarRentaVivoVIP,button");if(btn&&(btn.id==="btnPagarRentaVivoVIP"||/pagar\s*\/\s*adelantar\s*renta/i.test(btn.innerText||""))){e.preventDefault();e.stopPropagation();window.abrirChatPagoEnVivo();}},true);
})();