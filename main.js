/* =========================================================
    REDA FAHIM | PORTFOLIO JS
========================================================= */

"use strict";


/* =========================================================
    CONFIG
========================================================= */

const CONTACT_EMAIL = "fahimreda139@gmail.com";
const CV_DOWNLOAD_URL = "./CV_Reda_Fahim-1.pdf";
const CV_DOWNLOAD_FILENAME = "Reda-Fahim-CV.pdf";


/* =========================================================
    DOM
========================================================= */

const body = document.body;

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-toggle__icon");

const siteHeader = document.querySelector(".site-header");

const scrollProgress = document.querySelector(".scroll-progress span");

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu__close");
const mobileMenuLinks = document.querySelectorAll(
  ".mobile-menu__links a"
);

const navLinks = document.querySelectorAll(
  ".nav__links a"
);

const sections = document.querySelectorAll(
  "main section[id]"
);

const roleElement = document.getElementById("role");
const roleIndexElement = document.getElementById("role-index");

const revealElements = document.querySelectorAll(".reveal");

const projectVisuals = document.querySelectorAll(
  ".project__visual"
);

const heroPortrait = document.querySelector(".hero__portrait");
const heroPortraitEffect = document.querySelector(".hero__portrait-effect");



/* =========================================================
    REDUCED MOTION
========================================================= */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const canUsePointer = window.matchMedia(
  "(pointer: fine)"
).matches;


/* =========================================================
    THEME
========================================================= */

const THEME_KEY = "reda-portfolio-theme";


function updateThemeIcon() {

  if (!themeIcon || !themeToggle) return;

  const isDark = body.classList.contains("dark-mode");

  themeIcon.textContent = isDark ? "☀" : "☾";

  themeToggle.setAttribute(
    "aria-label",
    isDark
      ? "Switch to light theme"
      : "Switch to dark theme"
  );

  themeToggle.setAttribute(
    "aria-pressed",
    String(isDark)
  );
}


function applyTheme(theme) {

  const isDark = theme === "dark";

  body.classList.toggle(
    "dark-mode",
    isDark
  );

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // The selected theme still applies when storage is unavailable.
  }

  updateThemeIcon();
}


function getInitialTheme() {

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch {
    // Fall back to the operating system preference.
  }

  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {
    return savedTheme;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}


if (themeToggle) {

  themeToggle.addEventListener(
    "click",
    () => {

      const nextTheme =
        body.classList.contains("dark-mode")
          ? "light"
          : "dark";

      applyTheme(nextTheme);
    }
  );
}


applyTheme(getInitialTheme());


/* =========================================================
    HEADER / NAVIGATION
========================================================= */

function updateHeader() {

  if (!siteHeader) return;

  siteHeader.classList.toggle(
    "scrolled",
    window.scrollY > 35
  );
}


function updateActiveNavigation() {

  const scrollPosition =
    window.scrollY + 260;

  let currentSection = "";

  sections.forEach((section) => {

    const top = section.offsetTop;
    const bottom =
      top + section.offsetHeight;

    if (
      scrollPosition >= top &&
      scrollPosition < bottom
    ) {
      currentSection = section.id;
    }

  });

  navLinks.forEach((link) => {

    const sectionName =
      link.dataset.nav;

    link.classList.toggle(
      "active",
      sectionName === currentSection
    );

  });
}


function updateScrollProgress() {

  if (!scrollProgress) return;

  const scrollTop =
    window.scrollY;

  const documentHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress =
    documentHeight > 0
      ? scrollTop / documentHeight
      : 0;

  scrollProgress.style.transform =
    `scaleX(${progress})`;
}


let ticking = false;


function handleScroll() {

  if (ticking) return;

  ticking = true;

  requestAnimationFrame(() => {

    updateHeader();
    updateActiveNavigation();
    updateScrollProgress();

    ticking = false;

  });
}


window.addEventListener(
  "scroll",
  handleScroll,
  { passive: true }
);


handleScroll();


/* =========================================================
    MOBILE MENU
========================================================= */

let menuWasOpenedByUser = false;


function openMenu() {

  if (!mobileMenu || !menuToggle) return;

  menuWasOpenedByUser = true;

  mobileMenu.classList.add("open");

  mobileMenu.setAttribute(
    "aria-hidden",
    "false"
  );

  menuToggle.setAttribute(
    "aria-expanded",
    "true"
  );

  body.classList.add("menu-open");

  mobileMenuClose?.focus();
}


function closeMenu({
  restoreFocus = true
} = {}) {

  if (!mobileMenu || !menuToggle) return;

  mobileMenu.classList.remove("open");

  mobileMenu.setAttribute(
    "aria-hidden",
    "true"
  );

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  body.classList.remove("menu-open");

  if (
    restoreFocus &&
    menuWasOpenedByUser
  ) {
    menuToggle.focus();
  }
}


menuToggle?.addEventListener(
  "click",
  () => {

    const isOpen =
      mobileMenu.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }

  }
);


