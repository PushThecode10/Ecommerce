import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX,
  FiHome, FiPackage, FiGrid, FiInstagram,
  FiTwitter, FiFacebook, FiMail, FiArrowUp,
  FiHelpCircle, FiRefreshCw, FiPhone,
} from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice.js';
import { selectCartItemCount } from '../Redux/createSlice.js';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
// public layout with top navbar, animated background orbs, scroll progress bar, and back-to-top button. The navbar includes a logo, navigation links, cart icon with item count badge, and user authentication actions (login/signup or user chip and logout). The layout uses global styles for consistent theming and responsive design. The main content is rendered via an Outlet for nested routes.
/* ─── Global Styles ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root {
      background: #060612 !important;
      color: #ffffff !important;
      font-family: 'DM Sans', sans-serif !important;
      min-height: 100vh;
    }

    .layout-root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #060612 !important;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
    }

    /* ── Layout background fixed orbs ── */
    .layout-bg-orb1 {
      position: fixed; top: -15%; left: -10%;
      width: 700px; height: 700px; border-radius: 50%;
      background: #7c3aed; filter: blur(140px); opacity: .12;
      pointer-events: none; z-index: 0;
      animation: layout-orb1 22s ease-in-out infinite;
    }
    .layout-bg-orb2 {
      position: fixed; bottom: -10%; right: -8%;
      width: 600px; height: 600px; border-radius: 50%;
      background: #db2777; filter: blur(130px); opacity: .1;
      pointer-events: none; z-index: 0;
      animation: layout-orb2 26s ease-in-out infinite 3s;
    }
    .layout-bg-grid {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
      background-size: 64px 64px;
      animation: grid-breathe 8s ease-in-out infinite;
    }

    @keyframes layout-orb1 { 0%,100%{transform:translate(0,0)} 40%{transform:translate(50px,-50px)} 75%{transform:translate(-30px,30px)} }
    @keyframes layout-orb2 { 0%,100%{transform:translate(0,0)} 45%{transform:translate(-40px,35px)} 80%{transform:translate(25px,-20px)} }
    @keyframes grid-breathe { 0%,100%{opacity:.6} 50%{opacity:1} }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes dot-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.5} }
    @keyframes cart-bounce { 0%,100%{transform:scale(1)} 30%{transform:scale(1.4)} 60%{transform:scale(.9)} }
    @keyframes scroll-indicator { 0%{opacity:0;transform:translateY(-6px)} 50%{opacity:1} 100%{opacity:0;transform:translateY(6px)} }
    @keyframes float-up { 0%,100%{transform:translateY(0);opacity:.2} 50%{transform:translateY(-24px);opacity:.6} }
    @keyframes footer-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes glow-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0)} 50%{box-shadow:0 0 24px 4px rgba(124,58,237,.25)} }

    .dot-pulse-anim { animation: dot-pulse 1.6s ease-in-out infinite; }
    .cart-bounce-anim { animation: cart-bounce .4s ease forwards; }

    /* ── NAVBAR ── */
    .ec-navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      font-family: 'DM Sans', sans-serif;
      transition: all .35s ease;
    }
    .ec-navbar.scrolled {
      background: rgba(6,6,18,.92) !important;
      border-bottom: 1px solid rgba(255,255,255,.07) !important;
      box-shadow: 0 8px 40px rgba(0,0,0,.5) !important;
      backdrop-filter: blur(24px) !important;
    }
    .ec-navbar.top {
      background: rgba(6,6,18,.2) !important;
      border-bottom: 1px solid rgba(255,255,255,.04) !important;
      backdrop-filter: blur(10px) !important;
    }
    .ec-navbar-inner {
      max-width: 1280px; margin: 0 auto;
      padding: 0 28px; height: 70px;
      display: flex; align-items: center; gap: 8px;
    }

    /* Logo */
    .ec-logo { display:flex; align-items:center; gap:11px; text-decoration:none!important; flex-shrink:0; }
    .ec-logo-mark {
      width:40px; height:40px; border-radius:13px;
      background: linear-gradient(135deg,#7c3aed,#6d28d9);
      display:flex; align-items:center; justify-content:center;
      font-family:'Clash Display',sans-serif; font-size:19px; font-weight:700; color:#fff;
      box-shadow: 0 4px 20px rgba(124,58,237,.45);
      transition: transform .25s, box-shadow .25s;
    }
    .ec-logo:hover .ec-logo-mark { transform:scale(1.08) rotate(-4deg); box-shadow:0 6px 28px rgba(124,58,237,.6); }
    .ec-logo-text {
      font-family:'Clash Display',sans-serif; font-size:20px; font-weight:700;
      color:#fff!important; letter-spacing:-.4px;
    }
    .ec-logo-dot { color:#a78bfa; }

    /* Nav links */
    .ec-navlinks { display:flex; align-items:center; gap:2px; margin-left:28px; flex:1; }
    .ec-navlink {
      position:relative; display:inline-flex; align-items:center; gap:7px;
      padding:8px 14px; border-radius:11px;
      font-size:14px; font-weight:500;
      color:rgba(255,255,255,.58)!important; text-decoration:none!important;
      transition:color .2s, background .2s;
    }
    .ec-navlink:hover { color:#fff!important; background:rgba(255,255,255,.07); }
    .ec-navlink.active { color:#fff!important; background:rgba(124,58,237,.18); }
    .ec-navlink.active::after {
      content:''; position:absolute; bottom:5px; left:50%; transform:translateX(-50%);
      width:16px; height:2px; border-radius:2px;
      background:linear-gradient(90deg,#7c3aed,#ec4899);
    }

    /* Right actions */
    .ec-nav-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }

    .ec-icon-btn {
      position:relative; width:40px; height:40px; border-radius:11px; border:none;
      background:rgba(255,255,255,.07)!important; color:rgba(255,255,255,.65)!important;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; text-decoration:none!important; font-size:19px;
      transition:background .2s, color .2s;
    }
    .ec-icon-btn:hover { background:rgba(255,255,255,.14)!important; color:#fff!important; }
    .ec-cart-badge {
      position:absolute; top:-5px; right:-5px;
      min-width:19px; height:19px; border-radius:10px;
      background:linear-gradient(135deg,#7c3aed,#ec4899);
      color:#fff; font-size:10px; font-weight:800;
      display:flex; align-items:center; justify-content:center;
      border:2px solid #060612; padding:0 4px;
      font-family:'DM Sans',sans-serif;
    }

    .ec-user-chip {
      display:inline-flex; align-items:center; gap:8px;
      padding:7px 14px 7px 8px; border-radius:40px;
      background:rgba(255,255,255,.07)!important;
      border:1px solid rgba(255,255,255,.1)!important;
      color:rgba(255,255,255,.8)!important;
      font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
      text-decoration:none!important; cursor:pointer;
      transition:all .2s;
    }
    .ec-user-chip:hover { background:rgba(255,255,255,.13)!important; color:#fff!important; }
    .ec-avatar {
      width:26px; height:26px; border-radius:50%;
      background:linear-gradient(135deg,#7c3aed,#ec4899);
      display:flex; align-items:center; justify-content:center;
      font-family:'Clash Display',sans-serif; font-size:12px; font-weight:700; color:#fff;
      flex-shrink:0;
    }

    .ec-btn-login {
      padding:8px 20px; border-radius:11px;
      background:rgba(255,255,255,.08)!important; border:1px solid rgba(255,255,255,.14)!important;
      color:rgba(255,255,255,.82)!important; font-family:'DM Sans',sans-serif;
      font-size:14px; font-weight:600; cursor:pointer; text-decoration:none!important;
      transition:all .2s; white-space:nowrap;
    }
    .ec-btn-login:hover { background:rgba(255,255,255,.14)!important; color:#fff!important; }

    .ec-btn-signup {
      padding:8px 20px; border-radius:11px;
      background:linear-gradient(135deg,#7c3aed,#6d28d9)!important;
      border:none!important; color:#fff!important;
      font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700;
      cursor:pointer; text-decoration:none!important;
      box-shadow:0 4px 20px rgba(124,58,237,.4);
      transition:transform .2s, box-shadow .2s; white-space:nowrap;
    }
    .ec-btn-signup:hover { transform:scale(1.05); box-shadow:0 6px 28px rgba(124,58,237,.6)!important; }

    .ec-logout-btn {
      padding:8px 16px; border-radius:11px; border:none;
      background:rgba(239,68,68,.14)!important; color:#f87171!important;
      font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600;
      cursor:pointer; display:flex; align-items:center; gap:7px;
      transition:all .2s;
    }
    .ec-logout-btn:hover { background:rgba(239,68,68,.25)!important; color:#fca5a5!important; }

    /* Hamburger */
    .ec-hamburger {
      display:none; width:40px; height:40px; border-radius:11px; border:none;
      background:rgba(255,255,255,.07)!important; color:rgba(255,255,255,.8)!important;
      align-items:center; justify-content:center; cursor:pointer; font-size:20px;
      transition:background .2s;
    }
    .ec-hamburger:hover { background:rgba(255,255,255,.14)!important; }

    /* Mobile menu */
    .ec-mobile-menu {
      position:fixed; top:70px; left:0; right:0;
      background:rgba(6,6,18,.97)!important;
      border-bottom:1px solid rgba(255,255,255,.08);
      backdrop-filter:blur(28px); z-index:999;
      padding:20px 24px 28px;
    }
    .ec-mobile-link {
      display:flex; align-items:center; gap:12px; padding:13px 16px;
      border-radius:13px; margin-bottom:6px; font-size:15px; font-weight:500;
      color:rgba(255,255,255,.68)!important; text-decoration:none!important;
      transition:all .2s;
    }
    .ec-mobile-link:hover, .ec-mobile-link.active {
      background:rgba(124,58,237,.15); color:#fff!important;
    }
    .ec-mobile-divider { height:1px; background:rgba(255,255,255,.07); margin:14px 0; }

    /* Scroll progress */
    .scroll-progress-bar {
      position:fixed; top:70px; left:0; height:2px; z-index:999;
      background:linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b);
      transform-origin:left; pointer-events:none;
    }

    /* Back to top */
    .back-to-top {
      position:fixed; bottom:32px; right:32px; z-index:100;
      width:46px; height:46px; border-radius:14px; border:none;
      background:linear-gradient(135deg,#7c3aed,#6d28d9)!important;
      color:#fff!important; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 6px 24px rgba(124,58,237,.45);
      transition:transform .2s;
    }
    .back-to-top:hover { transform:scale(1.1) translateY(-3px); }

    /* Main content */
    .layout-main {
      flex:1; position:relative; z-index:1;
      padding-top:70px; /* navbar height */
    }

    /* ── FOOTER ── */
    .ec-footer {
      position:relative; z-index:1;
      background:rgba(255,255,255,.025)!important;
      border-top:1px solid rgba(255,255,255,.07);
    }
    .ec-footer-inner {
      max-width:1280px; margin:0 auto; padding:72px 28px 40px;
    }
    .ec-footer-grid {
      display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; margin-bottom:56px;
    }
    .ec-footer-link {
      display:block; font-family:'DM Sans',sans-serif; font-size:14px;
      color:rgba(255,255,255,.38)!important; text-decoration:none!important;
      padding:5px 0; transition:color .2s;
    }
    .ec-footer-link:hover { color:rgba(167,139,250,.85)!important; }
    .ec-footer-social {
      width:38px; height:38px; border-radius:11px;
      background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1);
      display:flex; align-items:center; justify-content:center;
      color:rgba(255,255,255,.5)!important; text-decoration:none!important;
      transition:all .25s; cursor:pointer; font-size:17px;
    }
    .ec-footer-social:hover {
      background:rgba(124,58,237,.2)!important; border-color:rgba(124,58,237,.4)!important;
      color:#a78bfa!important; transform:translateY(-3px);
    }
    .ec-footer-bottom {
      border-top:1px solid rgba(255,255,255,.06);
      padding-top:28px; display:flex; align-items:center; justify-content:space-between;
      flex-wrap:wrap; gap:14px;
    }
    .ec-newsletter-input {
      flex:1; background:rgba(255,255,255,.07)!important; border:1px solid rgba(255,255,255,.12)!important;
      border-radius:11px 0 0 11px; padding:11px 16px;
      font-family:'DM Sans',sans-serif; font-size:14px; color:#fff!important;
      outline:none; transition:border-color .2s;
      min-width:0;
    }
    .ec-newsletter-input::placeholder { color:rgba(255,255,255,.28); }
    .ec-newsletter-input:focus { border-color:rgba(124,58,237,.55)!important; }
    .ec-newsletter-btn {
      padding:11px 20px; border-radius:0 11px 11px 0; border:none;
      background:linear-gradient(135deg,#7c3aed,#6d28d9)!important;
      color:#fff!important; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700;
      cursor:pointer; transition:opacity .2s; white-space:nowrap;
    }
    .ec-newsletter-btn:hover { opacity:.88; }

    @media(max-width:1024px) {
      .ec-footer-grid { grid-template-columns:1fr 1fr; gap:36px; }
    }
    @media(max-width:900px) {
      .ec-navlinks, .ec-btn-login, .ec-btn-signup, .ec-logout-btn, .ec-user-chip { display:none!important; }
      .ec-hamburger { display:flex!important; }
    }
    @media(max-width:600px) {
      .ec-footer-grid { grid-template-columns:1fr; gap:28px; }
      .ec-footer-inner { padding:48px 20px 28px; }
      .ec-logo-text { display:none; }
      .back-to-top { bottom:20px; right:20px; }
    }

    ::selection { background:rgba(124,58,237,.4); color:#fff; }
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-track { background:#060612; }
    ::-webkit-scrollbar-thumb { background:linear-gradient(#7c3aed,#ec4899); border-radius:4px; }
  `}</style>
);

/* ─── Scroll Progress Bar ────────────────────────────────────────────────── */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div className="scroll-progress-bar" style={{ scaleX: scrollYProgress }} />
  );
};

/* ─── Back To Top ────────────────────────────────────────────────────────── */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button className="back-to-top"
          initial={{ opacity:0, scale:.7, y:20 }}
          animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:.7, y:20 }}
          transition={{ duration:.35, ease:'backOut' }}
          onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          title="Back to top"
        >
          <FiArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [cartPop, setCartPop]     = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const itemCount = useSelector(selectCartItemCount);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setCartPop(true);
      setTimeout(() => setCartPop(false), 500);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = path => location.pathname === path;

  const getDashLink = () => {
    if (!user) return '/';
    return user.role==='admin' ? '/admin' : user.role==='seller' ? '/seller' : '/buyer';
  };

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const navLinks = [
    { to:'/',         label:'Home',     icon:<FiHome size={14}/> },
    { to:'/products', label:'Products', icon:<FiPackage size={14}/> },
  ];

  return (
    <>
      <nav className={`ec-navbar ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="ec-navbar-inner">

          {/* Logo */}
          <Link to="/" className="ec-logo">
            <div className="ec-logo-mark">E</div>
            <span className="ec-logo-text">E<span className="ec-logo-dot">·</span>Commerce</span>
          </Link>

          {/* Desktop links */}
          <div className="ec-navlinks">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`ec-navlink ${isActive(l.to)?'active':''}`}>
                {l.icon}{l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="ec-nav-right">
            {/* Cart */}
            <Link to="/cart" className={`ec-icon-btn ${cartPop ? 'cart-bounce-anim' : ''}`}>
              <FiShoppingCart size={19} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span className="ec-cart-badge"
                    key={itemCount}
                    initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                    transition={{ type:'spring', stiffness:400, damping:20 }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to={getDashLink()} className="ec-user-chip">
                  <div className="ec-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button className="ec-logout-btn" onClick={handleLogout}>
                  <FiLogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="ec-btn-login">Login</Link>
                <Link to="/register" className="ec-btn-signup">Sign Up</Link>
              </>
            )}

            {/* Hamburger */}
            <motion.button className="ec-hamburger" onClick={() => setMenuOpen(o=>!o)}
              whileTap={{ scale:.9 }}
            >
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.span key="x" initial={{ rotate:-90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:90,opacity:0 }} transition={{ duration:.2 }}><FiX size={20}/></motion.span>
                  : <motion.span key="m" initial={{ rotate:90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:-90,opacity:0 }} transition={{ duration:.2 }}><FiMenu size={20}/></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="ec-mobile-menu"
            initial={{ opacity:0, y:-20, clipPath:'inset(0 0 100% 0)' }}
            animate={{ opacity:1, y:0, clipPath:'inset(0 0 0% 0)' }}
            exit={{ opacity:0, y:-12, clipPath:'inset(0 0 100% 0)' }}
            transition={{ duration:.35, ease:[.22,1,.36,1] }}
          >
            {/* Mobile search */}
            <div style={{ position:'relative', marginBottom:16 }}>
              <input
                placeholder="Search products…"
                style={{ width:'100%', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:'11px 16px', fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#fff', outline:'none' }}
                onKeyDown={e => { if(e.key==='Enter' && e.target.value) { navigate(`/products?search=${e.target.value}`); setMenuOpen(false); } }}
              />
            </div>

            {navLinks.map((l,i) => (
              <motion.div key={l.to}
                initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:i*.07 }}
              >
                <Link to={l.to} className={`ec-mobile-link ${isActive(l.to)?'active':''}`}>
                  {l.icon} {l.label}
                </Link>
              </motion.div>
            ))}

            <Link to="/cart" className="ec-mobile-link" style={{ justifyContent:'space-between' }}>
              <span style={{ display:'flex', alignItems:'center', gap:12 }}><FiShoppingCart size={15}/> Cart</span>
              {itemCount > 0 && (
                <span style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', color:'#fff', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:800 }}>{itemCount}</span>
              )}
            </Link>

            <div className="ec-mobile-divider" />

            {isAuthenticated ? (
              <div style={{ display:'flex', gap:10 }}>
                <Link to={getDashLink()} style={{ flex:1, textAlign:'center', padding:'12px', borderRadius:12, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.8)', textDecoration:'none', fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600 }}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ flex:1, padding:'12px', borderRadius:12, background:'rgba(239,68,68,.14)', border:'1px solid rgba(239,68,68,.24)', color:'#f87171', fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', gap:10 }}>
                <Link to="/login" style={{ flex:1, textAlign:'center', padding:'12px', borderRadius:12, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'rgba(255,255,255,.82)', textDecoration:'none', fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600 }}>Login</Link>
                <Link to="/register" style={{ flex:1, textAlign:'center', padding:'12px', borderRadius:12, background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff', textDecoration:'none', fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:700, boxShadow:'0 4px 18px rgba(124,58,237,.35)' }}>Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Footer ─────────────────────────────────────────────────────────────── */
const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = e => {
    e.preventDefault();
    if(email.trim()) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  const year = new Date().getFullYear();

  const footerLinks = {
    'Shop': [
      { label:'All Products', to:'/products' },
      { label:'New Arrivals', to:'/products?sort=newest' },
      { label:'Flash Deals', to:'/products?sort=sale' },
      { label:'Top Rated', to:'/products?sort=rating' },
    ],
    'Sellers': [
      { label:'Start Selling', to:'/register' },
      { label:'Seller Dashboard', to:'/seller' },
      { label:'Pricing', to:'#' },
      { label:'Seller Guidelines', to:'#' },
    ],
    'Support': [
      { label:'Help Center', to:'#' },
      { label:'Track Order', to:'#' },
      { label:'Returns & Refunds', to:'#' },
      { label:'Contact Us', to:'#' },
    ],
  };

  const socials = [
    { icon:<FiFacebook size={16}/>, href:'#', label:'Facebook' },
    { icon:<FiTwitter  size={16}/>, href:'#', label:'Twitter'  },
    { icon:<FiInstagram size={16}/>, href:'#', label:'Instagram' },
    { icon:<FiMail     size={16}/>, href:'#', label:'Email'    },
  ];

  return (
    <footer className="ec-footer">
      {/* Decorative top glow */}
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:1, background:'linear-gradient(90deg, transparent, rgba(124,58,237,.4), rgba(236,72,153,.3), transparent)' }} />

      <div className="ec-footer-inner">
        <div className="ec-footer-grid">

          {/* Brand column */}
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.6 }}>
            <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:20 }}>
              <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#7c3aed,#6d28d9)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Clash Display,sans-serif', fontSize:17, fontWeight:700, color:'#fff', boxShadow:'0 4px 16px rgba(124,58,237,.4)' }}>E</div>
              <span style={{ fontFamily:'Clash Display,sans-serif', fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-.3px' }}>E<span style={{ color:'#a78bfa' }}>·</span>Commerce</span>
            </Link>

            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.38)', lineHeight:1.72, marginBottom:24, maxWidth:260 }}>
              Your one-stop shop for everything you need, delivered fast and secured by our buyer protection.
            </p>

            {/* Socials */}
            <div style={{ display:'flex', gap:10, marginBottom:32 }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} className="ec-footer-social" title={s.label}>{s.icon}</a>
              ))}
            </div>

            {/* Newsletter */}
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'rgba(255,255,255,.35)', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>Newsletter</p>
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.p key="thanks" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'#34d399', fontWeight:600 }}
                >✓ Subscribed! Thank you 🎉</motion.p>
              ) : (
                <motion.form key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} onSubmit={handleSubscribe}
                  style={{ display:'flex', maxWidth:300 }}
                >
                  <input className="ec-newsletter-input" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
                  <button type="submit" className="ec-newsletter-btn">Subscribe</button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links], si) => (
            <motion.div key={section}
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:.6, delay:.1+si*.1 }}
            >
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:700, letterSpacing:3, color:'rgba(255,255,255,.3)', textTransform:'uppercase', marginBottom:20 }}>{section}</p>
              {links.map(l => (
                <Link key={l.label} to={l.to} className="ec-footer-link">{l.label}</Link>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div className="ec-footer-bottom"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:.6 }}
        >
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.22)' }}>
            © {year} E-Commerce. All rights reserved.
          </p>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(255,255,255,.22)', textDecoration:'none', transition:'color .2s' }}
                onMouseEnter={e=>e.target.style.color='rgba(167,139,250,.7)'}
                onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.22)'}
              >{t}</a>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span className="dot-pulse-anim" style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', display:'block', flexShrink:0 }} />
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(255,255,255,.25)' }}>All systems operational</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

/* ─── Page Transition Wrapper ────────────────────────────────────────────── */
const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity:0, y:16 }}
        animate={{ opacity:1, y:0 }}
        exit={{ opacity:0, y:-12 }}
        transition={{ duration:.35, ease:[.22,1,.36,1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Public Layout ──────────────────────────────────────────────────────── */
const PublicLayout = () => {
  return (
    <>
      <GlobalStyles />

      {/* Fixed background layers */}
      <div className="layout-bg-orb1" />
      <div className="layout-bg-orb2" />
      <div className="layout-bg-grid" />

      {/* Floating particles */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        {Array.from({length:18},(_,i) => (
          <div key={i} style={{
            position:'absolute',
            left:`${(i*67+13)%100}%`, top:`${(i*41+7)%100}%`,
            width:i%3+1, height:i%3+1,
            borderRadius:'50%', background:'rgba(255,255,255,.45)',
            animation:`float-up ${5+i%5}s ease-in-out ${i*.4}s infinite`,
          }} />
        ))}
        <style>{`@keyframes float-up{0%,100%{transform:translateY(0);opacity:.2}50%{transform:translateY(-24px);opacity:.6}}`}</style>
      </div>

      <div className="layout-root">
        <Navbar />
        <ScrollProgress />

        <main className="layout-main">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        <Footer />
      </div>

      <BackToTop />
    </>
  );
};

export default PublicLayout;