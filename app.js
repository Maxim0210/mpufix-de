let leadState = {};
try {
  const storedState = window.localStorage?.getItem("mpufix_state");
  leadState = storedState ? JSON.parse(storedState) : {};
} catch (error) {
  leadState = {};
}
leadState.contacts ||= [];
const WHATSAPP_NUMBER = "491624710700";
let currentLanguage = "de";

const languageConfig = {
  de: {
    label: "Wir sprechen und zeigen die Seite auf:",
    active: "Deutsch",
    menu: "Menü",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen"
  },
  ru: {
    label: "Мы говорим и показываем сайт на:",
    active: "Русский",
    menu: "Меню",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню"
  },
  en: {
    label: "We speak and show this page in:",
    active: "English",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu"
  }
};

const pageTranslations = {
  de: {
    "nav.situationen": "Situationen",
    "nav.system": "System",
    "nav.nachweise": "Nachweise",
    "nav.pakete": "Pakete",
    "nav.about": "Über mich",
    "nav.blog": "Blog",
    "nav.faq": "FAQ",
    "nav.kontakt": "Kontakt",
    "header.cta": "Gratis MPU-Check",
    "hero.eyebrow": "MPU Beratung online in Deutschland",
    "hero.signalTitle": "Gratis MPU-Check",
    "hero.signalText": "klare Ersteinschätzung in wenigen Minuten",
    "hero.h1": "Schnell und strukturiert zurück zum Führerschein.",
    "hero.text": "MPUFIX bringt Ordnung in deinen MPU-Fall: Anlass verstehen, Nachweise planen, Online-Kurs nutzen und im Gespräch klar erklären, was sich wirklich verändert hat.",
    "hero.li1": "Vorbereitung bei Alkohol, Drogen, Cannabis, Punkten und Straftaten",
    "hero.li2": "Online-Raum mit Videos, Checklisten und klaren Schritten",
    "hero.li3": "Persönliche Begleitung möglich, verständlich und Schritt für Schritt",
    "hero.primary": "Kostenlose Ersteinschätzung per WhatsApp",
    "hero.secondary": "MPU-Fall in 2 Minuten einordnen",
    "hero.proof1": "Seriöse Vorbereitung",
    "hero.proof2": "Deutsch · Русский · English",
    "hero.proof3": "Deutschlandweit online",
    "contact.eyebrow": "Kontakt",
    "contact.h2": "Lass uns gemeinsam auf deinen Fall schauen.",
    "contact.text": "Schreib kurz, warum du zur MPU musst, ob schon ein Termin steht und ob Nachweise vorhanden sind. Danach bekommst du eine ehrliche erste Einschätzung.",
    "contact.whatsapp": "Per WhatsApp schreiben",
    "contact.call": "Direkt anrufen",
    "contact.email": "E-Mail senden",
    "chat.title": "MPUFIX Assistentin",
    "chat.subtitle": "Beantwortet Kursfragen und bringt dich zum passenden nächsten Schritt.",
    "chat.costs": "Kosten",
    "chat.package": "Paket",
    "chat.proofs": "Nachweise",
    "chat.urgent": "Eilig",
    "chat.placeholder": "Frage kurz eingeben",
    "chat.send": "Senden",
    "chat.whatsapp": "Zu WhatsApp wechseln"
  },
  ru: {
    "nav.situationen": "Ситуации",
    "nav.system": "Система",
    "nav.nachweise": "Документы",
    "nav.pakete": "Пакеты",
    "nav.about": "Обо мне",
    "nav.blog": "Блог",
    "nav.faq": "FAQ",
    "nav.kontakt": "Контакт",
    "header.cta": "Бесплатная проверка MPU",
    "hero.eyebrow": "Онлайн-подготовка к MPU в Германии",
    "hero.signalTitle": "Бесплатная MPU-проверка",
    "hero.signalText": "понятная первичная оценка за несколько минут",
    "hero.h1": "Быстро и структурированно обратно к водительским правам.",
    "hero.text": "MPUFIX помогает навести порядок в твоем случае MPU: понять причину, спланировать подтверждения, использовать онлайн-курс и уверенно объяснить на разговоре, что действительно изменилось.",
    "hero.li1": "Подготовка при алкоголе, наркотиках, каннабисе, баллах и нарушениях",
    "hero.li2": "Онлайн-кабинет с видео, чек-листами и понятными шагами",
    "hero.li3": "Личное сопровождение, простым языком и шаг за шагом",
    "hero.primary": "Бесплатная оценка через WhatsApp",
    "hero.secondary": "Оценить MPU-случай за 2 минуты",
    "hero.proof1": "Серьезная подготовка",
    "hero.proof2": "Deutsch · Русский · English",
    "hero.proof3": "Онлайн по всей Германии",
    "contact.eyebrow": "Контакт",
    "contact.h2": "Давай вместе посмотрим на твой случай.",
    "contact.text": "Коротко напиши, почему тебе нужна MPU, есть ли уже дата и есть ли подтверждения. После этого ты получишь честную первичную оценку.",
    "contact.whatsapp": "Написать в WhatsApp",
    "contact.call": "Позвонить напрямую",
    "contact.email": "Отправить e-mail",
    "chat.title": "Ассистентка MPUFIX",
    "chat.subtitle": "Отвечает на вопросы о курсе и ведет к правильному следующему шагу.",
    "chat.costs": "Цены",
    "chat.package": "Пакет",
    "chat.proofs": "Документы",
    "chat.urgent": "Срочно",
    "chat.placeholder": "Коротко задай вопрос",
    "chat.send": "Отправить",
    "chat.whatsapp": "Перейти в WhatsApp"
  },
  en: {
    "nav.situationen": "Situations",
    "nav.system": "System",
    "nav.nachweise": "Proofs",
    "nav.pakete": "Packages",
    "nav.about": "About me",
    "nav.blog": "Blog",
    "nav.faq": "FAQ",
    "nav.kontakt": "Contact",
    "header.cta": "Free MPU check",
    "hero.eyebrow": "Online MPU preparation in Germany",
    "hero.signalTitle": "Free MPU check",
    "hero.signalText": "clear first assessment in a few minutes",
    "hero.h1": "Back to your driving licence with a clear structure.",
    "hero.text": "MPUFIX brings structure into your MPU case: understand the reason, plan the proof, use the online course and explain clearly what has really changed.",
    "hero.li1": "Preparation for alcohol, drugs, cannabis, points and offences",
    "hero.li2": "Online room with videos, checklists and clear steps",
    "hero.li3": "Personal support available, clear and step by step",
    "hero.primary": "Free first assessment via WhatsApp",
    "hero.secondary": "Check your MPU case in 2 minutes",
    "hero.proof1": "Serious preparation",
    "hero.proof2": "Deutsch · Русский · English",
    "hero.proof3": "Online across Germany",
    "contact.eyebrow": "Contact",
    "contact.h2": "Let us look at your case together.",
    "contact.text": "Briefly write why you need the MPU, whether a date is already set and whether proof is available. Then you receive an honest first assessment.",
    "contact.whatsapp": "Write via WhatsApp",
    "contact.call": "Call directly",
    "contact.email": "Send e-mail",
    "chat.title": "MPUFIX assistant",
    "chat.subtitle": "Answers course questions and guides you to the right next step.",
    "chat.costs": "Costs",
    "chat.package": "Package",
    "chat.proofs": "Proofs",
    "chat.urgent": "Urgent",
    "chat.placeholder": "Type a short question",
    "chat.send": "Send",
    "chat.whatsapp": "Open WhatsApp"
  }
};

