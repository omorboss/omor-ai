const pages = ["home","chat","image","writing","voice","coding","profile"];
const toastEl = document.getElementById("toast");
let toastTimer;
function toast(message){toastEl.textContent=message;toastEl.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove("show"),2200)}
function openPage(name){
  pages.forEach(p=>{const el=document.getElementById(p+"Page");if(el)el.classList.toggle("active",p===name)});
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  window.scrollTo(0,0);
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>openPage(b.dataset.page)));
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openPage(b.dataset.open)));
document.getElementById("profileShortcut").addEventListener("click",()=>openPage("profile"));

function addBubble(text,kind){const area=document.getElementById("chatArea");const welcome=area.querySelector(".welcome-chat");if(welcome)welcome.remove();const bubble=document.createElement("div");bubble.className="chat-bubble "+kind;bubble.textContent=text;area.appendChild(bubble);area.scrollTop=area.scrollHeight}
document.getElementById("chatForm").addEventListener("submit",e=>{
 e.preventDefault();const input=document.getElementById("chatInput");const message=input.value.trim();if(!message)return;
 addBubble(message,"user");input.value="";
 setTimeout(()=>addBubble("ধন্যবাদ! এটি OMOR AI-এর ডেমো সংস্করণ। বাস্তব AI উত্তর পেতে পরবর্তী ধাপে নিরাপদ Backend ও AI API সংযুক্ত করা হবে।","ai"),450);
});
document.querySelectorAll(".suggestion").forEach(b=>b.addEventListener("click",()=>{document.getElementById("chatInput").value=b.textContent;document.getElementById("chatInput").focus()}));
document.getElementById("newChat").addEventListener("click",()=>{document.getElementById("chatArea").innerHTML='<div class="welcome-chat"><div class="big-spark">✦</div><h2>New conversation</h2><p class="muted">What would you like to know today?</p></div>';toast("New chat started")});
document.getElementById("imageGenerate").addEventListener("click",()=>{const p=document.getElementById("imagePrompt").value.trim();toast(p?"Image generation will be connected in the AI integration phase.":"Please describe your image first.")});
document.querySelectorAll(".writer-chip").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".writer-chip").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")}));
document.getElementById("writeBtn").addEventListener("click",()=>{const p=document.getElementById("writingPrompt").value.trim();document.getElementById("writingOutput").textContent=p?"Your writing request is ready: “"+p+"”\n\nThe live AI writing engine will be connected in the next development phase.":"Please enter a topic first."});
document.getElementById("copyOutput").addEventListener("click",async()=>{const text=document.getElementById("writingOutput").textContent;try{await navigator.clipboard.writeText(text);toast("Copied")}catch(e){toast("Copy is not available in this browser")}});
document.getElementById("voiceDemo").addEventListener("click",()=>{document.getElementById("voiceStatus").textContent="Voice demo selected. Speech recognition and AI voice will be integrated later.";toast("Voice feature is planned")});
document.getElementById("codeBtn").addEventListener("click",()=>{toast(document.getElementById("codePrompt").value.trim()?"Coding assistant will be connected in the next phase.":"Describe your coding task first.")});
document.getElementById("loginFromProfile").addEventListener("click",showAuth);
document.getElementById("guestBtn").addEventListener("click",()=>{document.getElementById("authScreen").classList.add("hidden");document.getElementById("mainApp").classList.remove("hidden");toast("Welcome to OMOR AI demo")});
function showAuth(){document.getElementById("authScreen").classList.remove("hidden");document.getElementById("mainApp").classList.add("hidden")}
document.querySelectorAll(".auth-tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".auth-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById("authSubmit").textContent=b.dataset.auth==="login"?"Login":"Create account"}));
document.getElementById("authForm").addEventListener("submit",e=>{e.preventDefault();toast("Authentication will be securely connected in a later phase.")});
document.getElementById("googleLogin").addEventListener("click",()=>toast("Google Sign-In setup is planned for the backend phase."));
// Demo starts directly on the dashboard. The authentication screen is available from Profile.
