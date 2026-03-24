import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellerAPI } from '../../service/apiAuth.js';
import {
  FiEdit, FiTrash2, FiEye, FiEyeOff, FiPlus, FiSearch,
  FiPackage, FiArrowRight, FiBox,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

const FALLBACK_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJhMTAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZGMyNjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4pqmPC90ZXh0Pjwvc3ZnPg==";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    html,body,#root{background:#1a0a00!important;color:#ffedd5!important;font-family:'DM Sans',sans-serif!important;}
    .sp-page{background:#1a0a00!important;min-height:100vh;color:#ffedd5;font-family:'DM Sans',sans-serif;position:relative;}
    .font-clash{font-family:'Clash Display',sans-serif!important;}

    @keyframes orb-a{0%,100%{transform:translate(0,0)scale(1)}40%{transform:translate(45px,-38px)scale(1.1)}75%{transform:translate(-28px,25px)scale(.93)}}
    @keyframes orb-b{0%,100%{transform:translate(0,0)scale(1)}45%{transform:translate(-36px,30px)scale(1.08)}}
    @keyframes grid-p{0%,100%{opacity:.04}50%{opacity:.08}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes float-up{0%,100%{transform:translateY(0);opacity:.15}50%{transform:translateY(-20px);opacity:.5}}
    @keyframes border-dance{0%,100%{border-color:rgba(220,38,38,.2)}50%{border-color:rgba(249,115,22,.45)}}

    .orb-a-anim{animation:orb-a 24s ease-in-out infinite;}
    .orb-b-anim{animation:orb-b 28s ease-in-out infinite 3s;}
    .grid-anim{animation:grid-p 8s ease-in-out infinite;}
    .float-p{animation:float-up var(--dur,5s) ease-in-out var(--delay,0s) infinite;}
    .spinner{animation:spin 1s linear infinite;}

    /* Product card */
    .prod-card{
      background:linear-gradient(135deg,rgba(220,38,38,.07),rgba(249,115,22,.04),rgba(255,237,213,.02))!important;
      border:1px solid rgba(220,38,38,.2)!important;border-radius:22px;padding:22px;
      transition:border-color .3s,box-shadow .3s,transform .3s;
      animation:border-dance 6s ease-in-out infinite;
    }
    .prod-card:hover{border-color:rgba(220,38,38,.5)!important;box-shadow:0 20px 50px rgba(220,38,38,.18)!important;transform:translateY(-4px);}
    .prod-card:hover .prod-img{transform:scale(1.06);}
    .prod-img{width:120px;height:120px;object-fit:cover;border-radius:14px;flex-shrink:0;transition:transform .4s ease;border:2px solid rgba(220,38,38,.2);}

    /* Search */
    .search-wrap{background:rgba(255,237,213,.06)!important;border:1px solid rgba(220,38,38,.22)!important;border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:12px;}
    .search-input{flex:1;background:transparent!important;border:none!important;outline:none;font-family:'DM Sans',sans-serif;font-size:15px;color:#ffedd5!important;}
    .search-input::placeholder{color:rgba(255,237,213,.28);}

    /* Action buttons */
    .btn-edit{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none!important;border:none;background:linear-gradient(135deg,#dc2626,#b91c1c)!important;color:#fff!important;box-shadow:0 3px 12px rgba(220,38,38,.35);transition:transform .2s,box-shadow .2s;}
    .btn-edit:hover{transform:scale(1.05);box-shadow:0 5px 20px rgba(220,38,38,.55)!important;}

    .btn-toggle-active{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:none;background:rgba(251,191,36,.15)!important;color:#fbbf24!important;border:1px solid rgba(251,191,36,.3)!important;transition:all .2s;}
    .btn-toggle-active:hover{background:rgba(251,191,36,.25)!important;}
    .btn-toggle-inactive{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:none;background:rgba(52,211,153,.13)!important;color:#34d399!important;border:1px solid rgba(52,211,153,.28)!important;transition:all .2s;}
    .btn-toggle-inactive:hover{background:rgba(52,211,153,.22)!important;}

    .btn-delete{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:none;background:rgba(248,113,113,.12)!important;color:#f87171!important;border:1px solid rgba(248,113,113,.25)!important;transition:all .2s;}
    .btn-delete:hover{background:rgba(248,113,113,.22)!important;}

    .btn-red-cta{background:linear-gradient(135deg,#dc2626,#b91c1c)!important;border:none!important;color:#fff!important;font-family:'DM Sans',sans-serif;font-weight:700;border-radius:12px;cursor:pointer;box-shadow:0 4px 20px rgba(220,38,38,.4);transition:transform .2s,box-shadow .2s;display:inline-flex;align-items:center;gap:8px;text-decoration:none!important;}
    .btn-red-cta:hover{transform:scale(1.04);box-shadow:0 6px 28px rgba(220,38,38,.6)!important;}

    /* Status badge */
    .badge-active{background:rgba(52,211,153,.13);color:#34d399;border:1px solid rgba(52,211,153,.28);padding:4px 12px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;}
    .badge-inactive{background:rgba(248,113,113,.12);color:#f87171;border:1px solid rgba(248,113,113,.25);padding:4px 12px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;}
    .badge-cat{background:rgba(220,38,38,.16);color:#fca5a5;border:1px solid rgba(220,38,38,.3);padding:3px 10px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;}

    /* Price */
    .price-grad{background:linear-gradient(135deg,#dc2626,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-family:'Clash Display',sans-serif;font-weight:700;}
    .grad-text{background:linear-gradient(135deg,#dc2626,#f97316,#ffedd5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

    .skeleton{background:rgba(255,237,213,.06);border-radius:16px;position:relative;overflow:hidden;}
    .skeleton::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,237,213,.1),transparent);background-size:400px 100%;animation:shimmer 1.6s ease-in-out infinite;}

    ::selection{background:rgba(220,38,38,.4);color:#ffedd5;}
    ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#1a0a00;}::-webkit-scrollbar-thumb{background:linear-gradient(#dc2626,#f97316);border-radius:4px;}
  `}</style>
);

const BG = () => (
  <>
    <div className="orb-a-anim fixed pointer-events-none z-0 rounded-full blur-[140px]" style={{ top:'-10%', right:'-5%', width:580, height:580, background:'#dc2626', opacity:.15 }}/>
    <div className="orb-b-anim fixed pointer-events-none z-0 rounded-full blur-[130px]" style={{ bottom:'-8%', left:'-7%', width:520, height:520, background:'#f97316', opacity:.11 }}/>
    <div className="grid-anim fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage:'linear-gradient(rgba(255,237,213,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,237,213,.035) 1px,transparent 1px)', backgroundSize:'64px 64px' }}/>
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({length:12},(_,i)=>(
        <div key={i} className="float-p absolute rounded-full" style={{ left:`${(i*67+11)%100}%`, top:`${(i*43+7)%100}%`, width:`${i%3+1}px`, height:`${i%3+1}px`, background:i%2===0?'rgba(220,38,38,.5)':'rgba(255,237,213,.35)', '--dur':`${5+i%4}s`, '--delay':`${i*.38}s` }}/>
      ))}
    </div>
  </>
);

const Products = () => {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggling,   setToggling]   = useState({});
  const [deleting,   setDeleting]   = useState({});

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try { const { data } = await sellerAPI.getProducts(); setProducts(data.data.products||[]); }
    catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if(!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(p=>({...p,[id]:true}));
    try { await sellerAPI.deleteProduct(id); toast.success('Deleted'); loadProducts(); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(p=>({...p,[id]:false})); }
  };

  const handleToggle = async id => {
    setToggling(p=>({...p,[id]:true}));
    try { await sellerAPI.toggleProductStatus(id); toast.success('Status updated'); loadProducts(); }
    catch { toast.error('Failed'); }
    finally { setToggling(p=>({...p,[id]:false})); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sp-page"><Styles/><BG/>
      <div className="relative z-[2] pb-20">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }} transition={{ duration:.65, ease:[.22,1,.36,1] }}
          className="flex flex-wrap items-start justify-between gap-4 mb-8"
        >
          <div>
            <span className="block font-dm text-[11px] font-bold tracking-[4px] uppercase mb-1.5" style={{ color:'#f97316' }}>Seller Panel</span>
            <h1 className="font-clash font-bold grad-text" style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)' }}>My Products</h1>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.2 }}
              className="font-dm text-sm mt-1" style={{ color:'rgba(255,237,213,.38)' }}
            >
              {products.length} products in your store
            </motion.p>
          </div>
          <motion.div initial={{ opacity:0, scale:.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.28 }}>
            <Link to="/seller/products/add" className="btn-red-cta px-5 py-3 rounded-xl text-sm">
              <FiPlus size={16}/> Add Product
            </Link>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:.18 }} className="search-wrap mb-6">
          <FiSearch size={17} style={{ color:'rgba(220,38,38,.6)', flexShrink:0 }}/>
          <input className="search-input" placeholder="Search by name or category…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
          {searchTerm && (
            <button onClick={()=>setSearchTerm('')} className="font-dm text-xs font-bold px-2 py-1 rounded-lg border-none cursor-pointer" style={{ background:'rgba(220,38,38,.18)', color:'#fca5a5' }}>Clear</button>
          )}
        </motion.div>

        {/* Stats strip */}
        {!loading && products.length > 0 && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.22 }}
            className="flex gap-3 mb-6 flex-wrap"
          >
            {[
              { label:`${products.filter(p=>p.isActive).length} Active`,   color:'#34d399', bg:'rgba(52,211,153,.12)',  border:'rgba(52,211,153,.25)' },
              { label:`${products.filter(p=>!p.isActive).length} Inactive`, color:'#f87171', bg:'rgba(248,113,113,.1)',  border:'rgba(248,113,113,.22)' },
              { label:`${filtered.length} Showing`,                         color:'#fbbf24', bg:'rgba(251,191,36,.12)',  border:'rgba(251,191,36,.25)' },
            ].map(b=>(
              <div key={b.label} className="px-3 py-1.5 rounded-full font-dm text-xs font-bold"
                style={{ background:b.bg, border:`1px solid ${b.border}`, color:b.color }}
              >{b.label}</div>
            ))}
          </motion.div>
        )}

        {/* Products */}
        {loading ? (
          <div className="flex flex-col gap-4">{[...Array(3)].map((_,i)=><div key={i} className="skeleton h-[150px]"/>)}</div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity:0, scale:.94 }} animate={{ opacity:1, scale:1 }}
            className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
            style={{ background:'rgba(255,237,213,.03)', border:'1px solid rgba(255,237,213,.07)' }}
          >
            <motion.div animate={{ y:[0,-12,0], rotate:[0,5,-5,0] }} transition={{ duration:3.5, repeat:Infinity }}>
              <FiBox size={60} style={{ color:'rgba(220,38,38,.4)', marginBottom:16 }}/>
            </motion.div>
            <p className="font-clash text-xl font-bold mb-2" style={{ color:'rgba(255,237,213,.6)' }}>
              {searchTerm ? 'No products match' : 'No products yet'}
            </p>
            <p className="font-dm text-sm mb-8" style={{ color:'rgba(255,237,213,.3)' }}>
              {searchTerm ? 'Try a different search term' : 'Add your first product to start selling'}
            </p>
            {!searchTerm && (
              <Link to="/seller/products/add" className="btn-red-cta px-6 py-3.5 rounded-xl text-sm">
                <FiPlus size={16}/> Add Your First Product
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div key={product._id} className="prod-card"
                  layout
                  initial={{ opacity:0, y:30, scale:.97 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, x:40, scale:.95 }}
                  transition={{ duration:.45, delay:i*.06, ease:[.22,1,.36,1] }}
                >
                  <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                    {/* Image */}
                    <div className="overflow-hidden flex-shrink-0" style={{ borderRadius:14 }}>
                      <img className="prod-img"
                        src={product.images?.[0]?.url?.startsWith('http') ? product.images[0].url : `http://localhost:3000${product.images?.[0]?.url||''}`}
                        alt={product.name}
                        onError={e=>{e.target.src=FALLBACK_IMAGE;}}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="badge-cat">{product.category}</span>
                              <span className={product.isActive ? 'badge-active' : 'badge-inactive'}>
                                {product.isActive ? '● Active' : '○ Inactive'}
                              </span>
                            </div>
                            <h3 className="font-clash font-bold" style={{ fontSize:17, color:'rgba(255,237,213,.92)', lineHeight:1.3 }}>{product.name}</h3>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="price-grad" style={{ fontSize:22 }}>${product.price}</p>
                            {product.comparePrice && (
                              <p className="font-dm text-xs mt-0.5" style={{ color:'rgba(255,237,213,.3)', textDecoration:'line-through' }}>${product.comparePrice}</p>
                            )}
                          </div>
                        </div>

                        <p className="font-dm text-xs leading-relaxed mb-3" style={{ color:'rgba(255,237,213,.4)', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                          {product.description}
                        </p>

                        <div className="flex gap-4 text-xs font-dm" style={{ color:'rgba(255,237,213,.38)' }}>
                          <span>Stock: <strong style={{ color:'rgba(255,237,213,.7)' }}>{product.stock}</strong></span>
                          <span>Sales: <strong style={{ color:'rgba(255,237,213,.7)' }}>{product.totalSales||0}</strong></span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <Link to={`/seller/products/edit/${product._id}`} className="btn-edit">
                          <FiEdit size={13}/> Edit
                        </Link>
                        <button onClick={()=>handleToggle(product._id)} disabled={toggling[product._id]}
                          className={product.isActive ? 'btn-toggle-active' : 'btn-toggle-inactive'}
                        >
                          {product.isActive ? <><FiEyeOff size={13}/> Deactivate</> : <><FiEye size={13}/> Activate</>}
                        </button>
                        <button onClick={()=>handleDelete(product._id,product.name)} disabled={deleting[product._id]}
                          className="btn-delete"
                        >
                          {deleting[product._id]
                            ? <div className="spinner w-3.5 h-3.5 rounded-full border-2 border-red-300/30 border-t-red-300 flex-shrink-0"/>
                            : <><FiTrash2 size={13}/> Delete</>
                          }
                        </button>
                        <Link to={`/products/${product._id}`} className="ml-auto btn-ghost-warm flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold no-underline"
                          style={{ background:'rgba(255,237,213,.07)', border:'1px solid rgba(255,237,213,.14)', color:'rgba(255,237,213,.6)' }}
                        >
                          Preview <FiArrowRight size={11}/>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;