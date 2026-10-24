(function(){
  document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));
  const header=document.querySelector('.site-header');
  document.querySelector('.menu-toggle')?.addEventListener('click',()=>header.classList.toggle('nav-open'));
  document.querySelectorAll('.menu-tabs a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('nav-open')));

  const root=document.documentElement;
  const slideMode=root.classList.contains('slides-on')&&document.body.classList.contains('home-page')&&window.gsap;
  if(!slideMode){
    root.classList.remove('slides-on');
    // Pagine lunghe (menu) e fallback: comparsa allo scorrimento + parallasse classica
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
      const layers=[...document.querySelectorAll('[data-speed]')], frames=[...document.querySelectorAll('[data-img]')];
      let ticking=false;
      const update=()=>{
        ticking=false;const vh=innerHeight;
        layers.forEach(el=>{
          const r=el.getBoundingClientRect(), shift=parseFloat(el.dataset.shift||0);
          if(r.bottom<-300||r.top>vh+300)return;
          const base=r.top+r.height/2-shift, y=(base-vh/2)*parseFloat(el.dataset.speed);
          el.dataset.shift=y;el.style.translate='0 '+y.toFixed(1)+'px';
        });
        frames.forEach(el=>{
          const r=el.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
          const p=(r.top+r.height/2-vh/2)/(vh/2+r.height/2);
          el.style.setProperty('--py',(-p*r.height*.13).toFixed(1)+'px');
        });
      };
      const req=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
      addEventListener('scroll',req,{passive:true});addEventListener('resize',req);addEventListener('load',req);update();
    }
    return;
  }

  /* ===== Scroll a slide, tradotto da gg.html ===== */
  const slides=[...document.querySelectorAll('.slide')], n=slides.length;
  const pb=document.getElementById('pb'), side=document.querySelector('.side'), ribbon=document.querySelector('.demo-ribbon');
  let cur=0, busy=false, lastInner=0;

  function setRib(){root.style.setProperty('--rib',(ribbon?ribbon.offsetHeight:0)+'px')}
  setRib();addEventListener('resize',setRib);

  const FLY='.reveal,.photo-card,.visit-slide footer';
  const FADE='.hero-stamp,.hero-bottom';
  slides.forEach((s,i)=>{s.style.zIndex=i?1:2;s.querySelectorAll(FADE).forEach(e=>e.classList.add('fade'))});
  const ins=sl=>[...sl.querySelectorAll(FLY+','+FADE)];
  const bgs=sl=>[...sl.querySelectorAll('.hero-photo,.teaser-image')];
  // elementi che seguono il mouse (parallasse), solo se non hanno già un'animazione di transform
  const mx=sl=>[...sl.querySelectorAll('[data-speed]')].filter(e=>!e.matches(FLY+','+FADE+',.hero-photo,.photo-card'));

  function loops(sl){
    sl.querySelectorAll('.hero-photo').forEach(e=>gsap.to(e,{scale:1.14,duration:10,delay:.8,ease:'none'}));
  }
  function theme(i){
    const light=slides[i].dataset.theme==='light';
    header.classList.toggle('on-light',light);side.classList.toggle('on-light',light);
  }
  function enter(sl,first,dir){
    dir=dir||1;
    const tl=gsap.timeline(), H=innerHeight;
    sl.classList.add('active');sl.scrollTop=0;
    if(!first)tl.fromTo(sl,{clipPath:dir>0?'inset(100% 0 0 0)':'inset(0 0 100% 0)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.55,ease:'power3.inOut'},0);
    bgs(sl).forEach(b=>tl.fromTo(b,{scale:1.16},{scale:1.04,duration:.75,ease:'power3.out'},0));
    ins(sl).forEach((e,i)=>{
      if(e.classList.contains('fade'))tl.fromTo(e,{opacity:0},{opacity:1,duration:.3,ease:'power3.inOut'},.5);
      else tl.fromTo(e,{y:H*dir},{y:0,duration:.55,ease:'sine.inOut'},(first?0:.14)+i*.025);
    });
    tl.add(()=>gsap.set(ins(sl),{clearProps:'transform,opacity'}));   // così gli hover CSS tornano a funzionare
    loops(sl);return tl;
  }
  function leave(sl,dir){
    dir=dir||1;
    const tl=gsap.timeline(), H=innerHeight;
    ins(sl).forEach(e=>{
      if(e.classList.contains('fade'))tl.to(e,{opacity:0,duration:.2,ease:'power3.inOut'},0);
      else tl.to(e,{y:-H*dir,duration:.45,ease:'sine.inOut'},0);
    });
    return tl;
  }
  function reset(sl){
    gsap.killTweensOf(sl.querySelectorAll('*'));
    sl.classList.remove('active');sl.style.clipPath='';sl.scrollTop=0;
    gsap.set(sl.querySelectorAll('*'),{clearProps:'transform,opacity'});
  }
  function mark(){gsap.to(pb,{height:((cur+1)/n*100)+'%',duration:.45,ease:'power2.out'})}
  function go(to,dir){
    if(to<0||to>=n||busy||to===cur)return;busy=true;
    dir=dir||(to>cur?1:-1);
    const out=slides[cur], inn=slides[to];
    out.style.zIndex=1;inn.style.zIndex=2;
    leave(out,dir);const t=enter(inn,false,dir);cur=to;mark();theme(cur);
    t.eventCallback('onComplete',()=>{reset(out);setTimeout(()=>{busy=false},150)});
  }
  const step=d=>go(cur+d,d);

  // parallasse col mouse
  addEventListener('mousemove',e=>{
    const nx=e.clientX/innerWidth-.5, ny=e.clientY/innerHeight-.5;
    mx(slides[cur]).forEach(m=>{
      const d=Math.abs(parseFloat(m.dataset.speed))*10||1;
      gsap.to(m,{x:-nx*d*18,y:-ny*d*18,duration:3,ease:'power3.out',overwrite:'auto'});
    });
  });

  // la slide corrente scorre al suo interno finché non arriva al bordo
  function inner(d){
    const s=slides[cur];
    if(!s.classList.contains('slide-scroll'))return false;
    const max=s.scrollHeight-s.clientHeight;
    if(max<4)return false;
    return d>0?s.scrollTop<max-2:s.scrollTop>2;
  }
  addEventListener('wheel',e=>{
    if(Math.abs(e.deltaY)<8)return;
    const d=e.deltaY>0?1:-1;
    if(inner(d)){lastInner=Date.now();return}
    if(busy||Date.now()-lastInner<250)return;
    step(d);
  },{passive:true});
  addEventListener('keydown',e=>{
    if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    const d=/Arrow(Down|Right)|PageDown/.test(e.key)?1:/Arrow(Up|Left)|PageUp/.test(e.key)?-1:0;
    if(d&&!inner(d))step(d);
  });
  let ty=0,ts=0;
  addEventListener('touchstart',e=>{ty=e.touches[0].clientY;ts=slides[cur].scrollTop},{passive:true});
  addEventListener('touchend',e=>{
    const d=ty-e.changedTouches[0].clientY;
    if(Math.abs(d)<50||Math.abs(slides[cur].scrollTop-ts)>2)return;   // se ha scorso dentro la slide non cambiare
    if(!inner(d>0?1:-1))step(d>0?1:-1);
  },{passive:true});
  document.getElementById('next').onclick=()=>step(1);
  document.getElementById('prev').onclick=()=>step(-1);

  // link interni (#experience, #visit, logo) → vanno alla slide corrispondente
  const idx=id=>{const el=document.getElementById(id);const s=el&&el.closest('.slide');return s?slides.indexOf(s):-1};
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a)return;
    const href=a.getAttribute('href');
    const m=href.match(/^(?:index\.html)?#(.+)$/);
    let to=m?idx(m[1]):(a.classList.contains('brand')&&/^index\.html$/.test(href)?0:-1);
    if(to<0)return;
    e.preventDefault();header.classList.remove('nav-open');go(to);
  });

  // avvio (supporta index.html#visit dalla pagina menu)
  const h=location.hash.slice(1), first=h?Math.max(0,idx(h)):0;
  cur=first;theme(cur);enter(slides[cur],true);
  gsap.set(pb,{height:((cur+1)/n*100)+'%'});
  slides.forEach((s,i)=>{s.style.zIndex=i===cur?2:1});
})();
