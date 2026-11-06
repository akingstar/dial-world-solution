/*
  Dial World Solution - frontend settings
  1) Deploy google-apps-script/Code.gs as a Web App.
  2) Paste its /exec URL below.
  3) Replace the email and WhatsApp placeholders in index.html before publishing.
*/
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2AZfQIFnXmLEaEhEBJsdskggMtrqwcJM5MuVaXFVXDFbVwyTIDXs6bHvAH5sO94K9/exec";

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-currency]").forEach(button => {
  button.addEventListener("click", () => {
    const currency = button.dataset.currency;
    document.querySelectorAll("[data-currency]").forEach(b => b.classList.toggle("active", b === button));
    document.querySelectorAll("[data-usd][data-inr]").forEach(el => {
      el.textContent = el.dataset[currency.toLowerCase()];
    });
    document.querySelectorAll('select[name="currency"] option').forEach(option => {
      option.selected = option.value === currency;
    });
  });
});

document.querySelectorAll(".choose-plan").forEach(link => {
  link.addEventListener("click", () => {
    const select = document.getElementById("packageSelect");
    if (select) select.value = link.dataset.plan || "";
  });
});

const form = document.getElementById("leadForm");
const statusBox = document.getElementById("formStatus");
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.website) return; // honeypot anti-spam field
  if (!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/")) {
    statusBox.textContent = "The enquiry form is not connected yet. Please contact the website owner while setup is completed.";
    statusBox.className = "form-status error";
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = "Sending…";
  data.page = window.location.href;
  data.submittedAt = new Date().toISOString();
  try {
    // no-cors is used because Apps Script web apps do not expose browser CORS headers.
    // The browser cannot read the response; this means delivery cannot be confirmed client-side.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(data)
    });
    statusBox.textContent = "Your enquiry has been submitted. If you do not hear back, please contact the business directly.";
    statusBox.className = "form-status success";
    form.reset();
  } catch (error) {
    statusBox.textContent = "We could not send your enquiry. Please try again or contact the business directly.";
    statusBox.className = "form-status error";
  } finally {
    submit.disabled = false;
    submit.innerHTML = 'Send enquiry <span>→</span>';
  }
});
/* DWS_REVEAL_UPGRADE */
document.documentElement.classList.add("reveal-ready");
const revealTargets = document.querySelectorAll(".section-heading,.service-card,.capability-card,.price-card,.recurring-card,.steps>div,.faq-list details");
revealTargets.forEach((el)=>el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries,observer)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.12});
  revealTargets.forEach((el)=>revealObserver.observe(el));
} else {
  revealTargets.forEach((el)=>el.classList.add("visible"));
}
