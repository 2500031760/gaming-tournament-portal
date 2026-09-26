const admin=JSON.parse(localStorage.getItem("currentUser")||"null");
if(!admin || admin.role!=="admin"){window.location.href="index.html";}
const $=id=>document.getElementById(id);
const getT=()=>JSON.parse(localStorage.getItem("tournaments")||"[]");
const getR=()=>JSON.parse(localStorage.getItem("registrations")||"[]");
const getU=()=>JSON.parse(localStorage.getItem("users")||"[]");
$("logout").onclick=()=>{localStorage.removeItem("currentUser");window.location.href="index.html"};

function render(){
  const ts=getT(),rs=getR();
  $("tCount").textContent=ts.length;$("rCount").textContent=rs.length;
  $("uCount").textContent=new Set(rs.map(r=>r.email)).size;
  $("tournaments").innerHTML=ts.map(t=>`
    <div class="admin-item"><div><span class="bigicon">${t.icon}</span><b>${escapeHTML(t.name)}</b><small>${escapeHTML(t.game)} · ${t.date} · ${t.prize}</small></div>
    <div class="actions"><button onclick="editTournament(${t.id})">Edit</button><button class="danger" onclick="deleteTournament(${t.id})">Delete</button></div></div>`).join("");
  $("registrations").innerHTML=rs.length?rs.slice().reverse().map(r=>{
    const t=ts.find(x=>x.id===r.tournamentId);
    return t?`<div class="registration"><b>${escapeHTML(r.name)}</b><span>${escapeHTML(t.name)}</span><small>${r.date}</small></div>`:"";
  }).join(""):"<p class='muted'>No registrations yet.</p>";
}
function openForm(t=null){
  $("formModal").classList.remove("hidden");
  $("formTitle").textContent=t?"Edit Tournament":"Add Tournament";
  $("tid").value=t?.id||"";$("name").value=t?.name||"";$("game").value=t?.game||"";$("icon").value=t?.icon||"🎮";
  $("date").value=t?.date||"";$("time").value=t?.time||"";$("prize").value=t?.prize||"";$("slots").value=t?.slots||"";
}
function closeForm(){$("formModal").classList.add("hidden")}
function editTournament(id){openForm(getT().find(t=>t.id===id))}
function deleteTournament(id){
  if(!confirm("Delete this tournament?"))return;
  localStorage.setItem("tournaments",JSON.stringify(getT().filter(t=>t.id!==id)));render();
}
$("tForm").onsubmit=e=>{
  e.preventDefault();
  const ts=getT(), id=Number($("tid").value);
  const item={id:id||Date.now(),name:$("name").value.trim(),game:$("game").value.trim(),icon:$("icon").value.trim(),date:$("date").value,time:$("time").value.trim(),prize:$("prize").value.trim(),slots:Number($("slots").value)};
  const index=ts.findIndex(t=>t.id===id);
  if(index>=0)ts[index]=item;else ts.push(item);
  localStorage.setItem("tournaments",JSON.stringify(ts));closeForm();render();
};
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
render();