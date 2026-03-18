import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { buyerAPI } from '../../service/apiAuth.js';
import {
  FiShoppingBag, FiPackage, FiTruck, FiCheckCircle,
  FiArrowRight, FiClock, FiXCircle, FiGrid,
  FiShoppingCart, FiStar, FiZap,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Global Styles ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    html,body,#root{background:#060612!important;color:#fff!important;font-family:'DM Sans',sans-serif!important;}
    .db-page{background:#060612!important;min-height:100vh;font-family:'DM Sans',sans-serif;color:#fff;position:relative;}

    @keyframes orb-a{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(50px,-40px) scale(1.1)}75%{transform:translate(-30px,25px) scale(.93)}}
    @keyframes orb-b{0%,100%{transform:translate(0,0) scale(1)}45%{transform:translate(-40px,35px) scale(1.08)}}
    @keyframes grid-pulse{0%,100%{opacity:.03}50%{opacity:.055}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes count-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes wave{0%,100%{transform:rotate(0deg)}25%{transform:rotate(20deg)}75%{transform:rotate(-10deg)}}
    @keyframes dot-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.5}}

    .db-orb1{position:fixed;top:-14%;right:-6%;width:650px;height:650px;border-radius:50%;background:#7c3aed;filter:blur(135px);opacity:.14;pointer-events:none;z-index:0;animation:orb-a 22s ease-in-out infinite;}
    .db-orb2{position:fixed;bottom:5%;left:-8%;width:560px;height:560px;border-radius:50%;background:#db2777;filter:blur(125px);opacity:.11;pointer-events:none;z-index:0;animation:orb-b 26s ease-in-out infinite 3s;}
    .db-orb3{position:fixed;top:45%;left:40%;width:340px;height:340px;border-radius:50%;background:#0ea5e9;filter:blur(110px);opacity:.07;pointer-events:none;z-index:0;}
    .db-grid{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);background-size:64px 64px;animation:grid-pulse 7s ease-in-out infinite;}

    /* skeleton */
    .skeleton{background:rgba(255,255,255,.06);border-radius:12px;position:relative;overflow:hidden;}
    .skeleton::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);background-size:400px 100%;animation:shimmer 1.6s ease-in-out infinite;}

    /* stat card */
    .stat-card{
      display:block;position:relative;overflow:hidden;
      background:rgba(255,255,255,.045)!important;
      border:1px solid rgba(255,255,255,.09)!important;
      border-radius:22px;padding:26px 28px;
      text-decoration:none!important;
      transition:border-color .3s,box-shadow .3s,transform .3s;
    }
    .stat-card:hover{transform:translateY(-6px);}

    /* order row */
    .order-row{
      display:grid;grid-template-columns:1.4fr 1fr .8fr 1fr 1.2fr .6fr;
      align-items:center;gap:12px;
      padding:14px 20px;border-radius:14px;
      transition:background .2s;
      border-bottom:1px solid rgba(255,255,255,.05);
    }
    .order-row:last-child{border-bottom:none;}
    .order-row:hover{background:rgba(255,255,255,.04);}

    /* quick action card */
    .qa-card{
      display:flex;align-items:center;gap:16px;
      background:rgba(255,255,255,.045)!important;
      border:1px solid rgba(255,255,255,.09)!important;
      border-radius:20px;padding:22px 24px;
      text-decoration:none!important;
      transition:border-color .3s,box-shadow .3s,transform .3s;
    }
    .qa-card:hover{transform:translateY(-5px);}

    /* activity timeline */
    .activity-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px;}
    .activity-line{width:1px;background:rgba(255,255,255,.08);flex-grow:1;margin:4px auto;}

    /* section card */
    .section-card{background:rgba(255,255,255,.04)!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:24px;overflow:hidden;}

    .ec-eyebrow{display:block;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:4px;color:#a78bfa;text-transform:uppercase;margin-bottom:10px;}
    .ec-h1{font-family:'Clash Display',sans-serif;font-size:clamp(1.7rem,3.5vw,2.6rem);font-weight:700;color:#fff;line-height:1.1;}
    .ec-h2{font-family:'Clash Display',sans-serif;font-size:1.25rem;font-weight:700;color:#fff;}

    .status-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;font-family:'DM Sans',sans-serif;text-transform:capitalize;letter-spacing:.3px;}

    .wave-hand{display:inline-block;animation:wave 1.2s ease-in-out 1;}
    .dot-pulse-anim{animation:dot-pulse 1.6s ease-in-out infinite;}

    ::selection{background:rgba(124,58,237,.4);color:#fff;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:#060612;}
    ::-webkit-scrollbar-thumb{background:linear-gradient(#7c3aed,#ec4899);border-radius:4px;}
  `}</style>
);

/* ─── Animated Counter ───────────────────────────────────────────────────── */
const AnimCount = ({ to }) => {
  const [n, setN] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !go) { setGo(true); obs.disconnect(); }
    }, { threshold: .5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [go]);
  useEffect(() => {
    if (!go || to === 0) return;
    let cur = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) { setN(to); clearInterval(t); } else setN(cur);
    }, 20);
    return () => clearInterval(t);
  }, [go, to]);
  return <span ref={ref}>{n}</span>;
};

/* ─── Status Config ──────────────────────────────────────────────────────── */
const STATUS = {
  pending:    { color:'#f59e0b', bg:'rgba(245,158,11,.14)', border:'rgba(245,158,11,.3)',  icon:'⏳' },
  confirmed:  { color:'#60a5fa', bg:'rgba(96,165,250,.14)',  border:'rgba(96,165,250,.3)',  icon:'✓'  },
  processing: { color:'#a78bfa', bg:'rgba(167,139,250,.14)', border:'rgba(167,139,250,.3)',icon:'⚙️' },
  shipped:    { color:'#38bdf8', bg:'rgba(56,189,248,.14)',   border:'rgba(56,189,248,.3)', icon:'🚚' },
  delivered:  { color:'#34d399', bg:'rgba(52,211,153,.14)',   border:'rgba(52,211,153,.3)', icon:'✅' },
  cancelled:  { color:'#f87171', bg:'rgba(248,113,113,.14)',  border:'rgba(248,113,113,.3)',icon:'✕'  },
};
const getStatus = s => STATUS[s] || { color:'rgba(255,255,255,.5)', bg:'rgba(255,255,255,.07)', border:'rgba(255,255,255,.15)', icon:'•' };

/* ─── Skeleton Loading ───────────────────────────────────────────────────── */
const SkeletonDash = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:24, position:'relative', zIndex:2 }}>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
      {[...Array(3)].map((_,i)=><div key={i} className="skeleton" style={{ height:120, borderRadius:22 }}/>)}
    </div>
    <div className="skeleton" style={{ height:320, borderRadius:24 }}/>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
      {[...Array(2)].map((_,i)=><div key={i} className="skeleton" style={{ height:90, borderRadius:20 }}/>)}
    </div>
  </div>
);

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState({ totalOrders:0, pendingOrders:0, deliveredOrders:0, processingOrders:0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await buyerAPI.getOrders({ limit:8 });
      const orders = data.data.orders || [];
      setRecentOrders(orders);
      setStats({
        totalOrders:      orders.length,
        pendingOrders:    orders.filter(o => o.status === 'pending').length,
        deliveredOrders:  orders.filter(o => o.status === 'delivered').length,
        processingOrders: orders.filter(o => ['processing','shipped','confirmed'].includes(o.status)).length,
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const statCards = [
    { title:'Total Orders',  value:stats.totalOrders,      icon:<FiShoppingBag size={22}/>, grad:'linear-gradient(135deg,#7c3aed,#6d28d9)', glow:'rgba(124,58,237,.25)', border:'rgba(124,58,237,.25)', link:'/buyer/orders' },
    { title:'In Progress',   value:stats.processingOrders, icon:<FiTruck       size={22}/>, grad:'linear-gradient(135deg,#0ea5e9,#0284c7)', glow:'rgba(14,165,233,.2)',  border:'rgba(14,165,233,.2)', link:'/buyer/orders?status=processing' },
    { title:'Pending',       value:stats.pendingOrders,    icon:<FiClock       size={22}/>, grad:'linear-gradient(135deg,#f59e0b,#d97706)', glow:'rgba(245,158,11,.2)', border:'rgba(245,158,11,.2)', link:'/buyer/orders?status=pending' },
    { title:'Delivered',     value:stats.deliveredOrders,  icon:<FiCheckCircle size={22}/>, grad:'linear-gradient(135deg,#10b981,#059669)', glow:'rgba(16,185,129,.2)', border:'rgba(16,185,129,.2)', link:'/buyer/orders?status=delivered' },
  ];

  const filteredOrders = activeTab === 'all'
    ? recentOrders
    : recentOrders.filter(o => o.status === activeTab);

  const tabs = ['all','pending','processing','shipped','delivered','cancelled'];

  return (
    <div className="db-page">
      <GlobalStyles />
      <div className="db-orb1"/><div className="db-orb2"/><div className="db-orb3"/><div className="db-grid"/>

      <div style={{ position:'relative', zIndex:2, maxWidth:1240, margin:'0 auto', padding:'40px 24px 100px' }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.65, ease:[.22,1,.36,1] }}
          style={{ marginBottom:44 }}
        >
          {/* Top bar */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:0 }}>
            <div>
              <motion.span className="ec-eyebrow" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.1 }}>
                Buyer Dashboard
              </motion.span>
              <motion.h1 className="ec-h1" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}>
                {greeting},{' '}
                <span style={{ background:'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                {' '}<span className="wave-hand">👋</span>
              </motion.h1>
              <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
                style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.38)', marginTop:6 }}
              >
                Here's a snapshot of your orders and activity.
              </motion.p>
            </div>

            <motion.div initial={{ opacity:0, scale:.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.3 }}>
              <Link to="/products" style={{
                display:'inline-flex', alignItems:'center', gap:9,
                padding:'11px 22px', borderRadius:40,
                background:'linear-gradient(135deg,#7c3aed,#6d28d9)',
                color:'#fff', fontFamily:'DM Sans,sans-serif',
                fontSize:14, fontWeight:700, textDecoration:'none',
                boxShadow:'0 4px 20px rgba(124,58,237,.38)',
              }}>
                <FiShoppingBag size={15}/> Shop Now
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {loading ? <SkeletonDash /> : (
          <>
            {/* ── STAT CARDS ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:18, marginBottom:32 }}>
              {statCards.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, y:40, scale:.95 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ duration:.55, delay:i*.08, ease:[.22,1,.36,1] }}
                >
                  <Link to={s.link} className="stat-card"
                    style={{ borderColor: s.border }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=s.border.replace('.25',',.55'); e.currentTarget.style.boxShadow=`0 20px 50px ${s.glow}`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=s.border; e.currentTarget.style.boxShadow='none'; }}
                  >
                    {/* Glow blob */}
                    <div style={{ position:'absolute', top:-40, right:-40, width:130, height:130, borderRadius:'50%', background:s.glow, filter:'blur(40px)', pointerEvents:'none' }}/>

                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', position:'relative' }}>
                      <div>
                        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'rgba(255,255,255,.38)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>{s.title}</p>
                        <p style={{ fontFamily:'Clash Display,sans-serif', fontSize:'clamp(2rem,3vw,2.8rem)', fontWeight:700, color:'#fff', lineHeight:1 }}>
                          <AnimCount to={s.value} />
                        </p>
                      </div>
                      <div style={{ width:50, height:50, borderRadius:14, background:s.grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:`0 6px 20px ${s.glow}`, flexShrink:0 }}>
                        {s.icon}
                      </div>
                    </div>

                    <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(255,255,255,.3)' }}>View orders</span>
                      <FiArrowRight size={12} style={{ color:'rgba(255,255,255,.3)' }}/>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* ── RECENT ORDERS ── */}
            <motion.div className="section-card"
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:.6, delay:.35 }}
              style={{ marginBottom:28 }}
            >
              {/* Header */}
              <div style={{ padding:'24px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
                <h2 className="ec-h2">Recent Orders</h2>
                <Link to="/buyer/orders" style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'8px 18px', borderRadius:30,
                  background:'rgba(124,58,237,.14)', border:'1px solid rgba(124,58,237,.28)',
                  color:'#a78bfa', fontFamily:'DM Sans,sans-serif',
                  fontSize:13, fontWeight:600, textDecoration:'none',
                }}>
                  View All <FiArrowRight size={13}/>
                </Link>
              </div>

              {/* Tab filter */}
              <div style={{ padding:'16px 24px 0', display:'flex', gap:6, overflowX:'auto', flexWrap:'nowrap' }}>
                {tabs.map(t => (
                  <motion.button key={t}
                    onClick={() => setActiveTab(t)}
                    whileTap={{ scale:.95 }}
                    style={{
                      padding:'6px 16px', borderRadius:30, border:'none',
                      fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600,
                      cursor:'pointer', whiteSpace:'nowrap',
                      background: activeTab===t ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'rgba(255,255,255,.07)',
                      color: activeTab===t ? '#fff' : 'rgba(255,255,255,.5)',
                      boxShadow: activeTab===t ? '0 4px 14px rgba(124,58,237,.35)' : 'none',
                      transition:'all .2s',
                      textTransform:'capitalize',
                    }}
                  >{t === 'all' ? 'All Orders' : t}</motion.button>
                ))}
              </div>

              {/* Table */}
              {recentOrders.length === 0 ? (
                <div style={{ padding:'60px 24px', textAlign:'center' }}>
                  <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3, repeat:Infinity }}>
                    <FiShoppingBag size={52} style={{ color:'rgba(255,255,255,.15)', marginBottom:16 }}/>
                  </motion.div>
                  <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(255,255,255,.35)', marginBottom:24 }}>No orders yet</p>
                  <Link to="/products" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:40, background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 20px rgba(124,58,237,.38)' }}>
                    <FiShoppingBag size={15}/> Start Shopping
                  </Link>
                </div>
              ) : (
                <div style={{ padding:'16px 0 8px' }}>
                  {/* Table head */}
                  <div className="order-row" style={{ padding:'8px 20px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
                    {['Order ID','Date','Items','Total','Status','Action'].map(h => (
                      <span key={h} style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:700, color:'rgba(255,255,255,.28)', letterSpacing:2, textTransform:'uppercase' }}>{h}</span>
                    ))}
                  </div>

                  <AnimatePresence mode="popLayout">
                    {(filteredOrders.length ? filteredOrders : recentOrders).map((order, i) => {
                      const st = getStatus(order.status);
                      return (
                        <motion.div key={order._id}
                          layout
                          initial={{ opacity:0, x:-20 }}
                          animate={{ opacity:1, x:0 }}
                          exit={{ opacity:0, x:20 }}
                          transition={{ duration:.35, delay:i*.05 }}
                          className="order-row"
                        >
                          {/* Order ID */}
                          <span style={{ fontFamily:'Clash Display,sans-serif', fontSize:13, fontWeight:600, color:'rgba(255,255,255,.85)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            #{order.orderId?.slice(-8) || order._id?.slice(-8)}
                          </span>
                          {/* Date */}
                          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.38)' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}
                          </span>
                          {/* Items */}
                          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.5)' }}>
                            {order.items?.length || 0} item{(order.items?.length||0)!==1?'s':''}
                          </span>
                          {/* Total */}
                          <span style={{ fontFamily:'Clash Display,sans-serif', fontSize:15, fontWeight:700, background:'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                            ${order.totalAmount}
                          </span>
                          {/* Status */}
                          <span className="status-pill" style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>
                            {st.icon} {order.status}
                          </span>
                          {/* Action */}
                          <Link to="/buyer/orders" style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'#a78bfa', textDecoration:'none', padding:'5px 12px', borderRadius:20, background:'rgba(124,58,237,.12)', border:'1px solid rgba(124,58,237,.25)', transition:'all .2s' }}
                            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(124,58,237,.25)'; }}
                            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(124,58,237,.12)'; }}
                          >
                            View <FiArrowRight size={11}/>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {filteredOrders.length === 0 && activeTab !== 'all' && (
                    <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
                      style={{ textAlign:'center', padding:'32px', fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.3)' }}
                    >
                      No {activeTab} orders found
                    </motion.p>
                  )}
                </div>
              )}
            </motion.div>

            {/* ── QUICK ACTIONS ── */}
            <motion.div
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:.6, delay:.5 }}
            >
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:600, color:'rgba(255,255,255,.28)', letterSpacing:3.5, textTransform:'uppercase', marginBottom:16 }}>Quick Actions</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
                {[
                  { to:'/products', icon:<FiShoppingBag size={22}/>, title:'Browse Products',  sub:'Discover new arrivals', grad:'linear-gradient(135deg,#7c3aed,#6d28d9)', glow:'rgba(124,58,237,.2)', border:'rgba(124,58,237,.22)' },
                  { to:'/cart',     icon:<FiShoppingCart size={22}/>, title:'View Cart',        sub:'Complete your purchase', grad:'linear-gradient(135deg,#10b981,#059669)', glow:'rgba(16,185,129,.2)', border:'rgba(16,185,129,.22)' },
                  { to:'/buyer/orders', icon:<FiPackage size={22}/>,  title:'My Orders',        sub:'Track all your orders',  grad:'linear-gradient(135deg,#0ea5e9,#0284c7)', glow:'rgba(14,165,233,.2)', border:'rgba(14,165,233,.22)' },
                  { to:'/products?sort=rating', icon:<FiStar size={22}/>, title:'Top Rated', sub:'Community favourites', grad:'linear-gradient(135deg,#f59e0b,#d97706)', glow:'rgba(245,158,11,.2)', border:'rgba(245,158,11,.22)' },
                ].map((q, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:.55+i*.07 }}
                    whileHover={{ y:-5 }}
                  >
                    <Link to={q.to} className="qa-card"
                      style={{ borderColor: q.border }}
                      onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 14px 40px ${q.glow}`; e.currentTarget.style.borderColor=q.border.replace('.22','.5'); }}
                      onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=q.border; }}
                    >
                      <div style={{ width:46, height:46, borderRadius:14, background:q.grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:`0 4px 16px ${q.glow}`, flexShrink:0 }}>
                        {q.icon}
                      </div>
                      <div>
                        <p style={{ fontFamily:'Clash Display,sans-serif', fontSize:15, fontWeight:600, color:'#fff', marginBottom:3 }}>{q.title}</p>
                        <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(255,255,255,.38)' }}>{q.sub}</p>
                      </div>
                      <FiArrowRight style={{ marginLeft:'auto', color:'rgba(255,255,255,.25)', flexShrink:0 }} size={16}/>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Responsive */}
      <style>{`
        @media(max-width:760px){
          .order-row{grid-template-columns:1fr 1fr!important;gap:8px!important;}
          .order-row>span:nth-child(3),.order-row>span:nth-child(1){grid-column:span 2;}
        }
        @media(max-width:520px){
          .order-row{display:flex!important;flex-direction:column!important;gap:6px!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:14px!important;margin:6px 12px!important;padding:14px!important;}
          .order-row:hover{background:rgba(255,255,255,.04)!important;}
        }
      `}</style>
    </div>
  );
};

export default Dashboard;