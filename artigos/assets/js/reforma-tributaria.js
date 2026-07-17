(function () {
  const CONFIG = window.MAESTRO_ARTICLE_CONFIG || {};

  // TODO: inserir aqui o endpoint real do backend do diagnóstico.
  // Enquanto vazio, o formulário funciona em modo demonstração e não envia dados externos.
  const FORM_ENDPOINT = "";

  const ENDPOINT = CONFIG.formEndpoint || FORM_ENDPOINT;
  const pageUrl = () => window.location.href.split("#")[0] || CONFIG.pageUrl || "https://maestrobusiness.com.br/artigos/reforma-tributaria/";
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const progressBar = document.querySelector("[data-reading-progress]");
  const toc = document.querySelector(".toc");
  const tocToggle = document.querySelector("[data-toc-toggle]");
  const tocLinks = Array.from(document.querySelectorAll("[data-toc-list] a"));
  const sections = tocLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const diagnosticForm = document.querySelector("[data-diagnostic-form]");
  const whatsappInput = document.querySelector("[data-whatsapp]");
  const floatingCta = document.querySelector("[data-floating-cta]");
  const closeFloating = document.querySelector("[data-close-floating]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const year = document.querySelector("[data-year]");
  const privacyLink = document.querySelector("[data-privacy-link]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let floatingDismissed = false;
  let ticking = false;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (privacyLink) {
    if (CONFIG.privacyUrl) {
      privacyLink.href = CONFIG.privacyUrl;
    } else {
      privacyLink.setAttribute("aria-disabled", "true");
      privacyLink.title = "URL da política de privacidade a configurar";
      privacyLink.addEventListener("click", (event) => event.preventDefault());
    }
  }

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  const closeMenu = () => {
    if (!header || !menuToggle || !mobileMenu) return;
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  };

  if (menuToggle && header && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      document.body.classList.toggle("menu-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      mobileMenu.hidden = !isOpen;
    });

    mobileMenu.addEventListener("click", (event) => {
      if (event.target.matches("a")) closeMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
      if (toc) toc.classList.remove("is-open");
      if (tocToggle) tocToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      if (toc) toc.classList.remove("is-open");
      if (tocToggle) tocToggle.setAttribute("aria-expanded", "false");
    }
  });

  if (tocToggle && toc) {
    tocToggle.addEventListener("click", () => {
      const isOpen = toc.classList.toggle("is-open");
      tocToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const updateReadingState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(scrollTop / maxScroll, 1);

    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    if (floatingCta && !floatingDismissed) {
      floatingCta.hidden = progress < 0.35;
    }

    if (backToTop) {
      backToTop.hidden = scrollTop < 720;
    }

    setHeaderState();
    ticking = false;
  };

  const requestReadingUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateReadingState);
  };

  window.addEventListener("scroll", requestReadingUpdate, { passive: true });
  window.addEventListener("resize", requestReadingUpdate);
  updateReadingState();

  if (closeFloating && floatingCta) {
    closeFloating.addEventListener("click", () => {
      floatingDismissed = true;
      floatingCta.hidden = true;
    });
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  document.querySelectorAll(".reveal").forEach((element) => {
    if (revealObserver && !reducedMotion) {
      revealObserver.observe(element);
    } else {
      element.classList.add("is-visible");
    }
  });

  const setActiveToc = (id) => {
    tocLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const tocObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) {
        setActiveToc(visible.target.id);
      }
    }, {
      rootMargin: "-24% 0px -56% 0px",
      threshold: [0.1, 0.2, 0.4]
    });

    sections.forEach((section) => tocObserver.observe(section));
  }

  const openShareWindow = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=920,height=720");
  };

  const copyButton = document.querySelector("[data-copy-link]");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const original = copyButton.textContent;
      try {
        await navigator.clipboard.writeText(pageUrl());
        copyButton.textContent = "Link copiado";
      } catch (error) {
        copyButton.textContent = "Copie pela barra";
      }
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1800);
    });
  }

  const linkedInButton = document.querySelector("[data-share-linkedin]");
  if (linkedInButton) {
    linkedInButton.addEventListener("click", () => {
      openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl())}`);
    });
  }

  const whatsAppButton = document.querySelector("[data-share-whatsapp]");
  if (whatsAppButton) {
    whatsAppButton.addEventListener("click", () => {
      const text = "Reforma Tributária: riscos para empresas tradicionais | Maestro Business";
      openShareWindow(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${pageUrl()}`)}`);
    });
  }

  const maskWhatsapp = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  if (whatsappInput) {
    whatsappInput.addEventListener("input", () => {
      whatsappInput.value = maskWhatsapp(whatsappInput.value);
    });
  }

  const requiredMessages = {
    nome: "Informe seu nome.",
    empresa: "Informe a empresa.",
    cargo: "Informe seu cargo.",
    email: "Informe um e-mail válido.",
    whatsapp: "Informe um WhatsApp com DDD.",
    faturamento: "Selecione o faturamento aproximado.",
    regime: "Selecione o regime tributário.",
    segmento: "Informe o segmento.",
    preocupacao: "Descreva a principal preocupação.",
    consentimento: "Confirme o consentimento para contato."
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

  const setFormDisabled = (form, disabled) => {
    form.querySelectorAll("input, select, textarea, button").forEach((field) => {
      if (field.name !== "website") {
        field.disabled = disabled;
      }
    });
  };

  const captureUtms = () => {
    const params = new URLSearchParams(window.location.search);
    document.querySelectorAll("[data-utm]").forEach((field) => {
      field.value = params.get(field.dataset.utm) || "";
    });
  };

  captureUtms();

  const buildPayload = (form) => {
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.pagina = pageUrl();
    payload.userAgent = navigator.userAgent;
    payload.timestamp = new Date().toISOString();
    return payload;
  };

  const submitPayload = async (payload) => {
    if (!ENDPOINT) {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      return { demo: true };
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Falha no envio: ${response.status}`);
    }

    return response;
  };

  if (diagnosticForm) {
    diagnosticForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formError = diagnosticForm.parentElement.querySelector("[data-form-error]");
      const success = diagnosticForm.parentElement.querySelector("[data-form-success]");
      const submit = diagnosticForm.querySelector("[data-submit-diagnostic]");
      const originalSubmitText = submit ? submit.textContent : "Enviar solicitação";

      if (success) success.hidden = true;

      const errors = validateForm(diagnosticForm);
      if (Object.keys(errors).length) {
        if (formError) {
          formError.textContent = "Revise os campos destacados antes de enviar.";
          formError.hidden = false;
        }
        return;
      }

      const payload = buildPayload(diagnosticForm);

      if (String(payload.website || "").trim() !== "") {
        diagnosticForm.reset();
        if (success) success.hidden = false;
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Enviando...";
      }
      setFormDisabled(diagnosticForm, true);

      try {
        const result = await submitPayload(payload);
        diagnosticForm.reset();
        captureUtms();
        clearErrors(diagnosticForm);
        if (success) {
          success.textContent = result.demo
            ? "Solicitação validada em modo demonstração. Configure o endpoint real para ativar o envio."
            : "Solicitação enviada. A equipe Maestro analisará as informações e retornará com os próximos passos.";
          success.hidden = false;
        }
      } catch (error) {
        if (formError) {
          formError.textContent = "Não foi possível enviar agora. Verifique a integração do endpoint e tente novamente.";
          formError.hidden = false;
        }
      } finally {
        setFormDisabled(diagnosticForm, false);
        if (submit) {
          submit.disabled = false;
          submit.textContent = originalSubmitText;
        }
      }
    });
  }
})();
