
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyD-XOF_j5Swxgm4lDbV6iF7hzkul6HMtN8",
  authDomain: "omor-ai.firebaseapp.com",
  projectId: "omor-ai",
  storageBucket: "omor-ai.firebasestorage.app",
  messagingSenderId: "446596163174",
  appId: "1:446596163174:web:704b17cd53b23bae656fa7",
  measurementId: "G-GQNEY1SSLV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const pages = ["home", "chat", "image", "writing", "voice", "coding", "profile"];
const toastEl = document.getElementById("toast");
let toastTimer;
let authMode = "login";

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3000);
}

function openPage(name) {
  pages.forEach(p => {
    const el = document.getElementById(p + "Page");
    if (el) el.classList.toggle("active", p === name);
  });

  document.querySelectorAll(".nav-item").forEach(b =>
    b.classList.toggle("active", b.dataset.page === name)
  );

  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-page]").forEach(b =>
  b.addEventListener("click", () => openPage(b.dataset.page))
);

document.querySelectorAll("[data-open]").forEach(b =>
  b.addEventListener("click", () => openPage(b.dataset.open))
);

document.getElementById("profileShortcut").addEventListener("click", () => openPage("profile"));

function addBubble(text, kind) {
  const area = document.getElementById("chatArea");
  const welcome = area.querySelector(".welcome-chat");
  if (welcome) welcome.remove();

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble " + kind;
  bubble.textContent = text;
  area.appendChild(bubble);
  area.scrollTop = area.scrollHeight;
}

document.getElementById("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  addBubble(message, "user");
  input.value = "";

  setTimeout(() => addBubble(
    "ধন্যবাদ! এটি OMOR AI-এর ডেমো সংস্করণ। বাস্তব AI উত্তর পেতে নিরাপদ Backend ও AI API যুক্ত করতে হবে।",
    "ai"
  ), 450);
});

document.querySelectorAll(".suggestion").forEach(b =>
  b.addEventListener("click", () => {
    document.getElementById("chatInput").value = b.textContent;
    document.getElementById("chatInput").focus();
  })
);

document.getElementById("newChat").addEventListener("click", () => {
  document.getElementById("chatArea").innerHTML =
    '<div class="welcome-chat"><div class="big-spark">✦</div><h2>New conversation</h2><p class="muted">What would you like to know today?</p></div>';
  toast("New chat started");
});

document.getElementById("imageGenerate").addEventListener("click", () => {
  const p = document.getElementById("imagePrompt").value.trim();
  toast(p ? "Image generation needs an AI provider." : "Please describe your image first.");
});

document.querySelectorAll(".writer-chip").forEach(b =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".writer-chip").forEach(x => x.classList.remove("selected"));
    b.classList.add("selected");
  })
);

document.getElementById("writeBtn").addEventListener("click", () => {
  const p = document.getElementById("writingPrompt").value.trim();
  document.getElementById("writingOutput").textContent =
    p ? "Your writing request is ready: “" + p + "”\n\nLive AI writing needs an AI API connection."
      : "Please enter a topic first.";
});

document.getElementById("copyOutput").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("writingOutput").textContent);
    toast("Copied");
  } catch (e) {
    toast("Copy is not available in this browser");
  }
});

document.getElementById("voiceDemo").addEventListener("click", () => {
  document.getElementById("voiceStatus").textContent =
    "Voice demo selected. Speech recognition and AI voice will be integrated later.";
  toast("Voice feature is planned");
});

document.getElementById("codeBtn").addEventListener("click", () => {
  toast(document.getElementById("codePrompt").value.trim()
    ? "Live coding AI needs a secure backend."
    : "Describe your coding task first.");
});

// AUTH SCREEN
function showAuth() {
  document.getElementById("authScreen").classList.remove("hidden");
  document.getElementById("mainApp").classList.add("hidden");
}

function showDashboard() {
  document.getElementById("authScreen").classList.add("hidden");
  document.getElementById("mainApp").classList.remove("hidden");
}

function setAuthMode(mode) {
  authMode = mode;

  document.querySelectorAll(".auth-tab").forEach(b =>
    b.classList.toggle("active", b.dataset.auth === mode)
  );

  document.getElementById("authSubmit").textContent =
    mode === "login" ? "Login" : "Create account";
}

document.querySelectorAll(".auth-tab").forEach(b =>
  b.addEventListener("click", () => setAuthMode(b.dataset.auth))
);

document.getElementById("loginFromProfile").addEventListener("click", showAuth);

document.getElementById("guestBtn").addEventListener("click", () => {
  showDashboard();
  toast("Welcome to OMOR AI demo");
});

// EMAIL LOGIN AND SIGNUP
document.getElementById("authForm").addEventListener("submit", async e => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const submit = document.getElementById("authSubmit");

  submit.disabled = true;
  submit.textContent = "Please wait...";

  try {
    if (authMode === "signup") {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: email.split("@")[0] });
      toast("Account created successfully!");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      toast("Login successful!");
    }
  } catch (error) {
    const messages = {
      "auth/email-already-in-use": "এই Email দিয়ে আগে Account খোলা হয়েছে।",
      "auth/invalid-email": "Email address সঠিক নয়।",
      "auth/weak-password": "আরও শক্তিশালী Password দিন।",
      "auth/invalid-credential": "Email অথবা Password ভুল হয়েছে।",
      "auth/network-request-failed": "Internet connection পরীক্ষা করুন।",
      "auth/too-many-requests": "অনেকবার চেষ্টা হয়েছে। একটু পরে চেষ্টা করুন।"
    };

    toast(messages[error.code] || error.message);
  } finally {
    submit.disabled = false;
    submit.textContent = authMode === "login" ? "Login" : "Create account";
  }
});

// GOOGLE LOGIN
document.getElementById("googleLogin").addEventListener("click", async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    toast(error.message);
  }
});

// GOOGLE REDIRECT RESULT
getRedirectResult(auth).catch(error => {
  toast(error.message);
});

// LOGOUT BUTTON
const profileCard = document.querySelector(".profile-card");
const logoutButton = document.createElement("button");

logoutButton.className = "outline-btn";
logoutButton.textContent = "Logout";
logoutButton.style.marginTop = "12px";
logoutButton.style.display = "none";
profileCard.appendChild(logoutButton);

logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    toast("Logged out successfully");
    showDashboard();
  } catch (error) {
    toast(error.message);
  }
});

// CHECK LOGIN SESSION
onAuthStateChanged(auth, user => {
  const profileName = profileCard.querySelector("h2");
  const profileStatus = profileCard.querySelector(".muted");
  const profileAvatar = profileCard.querySelector(".profile-avatar");

  if (user) {
    showDashboard();

    profileName.textContent = user.displayName || user.email;
    profileStatus.textContent = user.email;
    profileAvatar.textContent = (user.displayName || user.email || "OF")
      .substring(0, 2).toUpperCase();

    logoutButton.style.display = "inline-block";
    document.getElementById("profileShortcut").textContent =
      (user.displayName || user.email || "OF").substring(0, 2).toUpperCase();
  } else {
    profileName.textContent = "Omor Faruk";
    profileStatus.textContent = "Guest account • Demo mode";
    profileAvatar.textContent = "OF";
    logoutButton.style.display = "none";
    document.getElementById("profileShortcut").textContent = "OF";
  }
});

// Demo starts on dashboard
