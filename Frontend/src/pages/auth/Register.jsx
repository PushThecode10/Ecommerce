import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Redux/authSlice.js';
import { authAPI } from '../../service/apiAuth.js';
import toast from 'react-hot-toast';
import {
  FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiShoppingBag, FiShoppingCart, FiArrowRight, FiCheck,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Global Styles ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    html,body,#root{background:#060612!important;color:#fff!important;font-family:'DM Sans',sans-serif!important;}
    .reg-page{background:#060612!important;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;font-family:'DM Sans',sans-serif;position:relative;overflow:hidden;}

    @keyframes orb-a{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(40px,-40px) scale(1.1)}75%{transform:translate(-25px,25px) scale(.93)}}
    @keyframes orb-b{0%,100%{transform:translate(0,0) scale(1)}45%{transform:translate(-35px,30px) scale(1.08)}}
    @keyframes grid-pulse{0%,100%{opacity:.028}50%{opacity:.052}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes password-strength{from{width:0}}

    .reg-orb1{animation:orb-a 20s ease-in-out infinite;position:absolute;top:-15%;right:-8%;width:600px;height:600px;border-radius:50%;background:#7c3aed;filter:blur(130px);opacity:.17;pointer-events:none;}
    .reg-orb2{animation:orb-b 24s ease-in-out infinite 2s;position:absolute;bottom:-10%;left:-8%;width:500px;height:500px;border-radius:50%;background:#db2777;filter:blur(120px);opacity:.13;pointer-events:none;}
    .reg-orb3{position:absolute;top:30%;right:10%;width:280px;height:280px;border-radius:50%;background:#10b981;filter:blur(100px);opacity:.07;pointer-events:none;}
    .reg-grid{animation:grid-pulse 7s ease-in-out infinite;position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:64px 64px;pointer-events:none;}

    /* Card */
    .reg-card{background:rgba(255,255,255,.043)!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:28px;padding:44px 40px;backdrop-filter:blur(24px);box-shadow:0 32px 80px rgba(0,0,0,.6);width:100%;max-width:620px;position:relative;z-index:2;}

    /* Role selector */
    .role-btn{flex:1;padding:20px 16px;border-radius:18px;border:2px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05)!important;color:rgba(255,255,255,.6)!important;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .3s ease;text-align:center;}
    .role-btn:hover{border-color:rgba(167,139,250,.35)!important;background:rgba(124,58,237,.08)!important;color:rgba(255,255,255,.85)!important;}
    .role-btn.active{border-color:#7c3aed!important;background:rgba(124,58,237,.15)!important;color:#fff!important;box-shadow:0 0 0 3px rgba(124,58,237,.2),0 8px 30px rgba(124,58,237,.25);}

    /* Input */
    .reg-input-wrap{position:relative;}
    .reg-input{width:100%;background:rgba(255,255,255,.07)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:14px;padding:13px 16px 13px 46px;font-family:'DM Sans',sans-serif;font-size:15px;color:#fff!important;outline:none;transition:border-color .25s,box-shadow .25s;box-sizing:border-box;}
    .reg-input::placeholder{color:rgba(255,255,255,.25);}
    .reg-input:focus{border-color:rgba(124,58,237,.6)!important;box-shadow:0 0 0 3px rgba(124,58,237,.14);}
    .reg-input-no-icon{padding-left:16px!important;}
    .reg-input-icon{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.33);pointer-events:none;transition:color .2s;}
    .reg-input-action{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,.35);cursor:pointer;padding:4px;display:flex;align-items:center;transition:color .2s;}
    .reg-input-action:hover{color:rgba(255,255,255,.7);}

    /* Label */
    .reg-label{display:block;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,.5);margin-bottom:8px;letter-spacing:.3px;}

    /* Seller box */
    .seller-box{background:rgba(124,58,237,.08)!important;border:1px solid rgba(124,58,237,.22)!important;border-radius:18px;padding:22px 20px;margin-top:4px;}

    /* Submit */
    .reg-submit{width:100%;padding:15px 24px;border-radius:14px;border:none;background:linear-gradient(135deg,#7c3aed,#6d28d9)!important;color:#fff!important;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 6px 28px rgba(124,58,237,.4);transition:transform .2s,box-shadow .2s;}
    .reg-submit:hover{transform:scale(1.02);box-shadow:0 8px 40px rgba(124,58,237,.58)!important;}
    .reg-submit:disabled{opacity:.5;cursor:not-allowed;transform:none;}

    /* Password strength */
    .pw-bar-track{height:4px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden;margin-top:8px;}
    .pw-bar-fill{height:100%;border-radius:4px;transition:width .4s ease,background .4s ease;}

    /* Divider */
    .auth-divider{display:flex;align-items:center;gap:14px;margin:24px 0;}
    .auth-divider-line{flex:1;height:1px;background:rgba(255,255,255,.07);}

    /* Spinner */
    .reg-spinner{width:20px;height:20px;border-radius:50%;border:2.5px solid rgba(255,255,255,.25);border-top:2.5px solid #fff;animation:spin 1s linear infinite;flex-shrink:0;}

    /* Grid 2 col */
    .reg-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
    @media(max-width:520px){.reg-2col{grid-template-columns:1fr;}.reg-card{padding:32px 22px;}}

    ::selection{background:rgba(124,58,237,.4);color:#fff;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:#060612;}
    ::-webkit-scrollbar-thumb{background:linear-gradient(#7c3aed,#ec4899);border-radius:4px;}
  `}</style>
);

/* ─── Password Strength ─────────────────────────────────────────────────── */
const PasswordStrength = ({ password }) => {
  const strength = !password ? 0
    : password.length < 6 ? 1
    : password.length < 10 && !/[!@#$%^&*]/.test(password) ? 2
    : password.length >= 10 && /[!@#$%^&*]/.test(password) && /[A-Z]/.test(password) ? 4 : 3;
  const labels = ['','Weak','Fair','Strong','Excellent'];
  const colors = ['','#ef4444','#f59e0b','#10b981','#7c3aed'];
  if (!password) return null;
  return (
    <div>
      <div className="pw-bar-track">
        <motion.div className="pw-bar-fill"
          animate={{ width:`${strength*25}%`, background:colors[strength] }}
          transition={{ duration:.4 }}
        />
      </div>
      <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:colors[strength], marginTop:4, fontWeight:600 }}>{labels[strength]}</p>
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    name:'', email:'', password:'', confirmPassword:'',
    role:'buyer', shopName:'', specialization:'',
  });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [focused, setFocused]     = useState('');
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRole   = role => setFormData({ ...formData, role, shopName:'', specialization:'' });

  const validate = () => {
    if (formData.password.length < 6)      { toast.error('Password must be at least 6 characters'); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return false; }
    if (formData.role==='seller') {
      if (!formData.shopName.trim())        { toast.error('Shop name is required'); return false; }
      if (!formData.specialization.trim())  { toast.error('Specialization is required'); return false; }
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { name:formData.name, email:formData.email, password:formData.password, role:formData.role };
      if (formData.role==='seller') { payload.shopName=formData.shopName; payload.specialization=formData.specialization; }
      const { data } = await authAPI.register(payload);
      dispatch(loginSuccess({ user:data.data.user, token:data.data.token }));
      toast.success('Registration successful!');
      const role = data.data.user.role;
      if (role==='seller') { toast.info('Seller account pending approval'); navigate('/seller'); }
      else navigate('/buyer');
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  };

  // Field configs
  const baseFields = [
    { name:'name',  type:'text',  placeholder:'Enter your full name', icon:<FiUser size={15}/>,  label:'Full Name' },
    { name:'email', type:'email', placeholder:'Enter your email',     icon:<FiMail size={15}/>,  label:'Email Address' },
  ];
  const passFields = [
    { name:'password',        label:'Password',         placeholder:'Min 6 characters',  action:true },
    { name:'confirmPassword', label:'Confirm Password', placeholder:'Repeat password',   action:false },
  ];

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="reg-page">
      <GlobalStyles />
      <div className="reg-orb1"/><div className="reg-orb2"/><div className="reg-orb3"/><div className="reg-grid"/>

      {/* Particles */}
      {Array.from({length:14},(_,i) => (
        <motion.div key={i}
          animate={{ y:[0,-22,0], opacity:[.12,.45,.12] }}
          transition={{ duration:4+i%5, repeat:Infinity, delay:i*.3 }}
          style={{ position:'absolute', left:`${(i*73)%100}%`, top:`${(i*41)%100}%`, width:i%3+1, height:i%3+1, borderRadius:'50%', background:'rgba(255,255,255,.5)', pointerEvents:'none' }}
        />
      ))}

      <motion.div style={{ width:'100%', maxWidth:620, position:'relative', zIndex:2 }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity:0, y:-28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.7, ease:[.22,1,.36,1] }}
          style={{ textAlign:'center', marginBottom:32 }}
        >
          <motion.div
            whileHover={{ rotate:[0,5,-5,0], scale:1.08 }}
            transition={{ duration:.4 }}
            style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#7c3aed,#6d28d9)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', boxShadow:'0 8px 32px rgba(124,58,237,.5)', cursor:'pointer' }}
            onClick={() => navigate('/')}
          >
            <span style={{ fontFamily:'Clash Display,sans-serif', fontSize:26, fontWeight:700, color:'#fff' }}>E</span>
          </motion.div>
          <h2 style={{ fontFamily:'Clash Display,sans-serif', fontSize:'clamp(1.7rem,3vw,2.2rem)', fontWeight:700, color:'#fff', marginBottom:8 }}>Create Account</h2>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.38)' }}>Join our marketplace today</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="reg-card"
          initial={{ opacity:0, y:40, scale:.96 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:.8, ease:[.22,1,.36,1], delay:.1 }}
        >
          <form onSubmit={handleSubmit}>

            {/* Role selector */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }} style={{ marginBottom:28 }}>
              <label className="reg-label" style={{ marginBottom:12 }}>I want to</label>
              <div style={{ display:'flex', gap:12 }}>
                {[
                  { role:'buyer',  icon:<FiShoppingCart size={26}/>, title:'Buy Products', sub:'Browse & purchase' },
                  { role:'seller', icon:<FiShoppingBag  size={26}/>, title:'Sell Products', sub:'Start your business' },
                ].map((r,i) => (
                  <motion.button key={r.role} type="button"
                    className={`role-btn ${formData.role===r.role?'active':''}`}
                    onClick={() => handleRole(r.role)}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:.25+i*.08 }}
                  >
                    <div style={{ marginBottom:10, color: formData.role===r.role ? '#a78bfa' : 'rgba(255,255,255,.4)', transition:'color .3s' }}>{r.icon}</div>
                    <div style={{ fontFamily:'Clash Display,sans-serif', fontWeight:600, fontSize:15, marginBottom:4 }}>{r.title}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.4)', fontFamily:'DM Sans,sans-serif' }}>{r.sub}</div>
                    {formData.role===r.role && (
                      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} style={{ position:'absolute', top:12, right:12, width:20, height:20, borderRadius:'50%', background:'#7c3aed', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <FiCheck size={12} color="#fff" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Name + Email */}
            <motion.div className="reg-2col" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }} style={{ marginBottom:18 }}>
              {baseFields.map((f,i) => (
                <div key={f.name}>
                  <label className="reg-label">{f.label}</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon" style={{ color: focused===f.name ? '#a78bfa' : 'rgba(255,255,255,.33)' }}>{f.icon}</span>
                    <input className="reg-input" name={f.name} type={f.type} placeholder={f.placeholder}
                      value={formData[f.name]} onChange={handleChange}
                      onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused('')} required />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Seller fields */}
            <AnimatePresence>
              {formData.role==='seller' && (
                <motion.div
                  initial={{ opacity:0, height:0, y:-10 }}
                  animate={{ opacity:1, height:'auto', y:0 }}
                  exit={{ opacity:0, height:0, y:-10 }}
                  transition={{ duration:.4, ease:[.22,1,.36,1] }}
                  style={{ overflow:'hidden', marginBottom:18 }}
                >
                  <div className="seller-box">
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:600, color:'#a78bfa', letterSpacing:3, textTransform:'uppercase', marginBottom:16 }}>Shop Details</p>
                    <div className="reg-2col">
                      {[
                        { name:'shopName', label:'Shop Name', placeholder:'e.g., Tech Gadgets Store' },
                        { name:'specialization', label:'Specialization', placeholder:'e.g., Electronics' },
                      ].map(f => (
                        <div key={f.name}>
                          <label className="reg-label">{f.label} <span style={{ color:'#ec4899' }}>*</span></label>
                          <input className="reg-input reg-input-no-icon" name={f.name} type="text"
                            placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange}
                            required={formData.role==='seller'} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password fields */}
            <motion.div className="reg-2col" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.38 }} style={{ marginBottom:28 }}>
              {passFields.map((f,i) => (
                <div key={f.name}>
                  <label className="reg-label">{f.label}</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon" style={{ color: focused===f.name ? '#a78bfa' : 'rgba(255,255,255,.33)' }}><FiLock size={15}/></span>
                    <input className="reg-input" name={f.name} type={showPass?'text':'password'}
                      placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange}
                      onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused('')} required />
                    {f.action && (
                      <button type="button" className="reg-input-action" onClick={()=>setShowPass(p=>!p)}>
                        {showPass ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
                      </button>
                    )}
                    {!f.action && formData.confirmPassword && (
                      <span style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', color: passwordsMatch ? '#10b981' : '#ef4444' }}>
                        {passwordsMatch ? <FiCheck size={15}/> : '✕'}
                      </span>
                    )}
                  </div>
                  {f.action && <PasswordStrength password={formData.password} />}
                </div>
              ))}
            </motion.div>

            {/* Submit */}
            <motion.button type="submit" className="reg-submit" disabled={loading}
              whileHover={{ scale: loading?1:1.02 }} whileTap={{ scale: loading?1:.98 }}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.48 }}
            >
              {loading
                ? <><span className="reg-spinner" /> Creating account…</>
                : <>{formData.role==='seller' ? 'Create Seller Account' : 'Create Buyer Account'} <FiArrowRight size={17}/></>
              }
            </motion.button>
          </form>

          {/* Divider + login link */}
          <motion.div className="auth-divider" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.55 }}>
            <div className="auth-divider-line" />
            <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(255,255,255,.28)' }}>Already have an account?</span>
            <div className="auth-divider-line" />
          </motion.div>

          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.6 }} style={{ textAlign:'center' }}>
            <Link to="/login" style={{
              fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600,
              background:'linear-gradient(135deg,#a78bfa,#ec4899)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              textDecoration:'none',
            }}>Sign in instead →</Link>
          </motion.div>
        </motion.div>

        {/* Back */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.7 }} style={{ textAlign:'center', marginTop:24 }}>
          <Link to="/" style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.28)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(167,139,250,.7)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.28)'}
          >← Back to Home</Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;