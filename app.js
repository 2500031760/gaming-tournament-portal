const defaultTournaments = [
  {id:1,game:"BGMI",icon:"🎯",name:"Battle Arena Championship",date:"2026-10-10",time:"6:00 PM",prize:"₹10,000",slots:32},
  {id:2,game:"Valorant",icon:"⚡",name:"Valorant Masters",date:"2026-10-18",time:"5:00 PM",prize:"₹15,000",slots:24},
  {id:3,game:"Free Fire",icon:"🔥",name:"Free Fire Clash",date:"2026-10-25",time:"7:00 PM",prize:"₹8,000",slots:48},
  {id:4,game:"FIFA",icon:"⚽",name:"FIFA Pro League",date:"2026-11-02",time:"4:00 PM",prize:"₹12,000",slots:16},
  {id:5,game:"COD Mobile",icon:"🔫",name:"COD Mobile Warzone",date:"2026-11-08",time:"6:30 PM",prize:"₹9,000",slots:32},
  {id:6,game:"Minecraft",icon:"⛏️",name:"Minecraft Build Battle",date:"2026-11-15",time:"3:00 PM",prize:"₹5,000",slots:20}
];

if(!localStorage.getItem("tournaments")){
  localStorage.setItem("tournaments", JSON.stringify(defaultTournaments));
}
if(!localStorage.getItem("users")){
  localStorage.setItem("users", JSON.stringify([
    {name:"Administrator",email:"admin@gaming.com",password:"admin123",role:"admin"}
  ]));
}

const $ = id => document.getElementById(id);
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const getTournaments = () => JSON.parse(localStorage.getItem("tournaments") || "[]");

function saveUsers(data){localStorage.setItem("users",JSON.stringify(data))}
function saveTournaments(data){localStorage.setItem("tournaments",JSON.stringify(data))}

function openAuth(mode="login"){
  $("authModal").classList.remove("hidden");
  setMode(mode);
}
function closeAuth(){$("authModal").classList.add("hidden")}
function setMode(mode){
  const login = mode === "login";
  $("loginForm").classList.toggle("hidden",!login);
  $("signupForm").classList.toggle("hidden",login);
  $("loginTab").classList.toggle("active",login);
  $("signupTab").classList.toggle("active",!login);
  $("authMessage").textContent="";
}
function showMessage(msg,error=false){
  $("authMessage").textContent=msg;
  $("authMessage").style.color=error?"#ff8799":"#7ff7b2";
}

$("loginNav").onclick=()=>openAuth("login");
$("signupNav").onclick=()=>openAuth("signup");
$("heroLogin").onclick=()=>openAuth("login");
$("heroSignup").onclick=()=>openAuth("signup");
$("closeModal").onclick=closeAuth;
$("loginTab").onclick=()=>setMode("login");
$("signupTab").onclick=()=>setMode("signup");
$("authModal").onclick=e=>{if(e.target.id==="authModal")closeAuth()};

$("signupForm").onsubmit=e=>{
  e.preventDefault();
  const name=$("signupName").value.trim();
  const email=$("signupEmail").value.trim().toLowerCase();
  const password=$("signupPassword").value;
  const users=getUsers();
  if(users.some(u=>u.email===email)){showMessage("Email already registered.",true);return}
  users.push({name,email,password,role:"user"});
  saveUsers(users);
  showMessage("Account created. You can now login.");
  setTimeout(()=>setMode("login"),700);
  $("signupForm").reset();
};

$("loginForm").onsubmit=e=>{
  e.preventDefault();
  const email=$("loginEmail").value.trim().toLowerCase();
  const password=$("loginPassword").value;
  const user=getUsers().find(u=>u.email===email&&u.password===password);
  if(!user){showMessage("Invalid email or password.",true);return}
  localStorage.setItem("currentUser",JSON.stringify(user));
  closeAuth();
  if(user.role==="admin") window.location.href="admin.html";
  else window.location.href="user.html";
};

$("logoutNav").onclick=()=>{
  localStorage.removeItem("currentUser");
  updateNav();
};

function updateNav(){
  const user=JSON.parse(localStorage.getItem("currentUser")||"null");
  if(user){
    $("loginNav").classList.add("hidden");
    $("signupNav").classList.add("hidden");
    $("logoutNav").classList.remove("hidden");
  }else{
    $("loginNav").classList.remove("hidden");
    $("signupNav").classList.remove("hidden");
    $("logoutNav").classList.add("hidden");
  }
}

function renderTournaments(){
  const grid=$("tournamentGrid");
  grid.innerHTML="";
  getTournaments().forEach(t=>{
    grid.innerHTML += `
      <article class="t-card">
        <div class="game">${t.icon}</div>
        <p class="tag">${t.game}</p>
        <h3>${escapeHTML(t.name)}</h3>
        <p>Join the competition and prove your gaming skills.</p>
        <div class="info"><span>📅 ${t.date}</span><span>⏰ ${t.time}</span></div>
        <div class="info"><span>🏆 ${t.prize}</span><span>👥 ${t.slots} slots</span></div>
        <button class="btn primary" onclick="joinTournament(${t.id})">Join Tournament</button>
      </article>`;
  });
}
function joinTournament(id){
  const user=JSON.parse(localStorage.getItem("currentUser")||"null");
  if(!user){openAuth("login");return}
  if(user.role==="admin"){alert("Admin accounts cannot register as players.");return}
  const registrations=JSON.parse(localStorage.getItem("registrations")||"[]");
  if(registrations.some(r=>r.email===user.email&&r.tournamentId===id)){
    alert("You have already registered for this tournament.");return;
  }
  registrations.push({email:user.email,tournamentId:id,name:user.name,date:new Date().toLocaleString()});
  localStorage.setItem("registrations",JSON.stringify(registrations));
  alert("Tournament registration successful!");
}
function escapeHTML(str){
  return String(str).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
updateNav();
renderTournaments();
