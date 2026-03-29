import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload, FiArrowLeft, FiCheck, FiX, FiTag, FiFileText, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({ baseURL: API_URL, withCredentials: true });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ══════════════════════════════════════════════════════
   Matches Dashboard palette:
   Deep bg:  #1a0a00 | Primary: #dc2626 | Accent: #f97316 | Light: #ffedd5
══════════════════════════════════════════════════════ */

const EMOJI_PRESETS = [
  '📱','💻','👗','👠','📚','🏡','⚽','🧸','💄','🚗',
  '🎮','🍕','🎧','⌚','📷','🌿','🎨','🧴','🛒','💎',
  '🔧','🎁','🏋️','🌸','🎵',
];

const COLOR_PRESETS = ['#dc2626','#f97316','#fbbf24','#10b981','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    .cf-page {
      min-height: 100vh;
      background: #1a0a00;
      font-family: 'DM Sans', sans-serif;
      color: #ffedd5;
      position: relative;
      overflow-x: hidden;
    }

    /* ── Animations ── */
    @keyframes orb-a   { 0%,100%{transform:translate(0,0)scale(1)} 40%{transform:translate(45px,-40px)scale(1.12)} 75%{transform:translate(-30px,28px)scale(.92)} }
    @keyframes orb-b   { 0%,100%{transform:translate(0,0)scale(1)} 45%{transform:translate(-38px,32px)scale(1.09)} }
    @keyframes grid-p  { 0%,100%{opacity:.04} 50%{opacity:.08} }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes pulse-d { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.5} }
    @keyframes grad-sh { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes float-p { 0%,100%{transform:translateY(0);opacity:.15} 50%{transform:translateY(-22px);opacity:.5} }

    .orb-a-anim { animation: orb-a 24s ease-in-out infinite; }
    .orb-b-anim { animation: orb-b 28s ease-in-out infinite 3s; }
    .grid-anim  { animation: grid-p 8s ease-in-out infinite; }
    .dot-pulse  { animation: pulse-d 1.8s ease-in-out infinite; }
    .float-p    { animation: float-p var(--dur,5s) ease-in-out var(--delay,0s) infinite; }

    .font-clash { font-family: 'Clash Display', sans-serif !important; }
    .font-dm    { font-family: 'DM Sans', sans-serif !important; }

    .animated-grad {
      background: linear-gradient(270deg, #dc2626, #f97316, #ffedd5, #f97316, #dc2626);
      background-size: 400% 400%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: grad-sh 5s ease infinite;
    }

    /* ── Form card ── */
    .cf-card {
      background: rgba(255,237,213,.04);
      border: 1px solid rgba(220,38,38,.22);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,.5), 0 0 0 1px rgba(220,38,38,.08);
    }

    /* ── Input ── */
    .cf-input {
      width: 100%;
      padding: 14px 18px;
      border-radius: 14px;
      background: rgba(255,237,213,.06);
      border: 1px solid rgba(255,237,213,.13);
      color: #ffedd5;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color .2s, box-shadow .2s, background .2s;
    }
    .cf-input:focus {
      border-color: rgba(220,38,38,.55);
      background: rgba(255,237,213,.08);
      box-shadow: 0 0 0 3px rgba(220,38,38,.12);
    }
    .cf-input::placeholder { color: rgba(255,237,213,.22); }

    /* ── Label ── */
    .cf-label {
      display: flex;
      align-items: center;
      gap: 7px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,237,213,.45);
      margin-bottom: 10px;
    }

    /* ── Section block ── */
    .cf-section {
      background: rgba(255,237,213,.03);
      border: 1px solid rgba(255,237,213,.07);
      border-radius: 20px;
      padding: 22px;
    }

    /* ── Upload zone ── */
    .upload-zone {
      border: 2px dashed rgba(220,38,38,.3);
      border-radius: 16px;
      padding: 36px 24px;
      text-align: center;
      cursor: pointer;
      transition: border-color .25s, background .25s;
    }
    .upload-zone:hover {
      border-color: rgba(220,38,38,.65);
      background: rgba(220,38,38,.05);
    }

    /* ── Emoji button ── */
    .emoji-btn {
      display: flex; align-items: center; justify-content: center;
      height: 38px; border-radius: 10px; border: 1px solid transparent;
      font-size: 19px; cursor: pointer; transition: all .15s;
      background: rgba(255,237,213,.04);
    }
    .emoji-btn:hover  { background: rgba(255,237,213,.1); transform: scale(1.15); }
    .emoji-btn.active { background: rgba(220,38,38,.22); border-color: rgba(220,38,38,.5); }

    /* ── Buttons ── */
    .btn-primary {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      border: none;
      box-shadow: 0 6px 28px rgba(220,38,38,.45), inset 0 1px 0 rgba(255,255,255,.15);
      transition: transform .2s, box-shadow .2s;
      cursor: pointer;
    }
    .btn-primary:hover:not(:disabled) {
      transform: scale(1.03) translateY(-1px);
      box-shadow: 0 10px 40px rgba(220,38,38,.6);
    }
    .btn-primary:disabled { opacity: .55; cursor: not-allowed; }

    .btn-ghost {
      background: rgba(255,237,213,.07);
      border: 1px solid rgba(255,237,213,.15);
      color: rgba(255,237,213,.6);
      cursor: pointer;
      transition: background .2s, transform .2s;
    }
    .btn-ghost:hover { background: rgba(255,237,213,.13); transform: scale(1.02); }

    /* ── Back link ── */
    .back-link {
      display: inline-flex; align-items: center; gap: 8px;
      color: rgba(255,237,213,.4);
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: color .2s, gap .2s;
      border: none; background: none; padding: 0;
    }
    .back-link:hover { color: rgba(255,237,213,.75); gap: 12px; }

    /* ── Step indicator ── */
    .step-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 14px; border-radius: 40px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* ── Drag feedback ── */
    .drag-over .upload-zone {
      border-color: rgba(220,38,38,.8);
      background: rgba(220,38,38,.08);
    }

    ::selection { background: rgba(220,38,38,.4); color: #ffedd5; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #1a0a00; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#dc2626,#f97316); border-radius: 4px; }
  `}</style>
);

/* ─── Spinner ────────────────────────────────────────────────────────────── */
const Spinner = ({ size = 18 }) => (
  <svg style={{ width:size, height:size, animation:'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.25)" strokeWidth="3" />
    <path fill="white" opacity=".85" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

/* ─── CategoryForm ───────────────────────────────────────────────────────── */
const CategoryForm = () => {
  const navigate   = useNavigate();
  const { id }     = useParams();
  const fileRef    = useRef(null);
  const dropRef    = useRef(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: '#dc2626',
  });
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading,      setLoading]      = useState(!!id);
  const [submitting,   setSubmitting]   = useState(false);
  const [dragOver,     setDragOver]     = useState(false);

  /* ── Load category for edit ── */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await api.get(`/categories/${id}`);
        // Support both data.data.category and data.data shapes
        const cat = data.data?.category ?? data.data ?? data;
        setForm({
          name:        cat.name        || '',
          description: cat.description || '',
          icon:        cat.icon        || '📦',
          color:       cat.color       || '#dc2626',
        });
        // ✅ FIX: handle image as object { url } OR plain string
        const rawUrl = cat.image?.url ?? cat.image ?? '';
        if (rawUrl) {
          setImagePreview(rawUrl.startsWith('http') ? rawUrl : `http://localhost:3000${rawUrl}`);
        }
      } catch {
        toast.error('Failed to load category');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── Image helpers ── */
  const applyFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error('Image must be under 5MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    applyFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())        { toast.error('Category name is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required');   return; }
    if (!id && !imageFile)        { toast.error('Please upload a category image'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name',        form.name.trim());
      fd.append('description', form.description.trim());
      fd.append('icon',        form.icon);
      fd.append('color',       form.color);
      // ✅ FIX: field name must be 'image' to match your uploadCategoryImage middleware
      if (imageFile) fd.append('image', imageFile);

      if (id) {
        await api.put(`/categories/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated!');
      } else {
        await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created!');
      }
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#1a0a00', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Styles />
        <div style={{ textAlign:'center' }}>
          <Spinner size={44} />
          <p className="font-dm mt-4 text-sm" style={{ color:'rgba(255,237,213,.4)' }}>Loading category…</p>
        </div>
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className="cf-page">
      <Styles />

      {/* ── Ambient orbs ── */}
      <div className="orb-a-anim" style={{ position:'fixed', top:'-10%', right:'-6%', width:580, height:580, borderRadius:'50%', background:'#dc2626', filter:'blur(140px)', opacity:.16, pointerEvents:'none', zIndex:0 }} />
      <div className="orb-b-anim" style={{ position:'fixed', bottom:'-8%', left:'-8%', width:480, height:480, borderRadius:'50%', background:'#f97316', filter:'blur(130px)', opacity:.12, pointerEvents:'none', zIndex:0 }} />

      {/* ── Grid ── */}
      <div className="grid-anim" style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,237,213,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,237,213,.04) 1px,transparent 1px)', backgroundSize:'64px 64px' }} />

      {/* ── Particles ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        {Array.from({length:14},(_,i) => (
          <div key={i} className="float-p" style={{
            position:'absolute',
            left:`${(i*67+13)%100}%`, top:`${(i*43+7)%100}%`,
            width:`${i%3+1}px`, height:`${i%3+1}px`,
            borderRadius:'50%',
            background: i%3===0?'rgba(220,38,38,.6)':i%3===1?'rgba(249,115,22,.55)':'rgba(255,237,213,.45)',
            '--dur':`${5+i%5}s`, '--delay':`${i*.35}s`,
          }} />
        ))}
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ position:'relative', zIndex:2, maxWidth:640, margin:'0 auto', padding:'40px 20px 80px' }}>

        {/* Back */}
        <motion.button
          className="back-link mb-8"
          onClick={() => navigate(-1)}
          initial={{ opacity:0, x:-12 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:.4 }}
        >
          <FiArrowLeft size={16} /> Back to Categories
        </motion.button>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.55, ease:[.22,1,.36,1] }}
          style={{ marginBottom:32 }}
        >
          {/* Eyebrow pill */}
          <div className="step-pill mb-4"
            style={{ background:'rgba(220,38,38,.15)', border:'1px solid rgba(220,38,38,.3)', color:'#fca5a5' }}
          >
            <span className="dot-pulse" style={{ width:7, height:7, borderRadius:'50%', background:'#dc2626', display:'block' }} />
            {id ? 'Edit Category' : 'New Category'}
          </div>

          <h1 className="font-clash font-bold" style={{ fontSize:'clamp(2rem,5vw,2.8rem)', lineHeight:1.1, margin:0 }}>
            <span style={{ color:'rgba(255,237,213,.65)' }}>{id ? 'Update ' : 'Create '}</span>
            <span className="animated-grad">{id ? 'Category' : 'New Category'}</span>
          </h1>
          <p className="font-dm text-sm mt-2" style={{ color:'rgba(255,237,213,.35)' }}>
            {id ? 'Modify the details of this category.' : 'Add a new product category to your store.'}
          </p>
        </motion.div>

        {/* ── Form card ── */}
        <form onSubmit={handleSubmit}>
          <div className="cf-card" style={{ display:'flex', flexDirection:'column', gap:0 }}>

            {/* Card header stripe */}
            <div style={{ background:'linear-gradient(135deg,rgba(220,38,38,.18),rgba(249,115,22,.1),rgba(255,237,213,.04))', borderBottom:'1px solid rgba(220,38,38,.18)', padding:'24px 32px' }}>
              <p className="font-clash font-bold text-lg" style={{ color:'#ffedd5', margin:0 }}>Category Details</p>
              <p className="font-dm text-xs mt-1" style={{ color:'rgba(255,237,213,.33)' }}>Fill in the information below</p>
            </div>

            <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:24 }}>

              {/* ── Name ── */}
              <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.12 }}>
                <label className="cf-label">
                  <FiTag size={12} style={{ color:'#dc2626' }} /> Category Name *
                </label>
                <input
                  className="cf-input"
                  type="text"
                  placeholder="e.g. Electronics, Fashion, Home & Garden…"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                />
              </motion.div>

              {/* ── Description ── */}
              <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.18 }}>
                <label className="cf-label">
                  <FiFileText size={12} style={{ color:'#f97316' }} /> Description *
                </label>
                <textarea
                  className="cf-input"
                  rows={3}
                  style={{ resize:'none' }}
                  placeholder="Describe what products belong to this category…"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </motion.div>

              {/* ── Icon + Color row ── */}
              <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.24 }}
                style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}
              >
                {/* Icon */}
                <div className="cf-section">
                  <label className="cf-label" style={{ marginBottom:12 }}>Emoji Icon</label>
                  {/* Preview */}
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, padding:'10px 14px', borderRadius:12, background:'rgba(255,237,213,.06)', border:'1px solid rgba(255,237,213,.1)' }}>
                    <span style={{ fontSize:26 }}>{form.icon}</span>
                    <span className="font-dm text-xs" style={{ color:'rgba(255,237,213,.4)' }}>Selected</span>
                  </div>
                  {/* Emoji grid */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:4 }}>
                    {EMOJI_PRESETS.map(em => (
                      <button key={em} type="button"
                        className={`emoji-btn ${form.icon === em ? 'active' : ''}`}
                        onClick={() => setForm(p => ({ ...p, icon: em }))}
                      >{em}</button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="cf-section">
                  <label className="cf-label" style={{ marginBottom:12 }}>Accent Color</label>
                  {/* Color preview swatch */}
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, padding:'10px 14px', borderRadius:12, background:'rgba(255,237,213,.06)', border:'1px solid rgba(255,237,213,.1)' }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:form.color, boxShadow:`0 2px 8px ${form.color}55` }} />
                    <span className="font-dm text-xs" style={{ color:'rgba(255,237,213,.4)' }}>{form.color}</span>
                  </div>
                  {/* Native picker */}
                  <input type="color" value={form.color}
                    onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                    style={{ width:'100%', height:44, borderRadius:10, border:'1px solid rgba(255,237,213,.13)', background:'transparent', cursor:'pointer', padding:'3px', marginBottom:12 }}
                  />
                  {/* Preset swatches */}
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    {COLOR_PRESETS.map(c => (
                      <button key={c} type="button"
                        onClick={() => setForm(p => ({ ...p, color: c }))}
                        style={{
                          width:26, height:26, borderRadius:'50%', background:c,
                          border: form.color === c ? '2.5px solid white' : '2.5px solid transparent',
                          cursor:'pointer', transition:'transform .15s',
                          boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform='scale(1.2)'}
                        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── Image Upload ── */}
              <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.3 }}>
                <label className="cf-label">
                  <FiImage size={12} style={{ color:'#fbbf24' }} /> Category Image {!id && '*'}
                </label>

                <input ref={fileRef} type="file" accept="image/*" className="hidden" style={{ display:'none' }}
                  onChange={e => applyFile(e.target.files?.[0])}
                />

                <AnimatePresence mode="wait">
                  {imagePreview ? (
                    /* Image preview */
                    <motion.div key="preview"
                      initial={{ opacity:0, scale:.96 }} animate={{ opacity:1, scale:1 }}
                      exit={{ opacity:0, scale:.96 }} transition={{ duration:.25 }}
                      style={{ position:'relative', borderRadius:16, overflow:'hidden', border:'1px solid rgba(220,38,38,.3)' }}
                    >
                      <img src={imagePreview} alt="Preview"
                        style={{ width:'100%', height:180, objectFit:'cover', display:'block' }}
                      />
                      {/* Overlay */}
                      <div style={{
                        position:'absolute', inset:0,
                        background:'linear-gradient(to top, rgba(26,10,0,.85) 0%, transparent 55%)',
                      }} />
                      {/* Controls */}
                      <div style={{ position:'absolute', bottom:14, left:14, right:14, display:'flex', gap:10 }}>
                        <button type="button"
                          onClick={() => fileRef.current?.click()}
                          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px 0', borderRadius:10, background:'rgba(249,115,22,.85)', border:'none', color:'white', fontSize:12, fontFamily:'DM Sans,sans-serif', fontWeight:600, cursor:'pointer', backdropFilter:'blur(8px)' }}
                        >
                          <FiUpload size={13} /> Change
                        </button>
                        <button type="button"
                          onClick={removeImage}
                          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px 0', borderRadius:10, background:'rgba(220,38,38,.85)', border:'none', color:'white', fontSize:12, fontFamily:'DM Sans,sans-serif', fontWeight:600, cursor:'pointer', backdropFilter:'blur(8px)' }}
                        >
                          <FiX size={13} /> Remove
                        </button>
                      </div>
                      {/* Corner badge */}
                      <div style={{ position:'absolute', top:12, right:12, padding:'4px 10px', borderRadius:20, background:'rgba(220,38,38,.75)', backdropFilter:'blur(6px)', fontSize:10, fontFamily:'DM Sans,sans-serif', fontWeight:700, color:'white', letterSpacing:1 }}>
                        ✓ IMAGE SET
                      </div>
                    </motion.div>
                  ) : (
                    /* Drop zone */
                    <motion.div key="dropzone"
                      ref={dropRef}
                      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                      onClick={() => fileRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                    >
                      <div style={{ width:56, height:56, borderRadius:16, background:'rgba(220,38,38,.15)', border:'1px solid rgba(220,38,38,.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                        <FiUpload size={22} style={{ color:'#dc2626' }} />
                      </div>
                      <p className="font-clash font-semibold text-base" style={{ color:'rgba(255,237,213,.7)', marginBottom:6 }}>
                        {dragOver ? 'Drop it!' : 'Upload Image'}
                      </p>
                      <p className="font-dm text-xs" style={{ color:'rgba(255,237,213,.28)' }}>
                        Click or drag & drop · PNG, JPG up to 5MB
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── Preview card ── */}
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.38 }}>
                <label className="cf-label" style={{ marginBottom:12 }}>Live Preview</label>
                <div style={{
                  borderRadius:18, overflow:'hidden',
                  background:'rgba(255,237,213,.05)',
                  border:`1px solid ${form.color}35`,
                  boxShadow:`0 8px 32px ${form.color}18`,
                  display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                }}>
                  {imagePreview ? (
                    <div style={{ width:56, height:56, borderRadius:14, overflow:'hidden', flexShrink:0 }}>
                      <img src={imagePreview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width:56, height:56, borderRadius:14, flexShrink:0, background:`${form.color}22`, border:`1px solid ${form.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
                      {form.icon}
                    </div>
                  )}
                  <div style={{ flex:1, minWidth:0 }}>
                    <p className="font-clash font-bold text-base" style={{ color:'#ffedd5', margin:0 }}>
                      {form.name || 'Category Name'}
                    </p>
                    <p className="font-dm text-xs mt-1" style={{ color:'rgba(255,237,213,.38)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {form.description || 'Your category description…'}
                    </p>
                  </div>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:form.color, flexShrink:0, boxShadow:`0 0 0 3px ${form.color}35` }} />
                </div>
              </motion.div>

            </div>

            {/* ── Footer actions ── */}
            <div style={{ padding:'24px 32px', borderTop:'1px solid rgba(255,237,213,.07)', display:'flex', gap:14 }}>
              <button type="button" onClick={() => navigate(-1)}
                className="btn-ghost font-dm font-semibold text-sm"
                style={{ flex:1, padding:'14px 0', borderRadius:14, fontSize:14 }}
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="btn-primary font-clash font-bold text-sm text-white"
                style={{ flex:2, padding:'14px 0', borderRadius:14, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
              >
                {submitting ? (
                  <><Spinner size={16} /> {id ? 'Updating…' : 'Creating…'}</>
                ) : (
                  <><FiCheck size={16} /> {id ? 'Update Category' : 'Create Category'}</>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;