const translationTargets = [
  [".main-nav a[href*='situationen'], .main-nav a[href='#situationen']", "nav.situationen"],
  [".main-nav a[href*='system'], .main-nav a[href='#system']", "nav.system"],
  [".main-nav a[href*='nachweise'], .main-nav a[href='#nachweise']", "nav.nachweise"],
  [".main-nav a[href*='pakete'], .main-nav a[href='#pakete']", "nav.pakete"],
  [".main-nav a[href*='ueber-mich']", "nav.about"],
  [".main-nav a[href*='blog']", "nav.blog"],
  [".main-nav a[href*='faq'], .main-nav a[href='#faq']", "nav.faq"],
  [".main-nav a[href*='kontakt'], .main-nav a[href='#kontakt']", "nav.kontakt"],
  [".header-cta", "header.cta"],
  [".hero .eyebrow", "hero.eyebrow"],
  [".hero-signal strong", "hero.signalTitle"],
  [".hero-signal small", "hero.signalText"],
  [".hero-copy h1", "hero.h1"],
  [".hero-text", "hero.text"],
  [".hero-checks li:nth-child(1)", "hero.li1"],
  [".hero-checks li:nth-child(2)", "hero.li2"],
  [".hero-checks li:nth-child(3)", "hero.li3"],
  [".hero-actions .button.primary", "hero.primary"],
  [".hero-actions .button.secondary", "hero.secondary"],
  [".hero-proofline span:nth-child(1)", "hero.proof1"],
  [".hero-proofline span:nth-child(2)", "hero.proof2"],
  [".hero-proofline span:nth-child(3)", "hero.proof3"],
  [".contact-copy .eyebrow", "contact.eyebrow"],
  [".contact-copy h2", "contact.h2"],
  [".contact-copy > p", "contact.text"],
  [".contact-actions .button:nth-child(1)", "contact.whatsapp"],
  [".contact-actions .button:nth-child(2)", "contact.call"],
  [".contact-actions .button:nth-child(3)", "contact.email"],
  [".chat-head strong", "chat.title"],
  [".chat-head span", "chat.subtitle"],
  [".quick-questions button:nth-child(1)", "chat.costs"],
  [".quick-questions button:nth-child(2)", "chat.package"],
  [".quick-questions button:nth-child(3)", "chat.proofs"],
  [".quick-questions button:nth-child(4)", "chat.urgent"],
  [".chat-form button", "chat.send"],
  ["#whatsappLink", "chat.whatsapp"]
];

