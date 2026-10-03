/* ==========================================================================
   50 RECETAS PREMIUM PARA DIABÉTICOS - INTERACTIVE JAVASCRIPT
   ========================================================================== */

/**
 * VARIABLE PRINCIPAL CENTRALIZADA DE CHECKOUT DE HOTMART
 * Modifica esta variable para actualizar el enlace de pago en todos los botones de la página.
 */
const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/R107844240O?checkoutMode=10";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Vincular URL de Hotmart a todos los botones de compra
  bindHotmartCheckoutUrls();

  // 2. Inicializar acordeón de Preguntas Frecuentes
  initFaqAccordion();

  // 3. Inicializar visor Lightbox para imágenes ilustrativas
  initLightbox();

  // 4. Inicializar modales de información legal / contacto del Footer
  initLegalModals();

  // 5. Inicializar reloj temporizador de cuenta regresiva
  initCountdownTimer();
});

/**
 * Vincula dinámicamente la constante HOTMART_CHECKOUT_URL a todos los elementos con la clase .js-hotmart-btn
 */
function bindHotmartCheckoutUrls() {
  const hotmartButtons = document.querySelectorAll(".js-hotmart-btn");
  hotmartButtons.forEach((btn) => {
    if (btn.tagName === "A") {
      btn.href = HOTMART_CHECKOUT_URL;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
    } else {
      btn.addEventListener("click", () => {
        window.open(HOTMART_CHECKOUT_URL, "_blank", "noopener,noreferrer");
      });
    }
  });
}

/**
 * Control del acordeón de Preguntas Frecuentes
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    
    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      
      // Cerrar todos los demás ítems
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherBtn = otherItem.querySelector(".faq-question");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      // Alternar el estado actual
      if (!isActive) {
        item.classList.add("active");
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/**
 * Lightbox interactivo para la sección de ejemplos ilustrativos
 */
function initLightbox() {
  const exampleCards = document.querySelectorAll(".js-lightbox-trigger");
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImage");
  const closeBtn = document.getElementById("lightboxClose");

  if (!modal || !modalImg) return;

  exampleCards.forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || "Ejemplo de uso del recetario";
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("lightbox-content")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

/**
 * Modales legales (Privacidad, Términos, Contacto)
 */
function initLegalModals() {
  const modalTriggers = document.querySelectorAll(".js-legal-modal-trigger");
  const closeButtons = document.querySelectorAll(".js-legal-modal-close");
  const legalModals = document.querySelectorAll(".legal-modal");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute("data-modal-target");
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      legalModals.forEach((m) => m.classList.remove("active"));
      document.body.style.overflow = "";
    });
  });

  legalModals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      legalModals.forEach((m) => m.classList.remove("active"));
      document.body.style.overflow = "";
    }
  });
}

/**
 * Reloj temporizador de cuenta regresiva
 */
function initCountdownTimer() {
  const hoursEl = document.getElementById("timer-hours");
  const minutesEl = document.getElementById("timer-minutes");
  const secondsEl = document.getElementById("timer-seconds");

  if (!hoursEl || !minutesEl || !secondsEl) return;

  const STORAGE_KEY = "recetas_timer_end_time";
  const TIMER_DURATION_MINUTES = 15;

  let endTime = localStorage.getItem(STORAGE_KEY);
  if (!endTime || isNaN(endTime) || parseInt(endTime) < Date.now()) {
    endTime = Date.now() + TIMER_DURATION_MINUTES * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, endTime.toString());
  } else {
    endTime = parseInt(endTime);
  }

  function updateTimer() {
    const now = Date.now();
    const remainingMs = Math.max(0, endTime - now);

    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");

    if (remainingMs <= 0) {
      const newEndTime = Date.now() + TIMER_DURATION_MINUTES * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, newEndTime.toString());
      endTime = newEndTime;
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}
