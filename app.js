let leadState = {};
try {
  const storedState = localStorage.getItem("mpufix_state");
  leadState = storedState ? JSON.parse(storedState) : {};
} catch (error) {
  leadState = {};
}
leadState.contacts ||= [];
const WHATSAPP_NUMBER = "491624710700";

const revealTargets = [
  ".hero-signal",
  ".benefit-strip article",
  ".logo-strip span",
  ".section-heading",
  ".situation-card",
  ".split-copy",
  ".rounded-image",
  ".system-card",
  ".feature-grid article",
  ".gradient-cta",
  ".compare-card",
  ".story-column blockquote",
  ".result-card",
  ".proof-slot",
  ".evidence-note",
  ".candidate-card",
  ".price-card",
  ".risk-panel",
  ".blog-card",
  ".faq-list",
  ".contact-copy",
  ".lead-card",
  ".article-card",
  ".reason-grid article",
  ".process-list article",
  ".credential-card",
  ".media-card"
].join(",");

document.querySelectorAll(revealTargets).forEach((element) => {
  element.classList.add("reveal");
});

const scrollProgress = document.querySelector("#scrollProgress");

function updateScrollProgress() {
  if (!scrollProgress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  window.setTimeout(() => {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => {
      element.classList.add("is-visible");
    });
  }, 1200);
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const zoomButtons = [...document.querySelectorAll(".certificate-zoom")];
let lastZoomTrigger = null;

if (zoomButtons.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Nachweis vergrößert anzeigen");
  lightbox.innerHTML = `
    <div class="image-lightbox-panel">
      <button class="image-lightbox-close" type="button" aria-label="Ansicht schließen">×</button>
      <img alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".image-lightbox-close");

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    if (lastZoomTrigger) lastZoomTrigger.focus();
  }

  function openLightbox(button) {
    lastZoomTrigger = button;
    lightboxImage.src = button.dataset.zoomSrc;
    lightboxImage.alt = button.dataset.zoomAlt || "Vergrößerter Nachweis";
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  zoomButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(button);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}

function saveState() {
  localStorage.setItem("mpufix_state", JSON.stringify(leadState));
}

document.querySelectorAll("[data-package]").forEach((button) => {
  button.addEventListener("click", () => {
    const packageSelect = document.querySelector("#packageSelect");
    if (!packageSelect) return;
    packageSelect.value = button.dataset.package;
    document.querySelector("#kontakt")?.scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#contactForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const result = document.querySelector("#contactResult");
  leadState.contacts.unshift({ ...data, createdAt: new Date().toISOString() });
  leadState.contacts = leadState.contacts.slice(0, 30);
  saveState();
  if (result) result.textContent = "Wird gesendet...";

  try {
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    });
    if (result) result.textContent = "Danke. Deine Anfrage ist angekommen. Wenn es eilig ist, schreib zusätzlich direkt per WhatsApp.";
    form.reset();
  } catch (error) {
    if (result) result.textContent = "Die Anfrage ist lokal vorbereitet. Falls nichts ankommt, nutze bitte direkt WhatsApp.";
    updateWhatsappLink(data.nachricht || "Ich möchte meinen MPU-Fall einschätzen lassen.");
  }
});

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function botReply(message) {
  const text = message.toLowerCase();

  if (includesAny(text, ["preis", "kosten", "kostet", "paket", "399", "899", "1999"])) {
    return { text: "Es gibt drei klare Wege: 399 € für den Videozugang, 899 € mit 2 persönlichen Gesprächen und 1.999 € für 10 Online-Termine. Wenn du nicht nur irgendwas schauen willst, sondern deinen Fall wirklich sicher einordnen möchtest, ist das 899-€-Paket meistens der stärkste Einstieg. Soll ich dich direkt zu WhatsApp weiterleiten?", escalate: false };
  }
  if (includesAny(text, ["welches paket", "passt", "empfehlung", "starten", "anfangen"])) {
    return { text: "Wenn dein Fall einfach ist und du selbstständig arbeitest, reicht oft der Videozugang. Wenn du unsicher bist, Nachweise klären musst oder bald Termin hast, ist persönliche Begleitung deutlich sinnvoller. Der schnellste Weg: Schreib kurz per WhatsApp, warum du zur MPU musst. Dann bekommst du eine ehrliche Einschätzung, ohne Verkaufsdruck.", escalate: true };
  }
  if (includesAny(text, ["online", "raum", "login", "zugang", "videos", "videokurs", "6 monate"])) {
    return { text: "Der Online-Raum läuft 6 Monate. Du bekommst Videos, Checklisten und klare Aufgaben, damit du nicht planlos durch YouTube, Foren und Halbwissen gehst. Der Vorteil: Du weißt jeden Schritt vorher und kannst dich ruhiger vorbereiten.", escalate: false };
  }
  if (includesAny(text, ["alkohol", "promille", "trunken"])) {
    return { text: "Bei Alkohol geht es nicht um perfekte Sätze, sondern um glaubwürdige Veränderung: Trinkmuster, Auslöser, Rückfallstrategie und mögliche Nachweise. Genau hier machen viele Fehler. Schreib per WhatsApp Promillewert, Datum und ob ein Termin steht, dann kann dein nächster Schritt sauber eingeordnet werden.", escalate: true };
  }
  if (includesAny(text, ["droge", "drogen", "cannabis", "thc", "kokain", "amphetamin"])) {
    return { text: "Bei Drogen oder Cannabis entscheidet frühe Planung oft über Stress oder Kontrolle. Wichtig sind Substanz, letzter Konsum, Abstinenz, Screening und Aktenlage. Schreib das kurz per WhatsApp, damit du keine Zeit mit falschen Schritten verlierst.", escalate: true };
  }
  if (includesAny(text, ["abstinenz", "nachweis", "urin", "haar", "haaranalyse", "screening"])) {
    return { text: "Ob Abstinenznachweise nötig sind, hängt stark vom Einzelfall ab. Falsch geplant kostet das Zeit und Geld. Schreib per WhatsApp, worum es geht und welche Nachweise du schon hast. Dann bekommst du eine klare Richtung.", escalate: true };
  }
  if (includesAny(text, ["punkte", "blitzer", "geschwindigkeit", "rotlicht"])) {
    return { text: "Bei Punkten geht es darum, dass deine Veränderung nachvollziehbar wirkt: Risikomuster, Einsicht, neue Regeln und Alltag. Der 899-€-Plan passt oft besser als nur Videos, weil deine persönliche Erklärung entscheidend ist.", escalate: false };
  }
  if (includesAny(text, ["termin", "bald", "morgen", "woche", "frist", "eilig"])) {
    return { text: "Wenn dein Termin bald ist, bitte nicht weiter raten. Dann zählt zuerst eine Risikoanalyse: Termin, Anlass, Nachweise, Gutachten oder Akte. Schreib sofort per WhatsApp, damit klar ist, was noch realistisch machbar ist.", escalate: true };
  }
  if (includesAny(text, ["bestehen", "garantie", "sicher", "durchfallen", "nicht bestanden"])) {
    return { text: "Eine Garantie wäre unseriös. Was aber möglich ist: deine Schwächen finden, deine Geschichte sauber aufarbeiten und typische Fehler vermeiden. Wenn du schon einmal nicht bestanden hast, ist WhatsApp der richtige nächste Schritt.", escalate: true };
  }

  return { text: "Ich kann dir einfache Fragen zu Kurs, Paketen, Online-Raum, Kosten, Alkohol, Drogen, Cannabis, Punkten und Nachweisen beantworten. Sobald es um deinen konkreten Fall geht, ist WhatsApp besser, weil dort die wichtigen Details schnell geklärt werden.", escalate: false };
}

function addChatMessage(text, type, escalate = false) {
  const wrap = document.querySelector("#chatMessages");
  if (!wrap) return;
  const item = document.createElement("div");
  item.className = `message ${type}${escalate ? " escalate" : ""}`;
  item.textContent = text;
  wrap.appendChild(item);
  wrap.scrollTop = wrap.scrollHeight;
}

function updateWhatsappLink(message) {
  const link = document.querySelector("#whatsappLink");
  if (!link) return;
  const text = `Hallo, ich habe eine Frage zur MPU-Beratung: ${message}`.slice(0, 450);
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function handleAssistantQuestion(message) {
  const reply = botReply(message);
  addChatMessage(message, "user");
  addChatMessage(reply.text, "bot", reply.escalate);
  updateWhatsappLink(message);
  document.querySelector("#chatBox")?.classList.toggle("needs-whatsapp", reply.escalate);
}

document.querySelector("#chatToggle")?.addEventListener("click", () => {
  const box = document.querySelector("#chatBox");
  const next = box.hidden;
  box.hidden = !next;
  document.querySelector("#chatToggle").setAttribute("aria-expanded", String(next));
  if (next && !document.querySelector("#chatMessages").children.length) {
    addChatMessage("Hi, ich bin die MPUFIX Assistentin. Ich beantworte dir schnell Fragen zum Kurs, zu Paketen, Kosten, Online-Raum, Nachweisen und Termindruck. Wenn dein Fall individuell ist, leite ich dich direkt zu WhatsApp weiter.", "bot");
  }
});

document.querySelector("#chatClose")?.addEventListener("click", () => {
  document.querySelector("#chatBox").hidden = true;
  document.querySelector("#chatToggle").setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => handleAssistantQuestion(button.dataset.question));
});

document.querySelector("#chatForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.message;
  const message = input.value.trim();
  if (!message) return;
  handleAssistantQuestion(message);
  input.value = "";
});

const riskSteps = [...document.querySelectorAll(".risk-step")];
const riskProgress = document.querySelector("#riskProgress");
const riskResult = document.querySelector("#riskResult");
const riskResultTitle = document.querySelector("#riskResultTitle");
const riskResultText = document.querySelector("#riskResultText");
const riskWhatsapp = document.querySelector("#riskWhatsapp");
let riskScore = 0;
let riskStepIndex = 0;
let riskReasons = [];

function showRiskStep(index) {
  riskStepIndex = index;
  riskSteps.forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex === index);
  });
  if (riskProgress) riskProgress.style.width = `${Math.min(100, ((index + 1) / 4) * 100)}%`;
}

function getRiskResult() {
  if (riskScore >= 9) {
    return {
      title: "Hoher Klärungsbedarf",
      text: "Dein Fall sollte nicht nur mit Videos vorbereitet werden. Termin, Nachweise oder Aktenlage können entscheidend sein. Der sinnvollste nächste Schritt ist eine persönliche Einschätzung per WhatsApp."
    };
  }
  if (riskScore >= 5) {
    return {
      title: "Mittleres Risiko",
      text: "Du hast einige Punkte, die vor der MPU sauber geklärt werden sollten. Der Online-Raum kann helfen, aber ein persönliches Gespräch macht deine Vorbereitung deutlich zielgerichteter."
    };
  }
  return {
    title: "Guter Startpunkt",
    text: "Dein Fall wirkt im ersten Schritt überschaubarer. Wichtig ist trotzdem, dass Nachweise, Ablauf und Gesprächsstrategie rechtzeitig geordnet werden. Der Videozugang kann ein sinnvoller Einstieg sein."
  };
}

function showRiskResult() {
  riskSteps.forEach((step) => step.classList.remove("is-active"));
  if (riskProgress) riskProgress.style.width = "100%";
  const result = getRiskResult();
  if (riskResultTitle) riskResultTitle.textContent = result.title;
  if (riskResultText) riskResultText.textContent = result.text;
  if (riskWhatsapp) {
    const text = `Hallo, ich habe den MPU-Risiko-Check gemacht. Ergebnis: ${result.title}. Antworten: ${riskReasons.join(" | ")}. Ich möchte meinen Fall einschätzen lassen.`;
    riskWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }
  if (riskResult) riskResult.hidden = false;
}

document.querySelectorAll(".risk-options button").forEach((button) => {
  button.addEventListener("click", () => {
    riskScore += Number(button.dataset.riskValue || 0);
    riskReasons.push(button.textContent.trim());
    if (riskStepIndex >= riskSteps.length - 1) {
      showRiskResult();
      return;
    }
    showRiskStep(riskStepIndex + 1);
  });
});

document.querySelector("#riskRestart")?.addEventListener("click", () => {
  riskScore = 0;
  riskReasons = [];
  if (riskResult) riskResult.hidden = true;
  showRiskStep(0);
});

showRiskStep(0);
