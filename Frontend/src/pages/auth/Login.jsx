import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Redux/authSlice.js';
import { authAPI } from '../../service/apiAuth.js';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { motion } from 'motion/react';

/* ─── Global Styles ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    html,body,#root{background:#060612!important;color:#fff!important;font-family:'DM Sans',sans-serif!important;}
    .auth-page{background:#060612!important;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;font-family:'DM Sans',sans-serif;position:relative;overflow:hidden;}

    @keyframes orb-float{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(40px,-40px) scale(1.1)}75%{transform:translate(-25px,25px) scale(.93)}}
    @keyframes orb-float2{0%,100%{transform:translate(0,0) scale(1)}45%{transform:translate(-35px,30px) scale(1.08)}}
    @keyframes grid-pulse{0%,100%{opacity:.028}50%{opacity:.052}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes float-card{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes border-glow{0%,100%{border-color:rgba(124,58,237,.3);box-shadow:0 0 0 0 rgba(124,58,237,0)}50%{border-color:rgba(124,58,237,.55);box-shadow:0 0 24px rgba(124,58,237,.15)}}

    .auth-orb1{animation:orb-float 20s ease-in-out infinite;position:absolute;top:-15%;left:-10%;width:600px;height:600px;border-radius:50%;background:#7c3aed;filter:blur(130px);opacity:.18;pointer-events:none;}
    .auth-orb2{animation:orb-float2 24s ease-in-out infinite 3s;position:absolute;bottom:-12%;right:-8%;width:520px;height:520px;border-radius:50%;background:#db2777;filter:blur(120px);opacity:.14;pointer-events:none;}
    .auth-orb3{position:absolute;top:40%;left:55%;width:300px;height:300px;border-radius:50%;background:#0ea5e9;filter:blur(100px);opacity:.08;pointer-events:none;}
    .auth-grid{animation:grid-pulse 7s ease-in-out infinite;position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:64px 64px;pointer-events:none;}

    /* Card */
    .auth-card{background:rgba(255,255,255,.045)!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:28px;padding:44px 40px;backdrop-filter:blur(24px);box-shadow:0 32px 80px rgba(0,0,0,.6);width:100%;max-width:440px;position:relative;z-index:2;}

    /* Input */
    .auth-input-wrap{position:relative;}
    .auth-input{width:100%;background:rgba(255,255,255,.07)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:14px;padding:14px 16px 14px 46px;font-family:'DM Sans',sans-serif;font-size:15px;color:#fff!important;outline:none;transition:border-color .25s,box-shadow .25s;box-sizing:border-box;}
    .auth-input::placeholder{color:rgba(255,255,255,.28);}
    .auth-input:focus{border-color:rgba(124,58,237,.6)!important;box-shadow:0 0 0 3px rgba(124,58,237,.15);}
    .auth-input-icon{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.35);pointer-events:none;}
    .auth-input-action{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,.38);cursor:pointer;padding:4px;display:flex;align-items:center;transition:color .2s;}
    .auth-input-action:hover{color:rgba(255,255,255,.7);}

    /* Label */
    .auth-label{display:block;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,.55);margin-bottom:8px;letter-spacing:.3px;}

    /* Submit btn */
    .auth-submit{width:100%;padding:15px 24px;border-radius:14px;border:none;background:linear-gradient(135deg,#7c3aed,#6d28d9)!important;color:#fff!important;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 6px 28px rgba(124,58,237,.4);transition:transform .2s,box-shadow .2s;}
    .auth-submit:hover{transform:scale(1.02);box-shadow:0 8px 40px rgba(124,58,237,.58)!important;}
    .auth-submit:disabled{opacity:.5;cursor:not-allowed;transform:none;}

    /* Quick login */
    .auth-quick-btn{padding:7px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06)!important;color:rgba(255,255,255,.65)!important;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;}
    .auth-quick-btn:hover{background:rgba(255,255,255,.12)!important;color:#fff!important;border-color:rgba(255,255,255,.22)!important;}

    /* Divider */
    .auth-divider{display:flex;align-items:center;gap:14px;margin:24px 0;}
    .auth-divider-line{flex:1;height:1px;background:rgba(255,255,255,.07);}
    .auth-divider-text{font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(255,255,255,.3);}

    /* Auth spinner */
    .auth-spinner{width:20px;height:20px;border-radius:50%;border:2.5px solid rgba(255,255,255,.25);border-top:2.5px solid #fff;animation:spin 1s linear infinite;flex-shrink:0;}

    ::selection{background:rgba(124,58,237,.4);color:#fff;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:#060612;}
    ::-webkit-scrollbar-thumb{background:linear-gradient(#7c3aed,#ec4899);border-radius:4px;}
  `}</style>
);

const Login = () => {
  const [formData, setFormData]     = useState({ email:'', password:'' });
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState('');
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(formData);
      dispatch(loginSuccess({ user:data.data.user, token:data.data.token }));
      toast.success('Login successful!');
      const role = data.data.user.role;
      console.log('User role:', role);
      navigate(role==='admin'?'/admin':role==='seller'?'/seller':'/buyer');
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  };

  const quickLogin = (email, password) => setFormData({ email, password });

  const fields = [
    { name:'email', type:'email', placeholder:'Enter your email', icon:<FiMail size={16}/>, label:'Email Address' },
    { name:'password', type:showPass?'text':'password', placeholder:'Enter your password', icon:<FiLock size={16}/>, label:'Password', action:true },
  ];

  return (
    <div className="auth-page">
      <GlobalStyles />

      {/* Background */}
      <div className="auth-orb1" /><div className="auth-orb2" /><div className="auth-orb3" /><div className="auth-grid" />

      {/* Particles */}
      {Array.from({length:16},(_,i) => (
        <motion.div key={i}
          animate={{ y:[0,-20,0], opacity:[.15,.5,.15] }}
          transition={{ duration:4+i%4, repeat:Infinity, delay:i*.35 }}
          style={{ position:'absolute', left:`${(i*67)%100}%`, top:`${(i*43)%100}%`, width:i%3+1, height:i%3+1, borderRadius:'50%', background:'rgba(255,255,255,.5)', pointerEvents:'none' }}
        />
      ))}

      <motion.div style={{ width:'100%', maxWidth:440, position:'relative', zIndex:2 }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.7, ease:[.22,1,.36,1] }}
          style={{ textAlign:'center', marginBottom:36 }}
        >
          <motion.div
            whileHover={{ rotate:[0,5,-5,0], scale:1.08 }}
            transition={{ duration:.4 }}
            style={{ width:64, height:64, borderRadius:20, background:'linear-gradient(135deg,#7c3aed,#6d28d9)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 32px rgba(124,58,237,.5)', cursor:'pointer' }}
            onClick={() => navigate('/')}
          >
            <span style={{ fontFamily:'Clash Display,sans-serif', fontSize:28, fontWeight:700, color:'#fff' }}>E</span>
          </motion.div>
          <h2 style={{ fontFamily:'Clash Display,sans-serif', fontSize:'clamp(1.7rem,3vw,2.2rem)', fontWeight:700, color:'#fff', marginBottom:8 }}>Welcome Back</h2>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.4)' }}>Sign in to your account</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="auth-card"
          initial={{ opacity:0, y:40, scale:.96 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:.8, ease:[.22,1,.36,1], delay:.15 }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {fields.map((f, i) => (
                <motion.div key={f.name}
                  initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:.25 + i*.1 }}
                >
                  <label className="auth-label">{f.label}</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon" style={{ color: focused===f.name ? '#a78bfa' : 'rgba(255,255,255,.35)', transition:'color .2s' }}>{f.icon}</span>
                    <input
                      className="auth-input"
                      name={f.name} type={f.type}
                      placeholder={f.placeholder}
                      value={formData[f.name]}
                      onChange={handleChange}
                      onFocus={() => setFocused(f.name)}
                      onBlur={() => setFocused('')}
                      required
                    />
                    {f.action && (
                      <button type="button" className="auth-input-action" onClick={() => setShowPass(p=>!p)}>
                        {showPass ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              type="submit" className="auth-submit"
              style={{ marginTop:28 }}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : .98 }}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:.5 }}
            >
              {loading ? <><span className="auth-spinner" /> Signing in…</> : <>Sign In <FiArrowRight size={17}/></>}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div className="auth-divider" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.55 }}>
            <div className="auth-divider-line" />
            <span className="auth-divider-text">New here?</span>
            <div className="auth-divider-line" />
          </motion.div>

          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.6 }} style={{ textAlign:'center' }}>
            <Link to="/register" style={{
              fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600,
              background:'linear-gradient(135deg,#a78bfa,#ec4899)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              textDecoration:'none',
            }}>Create a new account →</Link>
          </motion.div>

          {/* Quick login */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.7 }}
            style={{ marginTop:28, paddingTop:24, borderTop:'1px solid rgba(255,255,255,.07)' }}
          >
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:'rgba(255,255,255,.25)', textAlign:'center', marginBottom:12, letterSpacing:2, textTransform:'uppercase' }}>Quick Login (Testing)</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[
                { label:'👑 Admin', email:'admin@ecommerce.com', pass:'Admin@123' },
                { label:'🛒 Buyer', email:'john@example.com', pass:'password123' },
                { label:'🏪 Seller', email:'techstore@example.com', pass:'password123' },
              ].map(q => (
                <button key={q.label} type="button" className="auth-quick-btn" onClick={() => quickLogin(q.email, q.pass)}>
                  {q.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Back link */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.75 }} style={{ textAlign:'center', marginTop:24 }}>
          <Link to="/" style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.3)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6, transition:'color .2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(167,139,250,.7)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}
          >← Back to Home</Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;