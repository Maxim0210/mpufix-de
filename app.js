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

const privacyNoticeText = {
  de: {
    title: "Datenschutz-Hinweis",
    text: "MPUFIX nutzt aktuell keine Analyse- oder Marketing-Cookies. Für notwendige Funktionen kann dein Browser lokale Einstellungen speichern.",
    accept: "Verstanden",
    privacy: "Datenschutz"
  },
  en: {
    title: "Privacy notice",
    text: "MPUFIX currently does not use analytics or marketing cookies. Your browser may store local settings for necessary functions.",
    accept: "Understood",
    privacy: "Privacy"
  },
  ru: {
    title: "Уведомление о данных",
    text: "MPUFIX сейчас не использует аналитические или маркетинговые cookies. Для необходимых функций браузер может сохранять локальные настройки.",
    accept: "Понятно",
    privacy: "Защита данных"
  }
};

const whatsappButtonText = {
  de: {
    label: "Direkt per WhatsApp schreiben",
    text: "WhatsApp"
  },
  en: {
    label: "Write directly on WhatsApp",
    text: "WhatsApp"
  },
  ru: {
    label: "Написать напрямую в WhatsApp",
    text: "WhatsApp"
  }
};

const callButtonText = {
  de: {
    label: "Direkt anrufen: +49 162 4710700",
    text: "Anrufen"
  },
  en: {
    label: "Call directly: +49 162 4710700",
    text: "Call"
  },
  ru: {
    label: "Позвонить напрямую: +49 162 4710700",
    text: "Позвонить"
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

function setupPrivacyNotice() {
  const storageKey = "mpufix_privacy_notice_v1";
  try {
    if (window.localStorage?.getItem(storageKey) === "accepted") return;
  } catch (error) {
    return;
  }

  const lang = getCurrentLanguage();
  const copy = privacyNoticeText[lang] || privacyNoticeText.de;
  const notice = document.createElement("aside");
  notice.className = "privacy-notice";
  notice.setAttribute("role", "dialog");
  notice.setAttribute("aria-label", copy.title);
  notice.innerHTML = `
    <div>
      <strong>${copy.title}</strong>
      <p>${copy.text}</p>
    </div>
    <div class="privacy-actions">
      <a href="${normalizeLocalHref("/datenschutz.html")}">${copy.privacy}</a>
      <button type="button">${copy.accept}</button>
    </div>
  `;
  document.body.appendChild(notice);
  document.body.classList.add("privacy-notice-open");

  notice.querySelector("button")?.addEventListener("click", () => {
    try {
      window.localStorage?.setItem(storageKey, "accepted");
    } catch (error) {
      // Ignore storage errors and still close the notice for this session.
    }
    document.body.classList.remove("privacy-notice-open");
    notice.remove();
  });
}

function setupFloatingWhatsappButton() {
  if (document.querySelector(".floating-whatsapp")) return;
  const lang = getCurrentLanguage();
  const copy = whatsappButtonText[lang] || whatsappButtonText.de;
  const message = lang === "en"
    ? "Hello, I would like a free MPU case check."
    : lang === "ru"
      ? "Здравствуйте, я хочу первичную оценку моего MPU-случая."
      : "Hallo, ich möchte meinen MPU-Fall kurz einschätzen lassen.";
  const link = document.createElement("a");
  link.className = "floating-whatsapp";
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", copy.label);
  link.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4l-4 1.1 1.1-3.9a8.4 8.4 0 1 1 15.3-4.6Z"></path>
      <path d="M8.9 7.8c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.4.5c-.2.2-.2.4-.1.6.4.8 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.6-.5c.2-.2.4-.2.7-.1l1.8.8c.3.1.4.3.4.6v.5c0 .3-.1.6-.4.7-.6.4-1.3.6-2.1.4-2.8-.6-5.5-3.2-6.1-6-.2-.8 0-1.5.4-2.1Z"></path>
    </svg>
    <span>${copy.text}</span>
  `;
  document.body.appendChild(link);
}

function setupFloatingCallButton() {
  if (document.querySelector(".floating-call")) return;
  const lang = getCurrentLanguage();
  const copy = callButtonText[lang] || callButtonText.de;
  const link = document.createElement("a");
  link.className = "floating-call";
  link.href = "tel:+491624710700";
  link.dataset.contact = "phone";
  link.setAttribute("aria-label", copy.label);
  link.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"></path>
    </svg>
    <span>${copy.text}</span>
  `;
  document.body.appendChild(link);
}

function cleanAttributionValue(value, maxLength = 80) {
  return String(value || "")
    .replace(/[\r\n|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function detectAcquisitionSource() {
  const params = new URLSearchParams(window.location.search);
  const campaignSource = cleanAttributionValue(params.get("utm_source"));
  if (campaignSource) return campaignSource;

  let referrerHost = "";
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";
  } catch (error) {
    referrerHost = "";
  }

  if (!referrerHost || referrerHost === window.location.hostname.toLowerCase()) return "Direkt";
  if (referrerHost.includes("google.")) return "Google";
  if (referrerHost.includes("bing.")) return "Bing";
  if (referrerHost.includes("chatgpt.com")) return "ChatGPT";
  if (referrerHost.includes("perplexity.ai")) return "Perplexity";
  if (referrerHost.includes("facebook.com") || referrerHost.includes("fb.com")) return "Facebook";
  if (referrerHost.includes("instagram.com")) return "Instagram";
  if (referrerHost.includes("tiktok.com")) return "TikTok";
  if (referrerHost.includes("youtube.com") || referrerHost.includes("youtu.be")) return "YouTube";
  return cleanAttributionValue(referrerHost.replace(/^www\./, ""));
}

function getContactAttribution() {
  const storageKey = "mpufix_attribution_v1";
  try {
    const stored = window.sessionStorage?.getItem(storageKey);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    // Continue with attribution from the current page.
  }

  const params = new URLSearchParams(window.location.search);
  const attribution = {
    source: detectAcquisitionSource(),
    campaign: cleanAttributionValue(params.get("utm_campaign")),
    landing: cleanAttributionValue(window.location.pathname || "/", 120)
  };

  try {
    window.sessionStorage?.setItem(storageKey, JSON.stringify(attribution));
  } catch (error) {
    // Attribution still works for the current page without storage.
  }
  return attribution;
}

function setupContactAttribution() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.('a[href*="wa.me/"]');
    if (!link) return;

    let url;
    try {
      url = new URL(link.href);
    } catch (error) {
      return;
    }

    const currentText = url.searchParams.get("text") || "Hallo, ich möchte meinen MPU-Fall einschätzen lassen.";
    if (currentText.includes("MPUFIX-Quelle:")) return;

    const attribution = getContactAttribution();
    const campaign = attribution.campaign ? ` | Kampagne: ${attribution.campaign}` : "";
    const contactPage = cleanAttributionValue(window.location.pathname || "/", 120);
    const sourceLine = `MPUFIX-Quelle: ${attribution.source}${campaign} | Einstieg: ${attribution.landing} | Kontakt: ${contactPage}`;
    url.searchParams.set("text", `${currentText}\n\n${sourceLine}`);
    link.href = url.toString();
  }, true);
}

async function setupPrivacyFriendlyAnalytics() {
  if (window.location.protocol === "file:") return;

  try {
    const response = await fetch("/analytics-config.json", { cache: "no-store" });
    if (!response.ok) return;
    const config = await response.json();
    const token = String(config.cloudflareToken || "").trim();
    if (!/^[a-f0-9]{32}$/i.test(token)) return;

    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token });
    document.head.appendChild(script);
  } catch (error) {
    // Analytics is optional and must never block the website.
  }
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
setupPrivacyNotice();
setupFloatingWhatsappButton();
setupFloatingCallButton();
setupContactAttribution();
setupPrivacyFriendlyAnalytics();