mobileMenuClose?.addEventListener(
  "click",
  () => closeMenu()
);


mobileMenuLinks.forEach((link) => {

  link.addEventListener(
    "click",
    () => closeMenu({
      restoreFocus: false
    })
  );

});


mobileMenu?.addEventListener(
  "click",
  (event) => {

    if (event.target === mobileMenu) {
      closeMenu();
    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (!mobileMenu?.classList.contains("open")) return;

    if (event.key === "Escape") {
      closeMenu();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableItems = mobileMenu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (!firstItem || !lastItem) {
      event.preventDefault();
      return;
    }

    if (!mobileMenu.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? lastItem : firstItem).focus();
    } else if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }

  }
);


window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth > 900 &&
      mobileMenu?.classList.contains("open")
    ) {
      closeMenu({
        restoreFocus: false
      });
    }

  }
);


/* =========================================================
    ROTATING ROLE
========================================================= */

const roles = [
  "UI/UX Designer",
  "Brand Designer",
  "Front-End Web Dev"
];

let roleIndex = 0;

const ROLE_DURATION = 4000;
const ROLE_TRANSITION = 650;

let roleTimer = null;
let roleTransitioning = false;


function updateRoleNumber() {

  if (!roleIndexElement) return;

  roleIndexElement.textContent =
    String(roleIndex + 1).padStart(2, "0");
}


function changeRole() {

  if (
    !roleElement ||
    roleTransitioning
  ) {
    return;
  }

  roleTransitioning = true;

  roleElement.classList.remove(
    "role-in"
  );

  roleElement.classList.add(
    "role-out"
  );


  window.setTimeout(() => {

    roleIndex =
      (roleIndex + 1) % roles.length;

    roleElement.textContent =
      roles[roleIndex];

    updateRoleNumber();

    roleElement.classList.remove(
      "role-out"
    );

    roleElement.classList.add(
      "role-in"
    );


    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        roleElement.classList.remove(
          "role-in"
        );

        window.setTimeout(() => {

          roleTransitioning = false;

        }, 100);

      });

    });

  }, ROLE_TRANSITION);
}


function startRoleRotation() {

  if (
    roleTimer ||
    document.hidden
  ) {
    return;
  }

  roleTimer = window.setInterval(
    changeRole,
    ROLE_DURATION
  );
}


function stopRoleRotation() {

  if (!roleTimer) return;

  window.clearInterval(roleTimer);

  roleTimer = null;
}


if (!prefersReducedMotion.matches) {
  startRoleRotation();
}


document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {

      stopRoleRotation();

    } else {

      if (!prefersReducedMotion.matches) {
        startRoleRotation();
      }

    }

  }
);


/* =========================================================
    SCROLL REVEALS
========================================================= */

if (
  prefersReducedMotion.matches
) {

  revealElements.forEach(
    (element) => {
      element.classList.add("is-visible");
    }
  );

} else {

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
      }
    );


  revealElements.forEach(
    (element) => {

      revealObserver.observe(
        element
      );

    }
  );

}


/* =========================================================
    PORTRAIT CODE REVEAL
========================================================= */

