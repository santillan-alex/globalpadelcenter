(() => {
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-button]');
  const closeMenu = () => {
    menu?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-header]')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) {
      closeMenu();
      toggle?.focus();
    }
    const viewer = document.querySelector('[data-stories-viewer].is-open');
    if (event.key !== 'Tab' || !viewer) return;
    const controls = [...viewer.querySelectorAll('button, a[href]')].filter(el => !el.hidden && el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  const forms = [...document.querySelectorAll('[data-lead-form]')];
  forms.forEach(form => {
    const notice = form.querySelector('[data-form-notice]');
    if (!window.GPC_CONFIG?.formsEnabled && notice) notice.textContent = 'Modo prueba: no se envían ni guardan tus datos.';
    form.addEventListener('invalid', event => { event.target.setAttribute('aria-invalid', 'true'); }, true);
    const syncFields = event => {
      if (event.target.validity?.valid) event.target.removeAttribute('aria-invalid');
      const status = form.querySelector('.form-status');
      if (status && !form.querySelector('[type=submit]')?.disabled) status.textContent = '';
      const field = event.target;
      if (!['name', 'phone', 'service'].includes(field.name)) return;
      forms.filter(other => other !== form).forEach(other => {
        const peer = other.elements.namedItem(field.name);
        if (peer) peer.value = field.value;
      });
    };
    form.addEventListener('input', syncFields);
    form.addEventListener('change', syncFields);
  });
})();