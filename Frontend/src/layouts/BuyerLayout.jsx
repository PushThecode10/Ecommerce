import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice.js';
import { selectCartItemCount } from '../Redux/createSlice.js';
import {
  FiHome, FiShoppingBag, FiShoppingCart, FiUser,
  FiLogOut, FiMenu, FiX, FiPackage, FiStar,
  FiChevronRight, FiZap,
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { authAPI } from '../service/apiAuth.js';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Non-Tailwind bits (animations + things Tailwind can't express) ─────── */
const Keyframes = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    html, body, #root {
      background: #060612 !important;
      color: #fff !important;
      font-family: 'DM Sans', sans-serif !important;
    }

    @keyframes orb-a {
      0%,100% { transform: translate(0,0) scale(1); }
      40%      { transform: translate(50px,-40px) scale(1.1); }
      75%      { transform: translate(-30px,25px) scale(.93); }
    }
    @keyframes orb-b {
      0%,100% { transform: translate(0,0) scale(1); }
      45%     { transform: translate(-40px,35px) scale(1.08); }
    }
    @keyframes grid-p {
      0%,100% { opacity: .025; }
      50%     { opacity: .05; }
    }
    @keyframes dot-blink {
      0%,100% { opacity:1; transform:scale(1); }
      50%     { opacity:.4; transform:scale(1.5); }
    }
    @keyframes float-up {
      0%,100% { transform:translateY(0); opacity:.2; }
      50%     { transform:translateY(-20px); opacity:.55; }
    }
    @keyframes shimmer-x {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .font-clash   { font-family: 'Clash Display', sans-serif !important; }
    .font-dm      { font-family: 'DM Sans', sans-serif !important; }

    .orb-a-anim   { animation: orb-a 22s ease-in-out infinite; }
    .orb-b-anim   { animation: orb-b 26s ease-in-out infinite 3s; }
    .grid-anim    { animation: grid-p 8s ease-in-out infinite; }
    .dot-blink    { animation: dot-blink 2s ease-in-out infinite; }
    .float-particle { animation: float-up var(--dur, 5s) ease-in-out var(--delay, 0s) infinite; }

    /* Active sidebar bar */
    .nav-active-bar {
      position: absolute; left: 0; top: 20%; height: 60%; width: 3px;
      border-radius: 0 3px 3px 0;
      background: linear-gradient(180deg, #7c3aed, #ec4899);
    }

    /* Hover shimmer sweep */
    .shimmer-sweep {
      position: absolute; inset: 0; border-radius: 14px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
      animation: shimmer-x .5s ease forwards;
    }

    /* Sidebar transition */
    .sidebar-slide {
      transition: transform .3s ease;
    }

    /* Scroll progress */
    .scroll-prog {
      transition: width .1s linear;
      background: linear-gradient(90deg, #7c3aed, #ec4899, #f59e0b);
    }

    /* Active nav item gradient bg */
    .nav-item-active-bg {
      background: linear-gradient(135deg, rgba(124,58,237,.22), rgba(109,40,217,.1)) !important;
    }
    /* User panel gradient */
    .user-panel-bg {
      background: linear-gradient(135deg, rgba(124,58,237,.16), rgba(236,72,153,.1)) !important;
    }
    /* Promo card gradient */
    .promo-card-bg {
      background: linear-gradient(135deg, rgba(124,58,237,.2), rgba(236,72,153,.14)) !important;
    }
    /* Logo mark gradient */
    .logo-mark-bg {
      background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
    }
    /* Avatar gradient */
    .avatar-bg {
      background: linear-gradient(135deg, #7c3aed, #ec4899) !important;
    }
    /* Logout btn */
    .logout-bg {
      background: rgba(239,68,68,.13) !important;
      color: #f87171 !important;
    }
    .logout-bg:hover {
      background: rgba(239,68,68,.25) !important;
      color: #fca5a5 !important;
    }
    /* Sidebar logout */
    .sidebar-logout {
      background: rgba(239,68,68,.1) !important;
      color: rgba(248,113,113,.8) !important;
    }
    .sidebar-logout:hover {
      background: rgba(239,68,68,.22) !important;
      color: #fca5a5 !important;
    }
    /* Cart badge */
    .cart-badge-bg { background: linear-gradient(135deg, #7c3aed, #ec4899) !important; }
    /* Nav badge */
    .nav-badge-bg  { background: linear-gradient(135deg, #7c3aed, #ec4899) !important; }
    /* Price gradient text */
    .price-grad {
      background: linear-gradient(135deg,#a78bfa,#7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    /* Online dot */
    .online-dot {
      background: #10b981;
      border: 2px solid #060612;
    }
    /* Icon btn dark */
    .icon-btn-dark {
      background: rgba(255,255,255,.07) !important;
      color: rgba(255,255,255,.65) !important;
    }
    .icon-btn-dark:hover {
      background: rgba(255,255,255,.14) !important;
      color: #fff !important;
    }
    /* User chip dark */
    .user-chip-dark {
      background: rgba(255,255,255,.07) !important;
      border: 1px solid rgba(255,255,255,.1) !important;
    }
    .user-chip-dark:hover { background: rgba(255,255,255,.13) !important; }
    /* Hamburger */
    .hamburger-dark {
      background: rgba(255,255,255,.07) !important;
      color: rgba(255,255,255,.75) !important;
    }
    .hamburger-dark:hover { background: rgba(255,255,255,.13) !important; }

    ::selection { background: rgba(124,58,237,.4); color: #fff; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #060612; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#7c3aed,#ec4899); border-radius: 4px; }
  `}</style>
);

/* ─── Scroll Progress Bar ────────────────────────────────────────────────── */
const ScrollProgress = ({ sidebarWidth }) => {
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
    <div
      className="scroll-prog fixed z-[150] h-0.5 pointer-events-none"
      style={{ top: 68, left: sidebarWidth, right: 0, width: `${w}%` }}
    />
  );
};

/* ─── BuyerLayout ────────────────────────────────────────────────────────── */
const BuyerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector(s => s.auth);
  const cartCount = useSelector(selectCartItemCount);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => { setSidebarOpen(false); }, [location]);

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch (e) { console.error(e); }
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/');
  };

  const isActive = path =>
    path === '/buyer' ? location.pathname === path : location.pathname.startsWith(path);

  const navigation = [
    { name: 'Dashboard', path: '/buyer',         icon: FiHome,         badge: null },
    { name: 'My Orders', path: '/buyer/orders',   icon: FiShoppingBag,  badge: null },
    { name: 'Cart',      path: '/cart',           icon: FiShoppingCart, badge: cartCount > 0 ? cartCount : null },
    { name: 'Profile',   path: '/buyer/profile',  icon: FiUser,         badge: null },
  ];

  const quickLinks = [
    { label: 'Browse Products', path: '/',                    icon: <FiPackage size={13} /> },
    { label: 'All Products',    path: '/products',            icon: <FiZap size={13} /> },
    { label: 'Top Rated',       path: '/products?sort=rating',icon: <FiStar size={13} /> },
  ];

  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? '🌅 Morning' : hour < 17 ? '☀️ Afternoon' : '🌙 Evening';

  // sidebar width for scroll bar offset on desktop
  const sidebarW = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 260 : 0;

  return (
    <>
      <Keyframes />

      {/* ── Fixed background layers ── */}
      {/* Orb 1 */}
      <div className="orb-a-anim fixed top-0 right-0 -translate-y-[12%] w-[560px] h-[560px] rounded-full pointer-events-none z-0 blur-[130px] opacity-[.13]"
        style={{ background: '#7c3aed' }} />
      {/* Orb 2 */}
      <div className="orb-b-anim fixed bottom-0 left-0 -translate-x-[6%] w-[480px] h-[480px] rounded-full pointer-events-none z-0 blur-[120px] opacity-[.10]"
        style={{ background: '#db2777' }} />
      {/* Grid */}
      <div className="grid-anim fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i}
            className="float-particle absolute rounded-full"
            style={{
              left: `${(i * 71 + 9) % 100}%`,
              top:  `${(i * 43 + 5) % 100}%`,
              width: `${i % 3 + 1}px`, height: `${i % 3 + 1}px`,
              background: 'rgba(255,255,255,.4)',
              '--dur': `${5 + i % 4}s`,
              '--delay': `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* ── Root ── */}
      <div className="min-h-screen flex flex-col font-dm" style={{ background: '#060612', color: '#fff' }}>

        {/* ════ TOP NAVBAR ════ */}
        <header className="fixed top-0 left-0 right-0 z-[200] h-[68px] flex items-center gap-3 px-6 backdrop-blur-xl"
          style={{ background: 'rgba(6,6,18,.88)', borderBottom: '1px solid rgba(255,255,255,.07)' }}
        >
          {/* Hamburger — mobile only */}
          <motion.button
            className="hamburger-dark lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border-none cursor-pointer text-xl"
            onClick={() => setSidebarOpen(o => !o)}
            whileTap={{ scale: .9 }}
          >
            <AnimatePresence mode="wait">
              {sidebarOpen
                ? <motion.span key="x" initial={{ rotate:-90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:90,opacity:0 }} transition={{ duration:.2 }}><FiX size={20}/></motion.span>
                : <motion.span key="m" initial={{ rotate:90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:-90,opacity:0 }} transition={{ duration:.2 }}><FiMenu size={20}/></motion.span>
              }
            </AnimatePresence>
          </motion.button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0 group">
            <div className="logo-mark-bg w-[38px] h-[38px] rounded-xl flex items-center justify-center font-clash text-lg font-bold text-white flex-shrink-0 group-hover:scale-110 group-hover:-rotate-[4deg] transition-transform duration-200"
              style={{ boxShadow: '0 4px 18px rgba(124,58,237,.45)' }}>
              E
            </div>
            <div className="hidden sm:block">
              <div className="font-clash text-lg font-bold text-white leading-tight">E·Commerce</div>
              <div className="font-dm text-[10px] text-white/35 tracking-[2px] uppercase">Buyer Portal</div>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Cart icon */}
            <Link to="/cart" className="icon-btn-dark relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors no-underline">
              <FiShoppingCart size={18} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    className="cart-badge-bg absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-[10px] px-1 text-white text-[10px] font-extrabold flex items-center justify-center font-dm"
                    style={{ border: '2px solid #060612' }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User chip — hidden on mobile */}
            <Link to="/buyer/profile"
              className="user-chip-dark hidden md:inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full text-white/80 text-sm font-semibold no-underline transition-colors font-dm"
            >
              <div className="avatar-bg w-7 h-7 rounded-full flex items-center justify-center font-clash text-xs font-bold text-white flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span>{user?.name?.split(' ')[0]}</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="logout-bg flex items-center gap-2 px-4 py-2 rounded-xl border-none font-dm text-sm font-semibold cursor-pointer transition-all"
            >
              <FiLogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <ScrollProgress sidebarWidth={sidebarW} />

        {/* ════ SIDEBAR ════ */}
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/65 z-[99]"
              style={{ top: 68 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: .25 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside
          className={`sidebar-slide fixed z-[100] flex flex-col overflow-y-auto overflow-x-hidden
            w-[260px] backdrop-blur-xl
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
          style={{
            top: 68, height: 'calc(100vh - 68px)',
            background: 'rgba(6,6,18,.7)',
            borderRight: '1px solid rgba(255,255,255,.07)',
            scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,.3) transparent',
          }}
        >
          {/* ── User panel ── */}
          <motion.div
            className="user-panel-bg m-3 rounded-[18px] p-[18px_16px] relative overflow-hidden flex-shrink-0"
            style={{ border: '1px solid rgba(124,58,237,.25)' }}
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: .1 }}
          >
            {/* Glow blob */}
            <div className="absolute -top-8 -right-8 w-[120px] h-[120px] rounded-full pointer-events-none blur-[40px]"
              style={{ background: 'rgba(124,58,237,.2)' }} />

            <div className="relative flex items-center gap-3">
              {/* Avatar with online dot */}
              <div className="relative flex-shrink-0">
                <div className="avatar-bg w-11 h-11 rounded-full flex items-center justify-center font-clash text-lg font-bold text-white"
                  style={{ boxShadow: '0 4px 16px rgba(124,58,237,.4)' }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="online-dot dot-blink absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" />
              </div>
              {/* Name / email */}
              <div className="min-w-0">
                <p className="font-clash font-bold text-[15px] text-white leading-tight truncate">{user?.name}</p>
                <p className="font-dm text-[11px] text-white/40 mt-0.5 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3.5">
              <span className="text-[10px]">{timeGreet}</span>
              <span className="w-px h-2.5 bg-white/15" />
              <span className="font-dm text-[11px] text-white/35">Buyer Account</span>
            </div>
          </motion.div>

          {/* ── Main navigation ── */}
          <div className="flex-shrink-0">
            <p className="font-dm text-[10px] font-bold text-white/20 tracking-[3px] uppercase px-7 mt-5 mb-2">
              Navigation
            </p>

            {navigation.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <motion.div key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: .12 + i * .07, ease: [.22, 1, .36, 1] }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 mx-3 my-0.5 px-4 py-3 rounded-[14px] text-sm font-medium no-underline overflow-hidden transition-colors
                      ${active
                        ? 'nav-item-active-bg text-white font-semibold'
                        : 'text-white/55 hover:text-white/90 hover:bg-white/[.06]'
                      }`}
                    style={active ? { border: '1px solid rgba(124,58,237,.28)' } : {}}
                  >
                    {/* Active left bar */}
                    {active && <span className="nav-active-bar" />}

                    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? 'text-[#a78bfa]' : ''}`} />
                    <span className="flex-1 font-dm">{item.name}</span>

                    {/* Badge */}
                    {item.badge && (
                      <motion.span
                        className="nav-badge-bg min-w-[20px] h-5 rounded-[10px] px-1.5 text-white text-[10px] font-extrabold flex items-center justify-center font-dm"
                        key={item.badge}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {item.badge}
                      </motion.span>
                    )}

                    {/* Active chevron */}
                    {active && (
                      <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}>
                        <FiChevronRight size={14} className="text-[#a78bfa]/50" />
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── Quick links ── */}
          <div className="px-3 flex-shrink-0">
            <p className="font-dm text-[10px] font-bold text-white/20 tracking-[3px] uppercase mt-5 mb-2 px-1">
              Shop
            </p>
            {quickLinks.map((l, i) => (
              <motion.div key={l.path}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: .35 + i * .06 }}
              >
                <Link
                  to={l.path}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl my-0.5 font-dm text-[13px] font-medium text-white/40 no-underline hover:bg-white/[.06] hover:text-white/75 transition-all"
                >
                  <span className="opacity-60">{l.icon}</span>
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ── Sidebar footer ── */}
          <motion.div
            className="mt-auto p-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .5 }}
          >
            {/* Promo card */}
            <div className="promo-card-bg relative rounded-2xl p-4 overflow-hidden"
              style={{ border: '1px solid rgba(124,58,237,.25)' }}
            >
              <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full pointer-events-none blur-[30px]"
                style={{ background: 'rgba(124,58,237,.25)' }} />
              <p className="font-clash text-[13px] font-bold text-white mb-1">🎉 Use code SAVE10</p>
              <p className="font-dm text-[11px] text-white/40 leading-relaxed mb-3">
                Get 10% off your next order at checkout
              </p>
              <Link to="/products"
                className="inline-flex items-center gap-1.5 font-dm text-[12px] font-bold text-[#a78bfa] no-underline"
              >
                Shop Now <FiChevronRight size={12} />
              </Link>
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              className="sidebar-logout w-full mt-3 py-2.5 px-4 rounded-xl border-none font-dm text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <FiLogOut size={14} /> Sign Out
            </button>
          </motion.div>
        </aside>

        {/* ════ MAIN CONTENT ════ */}
        <main className="flex-1 lg:ml-[260px] pt-[68px] relative z-[1] min-h-screen">
          <div className="p-6 lg:p-8 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: .35, ease: [.22, 1, .36, 1] }}
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

export default BuyerLayout;