const currentUser=JSON.parse(localStorage.getItem("currentUser")||"null");
if(!currentUser || currentUser.role!=="user"){window.location.href="index.html";}
const $=id=>document.getElementById(id);
const getT=()=>JSON.parse(localStorage.getItem("tournaments")||"[]");
const getR=()=>JSON.parse(localStorage.getItem("registrations")||"[]");
$("userName").textContent=currentUser.name;
$("logout").onclick=()=>{localStorage.removeItem("currentUser");window.location.href="index.html"};

function render(){
  const ts=getT(), rs=getR().filter(r=>r.email===currentUser.email);
  $("total").textContent=ts.length;
  $("joined").textContent=rs.length;
  $("tournaments").innerHTML=ts.map(t=>`
    <article class="card">
      <div class="icon">${t.icon}</div><p class="tag">${t.game}</p>
      <h3>${escapeHTML(t.name)}</h3>
      <p>📅 ${t.date} &nbsp; ⏰ ${t.time}</p>
      <p>🏆 ${t.prize} &nbsp; 👥 ${t.slots}</p>
      <button class="primary" onclick="register(${t.id})">Register</button>
    </article>`).join("");
  $("myRegistrations").innerHTML=rs.length ? rs.map(r=>{
    const t=ts.find(x=>x.id===r.tournamentId);
    return t?`<div class="registration"><span>${t.icon} <b>${escapeHTML(t.name)}</b></span><span>${t.date}</span></div>`:"";
  }).join(""):"<p class='muted'>No registrations yet.</p>";
}
function register(id){
  const rs=getR();
  if(rs.some(r=>r.email===currentUser.email&&r.tournamentId===id)){alert("Already registered.");return}
  rs.push({email:currentUser.email,tournamentId:id,name:currentUser.name,date:new Date().toLocaleString()});
  localStorage.setItem("registrations",JSON.stringify(rs));render();alert("Registered successfully!");
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
render();