if (heroPortrait && heroPortraitEffect) {
  const portraitContext = heroPortraitEffect.getContext("2d", { alpha: true });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  let previousPoint = null;
  let isPortraitDragging = false;

  /* The visible <img> stays untouched. A separate CORS-enabled copy is used
     only to read brightness values, so a host without CORS headers can never
     break the portrait; the effect then falls back to a generic pattern. */
  const portraitImage = heroPortrait.querySelector(".hero__portrait-image");
  const sampleCanvas = document.createElement("canvas");
  const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
  let portraitSource = null;

  function sampleBrightness(columns, rows, width, height) {
    if (!portraitSource || !sampleContext) return null;

    const sourceWidth = portraitSource.naturalWidth;
    const sourceHeight = portraitSource.naturalHeight;
    if (!sourceWidth || !sourceHeight) return null;

    /* Mirror the CSS object-fit: contain placement of the visible image */
    const scale = Math.min(width / sourceWidth, height / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;

    sampleCanvas.width = columns;
    sampleCanvas.height = rows;

    sampleContext.fillStyle = "#000";
    sampleContext.fillRect(0, 0, columns, rows);
    sampleContext.scale(columns / width, rows / height);
    sampleContext.drawImage(
      portraitSource,
      (width - drawWidth) / 2,
      (height - drawHeight) / 2,
      drawWidth,
      drawHeight
    );

    try {
      const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
      const values = new Float32Array(columns * rows);

      for (let index = 0; index < values.length; index += 1) {
        const offset = index * 4;
        values[index] = (
          0.2126 * pixels[offset] +
          0.7152 * pixels[offset + 1] +
          0.0722 * pixels[offset + 2]
        ) / 255;
      }

      return values;
    } catch {
      return null; /* canvas tainted by a host without CORS */
    }
  }

  if (portraitImage) {
    const sampler = new Image();
    sampler.crossOrigin = "anonymous";
    sampler.addEventListener("load", () => {
      portraitSource = sampler;
      drawCodePortrait();
    });
    sampler.src = portraitImage.src;
  }

  function drawCodePortrait() {
    if (!portraitContext) return;

    const bounds = heroPortrait.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    const canvasWidth = Math.round(width * pixelRatio);
    const canvasHeight = Math.round(height * pixelRatio);

    if (heroPortraitEffect.width !== canvasWidth || heroPortraitEffect.height !== canvasHeight) {
      heroPortraitEffect.width = canvasWidth;
      heroPortraitEffect.height = canvasHeight;
    }

    portraitContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    portraitContext.globalCompositeOperation = "source-over";
    portraitContext.clearRect(0, 0, width, height);
    portraitContext.fillStyle = "#100d20";
    portraitContext.fillRect(0, 0, width, height);

    const columns = Math.max(28, Math.min(90, Math.floor(width / 4)));
    const rows = Math.max(16, Math.round(columns * height / width * 0.5));
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    const asciiRamp = " .:-=+*#%@";
    const fallbackRamp = "@%#*+=-:. ";
    const brightness = sampleBrightness(columns, rows, width, height);
    const fontSize = Math.min(cellHeight * 0.92, cellWidth / 0.62);
    portraitContext.font = `${fontSize}px monospace`;
    portraitContext.textBaseline = "middle";
    portraitContext.shadowColor = "rgba(161, 137, 255, 0.65)";
    portraitContext.shadowBlur = 2;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        let character;
        let color;

        if (brightness) {
          const level = brightness[row * columns + column];
          if (level < 0.1) continue;

          character = asciiRamp[Math.floor(level * (asciiRamp.length - 1))];
          color = level > 0.72 ? "#e4d8ff" : level > 0.4 ? "#a78bfa" : "#7c4dff";
        } else {
          const pattern = (row * 17 + column * 31 + row * column * 7) % 29;
          character = fallbackRamp[pattern % fallbackRamp.length];
          if (character === " ") continue;
          color = pattern > 19 ? "#c4a7ff" : "#8b5cf6";
        }

        portraitContext.fillStyle = color;
        portraitContext.fillText(
          character,
          column * cellWidth,
          row * cellHeight + cellHeight * 0.52
        );
      }
    }

    portraitContext.shadowBlur = 0;
  }

  function erasePortraitAlong(point) {
    if (!portraitContext) return;

    portraitContext.globalCompositeOperation = "destination-out";
    portraitContext.strokeStyle = "rgba(0, 0, 0, 0.92)";
    portraitContext.lineWidth = Math.max(32, Math.min(76, heroPortrait.clientWidth * 0.22));
    portraitContext.lineCap = "round";
    portraitContext.lineJoin = "round";
    portraitContext.shadowColor = "rgba(0, 0, 0, 0.45)";
    portraitContext.shadowBlur = 18;
    portraitContext.beginPath();

    if (previousPoint) {
      portraitContext.moveTo(previousPoint.x, previousPoint.y);
      portraitContext.lineTo(point.x, point.y);
    } else {
      portraitContext.moveTo(point.x, point.y);
      portraitContext.lineTo(point.x + 0.1, point.y + 0.1);
    }

    portraitContext.stroke();
    portraitContext.shadowBlur = 0;
    portraitContext.globalCompositeOperation = "source-over";
    previousPoint = point;
  }

  heroPortrait.addEventListener("pointerdown", (event) => {
    isPortraitDragging = true;
    previousPoint = null;
    heroPortrait.setPointerCapture(event.pointerId);
    const bounds = heroPortrait.getBoundingClientRect();
    erasePortraitAlong({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    });
  });

  heroPortrait.addEventListener("pointermove", (event) => {
    if (!isPortraitDragging) return;
    const bounds = heroPortrait.getBoundingClientRect();
    erasePortraitAlong({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    });
  });

  function stopPortraitDrag() {
    isPortraitDragging = false;
    previousPoint = null;
  }

  heroPortrait.addEventListener("pointerup", stopPortraitDrag);
  heroPortrait.addEventListener("pointercancel", stopPortraitDrag);
  heroPortrait.addEventListener("lostpointercapture", stopPortraitDrag);

  window.addEventListener("resize", drawCodePortrait, { passive: true });
  drawCodePortrait();
}


