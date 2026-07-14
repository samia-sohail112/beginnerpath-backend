const API_BASE = 'http://localhost:5000';
document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initAOS();
  initStatsCounter();
  initBackToTop();
  // page-specific
  if (document.getElementById("loginForm"))  initLogin();
  if (document.getElementById("signupForm")) initSignup();
});
/* ── Navbar scroll shadow ── */
function initNavScroll() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 20));
}
/* ── Animate on Scroll ── */
function initAOS() {
  const els = document.querySelectorAll("[data-aos]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add("visible"), d);
      io.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}
/* ── Stats counter ── */
function initStatsCounter() {
  const items = document.querySelectorAll(".stat-item");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target._counted) return;
      e.target._counted = true;
      const target = parseInt(e.target.dataset.count);
      const suffix = e.target.dataset.suffix || "";
      const el = e.target.querySelector(".stat-n");
      if (!el) return;
      let cur = 0;
      const step = Math.ceil(target / 55);
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur.toLocaleString() + suffix;
        if (cur >= target) clearInterval(t);
      }, 22);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  items.forEach(el => io.observe(el));
}
/* ── Back to top ── */
function initBackToTop() {
  const btn = document.getElementById("backTop");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("show", scrollY > 380));
  btn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}
/* ── Toast helper ── */
function showToast(msg, type = "ok") {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove("show"), 3200);
}
/* ============================================================
   LOGIN PAGE - NOW CALLS REAL BACKEND API
   ============================================================ */
function initLogin() {
  const form    = document.getElementById("loginForm");
  const emailEl = document.getElementById("loginEmail");
  const passEl  = document.getElementById("loginPass");
  const eyeBtn  = document.getElementById("eyeLogin");
  // toggle password visibility
  eyeBtn?.addEventListener("click", () => {
    const isText = passEl.type === "text";
    passEl.type = isText ? "password" : "text";
    eyeBtn.innerHTML = isText
      ? '<i class="ti ti-eye"></i>'
      : '<i class="ti ti-eye-off"></i>';
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;
    // validation
    if (!emailEl.value.includes("@")) {
      showErr(emailEl, "emailErr", "Enter a valid email address"); valid = false;
    } else clearErr(emailEl, "emailErr");
    if (passEl.value.length < 6) {
      showErr(passEl, "passErr", "Password must be at least 6 characters"); valid = false;
    } else clearErr(passEl, "passErr");
    if (!valid) return;
    const btn = form.querySelector(".auth-submit");
    const originalText = btn.textContent;
    btn.textContent = "Logging in…";
    btn.disabled = true;
    try {
      // ── REAL API CALL TO BACKEND ──
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailEl.value.trim(),
          password: passEl.value
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      // ── STORE TOKEN AND USER DATA ──
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userId', data.user.id);
      showToast("✅ Logged in successfully! Redirecting…", "ok");
      setTimeout(() => window.location.href = "dashboard.html", 1200);
    } catch (error) {
      console.error('Login error:', error);
      showToast(error.message || "Login failed. Please try again.", "err");
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}
/* ============================================================
   SIGNUP PAGE - NOW CALLS REAL BACKEND API
   ============================================================ */
function initSignup() {
  const form     = document.getElementById("signupForm");
  const nameEl   = document.getElementById("signupName");
  const emailEl  = document.getElementById("signupEmail");
  const passEl   = document.getElementById("signupPass");
  const pass2El  = document.getElementById("signupPass2");
  const eyeBtn   = document.getElementById("eyeSignup");
  const eye2Btn  = document.getElementById("eyeSignup2");
  const termsEl  = document.getElementById("terms");
  const bars     = document.querySelectorAll(".strength-bar span");
  const strengthLabel = document.getElementById("strengthLabel");
  // eye toggles
  eyeBtn?.addEventListener("click", () => toggleEye(passEl, eyeBtn));
  eye2Btn?.addEventListener("click", () => toggleEye(pass2El, eye2Btn));
  // password strength
  passEl?.addEventListener("input", () => {
    const v   = passEl.value;
    const score = getStrength(v);
    bars.forEach((b, i) => {
      b.style.background = i < score
        ? (score <= 1 ? "#EF4444" : score <= 2 ? "#F59E0B" : score <= 3 ? "#3B82F6" : "#10B981")
        : "#E2E8F0";
    });
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    if (strengthLabel) strengthLabel.textContent = v.length ? labels[score] || "Strong" : "";
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;
    if (nameEl.value.trim().length < 2) {
      showErr(nameEl, "nameErr", "Enter your full name"); valid = false;
    } else clearErr(nameEl, "nameErr");
    if (!emailEl.value.includes("@")) {
      showErr(emailEl, "emailErr2", "Enter a valid email address"); valid = false;
    } else clearErr(emailEl, "emailErr2");
    if (passEl.value.length < 6) {
      showErr(passEl, "passErr2", "Password must be at least 6 characters"); valid = false;
    } else clearErr(passEl, "passErr2");
    if (pass2El.value !== passEl.value) {
      showErr(pass2El, "pass2Err", "Passwords do not match"); valid = false;
    } else clearErr(pass2El, "pass2Err");
    if (!termsEl.checked) {
      showToast("Please accept the Terms of Service to continue.", "err"); valid = false;
    }
    if (!valid) return;
    const btn = form.querySelector(".auth-submit");
    const originalText = btn.textContent;
    btn.textContent = "Creating account…";
    btn.disabled = true;
    try {
      // ── REAL API CALL TO BACKEND ──
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nameEl.value.trim(),
          email: emailEl.value.trim(),
          password: passEl.value
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      // Store user name for onboarding
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      showToast("🎉 Account created! Let's find your career path.", "ok");
      setTimeout(() => window.location.href = "onboarding.html", 1400);
    } catch (error) {
      console.error('Signup error:', error);
      showToast(error.message || "Signup failed. Please try again.", "err");
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}
/* ── helpers ── */
function toggleEye(input, btn) {
  const isText = input.type === "text";
  input.type = isText ? "password" : "text";
  btn.innerHTML = isText ? '<i class="ti ti-eye"></i>' : '<i class="ti ti-eye-off"></i>';
}
function getStrength(p) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}
function showErr(input, errId, msg) {
  input.classList.add("error");
  const el = document.getElementById(errId);
  if (el) { el.textContent = msg; el.classList.add("show"); }
}
function clearErr(input, errId) {
  input.classList.remove("error");
  const el = document.getElementById(errId);
  if (el) el.classList.remove("show");
}