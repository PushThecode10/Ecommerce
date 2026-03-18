import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { publicAPI } from "../../service/apiAuth.js";
import {
  FiSearch, FiStar, FiGrid, FiList,
  FiChevronDown, FiX, FiPackage, FiSliders,
} from "react-icons/fi";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

/* ─── Global Styles ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    html, body, #root {
      background: #060612 !important;
      color: #fff !important;
      font-family: 'DM Sans', sans-serif !important;
    }

    .prd-page {
      background: #060612 !important;
      min-height: 100vh;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      position: relative;
    }

    /* ── Keyframes ── */
    @keyframes orb-a { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-40px) scale(1.1)} 75%{transform:translate(-30px,25px) scale(.93)} }
    @keyframes orb-b { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-40px,35px) scale(1.08)} 70%{transform:translate(20px,-25px) scale(.95)} }
    @keyframes orb-c { 0%,100%{transform:translate(0,0) scale(1)} 55%{transform:translate(30px,40px) scale(1.12)} }
    @keyframes grid-pulse { 0%,100%{opacity:.03} 50%{opacity:.055} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes shimmer-move {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes tag-pop { 0%{transform:scale(.7);opacity:0} 100%{transform:scale(1);opacity:1} }

    .orb-a { animation: orb-a 22s ease-in-out infinite; }
    .orb-b { animation: orb-b 26s ease-in-out infinite 3s; }
    .orb-c { animation: orb-c 18s ease-in-out infinite 1.5s; }
    .grid-pulse { animation: grid-pulse 7s ease-in-out infinite; }
    .prd-spinner { animation: spin 1s linear infinite; }

    /* ── Skeleton shimmer ── */
    .skeleton {
      background: rgba(255,255,255,.06);
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }
    .skeleton::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.07) 50%, transparent 100%);
      background-size: 400px 100%;
      animation: shimmer-move 1.6s ease-in-out infinite;
    }

    /* ── Product Card ── */
    .prd-card {
      display: block;
      background: rgba(255,255,255,.042) !important;
      border: 1px solid rgba(255,255,255,.08) !important;
      border-radius: 20px !important;
      overflow: hidden;
      text-decoration: none !important;
      transition: border-color .3s, box-shadow .3s;
      position: relative;
    }
    .prd-card:hover {
      border-color: rgba(124,58,237,.5) !important;
      box-shadow: 0 20px 56px rgba(124,58,237,.2) !important;
    }
    .prd-card:hover .prd-card-img { transform: scale(1.08); }
    .prd-card-img {
      width:100%; height:200px; object-fit:cover; display:block;
      transition: transform .5s ease;
    }

    /* List card */
    .prd-list-card {
      display: flex; gap: 0;
      background: rgba(255,255,255,.042) !important;
      border: 1px solid rgba(255,255,255,.08) !important;
      border-radius: 20px !important;
      overflow: hidden;
      text-decoration: none !important;
      transition: border-color .3s, box-shadow .3s;
    }
    .prd-list-card:hover {
      border-color: rgba(124,58,237,.5) !important;
      box-shadow: 0 20px 56px rgba(124,58,237,.2) !important;
    }
    .prd-list-card:hover .prd-list-img { transform: scale(1.05); }
    .prd-list-img {
      width:200px; height:180px; object-fit:cover; display:block;
      flex-shrink:0;
      transition: transform .5s ease;
    }

    /* ── Filter / Search UI ── */
    .prd-search-wrap {
      background: rgba(255,255,255,.05) !important;
      border: 1px solid rgba(255,255,255,.1) !important;
      border-radius: 16px;
      padding: 22px 24px;
      backdrop-filter: blur(16px);
    }
    .prd-input {
      background: rgba(255,255,255,.07) !important;
      border: 1px solid rgba(255,255,255,.1) !important;
      border-radius: 12px;
      padding: 12px 16px 12px 44px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: #fff !important;
      outline: none;
      width: 100%;
      transition: border-color .2s, box-shadow .2s;
    }
    .prd-input::placeholder { color: rgba(255,255,255,.3); }
    .prd-input:focus {
      border-color: rgba(124,58,237,.55) !important;
      box-shadow: 0 0 0 3px rgba(124,58,237,.14);
    }

    .prd-select {
      background: rgba(255,255,255,.07) !important;
      border: 1px solid rgba(255,255,255,.1) !important;
      border-radius: 12px;
      padding: 11px 36px 11px 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: rgba(255,255,255,.82) !important;
      outline: none;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
      transition: border-color .2s;
    }
    .prd-select:focus { border-color: rgba(124,58,237,.5) !important; }
    .prd-select option { background: #0f0f1f; color: #fff; }

    /* Category pills */
    .prd-cat-pill {
      padding: 7px 16px; border-radius: 40px; border: none;
      font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
      cursor: pointer;
      transition: all .22s ease;
      white-space: nowrap;
    }
    .prd-cat-pill.inactive {
      background: rgba(255,255,255,.07) !important;
      color: rgba(255,255,255,.6) !important;
      border: 1px solid rgba(255,255,255,.1);
    }
    .prd-cat-pill.inactive:hover {
      background: rgba(255,255,255,.12) !important;
      color: #fff !important;
    }
    .prd-cat-pill.active {
      background: linear-gradient(135deg,#7c3aed,#6d28d9) !important;
      color: #fff !important;
      border: 1px solid transparent;
      box-shadow: 0 4px 18px rgba(124,58,237,.38);
    }

    /* View toggle */
    .prd-view-btn {
      width:38px; height:38px; border-radius:10px; border:none;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition: all .2s;
      font-size: 16px;
    }
    .prd-view-btn.active {
      background: linear-gradient(135deg,#7c3aed,#6d28d9) !important;
      color: #fff !important;
      box-shadow: 0 4px 14px rgba(124,58,237,.35);
    }
    .prd-view-btn.inactive {
      background: rgba(255,255,255,.07) !important;
      color: rgba(255,255,255,.55) !important;
    }
    .prd-view-btn.inactive:hover {
      background: rgba(255,255,255,.12) !important;
      color: #fff !important;
    }

    /* Search btn */
    .prd-search-btn {
      padding: 12px 28px; border-radius: 12px; border: none;
      background: linear-gradient(135deg,#7c3aed,#6d28d9) !important;
      color: #fff !important; font-family: 'DM Sans', sans-serif;
      font-size: 14px; font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 20px rgba(124,58,237,.35);
      transition: transform .2s, box-shadow .2s;
      white-space: nowrap;
      display: flex; align-items: center; gap: 8px;
    }
    .prd-search-btn:hover { transform:scale(1.04); box-shadow: 0 6px 28px rgba(124,58,237,.55) !important; }

    .prd-clear-btn {
      padding: 10px 18px; border-radius: 12px; border: none;
      background: rgba(255,255,255,.07) !important;
      color: rgba(255,255,255,.7) !important;
      font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
      cursor: pointer; display:flex; align-items:center; gap:6px;
      transition: all .2s;
    }
    .prd-clear-btn:hover { background: rgba(255,255,255,.13) !important; color:#fff !important; }

    /* Empty state */
    .prd-empty {
      background: rgba(255,255,255,.04) !important;
      border: 1px solid rgba(255,255,255,.08) !important;
      border-radius: 24px;
      padding: 80px 40px;
      text-align: center;
    }

    /* Stock badges */
    .badge-in { background: rgba(16,185,129,.15); color:#34d399; border:1px solid rgba(16,185,129,.25); padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; font-family:'DM Sans',sans-serif; }
    .badge-out { background: rgba(239,68,68,.12); color:#f87171; border:1px solid rgba(239,68,68,.22); padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; font-family:'DM Sans',sans-serif; }

    /* Typography */
    .ec-eyebrow { display:block; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; letter-spacing:4px; color:#a78bfa; text-transform:uppercase; margin-bottom:10px; }
    .ec-h1 { font-family:'Clash Display',sans-serif; font-size:clamp(2rem,4vw,3rem); font-weight:700; color:#fff; line-height:1.1; }
    .ec-price { font-family:'Clash Display',sans-serif; font-size:20px; font-weight:700; background:linear-gradient(135deg,#a78bfa,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .ec-price-lg { font-family:'Clash Display',sans-serif; font-size:26px; font-weight:700; background:linear-gradient(135deg,#a78bfa,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

    /* Discount badge */
    .disc-badge { position:absolute; top:12px; right:12px; background:linear-gradient(135deg,#f59e0b,#ef4444); color:#fff; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:800; letter-spacing:.5px; font-family:'DM Sans',sans-serif; }

    /* Cat badge on card */
    .cat-chip { background:rgba(124,58,237,.18); border:1px solid rgba(124,58,237,.3); color:#c4b5fd; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; font-family:'DM Sans',sans-serif; }

    ::selection { background:rgba(124,58,237,.4); color:#fff; }
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-track { background:#060612; }
    ::-webkit-scrollbar-thumb { background:linear-gradient(#7c3aed,#ec4899); border-radius:4px; }
  `}</style>
);

/* ─── Background ─────────────────────────────────────────────────────────── */
const BG = () => (
  <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden', background:'#060612' }}>
    <div className="orb-a" style={{ position:'absolute', top:'-10%', right:'-8%', width:600, height:600, borderRadius:'50%', background:'#7c3aed', filter:'blur(130px)', opacity:.14 }} />
    <div className="orb-b" style={{ position:'absolute', bottom:'5%', left:'-8%', width:520, height:520, borderRadius:'50%', background:'#db2777', filter:'blur(120px)', opacity:.12 }} />
    <div className="orb-c" style={{ position:'absolute', top:'40%', left:'45%', width:380, height:380, borderRadius:'50%', background:'#0ea5e9', filter:'blur(110px)', opacity:.08 }} />
    <div className="grid-pulse" style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)`, backgroundSize:'64px 64px' }} />
  </div>
);

/* ─── Skeleton Card ──────────────────────────────────────────────────────── */
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity:0, y:30 }}
    animate={{ opacity:1, y:0 }}
    transition={{ delay: index * 0.05 }}
    style={{ borderRadius:20, overflow:'hidden', background:'rgba(255,255,255,.042)', border:'1px solid rgba(255,255,255,.08)' }}
  >
    <div className="skeleton" style={{ height:200 }} />
    <div style={{ padding:'16px 18px 20px' }}>
      <div className="skeleton" style={{ height:12, width:'40%', marginBottom:12 }} />
      <div className="skeleton" style={{ height:16, width:'90%', marginBottom:8 }} />
      <div className="skeleton" style={{ height:16, width:'70%', marginBottom:16 }} />
      <div className="skeleton" style={{ height:24, width:'35%' }} />
    </div>
  </motion.div>
);

/* ─── Grid Product Card ──────────────────────────────────────────────────── */
const GridCard = ({ product, index }) => {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity:0, y:50, scale:.96 }}
      animate={{ opacity:1, y:0, scale:1 }}
      exit={{ opacity:0, y:-20, scale:.96 }}
      transition={{ duration:.5, delay: index * 0.06, ease:[.22,1,.36,1] }}
      layout
    >
      <Link to={`/products/${product._id}`} className="prd-card">
        {/* Image */}
        <div style={{ position:'relative', overflow:'hidden' }}>
          <img
            className="prd-card-img"
            src={product.images?.[0]?.url?.startsWith('http') ? product.images[0].url : `http://localhost:3000${product.images?.[0]?.url||''}`}
            alt={product.name}
            onError={e=>{ e.target.src='https://placehold.co/400x200/0d0d1f/7c3aed?text=✦'; }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(6,6,18,.7) 0%,transparent 55%)' }} />
          {discount && <span className="disc-badge">{discount}% OFF</span>}
        </div>

        {/* Body */}
        <div style={{ padding:'16px 18px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <span className="cat-chip">{product.category}</span>
            {product.stock > 0
              ? <span className="badge-in">In Stock</span>
              : <span className="badge-out">Out of Stock</span>}
          </div>

          <p style={{ fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:15, color:'rgba(255,255,255,.88)', lineHeight:1.4, marginBottom:10, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
            {product.name}
          </p>

          {/* Stars */}
          <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:14 }}>
            {[...Array(5)].map((_,i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                fill={i<Math.round(product.rating||5)?'#f59e0b':'none'}
                stroke={i<Math.round(product.rating||5)?'#f59e0b':'rgba(255,255,255,.2)'}
                strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginLeft:3 }}>
              {product.rating ? product.rating.toFixed(1) : '5.0'}
            </span>
          </div>

          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
            <div>
              <p className="ec-price">${product.price}</p>
              {product.comparePrice && (
                <p style={{ fontSize:12, color:'rgba(255,255,255,.28)', textDecoration:'line-through', fontFamily:'DM Sans,sans-serif' }}>${product.comparePrice}</p>
              )}
            </div>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(124,58,237,.18)', border:'1px solid rgba(124,58,237,.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a78bfa', fontSize:16 }}>→</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ─── List Product Card ──────────────────────────────────────────────────── */
const ListCard = ({ product, index }) => {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity:0, x:-40 }}
      animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:40 }}
      transition={{ duration:.45, delay:index * 0.05, ease:[.22,1,.36,1] }}
      layout
    >
      <Link to={`/products/${product._id}`} className="prd-list-card">
        {/* Image */}
        <div style={{ position:'relative', overflow:'hidden', flexShrink:0 }}>
          <img
            className="prd-list-img"
            src={product.images?.[0]?.url?.startsWith('http') ? product.images[0].url : `http://localhost:3000${product.images?.[0]?.url||''}`}
            alt={product.name}
            onError={e=>{ e.target.src='https://placehold.co/200x180/0d0d1f/7c3aed?text=✦'; }}
          />
          {discount && <span className="disc-badge" style={{ fontSize:10 }}>{discount}%</span>}
        </div>

        {/* Body */}
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexWrap:'wrap' }}>
              <span className="cat-chip">{product.category}</span>
              {product.stock > 0
                ? <span className="badge-in">In Stock ({product.stock})</span>
                : <span className="badge-out">Out of Stock</span>}
            </div>

            <p style={{ fontFamily:'Clash Display,sans-serif', fontWeight:600, fontSize:19, color:'rgba(255,255,255,.9)', lineHeight:1.35, marginBottom:10 }}>
              {product.name}
            </p>

            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.4)', lineHeight:1.6, marginBottom:12, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
              {product.description}
            </p>

            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              {[...Array(5)].map((_,i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24"
                  fill={i<Math.round(product.rating||5)?'#f59e0b':'none'}
                  stroke={i<Math.round(product.rating||5)?'#f59e0b':'rgba(255,255,255,.2)'}
                  strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
              <span style={{ fontSize:12, color:'rgba(255,255,255,.35)', marginLeft:4, fontFamily:'DM Sans,sans-serif' }}>
                {product.rating ? product.rating.toFixed(1) : '5.0'} ({product.reviewCount||0} reviews)
              </span>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16, flexWrap:'wrap', gap:12 }}>
            <div>
              <p className="ec-price-lg">${product.price}</p>
              {product.comparePrice && (
                <p style={{ fontSize:13, color:'rgba(255,255,255,.3)', textDecoration:'line-through', fontFamily:'DM Sans,sans-serif' }}>${product.comparePrice}</p>
              )}
            </div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'10px 22px', borderRadius:40,
              background:'linear-gradient(135deg,rgba(124,58,237,.22),rgba(236,72,153,.14))',
              border:'1px solid rgba(124,58,237,.32)',
              color:'#c4b5fd', fontSize:13, fontWeight:600, fontFamily:'DM Sans,sans-serif',
            }}>
              View Details →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ─── Main Products Page ─────────────────────────────────────────────────── */
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState(searchParams.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy]             = useState("newest");
  const [viewMode, setViewMode]         = useState("grid");
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const headerRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: headerRef, offset:['start start','end start'] });
  const headerY   = useTransform(scrollYProgress, [0,1], [0, 60]);
  const headerOp  = useTransform(scrollYProgress, [0,.6],  [1, 0]);

  const categories = ["All","Electronics","Fashion","Books","Home & Garden","Sports","Toys","Beauty","Automotive","Food"];

  const sortProducts = useCallback((arr, type) => {
    const s = [...arr];
    switch(type){
      case 'price-low':  return s.sort((a,b)=>a.price-b.price);
      case 'price-high': return s.sort((a,b)=>b.price-a.price);
      case 'name':       return s.sort((a,b)=>a.name.localeCompare(b.name));
      default:           return s.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    }
  },[]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if(searchParams.get("search")) params.search = searchParams.get("search");
      if(searchParams.get("category") && searchParams.get("category") !== "all")
        params.category = searchParams.get("category");
      const {data} = await publicAPI.getProducts(params);
      setProducts(sortProducts(data.data.products || [], sortBy));
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  },[searchParams, sortBy, sortProducts]);

  useEffect(() => { loadProducts(); },[loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = {};
    if(searchTerm) p.search = searchTerm;
    if(categoryFilter !== "all") p.category = categoryFilter;
    setSearchParams(p);
  };

  const handleCategory = (cat) => {
    const val = cat.toLowerCase() === "all" ? "all" : cat;
    setCategoryFilter(val);
    const p = {};
    if(searchTerm) p.search = searchTerm;
    if(val !== "all") p.category = val;
    setSearchParams(p);
  };

  const handleSort = (val) => {
    setSortBy(val);
    setProducts(sortProducts(products, val));
  };

  const clearAll = () => {
    setSearchTerm(""); setCategoryFilter("all"); setSearchParams({});
  };

  const filtered = products.filter(p =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasActiveFilters = searchTerm || categoryFilter !== "all";

  return (
    <div className="prd-page">
      <GlobalStyles />
      <BG />

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <motion.section
        ref={headerRef}
        style={{ y:headerY, opacity:headerOp }}
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.8, ease:[.22,1,.36,1] }}
        className="prd-page-header"
      >
        <div style={{ maxWidth:1240, margin:'0 auto', padding:'60px 24px 50px', position:'relative', zIndex:2 }}>
          {/* Spotlight */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'min(100vw,900px)', height:400, background:'radial-gradient(ellipse at center,rgba(124,58,237,.12) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div style={{ position:'relative' }}>
            <motion.span
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.1 }} className="ec-eyebrow"
            >Our catalogue</motion.span>

            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
              <motion.h1 className="ec-h1"
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.18 }}
              >
                All Products
                <motion.span
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:.35 }}
                  style={{ fontFamily:'DM Sans,sans-serif', fontSize:'clamp(.9rem,1.5vw,1.1rem)', fontWeight:500, color:'rgba(255,255,255,.38)', marginLeft:18, letterSpacing:0 }}
                >
                  {!loading && `${filtered.length} items`}
                </motion.span>
              </motion.h1>

              {/* View toggle desktop */}
              <motion.div
                initial={{ opacity:0, scale:.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.3 }}
                style={{ display:'flex', gap:6, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.09)', borderRadius:12, padding:4 }}
              >
                {[{mode:'grid',icon:<FiGrid size={16}/>},{mode:'list',icon:<FiList size={16}/>}].map(v=>(
                  <button key={v.mode}
                    className={`prd-view-btn ${viewMode===v.mode?'active':'inactive'}`}
                    onClick={()=>setViewMode(v.mode)}
                  >{v.icon}</button>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── SEARCH & FILTERS ─────────────────────────────────────────── */}
      <div style={{ position:'relative', zIndex:2, maxWidth:1240, margin:'0 auto', padding:'0 24px 28px' }}>
        <motion.div
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.7, delay:.25 }}
          className="prd-search-wrap"
        >
          {/* Search row */}
          <form onSubmit={handleSearch} style={{ display:'flex', gap:12, marginBottom:18, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:220, position:'relative' }}>
              <FiSearch style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,.35)', pointerEvents:'none' }} size={16} />
              <input
                className="prd-input"
                type="text"
                placeholder="Search products…"
                value={searchTerm}
                onChange={e=>setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort select */}
            <div style={{ position:'relative', flexShrink:0 }}>
              <select className="prd-select" value={sortBy} onChange={e=>handleSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name">Name: A → Z</option>
              </select>
              <FiChevronDown style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,.45)', pointerEvents:'none' }} size={14} />
            </div>

            <button type="submit" className="prd-search-btn">
              <FiSearch size={15} /> Search
            </button>

            {hasActiveFilters && (
              <button type="button" className="prd-clear-btn" onClick={clearAll}>
                <FiX size={14} /> Clear
              </button>
            )}
          </form>

          {/* Category pills */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity:0, scale:.8 }}
                animate={{ opacity:1, scale:1 }}
                transition={{ delay: .3 + i * .04, ease:'backOut' }}
                className={`prd-cat-pill ${
                  categoryFilter === cat.toLowerCase() || (categoryFilter === "all" && cat === "All")
                    ? 'active' : 'inactive'
                }`}
                onClick={()=>handleCategory(cat)}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active filter tags */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              transition={{ duration:.3 }}
              style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap', overflow:'hidden' }}
            >
              {searchTerm && (
                <motion.div
                  initial={{ scale:.7, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  exit={{ scale:.7, opacity:0 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(124,58,237,.18)', border:'1px solid rgba(124,58,237,.3)', color:'#c4b5fd', padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600, fontFamily:'DM Sans,sans-serif' }}
                >
                  🔍 "{searchTerm}"
                  <FiX size={12} style={{ cursor:'pointer' }} onClick={()=>{ setSearchTerm(''); setSearchParams(p=>{ const n=new URLSearchParams(p); n.delete('search'); return n; }); }} />
                </motion.div>
              )}
              {categoryFilter !== "all" && (
                <motion.div
                  initial={{ scale:.7, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  exit={{ scale:.7, opacity:0 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(236,72,153,.15)', border:'1px solid rgba(236,72,153,.3)', color:'#f9a8d4', padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600, fontFamily:'DM Sans,sans-serif' }}
                >
                  🏷️ {categoryFilter}
                  <FiX size={12} style={{ cursor:'pointer' }} onClick={()=>handleCategory("All")} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PRODUCTS ─────────────────────────────────────────────────── */}
      <div style={{ position:'relative', zIndex:2, maxWidth:1240, margin:'0 auto', padding:'0 24px 100px' }}>

        {loading ? (
          /* Skeleton grid */
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:24 }}>
            {Array.from({length:8}).map((_,i) => <SkeletonCard key={i} index={i} />)}
          </div>

        ) : filtered.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity:0, scale:.95 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:.6 }}
            className="prd-empty"
          >
            <motion.div
              animate={{ y:[0,-10,0], rotate:[0,5,-5,0] }}
              transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
              style={{ fontSize:64, marginBottom:24 }}
            >📦</motion.div>
            <h3 style={{ fontFamily:'Clash Display,sans-serif', fontSize:26, fontWeight:700, color:'#fff', marginBottom:12 }}>No Products Found</h3>
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(255,255,255,.4)', marginBottom:32, maxWidth:360, margin:'0 auto 32px', lineHeight:1.6 }}>
              We couldn't find anything matching your search. Try different keywords or clear the filters.
            </p>
            <button
              onClick={clearAll}
              style={{ padding:'13px 32px', borderRadius:40, border:'none', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 6px 24px rgba(124,58,237,.4)' }}
            >Clear All Filters</button>
          </motion.div>

        ) : viewMode === "grid" ? (
          /* Grid view */
          <motion.div
            layout
            style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:24 }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p,i) => <GridCard key={p._id} product={p} index={i} />)}
            </AnimatePresence>
          </motion.div>

        ) : (
          /* List view */
          <motion.div layout style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((p,i) => <ListCard key={p._id} product={p} index={i} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;