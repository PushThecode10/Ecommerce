import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice.js';
import {
  FiHome, FiPackage, FiShoppingBag, FiUser,
  FiLogOut, FiMenu, FiX, FiPlus, FiChevronRight,
  FiZap, FiTrendingUp, FiArrowUpRight,
} from 'react-icons/fi';
import { TbBlocks } from "react-icons/tb";
import { useState, useEffect } from 'react';
import { authAPI } from '../service/apiAuth.js';
import { motion, AnimatePresence } from 'motion/react';
//seller layout with sidebar navigation, top navbar, and main content area. Includes animated orbs, grid background, and floating particles for a dynamic visual effect. The sidebar contains navigation links with active state styling and quick links. The top navbar has a logo, user profile chip, and logout button. The main content area uses AnimatePresence for smooth transitions between routes.
/* ─── Non-Tailwind: keyframes + gradient helpers ─────────────────────────── */
const Keyframes = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    html, body, #root {
      background: #1a0a00 !important;
      color: #ffedd5 !important;
      font-family: 'DM Sans', sans-serif !important;
    }

    @keyframes orb-a {
      0%,100%{ transform: translate(0,0) scale(1); }
      40%    { transform: translate(45px,-38px) scale(1.1); }
      75%    { transform: translate(-28px,25px) scale(.93); }
    }
    @keyframes orb-b {
      0%,100%{ transform: translate(0,0) scale(1); }
      45%    { transform: translate(-36px,30px) scale(1.08); }
    }
    @keyframes grid-p  { 0%,100%{opacity:.04} 50%{opacity:.08} }
    @keyframes spin    { to{ transform: rotate(360deg); } }
    @keyframes float-up{ 0%,100%{transform:translateY(0);opacity:.15} 50%{transform:translateY(-20px);opacity:.5} }
    @keyframes dot-blink{ 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.4} }
    @keyframes border-dance{ 0%,100%{border-color:rgba(220,38,38,.25)} 50%{border-color:rgba(249,115,22,.55)} }
    @keyframes scroll-prog{ from{width:0} }
    @keyframes shimmer-x{ 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
    @keyframes gradient-shift{
      0%,100%{ background-position:0% 50%; }
      50%    { background-position:100% 50%; }
    }

    .font-clash { font-family: 'Clash Display', sans-serif !important; }
    .font-dm    { font-family: 'DM Sans', sans-serif !important; }

    /* Orbs */
    .sl-orb-a { animation: orb-a 24s ease-in-out infinite; }
    .sl-orb-b { animation: orb-b 28s ease-in-out infinite 3s; }
    /* Grid */
    .sl-grid   { animation: grid-p 8s ease-in-out infinite; }
    /* Particles */
    .sl-particle { animation: float-up var(--dur,5s) ease-in-out var(--delay,0s) infinite; }
    /* Online dot */
    .dot-blink { animation: dot-blink 2s ease-in-out infinite; }
    /* Spinner */
    .spinner   { animation: spin 1s linear infinite; }

    /* Scroll progress */
    .sl-scroll-prog {
      background: linear-gradient(90deg,#dc2626,#f97316,#fbbf24) !important;
      transition: width .1s linear;
    }

    /* Sidebar nav item active */
    .sl-nav-active {
      background: linear-gradient(135deg,rgba(220,38,38,.2),rgba(249,115,22,.12)) !important;
      border: 1px solid rgba(220,38,38,.35) !important;
      color: #ffedd5 !important;
      animation: border-dance 4s ease-in-out infinite;
    }
    /* Active left bar */
    .sl-active-bar {
      position: absolute; left: 0; top: 20%; height: 60%; width: 3px;
      border-radius: 0 3px 3px 0;
      background: linear-gradient(180deg,#dc2626,#f97316);
    }
    /* Hover shimmer sweep */
    .sl-shimmer {
      position: absolute; inset: 0; border-radius: 14px;
      background: linear-gradient(90deg,transparent,rgba(255,237,213,.05),transparent);
    }

    /* User panel gradient */
    .sl-user-panel {
      background: linear-gradient(135deg,rgba(220,38,38,.18),rgba(249,115,22,.1)) !important;
      border: 1px solid rgba(220,38,38,.3) !important;
      animation: border-dance 5s ease-in-out infinite;
    }

    /* Avatar ring */
    .sl-avatar {
      background: linear-gradient(135deg,#dc2626,#f97316) !important;
    }

    /* CTA button */
    .sl-cta {
      background: linear-gradient(135deg,#dc2626,#b91c1c) !important;
      box-shadow: 0 4px 20px rgba(220,38,38,.45) !important;
      transition: transform .2s, box-shadow .2s;
    }
    .sl-cta:hover {
      transform: scale(1.04);
      box-shadow: 0 6px 28px rgba(220,38,38,.65) !important;
    }

    /* Top navbar */
    .sl-topnav {
      background: rgba(26,10,0,.9) !important;
      border-bottom: 1px solid rgba(220,38,38,.2) !important;
      backdrop-filter: blur(22px);
    }

    /* Sidebar */
    .sl-sidebar {
      background: rgba(26,10,0,.75) !important;
      border-right: 1px solid rgba(220,38,38,.18) !important;
      backdrop-filter: blur(20px);
    }

    /* Promo card */
    .sl-promo {
      background: linear-gradient(135deg,rgba(220,38,38,.18),rgba(249,115,22,.12)) !important;
      border: 1px solid rgba(220,38,38,.28) !important;
      animation: border-dance 5s ease-in-out infinite;
    }

    /* Logout */
    .sl-logout {
      background: rgba(220,38,38,.12) !important;
      color: #fca5a5 !important;
      border: 1px solid rgba(220,38,38,.25) !important;
      transition: background .2s;
    }
    .sl-logout:hover {
      background: rgba(220,38,38,.25) !important;
      color: #fecaca !important;
    }

    /* Icon btn */
    .sl-icon-btn {
      background: rgba(255,237,213,.07) !important;
      color: rgba(255,237,213,.65) !important;
      transition: background .2s, color .2s;
    }
    .sl-icon-btn:hover {
      background: rgba(255,237,213,.14) !important;
      color: #ffedd5 !important;
    }

    /* Logo text grad */
    .sl-logo-grad {
      background: linear-gradient(135deg,#dc2626,#f97316,#ffedd5);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradient-shift 5s ease infinite;
    }

    /* Hamburger */
    .sl-hamburger {
      background: rgba(255,237,213,.07) !important;
      color: rgba(255,237,213,.75) !important;
      transition: background .2s;
    }
    .sl-hamburger:hover { background: rgba(255,237,213,.14) !important; }

    /* Quick link */
    .sl-quick-link {
      color: rgba(255,237,213,.42) !important;
      transition: color .2s, background .2s;
    }
    .sl-quick-link:hover {
      background: rgba(255,237,213,.06) !important;
      color: rgba(255,237,213,.75) !important;
    }

    ::selection { background: rgba(220,38,38,.4); color: #ffedd5; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #1a0a00; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#dc2626,#f97316); border-radius: 4px; }
  `}</style>
);

/* ─── Scroll Progress Bar ────────────────────────────────────────────────── */
const ScrollProgress = ({ offsetLeft }) => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      setW((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 || 0);
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <div className="sl-scroll-prog fixed z-[150] h-0.5 pointer-events-none"
      style={{ top: 68, left: offsetLeft, right: 0, width: `${w}%` }} />
  );
};

/* ─── SellerLayout ───────────────────────────────────────────────────────── */
const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector(s => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => { setSidebarOpen(false); }, [location]);

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/');
  };

  const isActive = path =>
    path === '/seller' ? location.pathname === path : location.pathname.startsWith(path);

  const navigation = [
    { name:'Dashboard',   path:'/seller',              icon:FiHome,        badge:null },
    { name:'My Products', path:'/seller/products',     icon:FiPackage,     badge:null },
    { name:'Add Product', path:'/seller/products/add', icon:FiPlus,        badge:'New' },
    { name:'Orders',      path:'/seller/orders',       icon:FiShoppingBag, badge:null },
    { name:'Profile',     path:'/seller/profile',      icon:FiUser,        badge:null },
    { name:'Categories',  path:'/seller/categories/get',   icon:TbBlocks,        badge:null },
  ];

  const quickLinks = [
    { label:'Store Preview',  path:'/products',             icon:<FiZap size={12}/> },
    { label:'View Analytics', path:'/seller/profile',       icon:<FiTrendingUp size={12}/> },
  ];

  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? '🌅 Morning' : hour < 17 ? '☀️ Afternoon' : '🌙 Evening';

  const sidebarW = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 260 : 0;

  return (
    <>
      <Keyframes />

      {/* ── Fixed BG layers ── */}
      <div className="sl-orb-a fixed pointer-events-none z-0 rounded-full blur-[140px]"
        style={{ top:'-12%', right:'-6%', width:600, height:600, background:'#dc2626', opacity:.17 }} />
      <div className="sl-orb-b fixed pointer-events-none z-0 rounded-full blur-[130px]"
        style={{ bottom:'-8%', left:'-7%', width:540, height:540, background:'#f97316', opacity:.13 }} />
      <div className="sl-grid fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:'linear-gradient(rgba(255,237,213,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,237,213,.035) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
        }}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({length:16},(_,i) => (
          <div key={i} className="sl-particle absolute rounded-full"
            style={{
              left:`${(i*67+11)%100}%`, top:`${(i*43+7)%100}%`,
              width:`${i%3+1}px`, height:`${i%3+1}px`,
              background: i%3===0 ? 'rgba(220,38,38,.55)' : i%3===1 ? 'rgba(249,115,22,.45)' : 'rgba(255,237,213,.35)',
              '--dur':`${5+i%4}s`, '--delay':`${i*.35}s`,
            }}
          />
        ))}
      </div>

      {/* ── Root shell ── */}
      <div className="min-h-screen flex flex-col font-dm" style={{ background:'#1a0a00', color:'#ffedd5' }}>

        {/* ════ TOP NAVBAR ════ */}
        <header className="sl-topnav fixed top-0 left-0 right-0 z-[200] h-[68px] flex items-center gap-3 px-5">

          {/* Hamburger — mobile only */}
          <motion.button
            className="sl-hamburger lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border-none cursor-pointer"
            onClick={() => setSidebarOpen(o => !o)}
            whileTap={{ scale:.9 }}
          >
            <AnimatePresence mode="wait">
              {sidebarOpen
                ? <motion.span key="x" initial={{ rotate:-90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:90,opacity:0 }} transition={{ duration:.18 }}><FiX size={20}/></motion.span>
                : <motion.span key="m" initial={{ rotate:90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:-90,opacity:0 }} transition={{ duration:.18 }}><FiMenu size={20}/></motion.span>
              }
            </AnimatePresence>
          </motion.button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0 group">
            <div className="sl-avatar w-[38px] h-[38px] rounded-[12px] flex items-center justify-center font-clash text-[18px] font-bold text-white flex-shrink-0 group-hover:scale-110 group-hover:-rotate-[4deg] transition-transform duration-200"
              style={{ boxShadow:'0 4px 18px rgba(220,38,38,.5)' }}>
              S
            </div>
            <div className="hidden sm:block">
              <div className="font-clash text-[18px] font-bold sl-logo-grad leading-tight">Seller Panel</div>
              <div className="font-dm text-[10px] tracking-[2px] uppercase" style={{ color:'rgba(255,237,213,.35)' }}>E·Commerce</div>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* User chip — desktop */}
            <Link to="/seller/profile"
              className="hidden md:inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full no-underline transition-all"
              style={{ background:'rgba(255,237,213,.07)', border:'1px solid rgba(255,237,213,.1)', color:'rgba(255,237,213,.8)' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,237,213,.13)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,237,213,.07)'; }}
            >
              <div className="sl-avatar w-7 h-7 rounded-full flex items-center justify-center font-clash text-[12px] font-bold text-white flex-shrink-0">
                {user?.name?.[0]?.toUpperCase()||'S'}
              </div>
              <span className="font-dm text-[13px] font-semibold">{user?.name?.split(' ')[0]}</span>
            </Link>

            {/* Quick add */}
            <Link to="/seller/products/add"
              className="sl-cta hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-white font-dm text-[13px] font-bold no-underline cursor-pointer"
            >
              <FiPlus size={14}/> Add Product
            </Link>
            <Link to="/seller/categories/add"
              className="sl-cta hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-white font-dm text-[13px] font-bold no-underline cursor-pointer"
            >
              <TbBlocks size={14}/> Add Category
            </Link>

            {/* Logout */}
            <button onClick={handleLogout}
              className="sl-logout flex items-center gap-2 px-3.5 py-2 rounded-xl border-none font-dm text-[13px] font-semibold cursor-pointer"
            >
              <FiLogOut size={14}/>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <ScrollProgress offsetLeft={sidebarW} />

        {/* ════ SIDEBAR ════ */}

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div className="lg:hidden fixed inset-0 z-[99]"
              style={{ background:'rgba(0,0,0,.7)', top:68 }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:.25 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside
          className={`sl-sidebar fixed z-[100] flex flex-col overflow-y-auto overflow-x-hidden w-[260px]
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            transition-transform duration-300 ease-in-out`}
          style={{ top:68, height:'calc(100vh - 68px)', scrollbarWidth:'thin', scrollbarColor:'rgba(220,38,38,.3) transparent' }}
        >

          {/* ── User panel ── */}
          <motion.div
            className="sl-user-panel m-3 rounded-[18px] p-[16px] relative overflow-hidden flex-shrink-0"
            initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.5, delay:.1 }}
          >
            {/* Corner glow */}
            <div className="absolute -top-8 -right-8 w-[110px] h-[110px] rounded-full pointer-events-none blur-[38px]"
              style={{ background:'rgba(220,38,38,.25)' }} />
            <div className="relative flex items-center gap-3">
              {/* Avatar + online dot */}
              <div className="relative flex-shrink-0">
                <div className="sl-avatar w-[44px] h-[44px] rounded-full flex items-center justify-center font-clash text-[18px] font-bold text-white"
                  style={{ boxShadow:'0 4px 16px rgba(220,38,38,.45)' }}>
                  {user?.name?.[0]?.toUpperCase()||'S'}
                </div>
                <div className="dot-blink absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                  style={{ background:'#34d399', border:'2px solid #1a0a00' }} />
              </div>
              <div className="min-w-0">
                <p className="font-clash font-bold text-[15px] leading-tight truncate" style={{ color:'#ffedd5' }}>{user?.name}</p>
                <p className="font-dm text-[11px] mt-0.5 truncate" style={{ color:'rgba(255,237,213,.38)' }}>{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop:'1px solid rgba(255,237,213,.08)' }}>
              <span className="font-dm text-[11px]" style={{ color:'rgba(255,237,213,.45)' }}>{timeGreet}</span>
              <span className="w-px h-3" style={{ background:'rgba(255,237,213,.15)' }} />
              <span className="font-dm text-[11px]" style={{ color:'rgba(255,237,213,.35)' }}>Seller Account</span>
            </div>
          </motion.div>

          {/* ── Navigation ── */}
          <div className="flex-shrink-0">
            <p className="font-dm text-[10px] font-bold tracking-[3px] uppercase px-7 mt-4 mb-2"
              style={{ color:'rgba(255,237,213,.2)' }}>Navigation</p>

            {navigation.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <motion.div key={item.path}
                  initial={{ opacity:0, x:-18 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay:.1 + i*.07, ease:[.22,1,.36,1] }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 mx-3 my-0.5 px-4 py-3 rounded-[14px] text-[14px] font-medium no-underline overflow-hidden transition-colors
                      ${active
                        ? 'sl-nav-active text-[#ffedd5]'
                        : 'text-[rgba(255,237,213,.52)] hover:text-[rgba(255,237,213,.88)] hover:bg-[rgba(255,237,213,.05)]'
                      }`}
                  >
                    {active && <span className="sl-active-bar" />}

                    {/* Hover shimmer */}
                    {!active && (
                      <motion.span className="sl-shimmer absolute inset-0"
                        initial={{ x:'-100%' }} whileHover={{ x:'100%' }}
                        transition={{ duration:.5 }}
                      />
                    )}

                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${active?'text-[#f97316]':''}`} />
                    <span className="flex-1 font-dm">{item.name}</span>

                    {/* Badge */}
                    {item.badge && (
                      <motion.span
                        className="font-dm font-bold px-2 py-0.5 rounded-full text-[10px]"
                        style={{ background:'rgba(220,38,38,.25)', color:'#fca5a5', border:'1px solid rgba(220,38,38,.35)' }}
                        initial={{ scale:0 }} animate={{ scale:1 }}
                        transition={{ type:'spring', stiffness:400 }}
                      >{item.badge}</motion.span>
                    )}

                    {active && (
                      <motion.span initial={{ opacity:0, x:-4 }} animate={{ opacity:1, x:0 }}>
                        <FiChevronRight size={13} style={{ color:'rgba(249,115,22,.6)' }}/>
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── Quick links ── */}
          <div className="px-3 flex-shrink-0">
            <p className="font-dm text-[10px] font-bold tracking-[3px] uppercase mt-4 mb-2 px-1"
              style={{ color:'rgba(255,237,213,.2)' }}>Quick Links</p>
            {quickLinks.map((l, i) => (
              <motion.div key={l.path}
                initial={{ opacity:0, x:-14 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay:.38 + i*.07 }}
              >
                <Link to={l.path}
                  className="sl-quick-link flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl my-0.5 font-dm text-[13px] font-medium no-underline"
                >
                  <span className="opacity-60">{l.icon}</span>
                  {l.label}
                  <FiArrowUpRight size={11} className="ml-auto opacity-40" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ── Sidebar footer ── */}
          <motion.div
            className="mt-auto p-3 flex-shrink-0"
            style={{ borderTop:'1px solid rgba(255,237,213,.06)' }}
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:.5 }}
          >
            {/* Add product CTA */}
            <Link to="/seller/products/add"
              className="sl-cta flex items-center justify-center gap-2.5 w-full py-3 rounded-2xl text-white font-dm text-[14px] font-bold no-underline cursor-pointer mb-3"
            >
              <FiPlus size={16}/> Add New Product
            </Link>

            {/* Help card */}
            <div className="sl-promo relative overflow-hidden rounded-2xl p-4">
              <div className="absolute -top-5 -right-5 w-[80px] h-[80px] rounded-full pointer-events-none blur-[28px]"
                style={{ background:'rgba(220,38,38,.22)' }} />
              <p className="font-clash text-[13px] font-bold mb-1" style={{ color:'#ffedd5' }}>🔥 Boost Sales</p>
              <p className="font-dm text-[11px] leading-relaxed mb-2.5" style={{ color:'rgba(255,237,213,.4)' }}>
                Add high-quality images to get 2× more clicks
              </p>
              <a href="#" className="inline-flex items-center gap-1 font-dm text-[12px] font-bold no-underline"
                style={{ color:'#fca5a5' }}
              >
                Seller Guide <FiChevronRight size={11}/>
              </a>
            </div>

            {/* Sign out */}
            <button onClick={handleLogout}
              className="sl-logout w-full mt-3 py-2.5 px-4 rounded-xl border-none font-dm text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              <FiLogOut size={14}/> Sign Out
            </button>
          </motion.div>
        </aside>

        {/* ════ MAIN CONTENT ════ */}
        <main className="flex-1 lg:ml-[260px] pt-[68px] relative z-[1] min-h-screen">
          <div className="p-5 lg:p-8 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-12 }}
                transition={{ duration:.32, ease:[.22,1,.36,1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
};

export default SellerLayout;