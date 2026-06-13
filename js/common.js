(function (window) {
  const FILTER_NONE = '__filter_none__';
  const HEART_PATH = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  function onDomReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function getNameRank(name) {
    const first = String(name).charAt(0);
    if (/[0-9]/.test(first)) return 0;
    if (/[a-zA-Z]/.test(first)) return 1;
    return 2;
  }

  function compareByName(a, b, locale) {
    const nameA = String(a);
    const nameB = String(b);
    const rankDiff = getNameRank(nameA) - getNameRank(nameB);
    if (rankDiff !== 0) return rankDiff;
    return nameA.localeCompare(nameB, locale || 'zh-CN', { numeric: true, sensitivity: 'base' });
  }

  function splitTokens(value) {
    return String(value || '').split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
  }

  function matchesFilterSet(set, values, noneKey) {
    if (!set || !set.size) return true;
    const key = noneKey || FILTER_NONE;
    const wantsEmpty = set.has(key);
    const wantsValues = [...set].filter((item) => item !== key);
    const hasValues = values.length > 0;
    if (wantsEmpty && !hasValues) return true;
    if (!wantsValues.length) return wantsEmpty && !hasValues;
    return hasValues && wantsValues.some((item) => values.includes(item));
  }

  function createHeartsEl(level, max, classPrefix) {
    const prefix = classPrefix || 'filter';
    const wrap = document.createElement('span');
    wrap.className = prefix + '-hearts';
    const count = Math.max(0, Math.min(max, Math.floor(Number(level) || 0)));
    const heartClass = prefix + '-heart';
    const svg = '<svg class="' + heartClass + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + HEART_PATH + '"/></svg>';
    for (let i = 1; i <= max; i++) {
      const slot = document.createElement('span');
      slot.className = prefix + '-heart-slot' + (i <= count ? ' is-on' : '');
      slot.innerHTML = svg;
      wrap.appendChild(slot);
    }
    return wrap;
  }

  function setHeartsLabel(el, level, max, classPrefix, suffix) {
    if (!el) return;
    el.textContent = '';
    el.classList.add(classPrefix + '-label');
    el.appendChild(createHeartsEl(level, max, classPrefix));
    if (suffix) {
      const extra = document.createElement('span');
      extra.textContent = suffix;
      el.appendChild(extra);
    }
  }

  function bindCoverPreview(container, selector, coverSrc) {
    const cover = container.querySelector(selector);
    if (!cover) return;
    function openPreview() {
      if (typeof window.openImagePreview === 'function') window.openImagePreview(coverSrc);
    }
    cover.addEventListener('click', openPreview);
    cover.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPreview();
      }
    });
  }

  function resetPreviewVideo(video) {
    if (!video) return;
    video.hidden = true;
    video.pause();
    video.removeAttribute('src');
    video.load();
  }

  function openImagePreview(src) {
    const preview = document.getElementById('image-preview');
    const img = preview && preview.querySelector('.image-preview-img');
    const video = preview && preview.querySelector('.image-preview-video');
    if (!preview || !img) return;
    resetPreviewVideo(video);
    img.hidden = false;
    img.src = src;
    preview.hidden = false;
  }

  function openMediaPreview(url, isVideo) {
    const preview = document.getElementById('image-preview');
    const img = preview && preview.querySelector('.image-preview-img');
    const video = preview && preview.querySelector('.image-preview-video');
    if (!preview || !img) return;
    if (isVideo) {
      if (!video) return;
      img.hidden = true;
      img.removeAttribute('src');
      video.hidden = false;
      video.src = url;
      video.play().catch(() => {});
    } else {
      openImagePreview(url);
      return;
    }
    preview.hidden = false;
  }

  function closeImagePreview() {
    const preview = document.getElementById('image-preview');
    if (!preview) return;
    preview.hidden = true;
    const img = preview.querySelector('.image-preview-img');
    if (img) {
      img.hidden = false;
      img.src = '';
    }
    resetPreviewVideo(preview.querySelector('.image-preview-video'));
  }

  function initImagePreview() {
    const preview = document.getElementById('image-preview');
    if (!preview || preview.dataset.bound) return;
    preview.dataset.bound = 'true';
    preview.addEventListener('click', (e) => {
      if (e.target === preview || e.target.classList.contains('image-preview-close')) closeImagePreview();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && preview && !preview.hidden) closeImagePreview();
    });
  }

  const filterDropdownControllers = [];
  let filterGlobalEventsBound = false;

  function closeAllFilterPanels() {
    filterDropdownControllers.forEach((controller) => controller.closePanel());
  }

  function bindGlobalFilterEvents() {
    if (filterGlobalEventsBound) return;
    filterGlobalEventsBound = true;
    document.addEventListener('click', closeAllFilterPanels);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllFilterPanels();
    });
    window.addEventListener('resize', () => {
      filterDropdownControllers.forEach((controller) => controller.syncOpenPanel());
    });
  }

  function createMultiSelectFilter(config) {
    const {
      layerId,
      noneKey,
      panels,
      selection,
      ui,
      optionClass,
      labelSelector,
      collectOptions,
      updateButtonLabel,
      renderOptionContent,
      onApply
    } = config;

    function getPanelElements(kind) {
      const def = panels.find((item) => item.kind === kind);
      if (!def) return null;
      const btn = document.getElementById(def.btnId);
      return {
        btn,
        panel: document.getElementById(def.panelId),
        labelEl: btn && btn.querySelector(labelSelector)
      };
    }

    function updateButtonLabels() {
      panels.forEach(({ kind, defaultLabel }) => {
        const { labelEl } = getPanelElements(kind) || {};
        if (labelEl) updateButtonLabel(kind, labelEl, selection[kind], defaultLabel);
      });
    }

    function buildPanel(kind) {
      const { panel } = getPanelElements(kind) || {};
      if (!panel) return;
      const set = selection[kind];
      const options = collectOptions(kind);
      panel.innerHTML = '';
      if (!options.length) {
        const empty = document.createElement('div');
        empty.className = optionClass;
        empty.setAttribute('aria-disabled', 'true');
        empty.textContent = '暂无可选项';
        panel.appendChild(empty);
        return;
      }
      options.forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = optionClass + ' ui-interactive';
        btn.setAttribute('role', 'option');
        btn.dataset.filterValue = item.value;
        btn.setAttribute('aria-selected', set && set.has(item.value) ? 'true' : 'false');
        renderOptionContent(btn, kind, item);
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleValue(kind, item.value);
        });
        panel.appendChild(btn);
      });
    }

    function buildAllPanels() {
      panels.forEach(({ kind }) => buildPanel(kind));
      updateButtonLabels();
    }

    function closePanel() {
      if (!ui.openKind) return;
      const { btn, panel } = getPanelElements(ui.openKind) || {};
      panel && panel.setAttribute('hidden', '');
      btn && btn.setAttribute('aria-expanded', 'false');
      ui.openKind = null;
      const layer = document.getElementById(layerId);
      if (layer) layer.setAttribute('aria-hidden', 'true');
    }

    function syncPanelPosition(panel, btn) {
      if (!panel || !btn) return;
      const rect = btn.getBoundingClientRect();
      panel.style.width = rect.width + 'px';
      panel.style.left = rect.left + 'px';
      panel.style.top = rect.bottom + 4 + 'px';
    }

    function openPanel(kind) {
      if (ui.openKind === kind) {
        closePanel();
        return;
      }
      closeAllFilterPanels();
      buildPanel(kind);
      const { btn, panel } = getPanelElements(kind) || {};
      if (!btn || !panel) return;
      const layer = document.getElementById(layerId);
      if (layer) {
        layer.appendChild(panel);
        layer.setAttribute('aria-hidden', 'false');
      }
      panel.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
      syncPanelPosition(panel, btn);
      ui.openKind = kind;
    }

    function toggleValue(kind, value) {
      const set = selection[kind];
      if (!set) return;
      const key = value === noneKey ? noneKey : String(value).trim();
      if (set.has(key)) set.delete(key);
      else set.add(key);
      applyFilters();
    }

    function applyFilters() {
      const openKind = ui.openKind;
      if (openKind) {
        panels.forEach(({ kind }) => {
          if (kind === openKind) {
            const { panel } = getPanelElements(kind) || {};
            if (!panel) return;
            const set = selection[kind];
            panel.querySelectorAll('.' + optionClass + '[role="option"]').forEach((btn) => {
              const val = btn.dataset.filterValue;
              if (val === undefined) return;
              btn.setAttribute('aria-selected', set && set.has(val) ? 'true' : 'false');
            });
          } else {
            buildPanel(kind);
          }
        });
      } else {
        buildAllPanels();
      }
      updateButtonLabels();
      if (typeof onApply === 'function') onApply();
    }

    function bindEvents() {
      panels.forEach(({ kind, btnId, panelId }) => {
        const btn = document.getElementById(btnId);
        if (btn && !btn.dataset.bound) {
          btn.dataset.bound = 'true';
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openPanel(kind);
          });
        }
        const panel = document.getElementById(panelId);
        if (panel && !panel.dataset.bound) {
          panel.dataset.bound = 'true';
          panel.addEventListener('click', (e) => e.stopPropagation());
        }
      });
      bindGlobalFilterEvents();
    }

    function syncOpenPanel() {
      if (!ui.openKind) return;
      const { btn, panel } = getPanelElements(ui.openKind) || {};
      syncPanelPosition(panel, btn);
    }

    const controller = { bindEvents, buildAllPanels, applyFilters, closePanel, syncOpenPanel };
    filterDropdownControllers.push(controller);
    return controller;
  }

  onDomReady(() => {
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.addEventListener('click', closeAllFilterPanels);
    });
  });

  window.AppCommon = {
    FILTER_NONE,
    onDomReady,
    compareByName,
    splitTokens,
    matchesFilterSet,
    createHeartsEl,
    setHeartsLabel,
    bindCoverPreview,
    openImagePreview,
    openMediaPreview,
    closeImagePreview,
    initImagePreview,
    createMultiSelectFilter,
    closeAllFilterPanels
  };

  window.openImagePreview = openImagePreview;
})(window);
