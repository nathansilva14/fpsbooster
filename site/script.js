// LOGIN
function login(){
  const key = document.getElementById("keyLogin").value;

  localStorage.setItem("key", key);
  window.location.href = "dashboard.html";
}

// CRIAR
async function criar(){

  const email = document.getElementById("email").value;

  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");

  const res = await fetch("/create", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email, ref })
  });

  const data = await res.json();

  alert("Key: " + data.key);
}

// PAGAR
async function pagar(plan){

  const key = localStorage.getItem("key");

  const res = await fetch("/pay", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ key, plan })
  });

  const data = await res.json();

  window.location.href = data.link;
}

// LOAD DASHBOARD
async function load(){

  const key = localStorage.getItem("key");

  const res = await fetch("/user?key="+key);
  const data = await res.json();

  if(data.expiresAt){
    const dias = Math.floor((new Date(data.expiresAt)-Date.now())/(1000*60*60*24));
    document.getElementById("tempo").innerText = "Dias restantes: " + dias;
  }

  document.getElementById("ref").innerText =
    location.origin + "?ref=" + data.refCode;
}

if(window.location.pathname.includes("dashboard")){
  load();
}