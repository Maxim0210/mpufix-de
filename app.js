let leadState = {};
try {
  const storedState = window.localStorage?.getItem("mpufix_state");
  leadState = storedState ? JSON.parse(storedState) : {};
} catch (error) {
  leadState = {};
}
leadState.contacts ||= [];
const WHATSAPP_NUMBER = "491624710700";

const languageConfig = {
  de: {
    label: "Wir sprechen und zeigen die Seite auf:",
    menu: "Menü",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen"
  },
  ru: {
    label: "Мы говорим и показываем сайт на:",
    menu: "Меню",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню"
  },
  en: {
    label: "We speak and show this page in:",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu"
  }
};

const languageLinks = [
  { lang: "de", label: "Deutsch", href: "/" },
  { lang: "ru", label: "Русский", href: "/ru.html" },
  { lang: "en", label: "English", href: "/en.html" }
];

const contactMessages = {
  de: {
    sending: "Wird gesendet...",
    success: "Danke. Deine Anfrage ist angekommen. Wenn es eilig ist, schreib zusätzlich direkt per WhatsApp.",
    fallback: "Die Anfrage ist lokal vorbereitet. Falls nichts ankommt, nutze bitte direkt WhatsApp."
  },
  en: {
    sending: "Sending...",
    success: "Thank you. Your request has arrived. If it is urgent, please also write directly on WhatsApp.",
    fallback: "Your request was prepared locally. If nothing arrives, please use WhatsApp directly."
  },
  ru: {
    sending: "Отправляется...",
    success: "Спасибо. Ваш запрос получен. Если вопрос срочный, напишите дополнительно напрямую в WhatsApp.",
    fallback: "Запрос подготовлен локально. Если он не отправится, пожалуйста, напишите напрямую в WhatsApp."
  }
};

function getCurrentLanguage() {
  const path = window.location.pathname.toLowerCase();
  if (path.endsWith("/ru.html")) return "ru";
  if (path.endsWith("/en.html")) return "en";
  return document.documentElement.lang?.slice(0, 2) || "de";
}

function normalizeLocalHref(href) {
  if (!window.location.protocol.startsWith("file")) return href;
  if (href === "/") return "index.html";
  return href.replace("/", "");
}

function renderLanguageControls(activeLang = getCurrentLanguage()) {
  document.querySelectorAll(".language-badge, .mobile-language-strip").forEach((wrap) => {
    const config = languageConfig[activeLang] || languageConfig.de;
    const links = languageLinks.map((item) => `
      <a href="${normalizeLocalHref(item.href)}" hreflang="${item.lang}" class="${item.lang === activeLang ? "is-active" : ""}">${item.label}</a>
    `).join("");
    wrap.innerHTML = `<span class="language-label">${config.label}</span>${links}`;
  });
}

function setupLanguageSwitcher() {
  renderLanguageControls(getCurrentLanguage());
}

function setMenuButtonLabel(button) {
  const lang = getCurrentLanguage();
  const config = languageConfig[lang] || languageConfig.de;
  const label = button.querySelector(".menu-toggle-text");
  if (label) label.textContent = config.menu;
  const isOpen = document.body.classList.contains("menu-open");
  button.setAttribute("aria-label", isOpen ? config.closeMenu : config.openMenu);
}

function setupMobileMenu() {
  document.querySelectorAll(".site-header").forEach((header, index) => {
    const nav = header.querySelector(".main-nav");
    if (!nav) return;

    let button = header.querySelector(".menu-toggle");
    if (!button) {
      button = document.createElement("button");
      button.className = "menu-toggle";
      button.type = "button";
      button.innerHTML = "<span class=\"menu-lines\" aria-hidden=\"true\"></span><span class=\"menu-toggle-text\">Menü</span>";
      header.insertBefore(button, nav);
    }

    nav.id ||= `mainNav-${index + 1}`;
    button.setAttribute("aria-controls", nav.id);
    button.setAttribute("aria-expanded", "false");
    setMenuButtonLabel(button);

    button.addEventListener("click", () => {
      const nextOpen = !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", nextOpen);
      button.setAttribute("aria-expanded", String(nextOpen));
      setMenuButtonLabel(button);
    });

    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      document.body.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
      setMenuButtonLabel(button);
    });
  });
}

