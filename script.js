// helpers
  function scrollToId(id){
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function copyText(t){
    if(navigator.clipboard){
      navigator.clipboard.writeText(t).then(()=>alert('Tersalin: '+t)).catch(()=>alert('Gagal menyalin'));
    } else {
      // fallback
      const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta);
      ta.select(); try{document.execCommand('copy'); alert('Tersalin: '+t);}catch(e){alert('Gagal menyalin')}
      ta.remove();
    }
  }

  // Accordion behavior
  function toggleAccItem(el){
    const body = el.nextElementSibling;
    const open = body.style.display === 'block';
    document.querySelectorAll('.acc-body').forEach(b=>b.style.display='none');
    if(!open) body.style.display='block';
  }

  // MODAL: open / close logic with accessibility basics
  const backdrop = document.getElementById('modal-backdrop');
  let activeModal = null;
  function openModal(id){
    const modal = document.getElementById(id);
    if(!modal) return;
    activeModal = modal;
    // show backdrop and modal
    backdrop.style.display = 'flex';
    backdrop.setAttribute('aria-hidden','false');
    // hide other modals content
    document.querySelectorAll('.modal').forEach(m=>m.classList.remove('show'));
    modal.classList.add('show');
    // small delay to make focus work smoother
    setTimeout(()=>{ try{ modal.focus(); }catch(e){} }, 120);
    // trap focus simple
    document.addEventListener('focus', trapFocus, true);
  }

  function closeModal(){
    if(!activeModal) {
      backdrop.style.display = 'none';
      backdrop.setAttribute('aria-hidden','true');
      return;
    }
    activeModal.classList.remove('show');
    // hide backdrop after animation
    setTimeout(()=>{
      backdrop.style.display = 'none';
      backdrop.setAttribute('aria-hidden','true');
    },220);
    document.removeEventListener('focus', trapFocus, true);
    activeModal = null;
  }

  // close on backdrop click
  backdrop.addEventListener('click', (e)=>{
    if(e.target === backdrop) closeModal();
  });

  // open modal from elements with data-modal or from cards
  document.querySelectorAll('[data-modal]').forEach(el=>{
    el.addEventListener('click', ()=> openModal(el.getAttribute('data-modal')));
    el.addEventListener('keydown', (ev)=> {
      if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openModal(el.getAttribute('data-modal')); }
    });
  });

  // attach openers from card small buttons
  document.querySelectorAll('[onclick^="openModal"]').forEach(btn=>{
    // leave as-is
  });

  // ESC to close
  document.addEventListener('keydown', (e)=> {
    if(e.key === 'Escape') closeModal();
  });

  // Simple focus trap (not full-featured but prevents focus loss)
  function trapFocus(e){
    if(!activeModal) return;
    if(!activeModal.contains(e.target)) {
      e.stopPropagation();
      activeModal.focus();
    }
  }

  // Download JSON button
  document.getElementById('downloadJson').addEventListener('click', ()=>{
    const info = {
      title: 'Gebyar Bahasa & Sastra - Lomba 4',
      theme: 'Bahasa Indonesia Berdaulat, Indonesia Maju',
      deadlines: { berita: '2025-10-20', naskah_drama: '2025-10-15' },
      categories: ['Baca Puisi','Baca Berita (Video)','Drama','Story Telling'],
      pj: {puisi:'Najwa Rizky', berita:'Farhan Conan', drama:'Dhiny Alivia', story:'Agha Alvian Hakim'}
    };
    const blob = new Blob([JSON.stringify(info,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download='gebyar_lomba4_info.json'; a.click();
    URL.revokeObjectURL(url);
  });

  // small utility: allow opening modal programmatically
  function openModalById(id){ openModal(id); }

  // expose for onclick attribute calls
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.copyText = copyText;
  window.scrollToId = scrollToId;
  window.toggleAccItem = toggleAccItem;

  // ensure accessible keyboard activation for accordion headers
  document.querySelectorAll('.acc-head').forEach(h=>{
    h.addEventListener('keydown', (ev)=>{
      if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggleAccItem(h); }
    });
  });

  // initial tiny enhancement: open first accordion by default (optional)
  // document.querySelectorAll('.acc-body')[0]?.style.display = 'block';