/* =========================================================
    CUSTOM CURSOR
========================================================= */

const customCursor = document.querySelector(".custom-cursor");
const cursorMark = customCursor?.querySelector(".custom-cursor__mark");
const cursorTargets = "a, button";

if (
  customCursor &&
  canUsePointer &&
  !prefersReducedMotion.matches
) {
  body.classList.add("custom-cursor-enabled");

  let pointerX = 0;
  let pointerY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let cursorFrame = null;

  function animateCursor() {
    const deltaX = pointerX - cursorX;
    const deltaY = pointerY - cursorY;

    cursorX += deltaX * 0.2;
    cursorY += deltaY * 0.2;

    const distance = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    customCursor.style.setProperty("--cursor-x", `${cursorX}px`);
    customCursor.style.setProperty("--cursor-y", `${cursorY}px`);
    customCursor.style.setProperty("--cursor-angle", `${angle}deg`);
    customCursor.style.setProperty(
      "--cursor-speed",
      String(Math.min(distance / 32, 0.75))
    );

    if (distance > 0.2) {
      cursorFrame = window.requestAnimationFrame(animateCursor);
    } else {
      customCursor.style.setProperty("--cursor-speed", "0");
      cursorFrame = null;
    }
  }

  document.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!customCursor.classList.contains("is-visible")) {
        cursorX = pointerX;
        cursorY = pointerY;
        customCursor.style.setProperty("--cursor-x", `${cursorX}px`);
        customCursor.style.setProperty("--cursor-y", `${cursorY}px`);
      }

      customCursor.classList.add("is-visible");

      if (cursorFrame === null) {
        cursorFrame = window.requestAnimationFrame(animateCursor);
      }
    },
    { passive: true }
  );

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest(cursorTargets)) {
      customCursor.classList.add("is-interactive");
      if (cursorMark) cursorMark.textContent = "↗";
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) {
      customCursor.classList.remove("is-visible", "is-interactive");
      if (cursorMark) cursorMark.textContent = "RF";
      return;
    }

    if (
      event.target.closest(cursorTargets) &&
      !event.relatedTarget.closest?.(cursorTargets)
    ) {
      customCursor.classList.remove("is-interactive");
      if (cursorMark) cursorMark.textContent = "RF";
    }
  });
}


/* =========================================================
    PROJECT PARALLAX
========================================================= */

if (
  canUsePointer &&
  !prefersReducedMotion.matches
) {

  projectVisuals.forEach(
    (visual) => {

      const project =
        visual.closest(".project");

      if (!project) return;


      project.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            project.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
            rect.height -
            0.5;

          const moveX =
            x * 10;

          const moveY =
            y * 10;

          visual.style.setProperty(
            "--parallax-x",
            `${moveX}px`
          );

          visual.style.setProperty(
            "--parallax-y",
            `${moveY}px`
          );

        }
      );


      project.addEventListener(
        "pointerleave",
        () => {

          visual.style.setProperty(
            "--parallax-x",
            "0px"
          );

          visual.style.setProperty(
            "--parallax-y",
            "0px"
          );

        }
      );

    }
  );

}


/* =========================================================
    MAGNETIC TOOL CARDS
========================================================= */

