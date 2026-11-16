// MAK Trades and Fittings - site behaviour (menu, services list, quote form)
document.documentElement.classList.add('js');
const WA='27624176064', MAIL='maktradesandfittings@gmail.com';
const P='fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const SERVICES=[
 ['Kitchens & Cupboards','Kitchen installations, upgrades, repairs, fitted cupboards, cabinets and storage solutions.','<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 11h18M12 4v16M9 7.5h1M14 7.5h1M9 14h1M14 14h1"/>'],
 ['Carpentry & Joinery','Custom cupboards, wardrobes, shelving, timber work, fittings and repairs.','<path d="M3 21l7-7M14 4l6 6-8 8-6-6z"/><path d="M11 7l6 6"/>'],
 ['Doors & Fittings','Door hanging, fitting, repair and replacement, including frames and related fittings.','<path d="M5 21V3h11v18M3 21h16"/><circle cx="13" cy="12" r="1"/><path d="M16 5l3 1v14l-3 1"/>'],
 ['Partitioning','Internal partitions, office divisions and alterations to use space better.','<rect x="3" y="4" width="18" height="16"/><path d="M11 4v16M11 12h10"/>'],
 ['Wooden Flooring','Wooden-floor installation, repairs and finishing for residential and commercial interiors.','<path d="M3 6h18M3 12h18M3 18h18M8 6v6M15 12v6M12 18v3M18 6v6M5 12v6"/>'],
 ['Bathroom Vanities','Bathroom vanity fitting, cupboards and practical storage solutions.','<path d="M4 11h16v9H4zM12 11v9M6 8h12M12 3v5M9 15h1M14 15h1"/>'],
 ['Tiling & Painting','Wall and floor tiling, interior painting, repairs and finishing work.','<rect x="3" y="3" width="13" height="6" rx="1"/><path d="M16 6h3v5h-8v3M11 14h0v7"/>'],
 ['Plumbing Projects','Plumbing installations, fittings, repairs and renovation-related plumbing work.','<path d="M4 8h8a4 4 0 0 1 4 4v1M4 5v6M16 13h4v4h-4zM18 17v4"/>'],
 ['Electrical Repairs','General electrical repair support and renovation-related electrical work.','<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>']
];
const grid=document.getElementById('svc-grid'), sel=document.getElementById('q-service'), ft=document.getElementById('ft-svc');
SERVICES.forEach(([n,d,ic])=>{
  grid.insertAdjacentHTML('beforeend',`<article class="svc rv"><svg viewBox="0 0 24 24" ${P}>${ic}</svg><h3>${n.replace('&','&amp;')}</h3><p>${d}</p><a href="#quote" data-svc="${n}">Request a quote <span class="arrow">→</span></a></article>`);
  sel.insertAdjacentHTML('beforeend',`<option>${n.replace('&','&amp;')}</option>`);
  ft.insertAdjacentHTML('beforeend',`<li><a href="#services">${n.replace('&','&amp;')}</a></li>`);
});
sel.insertAdjacentHTML('beforeend','<option>Multiple services / full refurbishment</option><option>Other</option>');
grid.addEventListener('click',e=>{const a=e.target.closest('[data-svc]');if(a)sel.value=a.dataset.svc;});

// mobile menu
const burger=document.getElementById('burger'), menu=document.getElementById('menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
menu.addEventListener('click',e=>{if(e.target.closest('a')){menu.classList.remove('open');burger.setAttribute('aria-expanded',false);}});

// tape-measure numbers
const tape=document.getElementById('tape');
for(let i=1;i<=30;i++) tape.insertAdjacentHTML('beforeend',`<span style="left:${i*100+4}px">${i*10}</span>`);

// reveal on scroll (content is visible by default; only below-fold items animate)
const els=[...document.querySelectorAll('.rv')];
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.remove('pre');io.unobserve(en.target);}}),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el);}});
}

// copy buttons
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
  const t=b.dataset.copy, ok=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1600);};
  (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(ok).catch(()=>{const r=document.createRange();r.selectNodeContents(b.previousElementSibling);getSelection().removeAllRanges();getSelection().addRange(r);});
}));

// photos preview
const photos=document.getElementById('q-photos'), thumbs=document.getElementById('thumbs');
photos.addEventListener('change',()=>{thumbs.innerHTML='';[...photos.files].slice(0,8).forEach(f=>{const i=new Image();i.alt=f.name;i.src=URL.createObjectURL(f);thumbs.append(i);});});

// quote form -> WhatsApp / email
const form=document.getElementById('qform'), err=document.getElementById('err'), done=document.getElementById('done');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const v=id=>document.getElementById(id).value.trim();
  const name=v('q-name'), phone=v('q-phone'), email=v('q-email');
  if(!name||!phone){err.textContent='Please add your name and phone number so we can reach you.';(name?document.getElementById('q-phone'):document.getElementById('q-name')).focus();return;}
  if(email && !/^\S+@\S+\.\S+$/.test(email)){err.textContent='That email address looks incomplete. Check it or leave it blank.';document.getElementById('q-email').focus();return;}
  err.textContent='';
  const via=form.querySelector('input[name=via]:checked').value;
  const msg=`Quote request – MAK Trades\n\nName: ${name}\nPhone: ${phone}${email?`\nEmail: ${email}`:''}\nProperty: ${v('q-type')}\nService: ${v('q-service')}\nPreferred contact: ${via}\n\nProject:\n${v('q-desc')||'(no description)'}`;
  document.getElementById('send-wa').href=`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  document.getElementById('send-mail').href=`mailto:${MAIL}?subject=${encodeURIComponent('Quote request – '+name)}&body=${encodeURIComponent(msg)}`;
  document.getElementById('photo-note').hidden=!photos.files.length;
  done.hidden=false; done.scrollIntoView({behavior:'smooth',block:'center'});
});