function setupMpuTools() {
  const costButton = document.getElementById("calculateCosts");
  if (costButton) {
    costButton.addEventListener("click", () => {
      const reason = document.getElementById("costReason")?.value || "points";
      const prep = Number(document.getElementById("costPrep")?.value || 0);
      const hair = Math.max(0, Number(document.getElementById("hairCount")?.value || 0));
      const urine = Math.max(0, Number(document.getElementById("urineCount")?.value || 0));
      const ranges = {
        points: [350, 550],
        alcohol: [450, 750],
        drugs: [450, 750],
        mixed: [600, 950]
      };
      const [baseMin, baseMax] = ranges[reason] || ranges.points;
      const min = baseMin + prep + hair * 200 + urine * 50;
      const max = baseMax + prep + hair * 300 + urine * 100;
      const result = document.getElementById("costResult");
      if (result) {
        result.innerHTML = `<span>Grobe Orientierung</span><strong>${min.toLocaleString("de-DE")} bis ${max.toLocaleString("de-DE")} Euro</strong><p>Das ist keine verbindliche Preisangabe. Entscheidend sind Anlass, Fragestellung, Nachweise und die gewählte Vorbereitung.</p>`;
      }
    });
  }

  const abstinenceButton = document.getElementById("calculateAbstinence");
  if (abstinenceButton) {
    abstinenceButton.addEventListener("click", () => {
      const startValue = document.getElementById("abstinenceStart")?.value;
      const months = Number(document.getElementById("abstinenceMonths")?.value || 0);
      const topic = document.getElementById("abstinenceTopic")?.value || "dein Thema";
      const result = document.getElementById("abstinenceResult");
      if (!startValue || !months || !result) return;
      const endDate = new Date(`${startValue}T12:00:00`);
      endDate.setMonth(endDate.getMonth() + months);
      const formatted = endDate.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
      result.innerHTML = `<span>Grobe Planung</span><strong>bis etwa ${formatted}</strong><p>Für ${topic} solltest du vor dem Start klären, welche Nachweisform akzeptiert wird und ob der Zeitraum zu deinem MPU-Termin passt.</p>`;
    });
  }

  const readinessButton = document.getElementById("calculateReadiness");
  if (readinessButton) {
    readinessButton.addEventListener("click", () => {
      const checks = [...document.querySelectorAll("#mpuQuestionCheck input[type='checkbox']")];
      const score = checks.filter((item) => item.checked).length;
      const result = document.getElementById("readinessResult");
      if (!result) return;
      let title = "Noch nicht stabil genug.";
      let text = "Deine Antworten haben wahrscheinlich noch Lücken. Starte mit Struktur, bevor du dich auf den MPU-Termin verlässt.";
      if (score >= 6) {
        title = "Gute Grundlage.";
        text = "Du hast viele Kernpunkte vorbereitet. Jetzt geht es darum, die Antworten persönlich, konkret und nicht auswendig klingen zu lassen.";
      } else if (score >= 4) {
        title = "Ansatz ist da, aber noch unsicher.";
        text = "Einige wichtige Punkte sind vorhanden. Die größten Risiken liegen meist bei Auslösern, Rückfallplan und glaubwürdiger Veränderung.";
      }
      result.innerHTML = `<span>${score} von ${checks.length} Punkten</span><strong>${title}</strong><p>${text}</p>`;
    });
  }

  const fineButton = document.getElementById("calculateFineRisk");
  if (fineButton) {
    fineButton.addEventListener("click", () => {
      const reason = document.getElementById("fineReason")?.value || "speed";
      const detail = document.getElementById("fineDetail")?.value || "inner";
      const speedOver = Math.max(0, Number(document.getElementById("speedOver")?.value || 0));
      const currentPoints = Math.max(0, Number(document.getElementById("currentPoints")?.value || 0));
      const result = document.getElementById("fineRiskResult");
      if (!result) return;

      const speedTableInner = [
        [10, 30, 0, "kein Regelfahrverbot"],
        [15, 50, 0, "kein Regelfahrverbot"],
        [20, 70, 0, "kein Regelfahrverbot"],
        [25, 115, 1, "kein Regelfahrverbot"],
        [30, 180, 1, "kein Regelfahrverbot"],
        [40, 260, 2, "1 Monat möglich"],
        [50, 400, 2, "1 Monat möglich"],
        [60, 560, 2, "2 Monate möglich"],
        [70, 700, 2, "3 Monate möglich"],
        [999, 800, 2, "3 Monate möglich"]
      ];
      const speedTableOuter = [
        [10, 20, 0, "kein Regelfahrverbot"],
        [15, 40, 0, "kein Regelfahrverbot"],
        [20, 60, 0, "kein Regelfahrverbot"],
        [25, 100, 1, "kein Regelfahrverbot"],
        [30, 150, 1, "kein Regelfahrverbot"],
        [40, 200, 1, "kein Regelfahrverbot"],
        [50, 320, 2, "1 Monat möglich"],
        [60, 480, 2, "1 Monat möglich"],
        [70, 600, 2, "2 Monate möglich"],
        [999, 700, 2, "3 Monate möglich"]
      ];

      function speedEstimate() {
        const table = detail === "outer" ? speedTableOuter : speedTableInner;
        const row = table.find(([limit]) => speedOver <= limit) || table[table.length - 1];
        return {
          label: detail === "outer" ? "Geschwindigkeit außerorts" : "Geschwindigkeit innerorts",
          fine: row[1],
          points: row[2],
          ban: row[3],
          risk: row[2] >= 2 || currentPoints + row[2] >= 6 ? "erhöht" : "niedrig bis mittel",
          advice: "Bei einzelnen Geschwindigkeitsverstößen geht es oft um Punkte und Fahrverbot. MPU-relevant wird es vor allem bei vielen Punkten, Wiederholung, Gefährdung oder Entziehung."
        };
      }

      const estimates = {
        alcohol: {
          label: "Alkohol am Steuer",
          fine: detail === "repeat" || detail === "danger" ? 1000 : 500,
          points: 2,
          ban: detail === "repeat" || detail === "danger" ? "bis 3 Monate möglich" : "1 Monat möglich",
          risk: detail === "repeat" || detail === "danger" ? "hoch" : "erhöht",
          advice: "Bei Alkohol zählt für die MPU nicht nur der Wert. Wichtig sind Trinkmuster, Auslöser, Veränderung, Rückfallplan und passende Nachweise."
        },
        thc: {
          label: "THC oder Cannabis am Steuer",
          fine: detail === "repeat" || detail === "danger" ? 1000 : 500,
          points: 2,
          ban: detail === "repeat" || detail === "danger" ? "bis 3 Monate möglich" : "1 Monat möglich",
          risk: "erhöht",
          advice: "Bei THC sollte schnell geklärt werden, welcher Wert vorliegt, ob Mischkonsum, Probezeit oder frühere Auffälligkeiten eine Rolle spielen und welche Nachweise sinnvoll sind."
        },
        phone: {
          label: "Handy am Steuer",
          fine: detail === "danger" ? 150 : 100,
          points: detail === "danger" ? 2 : 1,
          ban: detail === "danger" ? "1 Monat möglich" : "kein Regelfahrverbot",
          risk: currentPoints + (detail === "danger" ? 2 : 1) >= 6 ? "erhöht" : "niedrig",
          advice: "Ein Handyverstoß allein führt selten direkt zur MPU. Kritisch wird es bei vielen Punkten, wiederholten Auffälligkeiten oder Gefährdung."
        },
        redlight: {
          label: "Rotlichtverstoß",
          fine: detail === "danger" || detail === "repeat" ? 200 : 90,
          points: detail === "danger" || detail === "repeat" ? 2 : 1,
          ban: detail === "danger" || detail === "repeat" ? "1 Monat möglich" : "kein Regelfahrverbot",
          risk: detail === "danger" || currentPoints >= 5 ? "erhöht" : "niedrig bis mittel",
          advice: "Beim Rotlicht zählt, ob es ein einfacher oder qualifizierter Verstoß war und ob Gefährdung oder Unfall im Raum stehen."
        },
        points: {
          label: "Punkte in Flensburg",
          fine: 0,
          points: 0,
          ban: currentPoints >= 8 ? "Entziehung der Fahrerlaubnis möglich" : "abhängig vom Anlass",
          risk: currentPoints >= 8 ? "hoch" : currentPoints >= 6 ? "erhöht" : "mittel",
          advice: "Ab mehreren Punkten geht es nicht nur um Einzelverstöße. Für eine MPU zählt, ob du dein Fahrverhalten nachvollziehbar verändert hast."
        }
      };

      const estimate = reason === "speed" ? speedEstimate() : estimates[reason];
      const totalPoints = currentPoints + estimate.points;
      const risk = totalPoints >= 8 ? "hoch" : totalPoints >= 6 && estimate.risk !== "hoch" ? "erhöht" : estimate.risk;
      const fineText = estimate.fine > 0 ? `ca. ${estimate.fine.toLocaleString("de-DE")} Euro` : "kein fester Bußgeldwert";
      const whatsappText = encodeURIComponent(`Hallo, ich habe den Bußgeld- und MPU-Risiko-Rechner genutzt. Thema: ${estimate.label}, grobes Risiko: ${risk}, Punkte nach Rechner: ${totalPoints}. Bitte kurz einschätzen.`);

      result.innerHTML = `
        <span>Grobe Orientierung</span>
        <strong>${risk === "hoch" ? "Hohes Risiko" : risk === "erhöht" ? "Erhöhtes Risiko" : "Erste Orientierung"}</strong>
        <div class="fine-summary">
          <p><b>Bußgeld:</b> ${fineText}</p>
          <p><b>Punkte:</b> ${estimate.points} neu, grob ${totalPoints} gesamt</p>
          <p><b>Fahrverbot:</b> ${estimate.ban}</p>
        </div>
        <p>${estimate.advice}</p>
        <a class="button secondary dark" href="https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}" target="_blank" rel="noopener">Fall kostenlos per WhatsApp klären</a>
      `;
    });
  }
}