if (canUsePointer && !prefersReducedMotion.matches) {
  document.querySelectorAll("[data-magnetic]").forEach((card) => {
    const surface = card.querySelector(".tool-card__surface");
    const icon = card.querySelector(".tool-card__icon");

    if (!surface) return;

    const target = { x: 0, y: 0, glowX: 50, glowY: 50 };
    const current = { x: 0, y: 0, tiltX: 0, tiltY: 0, glowX: 50, glowY: 50 };
    let animationFrame = null;

    function animateCard() {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      current.tiltX += (-target.y * 10 - current.tiltX) * 0.14;
      current.tiltY += (target.x * 10 - current.tiltY) * 0.14;
      current.glowX += (target.glowX - current.glowX) * 0.2;
      current.glowY += (target.glowY - current.glowY) * 0.2;

      surface.style.setProperty("--magnetic-x", `${current.x * 12}px`);
      surface.style.setProperty("--magnetic-y", `${current.y * 12}px`);
      surface.style.setProperty("--tilt-x", `${current.tiltX}deg`);
      surface.style.setProperty("--tilt-y", `${current.tiltY}deg`);
      surface.style.setProperty("--glow-x", `${current.glowX}%`);
      surface.style.setProperty("--glow-y", `${current.glowY}%`);

      if (icon) {
        icon.style.setProperty("--icon-rotate", `${current.tiltY * 0.45}deg`);
      }

      const settling =
        Math.abs(target.x - current.x) +
        Math.abs(target.y - current.y) +
        Math.abs(target.glowX - current.glowX) +
        Math.abs(target.glowY - current.glowY) > 0.01;

      if (settling) {
        animationFrame = window.requestAnimationFrame(animateCard);
      } else {
        animationFrame = null;
      }
    }

    function startAnimation() {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(animateCard);
      }
    }

    card.addEventListener("pointerenter", () => {
      card.classList.add("is-active");
      startAnimation();
    });

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      target.x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
      target.y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
      target.glowX = (target.x + 0.5) * 100;
      target.glowY = (target.y + 0.5) * 100;
      startAnimation();
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-active");
      target.x = 0;
      target.y = 0;
      target.glowX = 50;
      target.glowY = 50;
      startAnimation();
    });
  });
}


/* =========================================================
    FOOTER MESSAGE FORM
========================================================= */

const footerMessageForm = document.getElementById("footer-message-form");

footerMessageForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const subject = footerMessageForm.elements.subject.value.trim();
  const message = footerMessageForm.elements.message.value.trim();
  if (!subject || !message) return;

  const encodedSubject = encodeURIComponent(subject);
  const bodyText = encodeURIComponent(message);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}&body=${bodyText}`;
});


/* =========================================================
    CV DOWNLOAD (virtual file download)
========================================================= */

const cvDownloadLink = document.getElementById("cv-download");

async function startCvDownload(event) {
  event.preventDefault();

  const url = cvDownloadLink?.dataset.cvUrl || CV_DOWNLOAD_URL;
  const filename = cvDownloadLink?.dataset.cvFilename || cvDownloadLink?.getAttribute("download") || CV_DOWNLOAD_FILENAME;

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("CV request failed");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = blobUrl;
    tempLink.download = filename;
    tempLink.rel = "noopener";
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.remove();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    return;
  } catch (error) {
    console.warn("CV download fallback used:", error);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Request CV")}&body=${encodeURIComponent("Hi Reda, can you please send me your CV in PDF format?")}`;
  }
}

cvDownloadLink?.addEventListener("click", startCvDownload);


/* =========================================================
    LOADER
========================================================= */

const loader = document.getElementById("loader");
const loaderCount = document.getElementById("loader-count");

const LOADER_MIN_DURATION = prefersReducedMotion.matches ? 300 : 1400;
const LOADER_MAX_DURATION = 5000;
const LOADER_EXIT_DELAY = 350;
const LOADER_REMOVE_DELAY = 1000;

const loaderStart = performance.now();

let loaderProgress = 0;
let loaderFinished = false;
let pageLoaded = document.readyState === "complete";


function renderLoader(value) {

  loaderProgress = value;

  loader?.style.setProperty("--progress", String(value / 100));

  if (loaderCount) {
    loaderCount.textContent = String(value).padStart(3, "0");
  }
}


function finishLoader() {

  if (loaderFinished) return;

  loaderFinished = true;

  renderLoader(100);

  window.setTimeout(() => {

    loader?.classList.add("is-done");
    loader?.setAttribute("aria-hidden", "true");

    body.classList.remove("is-loading");
    body.classList.add("is-ready");

    window.setTimeout(() => loader?.remove(), LOADER_REMOVE_DELAY);

  }, loader ? LOADER_EXIT_DELAY : 0);
}


function stepLoader(now) {

  if (loaderFinished) return;

  const timeRatio = Math.min((now - loaderStart) / LOADER_MIN_DURATION, 1);
  const target = pageLoaded ? 100 : 90;
  const eased = Math.round(target * (1 - Math.pow(1 - timeRatio, 3)));

  renderLoader(Math.max(loaderProgress, eased));

  if (pageLoaded && timeRatio >= 1) {
    finishLoader();
    return;
  }

  window.requestAnimationFrame(stepLoader);
}


window.addEventListener("load", () => {
  pageLoaded = true;
});

window.setTimeout(finishLoader, LOADER_MAX_DURATION);

if (loader) {
  window.requestAnimationFrame(stepLoader);
} else {
  finishLoader();
}
