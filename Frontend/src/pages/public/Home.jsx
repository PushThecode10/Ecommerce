import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../service/apiAuth.js';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';

/* ─── Global Styles (injected directly — wins over Tailwind) ─────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    html, body, #root {
      background: #060612 !important;
      color: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .ec-page {
      background: #060612 !important;
      min-height: 100vh;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    /* ── Animations ── */
    @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(40px,-35px) scale(1.1)} 70%{transform:translate(-25px,20px) scale(0.93)} }
    @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-40px,30px) scale(1.08)} 75%{transform:translate(20px,-25px) scale(0.95)} }
    @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,35px) scale(1.12)} }
    @keyframes orb4 { 0%,100%{transform:translate(0,0) scale(1)} 45%{transform:translate(-30px,-20px) scale(1.06)} }
    @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.5} }
    @keyframes scroll-bob { 0%,100%{transform:translateY(0);opacity:.5} 50%{transform:translateY(12px);opacity:1} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes grid-breathe { 0%,100%{opacity:.035} 50%{opacity:.065} }
    @keyframes float-up { 0%,100%{transform:translateY(0);opacity:.2} 50%{transform:translateY(-28px);opacity:.65} }

    .orb-a { animation: orb1 20s ease-in-out infinite; }
    .orb-b { animation: orb2 24s ease-in-out infinite 2s; }
    .orb-c { animation: orb3 16s ease-in-out infinite 1s; }
    .orb-d { animation: orb4 28s ease-in-out infinite 3.5s; }
    .orb-e { animation: orb1 22s ease-in-out infinite 5s reverse; }
    .grid-pulse { animation: grid-breathe 7s ease-in-out infinite; }
    .dot-anim { animation: pulse-dot 1.6s ease-in-out infinite; }
    .scroll-anim { animation: scroll-bob 2.2s ease-in-out infinite; }
    .spinner { animation: spin 1s linear infinite; }

    /* ── Cards ── */
    .ec-product-card {
      display: block;
      background: rgba(255,255,255,0.045) !important;
      border: 1px solid rgba(255,255,255,0.09) !important;
      border-radius: 20px !important;
      overflow: hidden;
      text-decoration: none !important;
      transition: border-color .3s, box-shadow .3s, transform .35s;
    }
    .ec-product-card:hover {
      border-color: rgba(124,58,237,.55) !important;
      box-shadow: 0 24px 64px rgba(124,58,237,.22) !important;
      transform: translateY(-9px);
    }
    .ec-product-card:hover .ec-prod-img { transform: scale(1.09); }
    .ec-prod-img {
      width:100%; height:220px; object-fit:cover; display:block;
      transition: transform .5s ease;
    }

    .ec-cat-card {
      display: block;
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 20px;
      padding: 28px 12px;
      text-align: center;
      text-decoration: none !important;
      transition: all .3s ease;
    }
    .ec-cat-card:hover {
      border-color: rgba(167,139,250,.45) !important;
      box-shadow: 0 12px 40px rgba(124,58,237,.2);
      transform: translateY(-7px) scale(1.04);
    }

    .ec-feat-card {
      background: rgba(255,255,255,0.04) !important;
      border-radius: 24px;
      padding: 36px 28px;
      transition: transform .3s, box-shadow .3s;
    }
    .ec-feat-card:hover { transform: translateY(-7px); }

    /* ── Buttons ── */
    .ec-btn-solid {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 16px 38px; border-radius: 50px; border: none;
      background: linear-gradient(135deg,#7c3aed,#6d28d9) !important;
      color: #fff !important; font-family: 'DM Sans',sans-serif;
      font-size: 16px; font-weight: 700; cursor: pointer;
      text-decoration: none !important;
      box-shadow: 0 6px 32px rgba(124,58,237,.42);
      transition: transform .2s, box-shadow .2s;
    }
    .ec-btn-solid:hover { transform: scale(1.05); box-shadow: 0 8px 52px rgba(124,58,237,.62) !important; }

    .ec-btn-ghost {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 16px 38px; border-radius: 50px;
      background: rgba(255,255,255,.07) !important;
      border: 1px solid rgba(255,255,255,.18) !important;
      color: rgba(255,255,255,.85) !important;
      font-family: 'DM Sans',sans-serif; font-size: 16px;
      font-weight: 600; cursor: pointer; text-decoration: none !important;
      transition: background .25s, transform .2s;
    }
    .ec-btn-ghost:hover { background: rgba(255,255,255,.14) !important; transform: scale(1.04); }

    .ec-view-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px; border-radius: 40px;
      background: rgba(124,58,237,.14) !important;
      border: 1px solid rgba(124,58,237,.3) !important;
      color: #a78bfa !important; font-family: 'DM Sans',sans-serif;
      font-size: 14px; font-weight: 600;
      text-decoration: none !important;
      transition: background .2s;
    }
    .ec-view-btn:hover { background: rgba(124,58,237,.25) !important; }

    /* ── Typography helpers ── */
    .ec-eyebrow {
      display: block;
      font-family: 'DM Sans',sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 4px;
      color: #a78bfa; text-transform: uppercase; margin-bottom: 14px;
    }
    .ec-h2 {
      font-family: 'Clash Display',sans-serif;
      font-size: clamp(1.9rem,3.8vw,3.1rem);
      font-weight: 700; color: #fff; line-height: 1.1; margin-bottom: 14px;
    }
    .ec-sub {
      font-family: 'DM Sans',sans-serif; font-size: 16px;
      color: rgba(255,255,255,.4); line-height: 1.65;
    }
    .ec-stat-num {
      display: block;
      font-family: 'Clash Display',sans-serif;
      font-size: clamp(1.8rem,3.5vw,2.8rem); font-weight: 700;
      background: linear-gradient(135deg,#a78bfa,#ec4899);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .ec-price {
      font-family: 'Clash Display',sans-serif; font-size: 22px; font-weight: 700;
      background: linear-gradient(135deg,#a78bfa,#7c3aed);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    ::selection { background: rgba(124,58,237,.4); color:#fff; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #060612; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#7c3aed,#ec4899); border-radius: 4px; }
  `}</style>
);

/* ─── Animated Background ────────────────────────────────────────────────── */
const BG = () => (
  <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden', background:'#060612' }}>
    <div className="orb-a" style={{ position:'absolute', top:'-14%', left:'-9%', width:720, height:720, borderRadius:'50%', background:'#7c3aed', filter:'blur(135px)', opacity:.17 }} />
    <div className="orb-b" style={{ position:'absolute', top:'52%', right:'-10%', width:600, height:600, borderRadius:'50%', background:'#db2777', filter:'blur(125px)', opacity:.14 }} />
    <div className="orb-c" style={{ position:'absolute', top:'22%', left:'55%', width:440, height:440, borderRadius:'50%', background:'#0ea5e9', filter:'blur(115px)', opacity:.1 }} />
    <div className="orb-d" style={{ position:'absolute', top:'68%', left:'12%', width:380, height:380, borderRadius:'50%', background:'#f59e0b', filter:'blur(105px)', opacity:.09 }} />
    <div className="orb-e" style={{ position:'absolute', top:'8%', right:'22%', width:300, height:300, borderRadius:'50%', background:'#10b981', filter:'blur(90px)', opacity:.08 }} />

    {/* Grid */}
    <div className="grid-pulse" style={{
      position:'absolute', inset:0,
      backgroundImage:`linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)`,
      backgroundSize:'64px 64px',
    }} />

    {/* Diagonal streaks */}
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.025 }} preserveAspectRatio="none">
      {Array.from({length:10},(_,i) => (
        <line key={i} x1={`${i*12}%`} y1="0" x2={`${i*12+18}%`} y2="100%" stroke="white" strokeWidth="1" />
      ))}
    </svg>
  </div>
);

/* ─── Cursor Glow ────────────────────────────────────────────────────────── */
const CursorGlow = () => {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx,{stiffness:70,damping:20});
  const sy = useSpring(my,{stiffness:70,damping:20});
  useEffect(() => {
    const h = e => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove',h);
    return () => window.removeEventListener('mousemove',h);
  },[]);
  return <motion.div style={{ position:'fixed', top:0, left:0, pointerEvents:'none', zIndex:9999, x:sx, y:sy, translateX:'-50%', translateY:'-50%', width:460, height:460, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,.1) 0%, transparent 68%)' }} />;
};

/* ─── Counter ────────────────────────────────────────────────────────────── */
const Counter = ({ to, suffix='' }) => {
  const [n,setN] = useState(0), [go,setGo] = useState(false), ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting && !go){ setGo(true); obs.disconnect(); } },{threshold:.5});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[go]);
  useEffect(() => {
    if(!go) return;
    let cur=0; const step=Math.ceil(to/60);
    const t = setInterval(() => { cur+=step; if(cur>=to){setN(to);clearInterval(t);}else setN(cur); },16);
    return () => clearInterval(t);
  },[go,to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
};

/* ─── Product Card ───────────────────────────────────────────────────────── */
const ProductCard = ({ product, index }) => (
  <motion.div
    initial={{ opacity:0, y:55 }}
    whileInView={{ opacity:1, y:0 }}
    viewport={{ once:true, margin:'-40px' }}
    transition={{ duration:.55, delay:index*.07, ease:[.22,1,.36,1] }}
  >
    <Link to={`/products/${product._id}`} className="ec-product-card">
      <div style={{ position:'relative', overflow:'hidden', height:220 }}>
        <img className="ec-prod-img"
          src={product.images?.[0]?.url?.startsWith('http') ? product.images[0].url : `http://localhost:3000${product.images?.[0]?.url||''}`}
          alt={product.name}
          onError={e=>{ e.target.src='https://placehold.co/400x220/0d0d1f/7c3aed?text=✦'; }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(6,6,18,.7) 0%,transparent 55%)' }} />
        {product.comparePrice && (
          <span style={{ position:'absolute', top:12, right:12, background:'linear-gradient(135deg,#f59e0b,#ef4444)', color:'#fff', padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:800, letterSpacing:1, fontFamily:'DM Sans,sans-serif' }}>SALE</span>
        )}
        <span style={{ position:'absolute', bottom:12, left:12, background:'rgba(6,6,18,.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.1)', padding:'3px 10px', borderRadius:20, fontSize:11, color:'rgba(255,255,255,.7)', fontFamily:'DM Sans,sans-serif', fontWeight:500 }}>
          {product.category}
        </span>
      </div>

      <div style={{ padding:'18px 20px 22px' }}>
        <p style={{ fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:15, color:'rgba(255,255,255,.88)', marginBottom:10, lineHeight:1.4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
          {product.name}
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:3, marginBottom:14 }}>
          {[...Array(5)].map((_,i) => (
            <svg key={i} width="13" height="13" viewBox="0 0 24 24"
              fill={i<Math.round(product.rating||5)?'#f59e0b':'none'}
              stroke={i<Math.round(product.rating||5)?'#f59e0b':'rgba(255,255,255,.2)'}
              strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span style={{ fontSize:12, color:'rgba(255,255,255,.3)', marginLeft:4, fontFamily:'DM Sans,sans-serif' }}>({product.reviewCount||0})</span>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <div>
            <p className="ec-price">${product.price}</p>
            {product.comparePrice && <p style={{ fontSize:12, color:'rgba(255,255,255,.27)', textDecoration:'line-through', fontFamily:'DM Sans,sans-serif' }}>${product.comparePrice}</p>}
          </div>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(124,58,237,.18)', border:'1px solid rgba(124,58,237,.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a78bfa', fontSize:16 }}>→</div>
        </div>
      </div>
    </Link>
  </motion.div>
);

/* ─── Home ───────────────────────────────────────────────────────────────── */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target:heroRef, offset:['start start','end start'] });
  const heroY = useTransform(scrollYProgress,[0,1],[0,150]);
  const heroOp = useTransform(scrollYProgress,[0,.75],[1,0]);

  useEffect(() => {
    (async () => {
      try { const {data} = await publicAPI.getProducts({limit:8}); setProducts(data.data.products||[]); }
      catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
  },[]);

  const categories = [
    {name:'Electronics',icon:'💻',grad:'linear-gradient(135deg,#6366f1,#4338ca)'},
    {name:'Fashion',icon:'👗',grad:'linear-gradient(135deg,#ec4899,#be185d)'},
    {name:'Books',icon:'📚',grad:'linear-gradient(135deg,#f59e0b,#d97706)'},
    {name:'Home & Garden',icon:'🏡',grad:'linear-gradient(135deg,#10b981,#047857)'},
    {name:'Sports',icon:'⚽',grad:'linear-gradient(135deg,#ef4444,#b91c1c)'},
    {name:'Toys',icon:'🧸',grad:'linear-gradient(135deg,#a855f7,#7e22ce)'},
    {name:'Beauty',icon:'💄',grad:'linear-gradient(135deg,#f472b6,#db2777)'},
    {name:'Automotive',icon:'🚗',grad:'linear-gradient(135deg,#64748b,#334155)'},
  ];

  const features = [
    {icon:'🛍️',label:'Curated Selection',desc:'50,000+ products hand-picked from the world\'s best sellers',color:'#7c3aed',border:'rgba(124,58,237,.22)',bg:'rgba(124,58,237,.1)'},
    {icon:'⚡',label:'Flash Deals Daily',desc:'Lightning offers updated every 24 hrs — never miss a deal',color:'#f59e0b',border:'rgba(245,158,11,.22)',bg:'rgba(245,158,11,.1)'},
    {icon:'🛡️',label:'Buyer Protection',desc:'100% secure checkout with full money-back guarantee',color:'#10b981',border:'rgba(16,185,129,.22)',bg:'rgba(16,185,129,.1)'},
    {icon:'⭐',label:'Verified Sellers',desc:'Every seller is rigorously vetted, rated, and reviewed',color:'#ec4899',border:'rgba(236,72,153,.22)',bg:'rgba(236,72,153,.1)'},
  ];

  const stats = [
    {val:50000,suffix:'+',label:'Products Listed'},
    {val:12000,suffix:'+',label:'Verified Sellers'},
    {val:98,suffix:'%',label:'Satisfaction Rate'},
    {val:500000,suffix:'+',label:'Happy Buyers'},
  ];

  return (
    <div className="ec-page">
      <GlobalStyles />
      <BG />
      <CursorGlow />

      {/* Floating particles */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:1 }}>
        {Array.from({length:22},(_,i) => (
          <div key={i} className="float-particle" style={{
            position:'absolute',
            left:`${(i*47)%100}%`, top:`${(i*63)%100}%`,
            width:Math.random()*2.5+1, height:Math.random()*2.5+1,
            borderRadius:'50%', background:'rgba(255,255,255,.5)',
            animation:`float-up ${5+i%6}s ease-in-out ${i*.4}s infinite`,
          }} />
        ))}
        <style>{`@keyframes float-up{0%,100%{transform:translateY(0);opacity:.2}50%{transform:translateY(-28px);opacity:.65}}`}</style>
      </div>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{
        minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative', zIndex:2, padding:'110px 24px 70px', textAlign:'center',
      }}>
        {/* Radial spotlight */}
        <div style={{
          position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width:'min(150vw,1700px)', height:'min(150vw,1700px)',
          background:'radial-gradient(ellipse at center, rgba(124,58,237,.14) 0%, transparent 58%)',
          pointerEvents:'none',
        }} />

        <motion.div style={{ y:heroY, opacity:heroOp, position:'relative', zIndex:1, maxWidth:880, width:'100%' }}>

          {/* Live badge */}
          <motion.div
            initial={{ opacity:0, scale:.7 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:.65, ease:'backOut' }}
            style={{
              display:'inline-flex', alignItems:'center', gap:9,
              background:'rgba(124,58,237,.14)', border:'1px solid rgba(124,58,237,.38)',
              borderRadius:40, padding:'9px 22px', marginBottom:42,
              boxShadow:'0 0 0 0 rgba(124,58,237,.5)',
              animation:'badge-glow 2.5s ease-in-out infinite',
            }}
          >
            <style>{`@keyframes badge-glow{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.5)}50%{box-shadow:0 0 0 8px rgba(124,58,237,0)}}`}</style>
            <span className="dot-anim" style={{ width:8, height:8, borderRadius:'50%', background:'#a78bfa', display:'block', flexShrink:0 }} />
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'#c4b5fd', letterSpacing:2.5 }}>
              NEW ARRIVALS EVERY DAY
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ overflow:'hidden' }}>
            <motion.h1
              initial={{ y:110, opacity:0 }}
              animate={{ y:0, opacity:1 }}
              transition={{ duration:.9, ease:[.22,1,.36,1], delay:.1 }}
              style={{ fontFamily:'Clash Display,sans-serif', fontSize:'clamp(3.4rem,9vw,7.8rem)', fontWeight:700, lineHeight:1.0, color:'#fff', letterSpacing:'-3px', margin:0 }}
            >Shop the</motion.h1>
          </div>
          <div style={{ overflow:'hidden', marginBottom:38 }}>
            <motion.h1
              initial={{ y:110, opacity:0 }}
              animate={{ y:0, opacity:1 }}
              transition={{ duration:.9, ease:[.22,1,.36,1], delay:.22 }}
              style={{
                fontFamily:'Clash Display,sans-serif', fontSize:'clamp(3.4rem,9vw,7.8rem)',
                fontWeight:700, lineHeight:1.0, letterSpacing:'-3px', margin:0,
                background:'linear-gradient(135deg,#c4b5fd 0%,#7c3aed 45%,#f472b6 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}
            >Future.</motion.h1>
          </div>

          <motion.p
            initial={{ opacity:0, y:22 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.8, delay:.46 }}
            style={{ fontFamily:'DM Sans,sans-serif', fontSize:'clamp(1rem,1.8vw,1.2rem)', color:'rgba(255,255,255,.47)', maxWidth:510, margin:'0 auto 54px', lineHeight:1.78 }}
          >
            Discover curated products from verified sellers — electronics, fashion, beauty &amp; more.
            Your next obsession is one click away.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.7, delay:.62 }}
            style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}
          >
            <Link to="/products" className="ec-btn-solid">
              <FiShoppingBag size={18} /> Explore Now <FiArrowRight size={16} />
            </Link>
            <Link to="/register" className="ec-btn-ghost">Become a Seller ✦</Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.9 }}
            style={{ marginTop:76, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}
          >
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:10, color:'rgba(255,255,255,.2)', letterSpacing:3.5, textTransform:'uppercase' }}>scroll</span>
            <div className="scroll-anim" style={{ width:1, height:46, background:'linear-gradient(to bottom,rgba(124,58,237,.9),transparent)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ STATS ══════════════════════════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:2, padding:'0 24px 92px' }}>
        <motion.div
          initial={{ opacity:0, y:42 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:.8 }}
          style={{
            maxWidth:880, margin:'0 auto',
            background:'rgba(255,255,255,.038)',
            border:'1px solid rgba(255,255,255,.08)',
            borderRadius:24, padding:'46px 20px',
            backdropFilter:'blur(20px)',
            display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
            gap:20, textAlign:'center',
          }}
        >
          {stats.map((s,i) => (
            <div key={i}>
              <span className="ec-stat-num"><Counter to={s.val} suffix={s.suffix} /></span>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.36)', marginTop:6 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══ CATEGORIES ════════════════════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:2, padding:'0 24px 102px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.7 }} style={{ textAlign:'center', marginBottom:56 }}>
            <span className="ec-eyebrow">Shop by interest</span>
            <h2 className="ec-h2">Browse Categories</h2>
            <p className="ec-sub" style={{ maxWidth:410, margin:'0 auto' }}>Find exactly what you're looking for, curated for every taste</p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(128px,1fr))', gap:16 }}>
            {categories.map((c,i) => (
              <motion.div key={i}
                initial={{ opacity:0, scale:.78 }}
                whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true, margin:'-20px' }}
                transition={{ duration:.45, delay:i*.055, ease:'backOut' }}
              >
                <Link to={`/products?category=${c.name}`} className="ec-cat-card">
                  <div style={{ width:56, height:56, borderRadius:16, background:c.grad, margin:'0 auto 14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 8px 24px rgba(0,0,0,.4)' }}>{c.icon}</div>
                  <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, color:'rgba(255,255,255,.72)' }}>{c.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══════════════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:2, padding:'0 24px 102px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.7 }}
            style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:52, flexWrap:'wrap', gap:20 }}
          >
            <div>
              <span className="ec-eyebrow">Hot picks</span>
              <h2 className="ec-h2" style={{ marginBottom:0 }}>Featured Products</h2>
            </div>
            <Link to="/products" className="ec-view-btn">View All <FiArrowRight size={15} /></Link>
          </motion.div>

          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}>
              <div className="spinner" style={{ width:48, height:48, borderRadius:'50%', border:'3px solid rgba(124,58,237,.15)', borderTop:'3px solid #7c3aed' }} />
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:24 }}>
              {products.slice(0,8).map((p,i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:2, padding:'0 24px 102px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.7 }} style={{ textAlign:'center', marginBottom:56 }}>
            <span className="ec-eyebrow">Why choose us</span>
            <h2 className="ec-h2">Built for Buyers</h2>
            <p className="ec-sub" style={{ maxWidth:400, margin:'0 auto' }}>Everything you need for a flawless shopping experience</p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:24 }}>
            {features.map((f,i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:40 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ duration:.6, delay:i*.1 }}
                className="ec-feat-card"
                style={{ border:`1px solid ${f.border}` }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 20px 50px ${f.color}25`}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
              >
                <div style={{ width:54, height:54, borderRadius:16, background:f.bg, border:`1px solid ${f.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, fontSize:24 }}>{f.icon}</div>
                <h3 style={{ fontFamily:'Clash Display,sans-serif', fontWeight:600, fontSize:19, color:'#fff', marginBottom:10 }}>{f.label}</h3>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.42)', lineHeight:1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════════════ */}
      <section style={{ position:'relative', zIndex:2, padding:'0 24px 128px' }}>
        <motion.div
          initial={{ opacity:0, scale:.94 }}
          whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true }}
          transition={{ duration:.8, ease:[.22,1,.36,1] }}
          style={{
            maxWidth:1000, margin:'0 auto',
            background:'linear-gradient(135deg,rgba(124,58,237,.22) 0%,rgba(236,72,153,.15) 100%)',
            border:'1px solid rgba(124,58,237,.28)', borderRadius:32,
            padding:'clamp(50px,8vw,92px) clamp(30px,6vw,84px)',
            textAlign:'center', position:'relative', overflow:'hidden',
          }}
        >
          <div style={{ position:'absolute', top:-80, right:-80, width:330, height:330, background:'rgba(124,58,237,.22)', borderRadius:'50%', filter:'blur(90px)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-80, left:-80, width:270, height:270, background:'rgba(236,72,153,.16)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <motion.span initial={{ opacity:0,y:18 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="ec-eyebrow">Ready to earn?</motion.span>
            <motion.h2 initial={{ opacity:0,y:18 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
              style={{ fontFamily:'Clash Display,sans-serif', fontSize:'clamp(2rem,5vw,4.2rem)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:20 }}
            >Start Selling Today</motion.h2>
            <motion.p initial={{ opacity:0,y:18 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}
              style={{ fontFamily:'DM Sans,sans-serif', fontSize:17, color:'rgba(255,255,255,.44)', maxWidth:450, margin:'0 auto 46px', lineHeight:1.65 }}
            >Join thousands of sellers already growing their business on our platform.</motion.p>
            <Link to="/register" className="ec-btn-solid" style={{ fontSize:17, padding:'18px 54px' }}>Register as Seller ✦</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;