function getSavedLanguage() {
  let lang = currentLanguage;
  try {
    lang = window.localStorage?.getItem("mpufix_language") || currentLanguage;
  } catch (error) {
    lang = currentLanguage;
  }
  return ["de", "ru", "en"].includes(lang) ? lang : "de";
}

function renderLanguageControls(activeLang) {
  document.querySelectorAll(".language-badge, .mobile-language-strip").forEach((wrap) => {
    const config = languageConfig[activeLang] || languageConfig.de;
    wrap.innerHTML = `
      <span class="language-label">${config.label}</span>
      <button type="button" data-lang="de">Deutsch</button>
      <button type="button" data-lang="ru">Русский</button>
      <button type="button" data-lang="en">English</button>
    `;
    wrap.querySelectorAll("[data-lang]").forEach((button) => {
      const isActive = button.dataset.lang === activeLang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  });
}

function applyLanguage(lang) {
  const selectedLang = ["de", "ru", "en"].includes(lang) ? lang : "de";
  currentLanguage = selectedLang;
  try {
    window.localStorage?.setItem("mpufix_language", selectedLang);
  } catch (error) {
    // Language switching still works for the current page when storage is unavailable.
  }
  document.documentElement.lang = selectedLang === "de" ? "de" : selectedLang;
  const translations = pageTranslations[selectedLang] || pageTranslations.de;

  translationTargets.forEach(([selector, key]) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (translations[key]) element.textContent = translations[key];
    });
  });

  const chatInput = document.querySelector(".chat-form input[name='message']");
  if (chatInput && translations["chat.placeholder"]) {
    chatInput.placeholder = translations["chat.placeholder"];
  }

  document.querySelectorAll(".menu-toggle").forEach((button) => {
    const isOpen = document.body.classList.contains("menu-open");
    button.lastChild.textContent = languageConfig[selectedLang].menu;
    button.setAttribute("aria-label", isOpen ? languageConfig[selectedLang].closeMenu : languageConfig[selectedLang].openMenu);
  });

  renderLanguageControls(selectedLang);
}

function setupLanguageSwitcher() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang]");
    if (!button) return;
    applyLanguage(button.dataset.lang);
  });
  applyLanguage(getSavedLanguage());
}

function setupMobileMenu() {
  document.querySelectorAll(".site-header").forEach((header) => {
    const nav = header.querySelector(".main-nav");
    if (!nav || header.querySelector(".menu-toggle")) return;
    const button = document.createElement("button");
    button.className = "menu-toggle";
    button.type = "button";
    button.setAttribute("aria-controls", "mainNav");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = "<span aria-hidden=\"true\"></span>Menü";
    nav.id ||= "mainNav";
    header.insertBefore(button, header.querySelector(".header-cta") || nav.nextSibling);
    button.addEventListener("click", () => {
      const nextOpen = !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", nextOpen);
      button.setAttribute("aria-expanded", String(nextOpen));
      const lang = getSavedLanguage();
      button.setAttribute("aria-label", nextOpen ? languageConfig[lang].closeMenu : languageConfig[lang].openMenu);
    });
    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      document.body.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
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
