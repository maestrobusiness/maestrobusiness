(function () {
  const GOOGLE_FORM_PUBLIC_URL = "https://docs.google.com/forms/d/e/1FAIpQLSce3gtKrZ_LflP7owBmA6K-SulcaK14hhgocDQZumZE2kgEuA/viewform";
  const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSce3gtKrZ_LflP7owBmA6K-SulcaK14hhgocDQZumZE2kgEuA/formResponse";

  // IDs reais extraídos do Google Forms em 2026-06-18.
  // O formulário público atual tem 5 perguntas; os campos sem entry próprio são enviados consolidados no campo de objetivo.
  const GOOGLE_FORM_FIELDS = {
    nome: "entry.2096053321",
    empresa: "entry.992448379",
    cargo: null,
    email: "entry.1199645829",
    whatsapp: "entry.2138150433",
    faturamento: null,
    interesse: null,
    desafio: null,
    mensagem: null
  };

  const GOOGLE_FORM_COMBINED_FIELD = "entry.1940759339";
  const GOOGLE_FORM_TARGET = "hidden_google_form_iframe";

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const diagnosticModal = document.querySelector("[data-diagnostic-modal]");
  const serviceModal = document.querySelector("[data-service-modal]");
  const diagnosticForm = document.querySelector("[data-diagnostic-form]");
  const whatsappInput = document.querySelector("[data-whatsapp]");
  const year = document.querySelector("[data-year]");
  let lastFocusedElement = null;

  const serviceDetails = {
    tax: {
      kicker: "Maestro Tax",
      title: "Recuperação tributária com leitura de valor.",
      text: "Analisamos créditos, teses, regimes, processos e oportunidades tributárias com foco em caixa, segurança e prioridade executiva.",
      bullets: [
        "Mapeamento de créditos e oportunidades não capturadas.",
        "Revisão de riscos, documentação e viabilidade econômica.",
        "Estratégia para redução de impostos sem abordagem genérica."
      ]
    },
    debt: {
      kicker: "Maestro Debt Strategy",
      title: "Passivos renegociáveis tratados como estratégia.",
      text: "A frente combina leitura financeira, fiscal e negocial para reduzir pressão de caixa e abrir margem de reorganização.",
      bullets: [
        "Diagnóstico de dívidas bancárias, fiscais e operacionais.",
        "Radar de oportunidades de renegociação e alongamento.",
        "Estruturação de tese para conversas com credores e instituições."
      ]
    },
    deal: {
      kicker: "Maestro Deal Advisory",
      title: "Transações mais claras, conectadas e defendáveis.",
      text: "Apoiamos decisões de M&A, fundraising e parcerias com preparação, narrativa, conexões e estruturação.",
      bullets: [
        "Preparação de tese, materiais e prioridades de negociação.",
        "Conexões estratégicas com capital, compradores e parceiros.",
        "Apoio em desenho de transação, timing e governança."
      ]
    },
    bi: {
      kicker: "Maestro Business Intelligence",
      title: "O que a operação não vê, a inteligência revela.",
      text: "Construímos diagnóstico empresarial para localizar perdas ocultas e oportunidades de performance no cruzamento de dados e contexto.",
      bullets: [
        "Mapeamento de custos ocultos, gargalos e vazamentos.",
        "Análise financeira, comercial, tributária e operacional integrada.",
        "Priorização objetiva por impacto, esforço e risco."
      ]
    },
    capital: {
      kicker: "Maestro Capital",
      title: "Patrimônio, investimento e internacionalização com estrutura.",
      text: "Estruturamos caminhos para proteção patrimonial, expansão internacional e decisões de capital com visão de longo prazo.",
      bullets: [
        "Estratégias de proteção, diversificação e governança patrimonial.",
        "Análise de estruturas nacionais e internacionais.",
        "Conexão entre patrimônio, empresa, sucessão e oportunidades."
      ]
    },
    systems: {
      kicker: "Maestro Systems",
      title: "Tecnologia proprietária para decisões recorrentes.",
      text: "Desenhamos softwares, automações e sistemas internos para transformar diagnóstico em rotina de inteligência.",
      bullets: [
        "Automação de processos críticos e painéis executivos.",
        "Sistemas exclusivos para mapeamento de oportunidades.",
        "Integração entre dados, alertas e tomada de decisão."
      ]
    }
  };

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    if (!header || !menuToggle) return;
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && header && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.addEventListener("click", (event) => {
      if (event.target.matches("a, button")) {
        closeMenu();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 })
    : null;

  document.querySelectorAll(".reveal").forEach((element) => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add("is-visible");
    }
  });

  const formatCounter = (value) => Math.round(value).toLocaleString("pt-BR");

  const animateCounter = (element) => {
    const target = Number(element.dataset.target || "0");
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${formatCounter(target * eased)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = `${prefix}${formatCounter(target)}${suffix}`;
      }
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));
  } else {
    document.querySelectorAll("[data-counter]").forEach(animateCounter);
  }

  const getFocusable = (container) => Array.from(
    container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
  );

  const openModal = (modal) => {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    const focusable = getFocusable(modal);
    if (focusable.length) {
      focusable[0].focus();
    }
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.hidden = true;
    if (diagnosticModal?.hidden && serviceModal?.hidden) {
      document.body.classList.remove("modal-open");
    }
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  document.querySelectorAll("[data-open-diagnostic]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(serviceModal);
      openModal(diagnosticModal);
    });
  });

  document.querySelectorAll("[data-close-diagnostic]").forEach((button) => {
    button.addEventListener("click", () => closeModal(diagnosticModal));
  });

  document.querySelectorAll("[data-close-service]").forEach((button) => {
    button.addEventListener("click", () => closeModal(serviceModal));
  });

  [diagnosticModal, serviceModal].forEach((modal) => {
    if (!modal) return;
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });

    modal.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = getFocusable(modal);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (diagnosticModal && !diagnosticModal.hidden) closeModal(diagnosticModal);
      if (serviceModal && !serviceModal.hidden) closeModal(serviceModal);
      closeMenu();
    }
  });

  document.querySelectorAll("[data-service]").forEach((card) => {
    card.addEventListener("click", () => {
      const detail = serviceDetails[card.dataset.service];
      if (!detail || !serviceModal) return;

      serviceModal.querySelector("[data-service-modal-kicker]").textContent = detail.kicker;
      serviceModal.querySelector("[data-service-modal-title]").textContent = detail.title;
      serviceModal.querySelector("[data-service-modal-text]").textContent = detail.text;

      const list = serviceModal.querySelector("[data-service-modal-list]");
      list.innerHTML = "";
      detail.bullets.forEach((bullet) => {
        const item = document.createElement("li");
        item.textContent = bullet;
        list.appendChild(item);
      });

      openModal(serviceModal);
    });
  });

  const maskWhatsApp = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  if (whatsappInput) {
    whatsappInput.addEventListener("input", () => {
      whatsappInput.value = maskWhatsApp(whatsappInput.value);
    });
  }

  const requiredMessages = {
    nome: "Informe seu nome.",
    empresa: "Informe a empresa.",
    cargo: "Informe seu cargo.",
    email: "Informe um e-mail corporativo válido.",
    whatsapp: "Informe um WhatsApp para contato.",
    faturamento: "Selecione o faturamento aproximado.",
    interesse: "Selecione uma frente de interesse.",
    desafio: "Descreva o principal desafio atual."
  };

  const setFieldError = (form, name, message) => {
    const field = form.querySelector(`[name="${name}"]`)?.closest(".field");
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if (field) field.classList.toggle("has-error", Boolean(message));
    if (error) error.textContent = message || "";
  };

  const clearErrors = (form) => {
    Object.keys(requiredMessages).forEach((name) => setFieldError(form, name, ""));
    const formError = form.parentElement.querySelector("[data-form-error]");
    if (formError) {
      formError.hidden = true;
      formError.textContent = "";
    }
  };

  const createHiddenInput = (name, value) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  };

  const buildCombinedMessage = (payload) => [
    `Empresa: ${payload.empresa}`,
    `Cargo: ${payload.cargo}`,
    `Faturamento mensal aproximado: ${payload.faturamento}`,
    `Principal interesse: ${payload.interesse}`,
    `Principal desafio atual: ${payload.desafio}`,
    payload.mensagem ? `Mensagem adicional: ${payload.mensagem}` : "",
    `Origem: ${payload.origem || "site-maestro-business"}`
  ].filter(Boolean).join("\n\n");

  const submitToGoogleForms = (payload) => {
    const hiddenForm = document.createElement("form");
    hiddenForm.method = "POST";
    hiddenForm.action = GOOGLE_FORM_ACTION;
    hiddenForm.target = GOOGLE_FORM_TARGET;
    hiddenForm.style.display = "none";

    Object.entries(GOOGLE_FORM_FIELDS).forEach(([field, entryId]) => {
      if (entryId && payload[field]) {
        hiddenForm.appendChild(createHiddenInput(entryId, payload[field]));
      }
    });

    hiddenForm.appendChild(createHiddenInput(GOOGLE_FORM_COMBINED_FIELD, buildCombinedMessage(payload)));
    hiddenForm.appendChild(createHiddenInput("fvv", "1"));
    hiddenForm.appendChild(createHiddenInput("pageHistory", "0"));
    hiddenForm.appendChild(createHiddenInput("submissionTimestamp", String(Date.now())));

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
    window.setTimeout(() => hiddenForm.remove(), 3000);
  };

  const setFormDisabled = (form, disabled) => {
    form.querySelectorAll("input, select, textarea, button").forEach((field) => {
      if (field.name !== "website") {
        field.disabled = disabled;
      }
    });
  };

  const validateForm = (form) => {
    const formData = new FormData(form);
    const errors = {};

    Object.entries(requiredMessages).forEach(([name, message]) => {
      const value = String(formData.get(name) || "").trim();
      if (!value) errors[name] = message;
    });

    const email = String(formData.get("email") || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Informe um e-mail válido.";
    }

    const phoneDigits = String(formData.get("whatsapp") || "").replace(/\D/g, "");
    if (phoneDigits && phoneDigits.length < 10) {
      errors.whatsapp = "Informe um WhatsApp com DDD.";
    }

    clearErrors(form);
    Object.entries(errors).forEach(([name, message]) => setFieldError(form, name, message));
    return errors;
  };

  if (diagnosticForm) {
    diagnosticForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const errors = validateForm(diagnosticForm);
      const formError = diagnosticForm.parentElement.querySelector("[data-form-error]");
      const success = diagnosticForm.parentElement.querySelector("[data-form-success]");
      const submit = diagnosticForm.querySelector("[data-submit-diagnostic]");
      const originalSubmitText = submit ? submit.textContent : "";

      if (success) success.hidden = true;

      if (Object.keys(errors).length) {
        if (formError) {
          formError.textContent = "Revise os campos destacados antes de enviar.";
          formError.hidden = false;
        }
        return;
      }

      const payload = Object.fromEntries(new FormData(diagnosticForm).entries());

      if (String(payload.website || "").trim() !== "") {
        diagnosticForm.reset();
        if (success) success.hidden = false;
        return;
      }

      if (submit) {
        submit.classList.add("is-loading");
        submit.disabled = true;
        submit.textContent = "Enviando...";
      }
      setFormDisabled(diagnosticForm, true);

      try {
        submitToGoogleForms(payload);
        await new Promise((resolve) => window.setTimeout(resolve, 900));

        diagnosticForm.reset();
        clearErrors(diagnosticForm);
        if (success) success.hidden = false;
      } catch (error) {
        if (formError) {
          formError.innerHTML = `Não foi possível enviar agora. Tente novamente ou <a class="fallback-link" href="${GOOGLE_FORM_PUBLIC_URL}" target="_blank" rel="noopener noreferrer">abra o formulário oficial em uma nova aba</a>.`;
          formError.hidden = false;
        }
      } finally {
        setFormDisabled(diagnosticForm, false);
        if (submit) {
          submit.classList.remove("is-loading");
          submit.disabled = false;
          submit.textContent = originalSubmitText || "Enviar diagnóstico";
        }
      }
    });
  }
})();
