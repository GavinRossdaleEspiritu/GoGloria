
const app = document.getElementById("app");
let tab = "home";
let presetYacht = "";
// GoGloria frontend configuration.
// The browser talks only to the backend API.
// Supabase secret credentials NEVER belong in this file.
const API_BASE_URL = window.GOGLORIA_API_URL || "http://localhost:3000/api";

const yachts = ["Azure Serenity", "Golden Hour", "Pearl Voyager", "Coral Drift", "Seabreeze II", "North Star", "Amber Tide", "Sundeck Classic"];

function go(name){ tab=name; window.scrollTo({top:0,behavior:"smooth"}); render(); }

function home(){
 return `
<section class="hero"><div class="wrap">
 <div class="eyebrow">DUBAI · UAE · YACHT CHARTER</div>
 <h1>Where every guest<br>feels welcome.</h1>
 <p>GoGloria is a boutique yacht charter brokerage connecting guests with trusted yacht owners and operators across Dubai.</p>
 <div class="actions"><button class="btn" onclick="go('fleet')">Explore the fleet</button><button class="btn secondary" onclick="go('inquire')">Request a charter</button></div>
</div></section>
<section class="section"><div class="wrap">
 <div class="eyebrow">THE GOGLORIA STANDARD</div><h2>A better way to charter.</h2>
 <p class="muted">We curate the right yacht, crew and experience around your occasion rather than asking you to fit into a booking system.</p>
 <div class="grid grid3" style="margin-top:35px">
  <div class="card"><div class="tag">01 · CURATED</div><h3>110 partner vessels</h3><p class="muted">Access a broad Dubai fleet without the overhead of owning a yacht.</p></div>
  <div class="card"><div class="tag">02 · PERSONAL</div><h3>Human service</h3><p class="muted">A real person coordinates your request from first enquiry to departure.</p></div>
  <div class="card"><div class="tag">03 · TRANSPARENT</div><h3>Clear recommendations</h3><p class="muted">We match your group, occasion and budget to the right vessel.</p></div>
 </div>
</div></section>
<section class="section paper"><div class="wrap center"><div class="eyebrow">HOW IT WORKS</div><h2>From idea to water.</h2>
 <div class="grid grid3 steps" style="margin-top:30px">
  <div class="step"><h3>Tell us what you need</h3><p class="muted">Date, guests, occasion and preferences.</p></div>
  <div class="step"><h3>We curate options</h3><p class="muted">We shortlist suitable partner yachts.</p></div>
  <div class="step"><h3>You enjoy Dubai</h3><p class="muted">We coordinate the charter details.</p></div>
 </div></div></section>`;
}

function fleet(){
 const cards = yachts.length ? yachts : ["Azimut 60","Sunseeker 65","Ferretti 72","Princess 85","Lagoon 620","Gulf Craft 95"];
 return `<section class="section"><div class="wrap">
 <div class="eyebrow">THE FLEET</div><h2>Find your yacht.</h2><p class="muted">A selection from our Dubai partner fleet.</p>
 <div class="filters"><select id="tier"><option value="">All yacht types</option><option>Luxury</option><option>Premium</option><option>Superyacht</option></select><input id="searchYacht" placeholder="Search yacht name"></div>
 <div id="fleetGrid" class="grid grid3">${cards.map((n,i)=>`<div class="card yacht"><div class="yacht-top"><strong>${escapeHtml(n)}</strong></div><div style="padding-top:15px"><div class="tag">${i%3===0?"LUXURY":i%3===1?"PREMIUM":"SUPER YACHT"}</div><p class="small">Dubai · Private charter</p><button class="btn" onclick="requestYacht('${escapeAttr(n)}')">Request this yacht</button></div></div>`).join("")}</div>
 </div></section>`;
}

function requestYacht(name){ presetYacht=name; go("inquire"); }

function how(){
 return `<section class="section"><div class="wrap"><div class="eyebrow">THE PROCESS</div><h2>How it works.</h2>
 <div class="grid grid3 steps" style="margin-top:35px"><div class="step"><h3>01 · Enquire</h3><p class="muted">Share your date, guest count, preferred yacht and occasion.</p></div><div class="step"><h3>02 · Match</h3><p class="muted">We review the partner fleet and return the most suitable options.</p></div><div class="step"><h3>03 · Charter</h3><p class="muted">Confirm the details and enjoy a professionally coordinated experience.</p></div></div>
 </div></section>`;
}

