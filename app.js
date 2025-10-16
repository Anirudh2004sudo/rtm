// Minimal JS for interactivity + live stats placeholders
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav
  const toggle = $('.nav__toggle');
  const menu = $('#menu');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Back to top button
  const toTop = $('.to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600){ toTop.hidden = false; } else { toTop.hidden = true; }
  });
  toTop && toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Copy referral link
  $$('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = $(btn.getAttribute('data-copy'));
      input.select();
      document.execCommand('copy');
      btn.textContent = 'Copied!';
      setTimeout(()=>btn.textContent='Copy referral link', 1200);
    });
  });

  // Fake subscriber (demo) — replace with your email tool
  const subBtn = $('#subscribeBtn');
  const subMsg = $('#subMsg');
  const email = $('#email');
  subBtn && subBtn.addEventListener('click', () => {
    const v = (email.value||'').trim();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){ subMsg.textContent = 'Enter a valid email.'; return; }
    subMsg.textContent = 'Thanks! We\'ll keep you posted.';
    email.value='';
  });

  // Live stats (optional): fetch from your published Google Sheet JSON
  const cfg = window.CATALYST_CONFIG || {};
  const target = cfg.targetPoolINR || 500000;
  const membersEl = $('#membersCount');
  const poolEl = $('#poolTotal');
  const bar = $('#poolProgress');

  function formatINR(n){
    return new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(n);
  }

  async function loadStats(){
    try{
      // EXPECTED JSON: { members: 5000, inr_per_member: 100 }
      const res = await fetch(cfg.sheetJSON, {cache:'no-store'});
      const data = await res.json();
      const members = Number(data.members||0);
      const inrPerMember = Number(data.inr_per_member||100);
      const pool = members * inrPerMember;
      membersEl.textContent = members.toLocaleString('en-IN');
      poolEl.textContent = formatINR(pool);
      const pct = Math.max(0, Math.min(100, (pool/target)*100));
      bar.style.width = pct.toFixed(1)+'%';
      bar.setAttribute('aria-valuenow', pct.toFixed(0));
    }catch(e){
      // Fallback demo numbers
      const members = 4980;
      const pool = members * 100;
      membersEl.textContent = members.toLocaleString('en-IN');
      poolEl.textContent = formatINR(pool);
      const pct = Math.max(0, Math.min(100, (pool/target)*100));
      bar.style.width = pct.toFixed(1)+'%';
    }
  }
  loadStats();
})();