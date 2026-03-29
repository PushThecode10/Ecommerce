import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sellerAPI } from '../../service/apiAuth.js';
import {
  FiPackage, FiShoppingBag, FiDollarSign,
  FiPlus, FiArrowRight, FiBox, FiBarChart2,
  FiZap, FiStar, FiChevronRight, FiTrendingUp,
  FiAward, FiActivity,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

/* ══════════════════════════════════════════════════════
   COLOR PALETTE
   Primary:   #dc2626  (red-600)
   Light:     #ffedd5  (orange-100 warm amber)
   Accent:    #f97316  (orange-500)
   Deep bg:   #1a0a00  (very dark warm brown)
   Card bg:   rgba(255,237,213,0.06)
══════════════════════════════════════════════════════ */

const Keyframes = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    html, body, #root {
      background: #1a0a00 !important;
      color: #ffedd5 !important;
      font-family: 'DM Sans', sans-serif !important;
    }

    .sd-page {
      background: #1a0a00 !important;
      min-height: 100vh;
      color: #ffedd5;
      font-family: 'DM Sans', sans-serif;
      position: relative;
    }

    /* ── Animations ── */
    @keyframes orb-a  { 0%,100%{transform:translate(0,0)scale(1)}40%{transform:translate(45px,-40px)scale(1.12)}75%{transform:translate(-30px,28px)scale(.92)} }
    @keyframes orb-b  { 0%,100%{transform:translate(0,0)scale(1)}45%{transform:translate(-38px,32px)scale(1.09)} }
    @keyframes orb-c  { 0%,100%{transform:translate(0,0)scale(1)}55%{transform:translate(28px,-20px)scale(1.06)} }
    @keyframes grid-p { 0%,100%{opacity:.04}50%{opacity:.08} }
    @keyframes spin   { to{transform:rotate(360deg)} }
    @keyframes shimmer{ 0%{background-position:-400px 0}100%{background-position:400px 0} }
    @keyframes float-up{ 0%,100%{transform:translateY(0);opacity:.15}50%{transform:translateY(-22px);opacity:.5} }
    @keyframes wave   { 0%,100%{transform:rotate(0deg)}25%{transform:rotate(18deg)}75%{transform:rotate(-10deg)} }
    @keyframes pulse-dot{ 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.5} }
    @keyframes gradient-shift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes border-dance {
      0%,100%{ border-color: rgba(220,38,38,.4); }
      50%    { border-color: rgba(249,115,22,.7); }
    }

    .font-clash { font-family:'Clash Display',sans-serif !important; }
    .font-dm    { font-family:'DM Sans',sans-serif !important; }

    .orb-a-anim  { animation: orb-a  24s ease-in-out infinite; }
    .orb-b-anim  { animation: orb-b  28s ease-in-out infinite 3s; }
    .orb-c-anim  { animation: orb-c  20s ease-in-out infinite 6s; }
    .grid-anim   { animation: grid-p  8s ease-in-out infinite; }
    .float-p     { animation: float-up var(--dur,5s) ease-in-out var(--delay,0s) infinite; }
    .spinner     { animation: spin    1s linear infinite; }
    .wave-hand   { display:inline-block; animation: wave 1.2s ease-in-out 1; }
    .dot-pulse   { animation: pulse-dot 1.8s ease-in-out infinite; }

    /* ── Skeleton ── */
    .skeleton {
      background: rgba(255,237,213,.06);
      border-radius: 16px; position:relative; overflow:hidden;
    }
    .skeleton::after {
      content:''; position:absolute; inset:0;
      background: linear-gradient(90deg,transparent,rgba(255,237,213,.1),transparent);
      background-size:400px 100%;
      animation: shimmer 1.6s ease-in-out infinite;
    }

    /* ── Stat card ── */
    .stat-card {
      display:block; text-decoration:none !important;
      border-radius:24px; padding:28px;
      position:relative; overflow:hidden;
      transition: transform .3s ease, box-shadow .3s ease;
    }
    .stat-card:hover { transform: translateY(-8px); }

    /* ── Quick action card ── */
    .qa-card {
      display:flex; align-items:center; gap:14px;
      border-radius:20px; padding:18px 20px;
      text-decoration:none !important;
      transition: transform .3s ease, box-shadow .3s ease;
      position:relative; overflow:hidden;
    }
    .qa-card:hover { transform: translateY(-5px); }

    /* ── Gradient animated headline ── */
    .animated-grad {
      background: linear-gradient(270deg, #dc2626, #f97316, #ffedd5, #f97316, #dc2626);
      background-size: 400% 400%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradient-shift 5s ease infinite;
    }

    /* ── CTA button ── */
    .cta-red {
      background: linear-gradient(135deg,#dc2626,#b91c1c) !important;
      border: none !important;
      box-shadow: 0 6px 28px rgba(220,38,38,.5), inset 0 1px 0 rgba(255,255,255,.15);
      transition: transform .2s, box-shadow .2s;
    }
    .cta-red:hover {
      transform: scale(1.05) translateY(-1px);
      box-shadow: 0 10px 40px rgba(220,38,38,.65) !important;
    }

    /* ── Secondary button ── */
    .btn-warm {
      background: rgba(255,237,213,.1) !important;
      border: 1px solid rgba(255,237,213,.2) !important;
      color: #ffedd5 !important;
      transition: background .2s, transform .2s;
    }
    .btn-warm:hover {
      background: rgba(255,237,213,.18) !important;
      transform: scale(1.03);
    }

    /* ── Perf bar ── */
    .perf-bar-track {
      height: 6px; border-radius: 6px;
      background: rgba(255,237,213,.1);
      overflow:hidden;
    }

    /* ── Tips banner ── */
    .tips-banner {
      background: linear-gradient(135deg, rgba(220,38,38,.2) 0%, rgba(249,115,22,.15) 50%, rgba(255,237,213,.08) 100%) !important;
      border: 1px solid rgba(220,38,38,.35) !important;
      border-radius: 24px;
      animation: border-dance 4s ease-in-out infinite;
    }

    /* ── Scrollbar ── */
    ::selection { background: rgba(220,38,38,.45); color:#ffedd5; }
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-track { background:#1a0a00; }
    ::-webkit-scrollbar-thumb { background:linear-gradient(#dc2626,#f97316); border-radius:4px; }
  `}</style>
);

/* ─── Animated Counter ───────────────────────────────────────────────────── */
const AnimCount = ({ to, prefix = '', suffix = '' }) => {
  const [n, setN]   = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef(null);
  const raw = parseFloat(String(to).replace(/[^0-9.]/g,'')) || 0;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !go) { setGo(true); obs.disconnect(); }
    }, { threshold: .5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [go]);

  useEffect(() => {
    if (!go || raw === 0) return;
    let cur = 0;
    const step = Math.ceil(raw / 55);
    const t = setInterval(() => {
      cur += step;
      if (cur >= raw) { setN(raw); clearInterval(t); } else setN(cur);
    }, 18);
    return () => clearInterval(t);
  }, [go, raw]);

  return <span ref={ref}>{prefix}{raw >= 1000 ? n.toLocaleString() : n}{suffix}</span>;
};

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
const SkeletonDash = () => (
  <div className="flex flex-col gap-5">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[...Array(3)].map((_,i) => <div key={i} className="skeleton h-[148px]" />)}
    </div>
    <div className="skeleton h-[230px] rounded-2xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_,i) => <div key={i} className="skeleton h-[96px]" />)}
    </div>
  </div>
);

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const { data } = await sellerAPI.getDashboardStats();
      setStats(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const totalProducts  = stats.products?.total      || 0;
  const activeProducts = stats.products?.active     || 0;
  const totalOrders    = stats.orders?.total        || 0;
  const pendingOrders  = stats.orders?.pending      || 0;
  const totalEarnings  = stats.earnings?.total      || 0;
  const totalSales     = stats.earnings?.totalSales || 0;

  /* Stat cards */
  const statCards = [
    {
      title:'Total Products',
      value: totalProducts,
      sub:`${activeProducts} active`,
      icon:<FiPackage size={24}/>,
      mainBg:'linear-gradient(135deg,rgba(220,38,38,.22),rgba(185,28,28,.12))',
      iconBg:'linear-gradient(135deg,#dc2626,#b91c1c)',
      glow:'rgba(220,38,38,.3)',
      border:'rgba(220,38,38,.35)',
      tag:'Products',
      tagColor:'#dc2626',
      link:'/seller/products',
    },
    {
      title:'Total Orders',
      value: totalOrders,
      sub:`${pendingOrders} pending`,
      icon:<FiShoppingBag size={24}/>,
      mainBg:'linear-gradient(135deg,rgba(249,115,22,.2),rgba(234,88,12,.1))',
      iconBg:'linear-gradient(135deg,#f97316,#ea580c)',
      glow:'rgba(249,115,22,.3)',
      border:'rgba(249,115,22,.35)',
      tag:'Orders',
      tagColor:'#f97316',
      link:'/seller/orders',
    },
    {
      title:'Total Earnings',
      value: totalEarnings,
      sub:`${totalSales} sales`,
      icon:<FiDollarSign size={24}/>,
      mainBg:'linear-gradient(135deg,rgba(255,237,213,.12),rgba(253,186,116,.06))',
      iconBg:'linear-gradient(135deg,#fbbf24,#f59e0b)',
      glow:'rgba(251,191,36,.25)',
      border:'rgba(251,191,36,.3)',
      tag:'Revenue',
      tagColor:'#fbbf24',
      link:'/seller/orders',
      prefix:'$',
    },
  ];

  /* Performance bars */
  const perfBars = [
    { label:'Products Active',  pct: Math.min((activeProducts / Math.max(totalProducts,1))*100, 100), color:'#dc2626', track:'rgba(220,38,38,.15)' },
    { label:'Orders Fulfilled', pct: Math.min(((totalOrders-pendingOrders) / Math.max(totalOrders,1))*100, 100), color:'#f97316', track:'rgba(249,115,22,.15)' },
    { label:'Revenue Rate',     pct: Math.min((totalSales / Math.max(totalSales+5,1))*100, 100), color:'#fbbf24', track:'rgba(251,191,36,.15)' },
  ];

  /* Quick actions */
  const quickActions = [
    { label:'Add Product', sub:'List new item',     icon:<FiPlus size={20}/>,       bg:'linear-gradient(135deg,#dc2626,#b91c1c)', glow:'rgba(220,38,38,.3)',  border:'rgba(220,38,38,.35)', link:'/seller/products/add' },
    { label:'My Products', sub:'Manage inventory',  icon:<FiBox size={20}/>,        bg:'linear-gradient(135deg,#f97316,#ea580c)', glow:'rgba(249,115,22,.3)',  border:'rgba(249,115,22,.35)', link:'/seller/products' },
    { label:'Orders',      sub:'Process & ship',    icon:<FiShoppingBag size={20}/>,bg:'linear-gradient(135deg,#fbbf24,#f59e0b)', glow:'rgba(251,191,36,.25)', border:'rgba(251,191,36,.3)',  link:'/seller/orders' },
    { label:'Analytics',   sub:'View reports',      icon:<FiBarChart2 size={20}/>,  bg:'linear-gradient(135deg,#dc2626,#f97316)', glow:'rgba(220,38,38,.3)',  border:'rgba(220,38,38,.3)',   link:'/seller/profile' },
  ];

  /* Mini metric row */
  const miniMetrics = [
    { label:'Active Products', val:activeProducts, color:'#dc2626' },
    { label:'Pending Orders',  val:pendingOrders,  color:'#f97316' },
    { label:'Sales Done',      val:totalSales,     color:'#fbbf24' },
    { label:'Store Rating',    val:'5.0 ★',        color:'#ffedd5' },
  ];

  return (
    <div className="sd-page rounded-2xl relative overflow-hidden">
      <Keyframes />

      {/* ── Background orbs ── */}
      <div className="orb-a-anim fixed pointer-events-none z-0 rounded-full blur-[140px]"
        style={{ top:'-10%', right:'-6%', width:640, height:640, background:'#dc2626', opacity:.18 }} />
      <div className="orb-b-anim fixed pointer-events-none z-0 rounded-full blur-[130px]"
        style={{ bottom:'-8%', left:'-8%', width:560, height:560, background:'#f97316', opacity:.14 }} />
      <div className="orb-c-anim fixed pointer-events-none z-0 rounded-full blur-[110px]"
        style={{ top:'40%', left:'38%', width:380, height:380, background:'#ffedd5', opacity:.06 }} />

      {/* ── Grid ── */}
      <div className="grid-anim fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:'linear-gradient(rgba(255,237,213,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,237,213,.04) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }}
      />

      {/* ── Particles ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden ">
        {Array.from({length:18},(_,i) => (
          <div key={i} className="float-p absolute rounded-full"
            style={{
              left:`${(i*67+13)%100}%`, top:`${(i*43+7)%100}%`,
              width:`${i%3+1}px`, height:`${i%3+1}px`,
              background: i%3===0 ? 'rgba(220,38,38,.6)' : i%3===1 ? 'rgba(249,115,22,.55)' : 'rgba(255,237,213,.45)',
              '--dur':`${5+i%5}s`, '--delay':`${i*.35}s`,
            }}
          />
        ))}
      </div>

      {/* ══ CONTENT ══════════════════════════════════════════ */}
      <div className="relative z-[2] container mx-auto px-4 py-8">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.65, ease:[.22,1,.36,1] }}
          className="flex flex-wrap items-start justify-between gap-5 mb-10"
        >
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:.1 }}
              className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full"
              style={{ background:'rgba(220,38,38,.15)', border:'1px solid rgba(220,38,38,.3)' }}
            >
              <span className="dot-pulse w-2 h-2 rounded-full flex-shrink-0" style={{ background:'#dc2626' }} />
              <span className="font-dm text-[11px] font-bold tracking-[3px] uppercase" style={{ color:'#fca5a5' }}>
                Seller Dashboard
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.15 }}
              className="font-clash font-bold leading-tight"
              style={{ fontSize:'clamp(2rem,4vw,3rem)' }}
            >
              <span style={{ color:'rgba(255,237,213,.7)' }}>{greeting}, </span>
              <span className="animated-grad">{user?.name?.split(' ')[0] || 'Seller'}</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
              className="font-dm text-sm mt-2" style={{ color:'rgba(255,237,213,.4)' }}
            >
              Here's what's happening in your store today.
            </motion.p>
          </div>

          {/* Add product CTA */}
          <motion.div initial={{ opacity:0, scale:.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.3 }}>
            <Link to="/seller/products/add"
              className="cta-red flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-white font-dm text-sm font-bold no-underline cursor-pointer"
            >
              <FiPlus size={17} /> Add Product
            </Link>
          </motion.div>
        </motion.div>

        {loading ? <SkeletonDash /> : (
          <>
            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              {statCards.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, y:44, scale:.95 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ duration:.55, delay:i*.1, ease:[.22,1,.36,1] }}
                >
                  <Link to={s.link} className="stat-card"
                    style={{ background:s.mainBg, border:`1px solid ${s.border}` }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow=`0 24px 60px ${s.glow}`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
                  >
                    {/* Corner glow */}
                    <div className="absolute -top-12 -right-12 w-[150px] h-[150px] rounded-full pointer-events-none"
                      style={{ background:s.glow, filter:'blur(50px)' }} />

                    {/* Top row */}
                    <div className="relative flex items-start justify-between mb-5">
                      <div className="flex flex-col gap-1">
                        {/* Tag pill */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-dm text-[10px] font-bold tracking-[2px] uppercase w-fit"
                          style={{ background:`${s.glow}`, color:s.tagColor, border:`1px solid ${s.border}` }}
                        >
                          <FiActivity size={9} /> {s.tag}
                        </span>
                      </div>
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                        style={{ background:s.iconBg, boxShadow:`0 8px 24px ${s.glow}` }}
                      >
                        {s.icon}
                      </div>
                    </div>

                    {/* Value */}
                    <p className="font-clash text-white leading-none mb-1.5"
                      style={{ fontSize:'clamp(2.2rem,4vw,2.8rem)', fontWeight:700 }}
                    >
                      <AnimCount to={s.value} prefix={s.prefix||''} />
                    </p>
                    <p className="font-dm font-bold mb-1" style={{ fontSize:16, color:'rgba(255,237,213,.8)' }}>{s.title}</p>
                    <p className="font-dm text-xs" style={{ color:'rgba(255,237,213,.4)' }}>{s.sub}</p>

                    {/* Footer */}
                    <div className="flex items-center gap-1.5 mt-4 pt-3.5"
                      style={{ borderTop:`1px solid ${s.border.replace('.35','.2')}` }}
                    >
                      <span className="font-dm text-[11px]" style={{ color:'rgba(255,237,213,.35)' }}>View details</span>
                      <FiArrowRight size={11} style={{ color:'rgba(255,237,213,.35)' }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* ── PERFORMANCE SNAPSHOT ── */}
            <motion.div
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:.6, delay:.38 }}
              className="rounded-2xl p-7 mb-5 relative overflow-hidden"
              style={{
                background:'linear-gradient(135deg,rgba(220,38,38,.1),rgba(249,115,22,.08),rgba(255,237,213,.05))',
                border:'1px solid rgba(220,38,38,.25)',
              }}
            >
              {/* BG blobs */}
              <div className="absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full pointer-events-none blur-[70px]"
                style={{ background:'rgba(220,38,38,.18)' }} />
              <div className="absolute -bottom-12 -left-12 w-[160px] h-[160px] rounded-full pointer-events-none blur-[60px]"
                style={{ background:'rgba(249,115,22,.14)' }} />

              {/* Header */}
              <div className="relative flex flex-wrap items-center justify-between gap-3 mb-7">
                <div>
                  <p className="font-clash text-xl font-bold" style={{ color:'#ffedd5' }}>Performance Snapshot</p>
                  <p className="font-dm text-[12px] mt-1" style={{ color:'rgba(255,237,213,.38)' }}>
                    Real-time store health overview
                  </p>
                </div>
                <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full font-dm text-[12px] font-semibold"
                  style={{ background:'rgba(220,38,38,.18)', border:'1px solid rgba(220,38,38,.35)', color:'#fca5a5' }}
                >
                  <span className="dot-pulse w-2 h-2 rounded-full flex-shrink-0 bg-red-400" />
                  Store Active
                </span>
              </div>

              {/* Progress bars */}
              <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6 mb-7">
                {perfBars.map((b, i) => (
                  <motion.div key={b.label}
                    initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:.45 + i*.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-dm text-[12px] font-medium" style={{ color:'rgba(255,237,213,.55)' }}>{b.label}</span>
                      <span className="font-clash text-[13px] font-bold" style={{ color:b.color }}>{Math.round(b.pct)}%</span>
                    </div>
                    <div className="perf-bar-track" style={{ background:b.track }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background:`linear-gradient(90deg,${b.color},${b.color}aa)` }}
                        initial={{ width:0 }}
                        animate={{ width:`${b.pct}%` }}
                        transition={{ duration:.95, delay:.55+i*.12, ease:'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mini metrics row */}
              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5"
                style={{ borderTop:'1px solid rgba(255,237,213,.08)' }}
              >
                {miniMetrics.map((m, i) => (
                  <motion.div key={m.label}
                    initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:.55 + i*.08 }}
                    className="text-center px-3 py-4 rounded-2xl"
                    style={{ background:'rgba(255,237,213,.05)', border:'1px solid rgba(255,237,213,.07)' }}
                  >
                    <p className="font-clash text-2xl font-bold mb-1.5" style={{ color:m.color }}>
                      {typeof m.val === 'number' ? <AnimCount to={m.val} /> : m.val}
                    </p>
                    <p className="font-dm text-[11px]" style={{ color:'rgba(255,237,213,.35)' }}>{m.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── QUICK ACTIONS ── */}
            <motion.div
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:.6, delay:.5 }}
              className="mb-5"
            >
              <p className="font-dm text-[11px] font-bold tracking-[3.5px] uppercase mb-4"
                style={{ color:'rgba(255,237,213,.28)' }}
              >
                Quick Actions
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((q, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:.55 + i*.08 }}
                    whileHover={{ y:-5 }}
                  >
                    <Link to={q.link} className="qa-card"
                      style={{ background:'rgba(255,237,213,.05)', border:`1px solid ${q.border}` }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 14px 40px ${q.glow}`; e.currentTarget.style.background='rgba(255,237,213,.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.background='rgba(255,237,213,.05)'; }}
                    >
                      {/* Icon */}
                      <div className="w-11 h-11 rounded-[13px] flex items-center justify-center text-white flex-shrink-0"
                        style={{ background:q.bg, boxShadow:`0 4px 16px ${q.glow}` }}
                      >
                        {q.icon}
                      </div>
                      {/* Labels */}
                      <div className="flex-1 min-w-0">
                        <p className="font-clash text-[14px] font-semibold mb-0.5" style={{ color:'#ffedd5' }}>{q.label}</p>
                        <p className="font-dm text-[12px]" style={{ color:'rgba(255,237,213,.38)' }}>{q.sub}</p>
                      </div>
                      <FiChevronRight size={14} className="flex-shrink-0 ml-auto" style={{ color:'rgba(255,237,213,.25)' }} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── TIPS BANNER ── */}
            <motion.div
              initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }}
              transition={{ duration:.7, delay:.65 }}
              className="tips-banner relative overflow-hidden p-7"
            >
              {/* Blobs */}
              <div className="absolute -top-14 -right-14 w-[220px] h-[220px] rounded-full pointer-events-none blur-[70px]"
                style={{ background:'rgba(220,38,38,.25)' }} />
              <div className="absolute -bottom-10 -left-10 w-[160px] h-[160px] rounded-full pointer-events-none blur-[55px]"
                style={{ background:'rgba(249,115,22,.18)' }} />

              <div className="relative flex flex-wrap items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiZap size={15} style={{ color:'#fbbf24' }} />
                    <span className="font-dm text-[10px] font-bold tracking-[3px] uppercase" style={{ color:'#fbbf24' }}>
                      Pro Tip
                    </span>
                  </div>
                  <p className="font-clash text-lg font-bold mb-2" style={{ color:'#ffedd5' }}>
                    High-quality images = 2× more clicks
                  </p>
                  <p className="font-dm text-[13px] leading-relaxed" style={{ color:'rgba(255,237,213,.48)' }}>
                    Products with 3+ photos get dramatically more engagement. Update your listings now.
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0 flex-wrap">
                  <Link to="/seller/products"
                    className="cta-red flex items-center gap-2 px-5 py-3 rounded-xl text-white font-dm text-sm font-bold no-underline cursor-pointer"
                  >
                    <FiStar size={14} /> Manage Products
                  </Link>
                  <Link to="/seller/products/add"
                    className="btn-warm flex items-center gap-2 px-5 py-3 rounded-xl font-dm text-sm font-bold no-underline cursor-pointer"
                  >
                    <FiPlus size={14} /> Add Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;