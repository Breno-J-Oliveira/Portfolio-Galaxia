/* Cards, filtros e modal. Conteúdo: src/app/data/index.js. */
(function () {
  'use strict';

  Utils.initPage();

  /* ── ANIMATED COUNTERS ─────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const statObs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const dur = 2000; const t0 = performance.now();
        const tick = function(now) {
          const elapsed = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (elapsed < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
        statObs.unobserve(el);
      }
    }
  }, { threshold: 0.5 });
  statNums.forEach(el => {
    if (Number(el.dataset.target) > 1000) el.textContent = el.dataset.target;
    else statObs.observe(el);
  });

  /* ── PROJECTS DATA ─────────────────────────────────────── */
  const PROJECTS = window.PORTFOLIO_DATA.projects;

  /* ── RENDER CARDS ──────────────────────────────────────── */
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  function coverHTML(p) {
    const inner = p.cover
      ? `<img src="${p.cover}" alt="${p.title}" width="800" height="450" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false;" /><div class="project-cover-fallback" hidden>${p.title.charAt(0)}</div>`
      : `<div class="project-cover-fallback">${p.title.charAt(0)}</div>`;
    return `<div class="project-cover">${inner}</div>`;
  }

  function cardHTML(p, i) {
    const delay = ['', 'reveal-delay-1', 'reveal-delay-2'][i % 3];
    const badge = p.featured
      ? '<div class="featured-badge">Em destaque</div>'
      : '';
    const tags = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
    return `
      <article class="project-card clickable ${p.color} reveal ${delay}" data-category="${p.category}" data-id="${p.id}" data-tags="${(p.tags || []).join(' ').toLowerCase()}">
        ${badge}
        <button class="project-save" type="button" data-save="${p.id}" aria-label="Salvar ${p.title}" aria-pressed="false">☆ Salvar</button>
        ${coverHTML(p)}
        <div class="project-category">${p.categoryLabel}</div>
        <p class="project-status">${p.status}</p>
        <h2 class="project-name">${p.title}</h2>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tags">${tags}</div>
        <button type="button" class="project-open-hint" aria-haspopup="dialog" aria-label="Ver detalhes de ${p.title}">Ver detalhes <span>→</span></button>
      </article>`;
  }

  function renderCards() {
    grid.innerHTML = PROJECTS.map((p, i) => cardHTML(p, i)).join('');
    if (Utils.revealObserver) {
      grid.querySelectorAll('.reveal').forEach(el => Utils.revealObserver.observe(el));
    }
    grid.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
      card.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
      card.querySelector('.project-open-hint').addEventListener('click', () => openModal(card.dataset.id));
      card.addEventListener('click', event => {
        if (event.target.closest('button, a, input, select') || window.getSelection()?.type === 'Range') return;
        card.querySelector('.project-open-hint').focus({preventScroll:true});
        openModal(card.dataset.id);
      });
    });
  }
  renderCards();

  /* ── MODAL ─────────────────────────────────────────────── */
  let modal, modalBox, modalMedia, modalThumbs, modalCat, modalTitle, modalDesc, modalTags, modalActions;

  function initModal() {
    var existing = document.getElementById('project-modal');
    if (existing) { setupModal(existing); return; }

    var obs = new MutationObserver(function() {
      var modalEl = document.getElementById('project-modal');
      if (modalEl) {
        obs.disconnect();
        setupModal(modalEl);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    setTimeout(function() {
      obs.disconnect();
      if (!document.getElementById('project-modal')) {
        console.error('Modal não foi injetado em 5s — verifique o fetch de modal.html em projects.html');
      }
    }, 5000);
  }

  function setupModal(modalEl) {
    modal       = modalEl;
    modalBox    = document.getElementById('modal-box');
    modalMedia  = document.getElementById('modal-media');
    modalThumbs = document.getElementById('modal-thumbs');
    modalCat    = document.getElementById('modal-cat');
    modalTitle  = document.getElementById('modal-title');
    modalDesc   = document.getElementById('modal-desc');
    modalTags   = document.getElementById('modal-tags');
    modalActions = document.getElementById('modal-actions');

    if (!modal) return;
    queueMicrotask(syncLocation);

    modalMedia.addEventListener('click', e => {
      const img = e.target.closest('img');
      if (img && img.src) openLightbox(img.src, img.alt);
    });

    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }
  initModal();

  function isYouTube(url) { return /youtube\.com|youtu\.be|vimeo\.com/.test(url); }

  function mediaImageHTML(src, alt) {
    return `<img src="${src}" alt="${alt}" onerror="this.style.display='none'; this.parentElement.querySelector('.modal-media-fallback').style.display='flex';" />
            <div class="modal-media-fallback" style="display:none;">✦</div>`;
  }
  function mediaVideoHTML(video) {
    if (isYouTube(video)) {
      return `<iframe src="${video}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <div class="video-badge">▶ Vídeo</div>`;
    }
    return `<video src="${video}" controls></video><div class="video-badge">▶ Vídeo</div>`;
  }

  function setMainMedia(p, type, src, alt) {
    if (type === 'video') {
      modalMedia.innerHTML = mediaVideoHTML(src);
    } else {
      modalMedia.innerHTML = mediaImageHTML(src, alt || p.title);
    }
  }

  function openModal(id, fromURL = false) {
    if (!modal) return;
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;
    currentModalIndex = PROJECTS.findIndex(item => item.id === id);
    if (!fromURL) { const url = new URL(location.href); url.searchParams.set('project', id); history.pushState({projectModal:true}, '', url); }
    document.title = p.title + ' · Projetos · Breno J. Oliveira';

    modalBox.className = 'modal-box ' + p.color;
    modalCat.textContent = p.categoryLabel + " · " + p.status;
    modalTitle.textContent = p.title;
    document.getElementById('modal-toolbar-title').textContent = p.title;
    modalDesc.textContent = p.longDesc || p.desc;
    const note = document.getElementById("modal-media-note");
    if (note) note.textContent = p.mediaNote || "";
    modalTags.innerHTML = p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

    let actions = '';
    if (p.live !== false) {
      const liveUrl = (typeof p.live === 'string' && p.live) ? p.live : `projetos/${p.id}/`;
      actions += `<a class="modal-btn featured" href="${liveUrl}" target="_blank" rel="noopener"><span>Visualizar</span><span>↗</span></a>`;
    }
    if (p.demo)   actions += `<a class="modal-btn" href="${p.demo}" ${p.demo.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}><span>Abrir site</span><span>→</span></a>`;
    if (p.docs) actions += `<a class="modal-btn" href="${p.docs}" target="_blank" rel="noopener noreferrer"><span>Documentação</span><span>↗</span></a>`;
    if (p.github) actions += `<a class="modal-btn" href="${p.github}" target="_blank" rel="noopener"><span>Código no GitHub</span><span>↗</span></a>`;
    actions += `<a class="modal-btn project-contact-link" href="contact.html?intent=other&amp;project=${encodeURIComponent(p.id)}">Conversar sobre este projeto</a>`;
    modalActions.innerHTML = actions || '<span class="modal-tag">Em breve mais detalhes</span>';

    const medias = [];
    galleryItems = medias;
    activeProject = p;
    galleryIndex = 0;
    if (p.video) medias.push({ type: 'video', src: p.video });
    (p.gallery || []).slice(0, 6).forEach((src, i) => medias.push({ type: 'image', src, alt: (p.galleryLabels || [])[i] || p.title }));

    if (medias.length === 0) {
      modalMedia.innerHTML = `<div class="modal-media-fallback">${p.title.charAt(0)}</div>`;
      modalThumbs.hidden = true;
      document.querySelector('.gallery-controls').hidden = true;
    } else {
      modalThumbs.hidden = medias.length < 2;
      document.querySelector('.gallery-controls').hidden = false;
      setMainMedia(p, medias[0].type, medias[0].src, medias[0].alt);
      modalThumbs.innerHTML = medias.map((m, i) => {
        const cls = 'modal-thumb' + (i === 0 ? ' active' : '') + (m.type === 'video' ? ' video-thumb' : '');
        const thumbImg = m.type === 'video'
          ? (isYouTube(m.src) ? '' : `<video src="${m.src}#t=0.5" muted></video>`)
          : `<img src="${m.src}" alt="" onerror="this.style.opacity=0;" />`;
        return `<button type="button" class="${cls}" data-index="${i}" aria-label="Ver imagem ${i + 1} de ${p.title}">${thumbImg}</button>`;
      }).join('');

      modalThumbs.querySelectorAll('.modal-thumb').forEach(th => {
        th.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
        th.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
        th.addEventListener('click', () => {
          const idx = parseInt(th.dataset.index);
          modalThumbs.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
          th.classList.add('active');
          selectGallery(idx);
        });
      });
    }

    modal.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
    });

    if (!modal.classList.contains('open')) { previousFocus = document.activeElement; inertBackground(true); }
    if (medias.length) selectGallery(0);
    document.getElementById('project-share-status').textContent = '';
    const visible = visibleProjects();
    const canNavigate = visible.some(item => item.id === p.id) ? visible.length > 1 : visible.length > 0;
    document.getElementById('project-prev').disabled = !canNavigate;
    document.getElementById('project-next').disabled = !canNavigate;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('modal-close').focus();
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(fromURL = false) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    inertBackground(false);
    if (previousFocus) previousFocus.focus({preventScroll:true});
    document.title = 'Projetos — BRENO J. OLIVEIRA';
    if (!fromURL) {const url=new URL(location.href);url.searchParams.delete('project');history.replaceState({},'',url);}
    document.body.style.overflow = '';
    modalMedia.innerHTML = '';
  }

  /* Ampliação acessível, com Escape e foco de volta à galeria. */
  function openLightbox(imgSrc, imgAlt) {
    const lb = document.createElement('dialog'); lb.id='lightbox'; lb.className='image-lightbox';
    const button=document.createElement('button');button.type='button';button.className='ui-button';button.textContent='Fechar imagem';
    const image=document.createElement('img');image.src=imgSrc;image.alt=imgAlt;
    lb.append(button,image);document.body.appendChild(lb);
    button.addEventListener('click',()=>lb.close());
    lb.addEventListener('close',()=>{lb.remove();document.getElementById('gallery-zoom').focus({preventScroll:true});});
    lb.showModal();
  }

  let galleryItems=[],galleryIndex=0,activeProject=null;
  function selectGallery(index) {
    if (!galleryItems.length) return;
    galleryIndex=(index+galleryItems.length)%galleryItems.length;
    const item=galleryItems[galleryIndex];setMainMedia(activeProject,item.type,item.src,item.alt);
    document.getElementById('gallery-position').textContent=galleryItems.length === 1 ? 'Imagem do projeto' : `${galleryIndex+1} de ${galleryItems.length}`;
    document.getElementById('gallery-prev').disabled=galleryItems.length<2;
    document.getElementById('gallery-next').disabled=galleryItems.length<2;
    document.getElementById('gallery-prev').hidden=galleryItems.length<2;
    document.getElementById('gallery-next').hidden=galleryItems.length<2;
    document.getElementById('gallery-zoom').hidden=item.type!=='image';
    modalThumbs.querySelectorAll('button').forEach((button,i)=>{button.classList.toggle('active',i===galleryIndex);button.setAttribute('aria-pressed',String(i===galleryIndex));});
  }
  let inertNodes=[];
  function inertBackground(on) {
    if(on){inertNodes=[...document.body.children].filter(el=>el!==modal && !el.contains(modal) && !['SCRIPT','STYLE'].includes(el.tagName)).map(el=>[el,el.inert]);inertNodes.forEach(([el])=>{el.inert=true;});}
    else{inertNodes.forEach(([el,value])=>{el.inert=value;});inertNodes=[];}
  }
  function visibleProjects(){return [...grid.querySelectorAll('.project-card:not(.hidden)')].map(card=>PROJECTS.find(p=>p.id===card.dataset.id));}
  function nextProject(direction){
    const list=visibleProjects();if(!list.length)return;
    const index=list.findIndex(p=>p.id===activeProject.id);
    const next=index<0?(direction>0?0:list.length-1):(index+direction+list.length)%list.length;
    openModal(list[next].id);
  }
  // O widget chega por fetch: delegação preserva os controles após a injeção.
  document.addEventListener('click', async event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.id==='gallery-prev')selectGallery(galleryIndex-1);
    if(target.id==='gallery-next')selectGallery(galleryIndex+1);
    if(target.id==='gallery-zoom' && galleryItems[galleryIndex])openLightbox(galleryItems[galleryIndex].src,galleryItems[galleryIndex].alt || activeProject.title);
    if(target.id==='project-prev')nextProject(-1);
    if(target.id==='project-next')nextProject(1);
    if(target.id==='copy-project-link')document.getElementById('project-share-status').textContent=await PortfolioUI.copy(location.href)?'Link do projeto copiado.':'Não foi possível copiar. Use o endereço do navegador.';
  });

  let previousFocus = null;
  let currentModalIndex = -1;
  document.addEventListener('keydown', e => {
    if (!modal || !modal.classList.contains('open')) return;
    if (document.getElementById('lightbox')) return;
    if (e.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('a[href], button')].filter(el => !el.disabled && el.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault();selectGallery(galleryIndex + (e.key === 'ArrowRight' ? 1 : -1));}
  });

  /* Busca, favoritos, ordenação e estado compartilhável na URL. */
  const UI=PortfolioUI;
  const saved=UI.storage.get('saved-projects',[]);
  const favorites=new Set(Array.isArray(saved)?saved.filter(id=>PROJECTS.some(p=>p.id===id)):[]);
  const filterBtns=document.querySelectorAll('.filter-btn');
  const searchInput=document.getElementById('search-projects');
  const sort=document.getElementById('project-sort');
  const featured=document.getElementById('featured-only');
  let activeCategory='all';
  filterBtns.forEach(button=>{
    button.dataset.label=button.textContent;
    button.addEventListener('click',()=>{activeCategory=button.dataset.filter;applyFilters();saveLocation(true);});
  });
  grid.querySelectorAll('[data-save]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.save;if(favorites.has(id))favorites.delete(id);else favorites.add(id);
    const persisted=UI.storage.set('saved-projects',[...favorites]);
    applyFilters();
    if(!persisted)document.getElementById('project-results').textContent+=' Os salvos duram apenas nesta visita porque o armazenamento não está disponível.';
  }));
  searchInput.addEventListener('input',()=>{applyFilters();saveLocation(false);});
  sort.addEventListener('change',()=>{applyFilters();saveLocation(true);});
  featured.addEventListener('change',()=>{applyFilters();saveLocation(true);});
  function resetProjectFilters(){searchInput.value='';sort.value='featured';featured.checked=false;activeCategory='all';applyFilters();saveLocation(true);searchInput.focus();}
  document.getElementById('clear-projects').addEventListener('click',resetProjectFilters);
  document.getElementById('reset-empty-projects').addEventListener('click',resetProjectFilters);
  function saveLocation(push){
    const url=new URL(location.href);
    for(const key of ['q','category','sort','featured'])url.searchParams.delete(key);
    if(searchInput.value)url.searchParams.set('q',searchInput.value);
    if(activeCategory!=='all')url.searchParams.set('category',activeCategory);
    if(sort.value!=='featured')url.searchParams.set('sort',sort.value);
    if(featured.checked)url.searchParams.set('featured','1');
    if(url.href!==location.href)history[push?'pushState':'replaceState']({},'',url);
  }
  function applyFilters(){
    const query=UI.normalize(searchInput.value.trim());
    const sorted=[...PROJECTS].sort((a,b)=>sort.value==='name'?a.title.localeCompare(b.title,'pt-BR'):Number(b.featured)-Number(a.featured));
    let count=0;
    sorted.forEach(project=>{
      const card=grid.querySelector(`[data-id="${project.id}"]`);grid.appendChild(card);
      const category=activeCategory==='all'||(activeCategory==='studies'?!project.featured:activeCategory==='favorites'?favorites.has(project.id):project.category===activeCategory);
      const text=UI.normalize([project.title,project.desc,project.categoryLabel,...project.tags].join(' '));
      const visible=category&&(!featured.checked||project.featured)&&(!query||text.includes(query));
      card.classList.toggle('hidden',!visible);if(visible)count++;
      const button=card.querySelector('[data-save]');const chosen=favorites.has(project.id);
      button.setAttribute('aria-pressed',String(chosen));button.textContent=chosen?'★ Salvo':'☆ Salvar';button.setAttribute('aria-label',(chosen?'Remover dos salvos: ':'Salvar ')+project.title);
    });
    filterBtns.forEach(button=>{
      const key=button.dataset.filter;
      const total=PROJECTS.filter(p=>key==='all'||(key==='studies'?!p.featured:key==='favorites'?favorites.has(p.id):p.category===key)).length;
      button.innerHTML=button.dataset.label+` <span aria-hidden="true">${total}</span>`;
      button.setAttribute('aria-label',button.dataset.label);button.setAttribute('aria-pressed',String(key===activeCategory));button.classList.toggle('active',key===activeCategory);
    });
    const activeLabel=activeCategory==='all'?'':filterBtns.length && [...filterBtns].find(button=>button.dataset.filter===activeCategory)?.dataset.label;
    document.getElementById('project-results').textContent=`${count} de ${PROJECTS.length} projetos encontrados.${activeLabel ? ' Categoria: '+activeLabel+'.' : ''}`;
    document.getElementById('projects-empty').hidden=count>0;
  }
  function syncLocation(){
    const params=new URL(location.href).searchParams;
    searchInput.value=params.get('q')||'';
    activeCategory=[...filterBtns].some(b=>b.dataset.filter===params.get('category'))?params.get('category'):'all';
    sort.value=params.get('sort')==='name'?'name':'featured';featured.checked=params.get('featured')==='1';
    if(activeCategory!=='all'||sort.value!=='featured'||featured.checked)document.querySelector('.project-filters').open=true;
    applyFilters();
    const id=params.get('project');
    if(id && PROJECTS.some(p=>p.id===id)){if(modal)openModal(id,true);}
    else if(modal && modal.classList.contains('open'))closeModal(true);
  }
  window.addEventListener('popstate',syncLocation);
  syncLocation();
})();