setupMobileMenu();
setupLanguageSwitcher();
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
      <button class="image-lightbox-close" type="button" aria-label="Ansicht schließen">&times;</button>
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
  try {
    window.localStorage?.setItem("mpufix_state", JSON.stringify(leadState));
  } catch (error) {
    // Lead data is still handled in the current session when storage is unavailable.
  }
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
  const messages = contactMessages[getCurrentLanguage()] || contactMessages.de;
  if (result) result.textContent = messages.sending;

  try {
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    });
    if (result) result.textContent = messages.success;
    form.reset();
  } catch (error) {
    if (result) result.textContent = messages.fallback;
    updateWhatsappLink(data.nachricht || "Ich möchte meinen MPU-Fall einschätzen lassen.");
  }
});

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function botReply(message) {
  const text = message.toLowerCase();

  if (includesAny(text, ["preis", "kosten", "kostet", "paket", "399", "899", "1999"])) {
    return { text: "Es gibt drei klare Wege: 399 EUR für den Videozugang, 899 EUR mit 2 persönlichen Gesprächen und 1.999 EUR für 10 Online-Termine. Wenn du nicht nur irgendwas schauen willst, sondern deinen Fall wirklich sauber einordnen möchtest, ist das 899-EUR-Paket meistens der stärkste Einstieg. Soll ich dich direkt zu WhatsApp weiterleiten?", escalate: false };
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
    return { text: "Bei Punkten geht es darum, dass deine Veränderung nachvollziehbar wirkt: Risikomuster, Einsicht, neue Regeln und Alltag. Der 899-EUR-Plan passt oft besser als nur Videos, weil deine persönliche Erklärung entscheidend ist.", escalate: false };
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
  const lang = getCurrentLanguage();
  if (lang === "en") {
    if (riskScore >= 9) {
      return {
        title: "High need for clarification",
        text: "Your case should not be prepared with videos only. Appointment timing, proof or file details can be decisive. The best next step is a personal WhatsApp assessment."
      };
    }
    if (riskScore >= 5) {
      return {
        title: "Medium risk",
        text: "Some parts of your case should be clarified before the MPU. The online room can help, but a personal call makes your preparation more targeted."
      };
    }
    return {
      title: "Good starting point",
      text: "Your case looks more manageable at first glance. Proof, process and interview strategy should still be organised early."
    };
  }
  if (lang === "ru") {
    if (riskScore >= 9) {
      return {
        title: "Нужна точная проверка",
        text: "Ваш случай не стоит готовить только по видео. Термин, документы или данные из дела могут быть решающими. Лучший следующий шаг — личная оценка в WhatsApp."
      };
    }
    if (riskScore >= 5) {
      return {
        title: "Средний риск",
        text: "В вашем случае есть моменты, которые нужно заранее прояснить. Онлайн-кабинет поможет, но личный разговор сделает подготовку точнее."
      };
    }
    return {
      title: "Хорошая стартовая точка",
      text: "На первый взгляд случай выглядит более понятным. Но документы, процесс и стратегия разговора должны быть подготовлены заранее."
    };
  }
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
    const lang = getCurrentLanguage();
    const text = lang === "en"
      ? `Hello, I completed the MPU risk check. Result: ${result.title}. Answers: ${riskReasons.join(" | ")}. I would like a case assessment.`
      : lang === "ru"
        ? `Здравствуйте, я прошел MPU-чек. Результат: ${result.title}. Ответы: ${riskReasons.join(" | ")}. Я хочу оценку моего случая.`
        : `Hallo, ich habe den MPU-Risiko-Check gemacht. Ergebnis: ${result.title}. Antworten: ${riskReasons.join(" | ")}. Ich möchte meinen Fall einschätzen lassen.`;
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
