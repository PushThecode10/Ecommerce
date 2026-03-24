import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sellerAPI } from '../../service/apiAuth.js';
import toast from 'react-hot-toast';
import {
  FiUpload, FiX, FiSave, FiPackage, FiDollarSign,
  FiImage, FiList, FiTag, FiArrowLeft, FiCheck,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    html,body,#root{background:#1a0a00!important;color:#ffedd5!important;font-family:'DM Sans',sans-serif!important;}
    .ep-page{background:#1a0a00!important;min-height:100vh;color:#ffedd5;position:relative;}
    .font-clash{font-family:'Clash Display',sans-serif!important;}

    @keyframes orb-a{0%,100%{transform:translate(0,0)scale(1)}40%{transform:translate(45px,-38px)scale(1.1)}75%{transform:translate(-28px,25px)scale(.93)}}
    @keyframes orb-b{0%,100%{transform:translate(0,0)scale(1)}45%{transform:translate(-36px,30px)scale(1.08)}}
    @keyframes grid-p{0%,100%{opacity:.04}50%{opacity:.08}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes float-up{0%,100%{transform:translateY(0);opacity:.15}50%{transform:translateY(-20px);opacity:.5}}
    @keyframes border-dance{0%,100%{border-color:rgba(220,38,38,.3)}50%{border-color:rgba(249,115,22,.6)}}

    .orb-a-anim{animation:orb-a 24s ease-in-out infinite;}
    .orb-b-anim{animation:orb-b 28s ease-in-out infinite 3s;}
    .grid-anim{animation:grid-p 8s ease-in-out infinite;}
    .float-p{animation:float-up var(--dur,5s) ease-in-out var(--delay,0s) infinite;}
    .spinner{animation:spin 1s linear infinite;}

    .sec-card{background:linear-gradient(135deg,rgba(220,38,38,.08),rgba(249,115,22,.05),rgba(255,237,213,.03))!important;border:1px solid rgba(220,38,38,.2)!important;border-radius:22px;padding:28px;animation:border-dance 5s ease-in-out infinite;}
    .ep-input{width:100%;background:rgba(255,237,213,.07)!important;border:1px solid rgba(220,38,38,.25)!important;border-radius:12px;padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:14px;color:#ffedd5!important;outline:none;transition:border-color .25s,box-shadow .25s;}
    .ep-input::placeholder{color:rgba(255,237,213,.28);}
    .ep-input:focus{border-color:rgba(220,38,38,.7)!important;box-shadow:0 0 0 3px rgba(220,38,38,.15);}
    .ep-input option{background:#2a1000;color:#ffedd5;}

    .upload-zone{background:rgba(220,38,38,.06)!important;border:2px dashed rgba(220,38,38,.35)!important;border-radius:16px;padding:32px;text-align:center;cursor:pointer;transition:all .3s;}
    .upload-zone:hover{background:rgba(220,38,38,.1)!important;border-color:rgba(220,38,38,.6)!important;}

    .img-preview{border-radius:14px;overflow:hidden;position:relative;border:2px solid rgba(220,38,38,.25);transition:border-color .25s,transform .25s;}
    .img-preview:hover{border-color:rgba(220,38,38,.6);transform:scale(1.03);}
    .img-preview img{width:100%;height:110px;object-fit:cover;display:block;}

    .spec-row{display:flex;align-items:center;justify-content:space-between;background:rgba(255,237,213,.06);border:1px solid rgba(255,237,213,.1);border-radius:11px;padding:10px 14px;margin-bottom:8px;transition:background .2s;}
    .spec-row:hover{background:rgba(255,237,213,.1);}

    .tag-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(220,38,38,.18);border:1px solid rgba(220,38,38,.35);color:#fca5a5;border-radius:20px;padding:5px 12px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;}

    .btn-red{background:linear-gradient(135deg,#dc2626,#b91c1c)!important;border:none!important;color:#fff!important;font-family:'DM Sans',sans-serif;font-weight:700;border-radius:12px;cursor:pointer;box-shadow:0 4px 20px rgba(220,38,38,.4);transition:transform .2s,box-shadow .2s;}
    .btn-red:hover{transform:scale(1.04);box-shadow:0 6px 30px rgba(220,38,38,.6)!important;}
    .btn-red:disabled{opacity:.5;cursor:not-allowed;transform:none;}
    .btn-ghost-warm{background:rgba(255,237,213,.08)!important;border:1px solid rgba(255,237,213,.18)!important;color:rgba(255,237,213,.8)!important;font-family:'DM Sans',sans-serif;font-weight:600;border-radius:12px;cursor:pointer;transition:all .2s;}
    .btn-ghost-warm:hover{background:rgba(255,237,213,.15)!important;color:#ffedd5!important;}
    .btn-add-sm{background:rgba(220,38,38,.18)!important;border:1px solid rgba(220,38,38,.35)!important;color:#fca5a5!important;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;border-radius:10px;padding:10px 18px;cursor:pointer;white-space:nowrap;transition:all .2s;}
    .btn-add-sm:hover{background:rgba(220,38,38,.3)!important;}
    .sec-icon{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,#dc2626,#b91c1c);box-shadow:0 4px 14px rgba(220,38,38,.4);}
    .ep-label{display:block;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,237,213,.45);margin-bottom:8px;}
    .ep-label span{color:#dc2626;}
    .grad-text{background:linear-gradient(135deg,#dc2626,#f97316,#ffedd5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

    .skeleton{background:rgba(255,237,213,.06);border-radius:14px;position:relative;overflow:hidden;}
    .skeleton::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,237,213,.1),transparent);background-size:400px 100%;animation:shimmer 1.6s ease-in-out infinite;}

    ::selection{background:rgba(220,38,38,.4);color:#ffedd5;}
    ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#1a0a00;}::-webkit-scrollbar-thumb{background:linear-gradient(#dc2626,#f97316);border-radius:4px;}
  `}</style>
);

const BG = () => (
  <>
    <div className="orb-a-anim fixed pointer-events-none z-0 rounded-full blur-[140px]" style={{ top:'-10%', right:'-5%', width:580, height:580, background:'#dc2626', opacity:.16 }}/>
    <div className="orb-b-anim fixed pointer-events-none z-0 rounded-full blur-[130px]" style={{ bottom:'-8%', left:'-7%', width:520, height:520, background:'#f97316', opacity:.12 }}/>
    <div className="grid-anim fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage:'linear-gradient(rgba(255,237,213,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,237,213,.035) 1px,transparent 1px)', backgroundSize:'64px 64px' }}/>
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({length:12},(_,i)=>(
        <div key={i} className="float-p absolute rounded-full" style={{ left:`${(i*67+11)%100}%`, top:`${(i*43+7)%100}%`, width:`${i%3+1}px`, height:`${i%3+1}px`, background:i%2===0?'rgba(220,38,38,.5)':'rgba(255,237,213,.35)', '--dur':`${5+i%4}s`, '--delay':`${i*.35}s` }}/>
      ))}
    </div>
  </>
);

const Sec = ({ title, icon, children, delay=0 }) => (
  <motion.div className="sec-card" initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55, delay, ease:[.22,1,.36,1] }}>
    <div className="flex items-center gap-3 mb-6">
      <div className="sec-icon">{icon}</div>
      <h2 className="font-clash text-lg font-bold" style={{ color:'#ffedd5' }}>{title}</h2>
    </div>
    {children}
  </motion.div>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="ep-label">{label}{required && <span> *</span>}</label>
    {children}
  </div>
);

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [specKey,   setSpecKey]   = useState('');
  const [specValue, setSpecValue] = useState('');
  const [tagInput,  setTagInput]  = useState('');
  const [formData,  setFormData]  = useState({
    name:'', description:'', price:'', comparePrice:'',
    category:'', subcategory:'', stock:'',
    specifications:{}, tags:[], images:[],
  });

  const categories = ['Electronics','Fashion','Books','Home & Garden','Sports','Toys','Beauty','Automotive','Food','Other'];

  useEffect(() => () => newPreviews.forEach(u=>{ if(u.startsWith('blob:')) URL.revokeObjectURL(u); }), []);
  useEffect(() => { loadProduct(); }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await sellerAPI.getProduct(id);
      const p = data.data.product;
      setFormData({ name:p.name||'', description:p.description||'', price:p.price||'', comparePrice:p.comparePrice||'', category:p.category||'', subcategory:p.subcategory||'', stock:p.stock||'', specifications:p.specifications||{}, tags:p.tags||[], images:p.images||[] });
    } catch { toast.error('Failed to load'); navigate('/seller/products'); }
    finally { setLoading(false); }
  };

  const handleChange = e => setFormData(p=>({...p,[e.target.name]:e.target.value}));

  const handleNewImage = e => {
    const files = Array.from(e.target.files); if(!files.length) return;
    if(formData.images.length+newImages.length+files.length>5){ toast.error('Max 5 images'); e.target.value=''; return; }
    const valid=[],prev=[];
    files.forEach(f=>{ if(!f.type.startsWith('image/')){ toast.error('Images only'); return; } valid.push(f); prev.push(URL.createObjectURL(f)); });
    setNewImages(p=>[...p,...valid]); setNewPreviews(p=>[...p,...prev]); e.target.value='';
  };

  const removeNew = i => { if(newPreviews[i]?.startsWith('blob:')) URL.revokeObjectURL(newPreviews[i]); setNewImages(p=>p.filter((_,j)=>j!==i)); setNewPreviews(p=>p.filter((_,j)=>j!==i)); };

  const addSpec = () => {
    if(!specKey.trim()||!specValue.trim()){ toast.error('Both fields required'); return; }
    setFormData(p=>({...p,specifications:{...p.specifications,[specKey.trim()]:specValue.trim()}}));
    setSpecKey(''); setSpecValue('');
  };

  const removeSpec = k => setFormData(p=>{ const s={...p.specifications}; delete s[k]; return{...p,specifications:s}; });
  const addTag = () => { const t=tagInput.trim(); if(!t) return; if(formData.tags.includes(t)){ toast.error('Exists'); return; } setFormData(p=>({...p,tags:[...p.tags,t]})); setTagInput(''); };
  const removeTag = t => setFormData(p=>({...p,tags:p.tags.filter(x=>x!==t)}));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(k=>{ if(k==='specifications'||k==='tags') fd.append(k,JSON.stringify(formData[k])); else if(k!=='images') fd.append(k,formData[k]); });
      newImages.forEach(img=>fd.append('images',img));
      await sellerAPI.updateProduct(id,fd);
      toast.success('Product updated!');
      newPreviews.forEach(u=>{ if(u.startsWith('blob:')) URL.revokeObjectURL(u); });
      navigate('/seller/products');
    } catch(e){ toast.error(e?.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };

  if(loading) return (
    <div className="ep-page"><Styles/><BG/>
      <div className="relative z-[2] max-w-3xl pt-8">
        <div className="flex flex-col gap-5">
          {[...Array(4)].map((_,i)=><div key={i} className="skeleton h-[180px]"/>)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="ep-page"><Styles/><BG/>
      <div className="relative z-[2] max-w-3xl pb-20">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }} className="mb-8">
          <button onClick={()=>navigate('/seller/products')} className="btn-ghost-warm flex items-center gap-2 px-3 py-2 text-sm mb-3 border-none rounded-lg cursor-pointer"><FiArrowLeft size={14}/> Back</button>
          <span className="block font-dm text-[11px] font-bold tracking-[4px] uppercase mb-1.5" style={{ color:'#f97316' }}>Edit Product</span>
          <h1 className="font-clash font-bold grad-text" style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)' }}>
            {formData.name || 'Edit Product'}
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Basic Info */}
          <Sec title="Basic Information" icon={<FiPackage size={17}/>} delay={.08}>
            <div className="flex flex-col gap-4">
              <Field label="Product Name" required>
                <input className="ep-input" name="name" type="text" required value={formData.name} onChange={handleChange}/>
              </Field>
              <Field label="Description" required>
                <textarea className="ep-input" name="description" required rows={4} value={formData.description} onChange={handleChange} style={{ resize:'vertical' }}/>
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Category" required>
                  <select className="ep-input" name="category" required value={formData.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    {categories.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Subcategory">
                  <input className="ep-input" name="subcategory" type="text" value={formData.subcategory} onChange={handleChange}/>
                </Field>
              </div>
            </div>
          </Sec>

          {/* Pricing */}
          <Sec title="Pricing & Inventory" icon={<FiDollarSign size={17}/>} delay={.14}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{name:'price',label:'Price',req:true},{name:'comparePrice',label:'Compare Price',req:false},{name:'stock',label:'Stock',req:true}].map(f=>(
                <Field key={f.name} label={f.label} required={f.req}>
                  <input className="ep-input" name={f.name} type="number" required={f.req} min="0" step={f.name==='stock'?'1':'0.01'} value={formData[f.name]} onChange={handleChange}/>
                </Field>
              ))}
            </div>
          </Sec>

          {/* Current Images */}
          {formData.images.length > 0 && (
            <Sec title={`Current Images (${formData.images.length})`} icon={<FiImage size={17}/>} delay={.2}>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {formData.images.map((img,i) => (
                  <motion.div key={i} className="img-preview" initial={{ opacity:0, scale:.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*.06 }}>
                    <img src={img.url?.startsWith('http') ? img.url : `http://localhost:3000${img.url}`} alt={`img ${i+1}`} onError={e=>{e.target.src='https://placehold.co/120x110/2a1000/dc2626?text=✦';}}/>
                    {img.isPrimary && <span className="absolute bottom-1.5 left-1.5 font-dm text-[9px] font-bold px-1.5 py-0.5 rounded-lg" style={{ background:'#dc2626', color:'#fff' }}>PRIMARY</span>}
                  </motion.div>
                ))}
              </div>
            </Sec>
          )}

          {/* New Images */}
          <Sec title="Add New Images" icon={<FiUpload size={17}/>} delay={.26}>
            <input type="file" id="new-images" multiple accept="image/*" onChange={handleNewImage} className="hidden"/>
            <label htmlFor="new-images" className="upload-zone flex flex-col items-center">
              <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:2.5, repeat:Infinity }}>
                <FiUpload size={36} style={{ color:'rgba(220,38,38,.7)', marginBottom:12 }}/>
              </motion.div>
              <p className="font-dm text-sm font-semibold" style={{ color:'rgba(255,237,213,.65)' }}>Click to upload new images</p>
              <p className="font-dm text-xs mt-1" style={{ color:'rgba(255,237,213,.35)' }}>Max 5 total</p>
            </label>
            <AnimatePresence>
              {newPreviews.length > 0 && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4 overflow-hidden"
                >
                  {newPreviews.map((src,i) => (
                    <motion.div key={i} className="img-preview" initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*.05 }}>
                      <img src={src} alt={`new ${i+1}`}/>
                      <button type="button" onClick={()=>removeNew(i)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ background:'#dc2626', color:'#fff' }}><FiX size={11}/></button>
                      <span className="absolute bottom-1.5 left-1.5 font-dm text-[9px] font-bold px-1.5 py-0.5 rounded-lg" style={{ background:'#16a34a', color:'#fff' }}>NEW</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Sec>

          {/* Specifications */}
          <Sec title="Specifications" icon={<FiList size={17}/>} delay={.32}>
            <div className="flex gap-2 mb-4 flex-wrap">
              <input className="ep-input flex-1 min-w-[110px]" placeholder="Key" value={specKey} onChange={e=>setSpecKey(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addSpec())}/>
              <input className="ep-input flex-1 min-w-[110px]" placeholder="Value" value={specValue} onChange={e=>setSpecValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addSpec())}/>
              <button type="button" className="btn-add-sm" onClick={addSpec}>+ Add</button>
            </div>
            <AnimatePresence>
              {Object.entries(formData.specifications).map(([k,v],i) => (
                <motion.div key={k} className="spec-row" initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }} transition={{ delay:i*.04 }}>
                  <span className="font-dm text-sm" style={{ color:'rgba(255,237,213,.75)' }}><strong style={{ color:'#fca5a5' }}>{k}:</strong> {v}</span>
                  <button type="button" onClick={()=>removeSpec(k)} className="border-none bg-transparent cursor-pointer p-1 rounded hover:bg-red-500/20 transition-colors" style={{ color:'rgba(220,38,38,.7)' }}><FiX size={14}/></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </Sec>

          {/* Tags */}
          <Sec title="Tags" icon={<FiTag size={17}/>} delay={.38}>
            <div className="flex gap-2 mb-4">
              <input className="ep-input flex-1" placeholder="Add a tag (Enter)" value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); addTag(); } }}/>
              <button type="button" className="btn-add-sm" onClick={addTag}>+ Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {formData.tags.map((t,i) => (
                  <motion.span key={t} className="tag-chip" initial={{ opacity:0, scale:.7 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.7 }} transition={{ delay:i*.04, type:'spring' }}>
                    #{t}
                    <button type="button" onClick={()=>removeTag(t)} className="border-none bg-transparent cursor-pointer p-0.5" style={{ color:'#fca5a5' }}><FiX size={11}/></button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </Sec>

          {/* Submit */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.44 }} className="flex gap-3">
            <motion.button type="submit" className="btn-red flex-1 py-4 text-base flex items-center justify-center gap-3"
              disabled={saving} whileHover={{ scale:saving?1:1.02 }} whileTap={{ scale:saving?1:.97 }}
            >
              {saving ? <><div className="spinner w-5 h-5 rounded-full border-2 border-white/25 border-t-white flex-shrink-0"/>Saving…</> : <><FiSave size={17}/> Save Changes</>}
            </motion.button>
            <motion.button type="button" className="btn-ghost-warm flex-1 py-4 text-base" onClick={()=>navigate('/seller/products')} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}>Cancel</motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;