setupMpuTools();
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

  if (includesAny(text, ["preis", "kosten", "kostet", "paket", "499", "899", "1999"])) {
    return { text: "Es gibt drei klare Wege: 499 EUR für den Videozugang, 899 EUR mit 2 persönlichen Gesprächen und 1.999 EUR für 10 Online-Termine. Wenn du nicht nur irgendwas schauen willst, sondern deinen Fall wirklich sauber einordnen möchtest, ist das 899-EUR-Paket meistens der stärkste Einstieg. Soll ich dich direkt zu WhatsApp weiterleiten?", escalate: false };
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

function setupLocationFinder() {
  const form = document.getElementById("locationFinder");
  const input = document.getElementById("locationQuery");
  const result = document.getElementById("locationResult");
  const title = document.getElementById("locationResultTitle");
  const whatsapp = document.getElementById("locationWhatsapp");

  if (!form || !input || !result || !title || !whatsapp) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const location = input.value.trim().replace(/\s+/g, " ").slice(0, 80);
    if (!location) {
      input.focus();
      return;
    }

    title.textContent = `MPU Beratung ist für ${location} online verfügbar.`;
    const message = `Hallo, ich wohne in ${location} und möchte meinen MPU-Fall kostenlos einordnen lassen. Mein Anlass ist: `;
    whatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function setupPrintableChecklist() {
  document.getElementById("printChecklist")?.addEventListener("click", () => window.print());
}

setupLocationFinder();
setupPrintableChecklist();