function plan(){
 const months=[45,52,68,75,82,88,94,90,78,65,55,48];
 return `<section class="section paper"><div class="wrap"><div class="eyebrow">BUSINESS PLAN</div><h2>GoGloria at a glance.</h2>
 <div class="grid grid4" style="margin:30px 0"><div class="card"><div class="tag">PARTNER VESSELS</div><div class="stat">110</div></div><div class="card"><div class="tag">MODEL</div><div class="stat">Brokerage</div></div><div class="card"><div class="tag">MARKET</div><div class="stat">Dubai</div></div><div class="card"><div class="tag">YEAR</div><div class="stat">2026</div></div></div>
 <div class="card"><div class="tag">SEASONALITY · ILLUSTRATIVE INDEX</div><div class="chart">${months.map((v,i)=>`<div class="bar" style="height:${v}%"><span>${v}</span></div>`).join("")}</div><div class="small" style="display:flex;justify-content:space-between"><span>Jan</span><span>Jun</span><span>Dec</span></div></div>
 </div></section>`;
}

function inquire(){
 return `<section class="section"><div class="wrap"><div class="center"><div class="eyebrow">CHARTER REQUEST</div><h2>Tell us about your charter.</h2><p class="muted">We'll review your requirements and respond with suitable options.</p></div>
 <form id="inquiryForm" class="form" style="margin-top:35px">
 <div><label>Name</label><input name="name" required></div><div><label>Email</label><input name="email" type="email" required></div>
 <div><label>Phone</label><input name="phone"></div><div><label>Yacht</label><input name="yacht" value="${escapeAttr(presetYacht)}" placeholder="No preference"></div>
 <div><label>Date</label><input name="date" type="date"></div><div><label>Message</label><textarea name="message" placeholder="Guests, occasion, timing and preferences"></textarea></div>
 <button class="btn" type="submit">Submit charter request</button><p id="formDone" class="success hidden">Request received. We will contact you shortly.</p>
 </form></div></section>`;
}

function about(){
 return `<section class="section paper"><div class="wrap center"><div class="eyebrow">OUR STORY</div><h1 style="font-size:44px">"GoGloria was named after my grandmother, Gloria."</h1></div></section>
 <section class="section"><div class="wrap"><p class="muted">Her warmth, generosity and ability to make people feel welcome are the inspiration behind the brand. That same feeling — of being personally looked after, not just processed through a booking system — is what we try to bring to every charter we arrange.</p>
 <p class="muted">GoGloria is a third-party yacht charter brokerage. We don't own yachts, marinas or crews — we connect customers with trusted yacht owners and operators across Dubai, and earn a transparent commission for the match.</p></div></section>`;
}

function render(){
 app.innerHTML = tab==="home"?home():tab==="fleet"?fleet():tab==="how"?how():tab==="plan"?plan():tab==="inquire"?inquire():about();
 bind();
}

function bind(){
 document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>go(b.dataset.tab));
 const form=document.getElementById("inquiryForm");
 if(form) form.onsubmit=async e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(form));
  const button=form.querySelector('button[type="submit"]');
  const done=document.getElementById("formDone");
  button.disabled=true;
  button.textContent="Submitting...";
  done.classList.add("hidden");

  try{
    const response=await fetch(`${API_BASE_URL}/charter-requests`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });
    const result=await response.json();
    if(!response.ok) throw new Error(result.error || "Unable to submit request.");

    done.textContent="Request received. We will contact you shortly.";
    done.classList.remove("hidden");
    form.reset();
  }catch(error){
    console.error("GoGloria submission error:",error);
    done.textContent=error.message || "Unable to submit your request. Please try again.";
    done.classList.remove("hidden");
  }finally{
    button.disabled=false;
    button.textContent="Submit charter request";
  }
};
 const search=document.getElementById("searchYacht");
 if(search) search.oninput=()=>{const q=search.value.toLowerCase();document.querySelectorAll("#fleetGrid .yacht").forEach(c=>c.style.display=c.innerText.toLowerCase().includes(q)?"flex":"none")};
 const menu=document.getElementById("menuBtn"), mob=document.getElementById("mobileNav");
 if(menu) menu.onclick=()=>mob.classList.toggle("open");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function escapeAttr(s){return escapeHtml(s).replace(/`/g,"&#096;")}
document.getElementById("newsletterForm").onsubmit=e=>{e.preventDefault();document.getElementById("newsletterForm").classList.add("hidden");document.getElementById("newsletterDone").classList.remove("hidden")};
render();
