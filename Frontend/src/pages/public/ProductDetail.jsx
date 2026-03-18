import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { publicAPI } from "../../service/apiAuth.js";
import { addToCart } from "../../Redux/createSlice.js";
import {
  FiStar, FiShoppingCart, FiHeart, FiShare2,
  FiPackage, FiTruck, FiShield, FiChevronRight,
  FiMinus, FiPlus, FiArrowLeft,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

/* ─── Global Styles ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    html,body,#root{background:#060612!important;color:#fff!important;font-family:'DM Sans',sans-serif!important;}
    .pd-page{background:#060612!important;min-height:100vh;color:#fff;font-family:'DM Sans',sans-serif;position:relative;}

    @keyframes orb-a{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(50px,-45px) scale(1.1)}75%{transform:translate(-30px,25px) scale(.93)}}
    @keyframes orb-b{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(-40px,35px) scale(1.08)}70%{transform:translate(20px,-25px) scale(.95)}}
    @keyframes grid-pulse{0%,100%{opacity:.03}50%{opacity:.055}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer-move{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes img-shine{0%{left:-100%}100%{left:200%}}

    .orb-a{animation:orb-a 22s ease-in-out infinite;}
    .orb-b{animation:orb-b 26s ease-in-out infinite 3s;}
    .grid-pulse{animation:grid-pulse 7s ease-in-out infinite;}
    .pd-spinner{animation:spin 1s linear infinite;}

    .skeleton{background:rgba(255,255,255,.06);border-radius:12px;overflow:hidden;position:relative;}
    .skeleton::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.07) 50%,transparent 100%);background-size:400px 100%;animation:shimmer-move 1.6s ease-in-out infinite;}

    /* Image gallery */
    .pd-main-img-wrap{border-radius:24px;overflow:hidden;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);position:relative;}
    .pd-main-img{width:100%;height:460px;object-fit:contain;display:block;transition:transform .5s ease;}
    .pd-main-img-wrap:hover .pd-main-img{transform:scale(1.04);}
    .pd-main-img-wrap::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);transform:skewX(-20deg);animation:img-shine 4s ease-in-out infinite 2s;}

    .pd-thumb{border-radius:14px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .25s;}
    .pd-thumb.active{border-color:#7c3aed!important;box-shadow:0 0 0 3px rgba(124,58,237,.25);}
    .pd-thumb:hover{border-color:rgba(167,139,250,.5)!important;}
    .pd-thumb img{width:100%;height:80px;object-fit:cover;display:block;}

    /* Quantity stepper */
    .pd-qty-wrap{display:inline-flex;align-items:center;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:14px;overflow:hidden;}
    .pd-qty-btn{width:42px;height:42px;border:none;background:transparent;color:rgba(255,255,255,.75);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s;}
    .pd-qty-btn:hover{background:rgba(124,58,237,.2);color:#fff;}
    .pd-qty-num{padding:0 22px;font-family:'Clash Display',sans-serif;font-size:18px;font-weight:700;color:#fff;min-width:50px;text-align:center;}

    /* Buttons */
    .pd-btn-cart{flex:1;padding:15px 24px;border-radius:14px;border:none;background:linear-gradient(135deg,#7c3aed,#6d28d9)!important;color:#fff!important;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 6px 28px rgba(124,58,237,.38);transition:transform .2s,box-shadow .2s;}
    .pd-btn-cart:hover{transform:scale(1.03);box-shadow:0 8px 40px rgba(124,58,237,.55)!important;}
    .pd-btn-cart:disabled{opacity:.45;cursor:not-allowed;transform:none;}

    .pd-btn-buy{flex:1;padding:15px 24px;border-radius:14px;border:none;background:linear-gradient(135deg,#ec4899,#be185d)!important;color:#fff!important;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 6px 28px rgba(236,72,153,.32);transition:transform .2s,box-shadow .2s;}
    .pd-btn-buy:hover{transform:scale(1.03);box-shadow:0 8px 40px rgba(236,72,153,.5)!important;}
    .pd-btn-buy:disabled{opacity:.45;cursor:not-allowed;transform:none;}

    .pd-btn-outline{flex:1;padding:13px 20px;border-radius:14px;background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.14)!important;color:rgba(255,255,255,.75)!important;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;}
    .pd-btn-outline:hover{background:rgba(255,255,255,.12)!important;color:#fff!important;border-color:rgba(255,255,255,.25)!important;}

    /* Spec table */
    .pd-spec-row{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);}
    .pd-spec-row:last-child{border-bottom:none;}

    /* Feature cards */
    .pd-feat-card{background:rgba(255,255,255,.04)!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:20px;padding:30px 24px;text-align:center;transition:transform .3s,box-shadow .3s;}
    .pd-feat-card:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(124,58,237,.15);}

    /* Tag chips */
    .pd-tag{background:rgba(124,58,237,.16);border:1px solid rgba(124,58,237,.28);color:#c4b5fd;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;}

    /* Seller card */
    .pd-seller-card{background:rgba(255,255,255,.04)!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:20px;padding:22px 24px;}

    /* Discount badge */
    .pd-disc-badge{background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;padding:5px 14px;border-radius:20px;font-size:13px;font-weight:800;font-family:'DM Sans',sans-serif;letter-spacing:.5px;}

    /* Stock */
    .badge-in{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.25);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;}
    .badge-out{background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.22);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;}

    /* Cat chip */
    .cat-chip{background:rgba(124,58,237,.18);border:1px solid rgba(124,58,237,.3);color:#c4b5fd;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;}

    .ec-price-xl{font-family:'Clash Display',sans-serif;font-size:clamp(2.2rem,4vw,3rem);font-weight:700;background:linear-gradient(135deg,#a78bfa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

    ::selection{background:rgba(124,58,237,.4);color:#fff;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:#060612;}
    ::-webkit-scrollbar-thumb{background:linear-gradient(#7c3aed,#ec4899);border-radius:4px;}
  `}</style>
);

/* ─── Background ─────────────────────────────────────────────────────────── */
const BG = () => (
  <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden', background:'#060612' }}>
    <div className="orb-a" style={{ position:'absolute', top:'-12%', right:'-8%', width:650, height:650, borderRadius:'50%', background:'#7c3aed', filter:'blur(135px)', opacity:.14 }} />
    <div className="orb-b" style={{ position:'absolute', bottom:'5%', left:'-8%', width:550, height:550, borderRadius:'50%', background:'#db2777', filter:'blur(125px)', opacity:.11 }} />
    <div className="grid-pulse" style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px)`, backgroundSize:'64px 64px' }} />
  </div>
);

/* ─── Loading Skeleton ───────────────────────────────────────────────────── */
const LoadingSkeleton = () => (
  <div style={{ maxWidth:1240, margin:'0 auto', padding:'40px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
    <div>
      <div className="skeleton" style={{ height:460, borderRadius:24, marginBottom:16 }} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
        {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height:80, borderRadius:14 }} />)}
      </div>
    </div>
    <div>
      {[80,180,120,60,100,50,50].map((h,i) => <div key={i} className="skeleton" style={{ height:h, borderRadius:12, marginBottom:16 }} />)}
    </div>
  </div>
);

/* ─── ProductDetail ──────────────────────────────────────────────────────── */
const ProductDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const { isAuthenticated, user } = useSelector(s => s.auth);

  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity]       = useState(1);
  const [wishlist, setWishlist]       = useState(false);
  const [imgLoaded, setImgLoaded]     = useState(false);

  useEffect(() => { loadProduct(); }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await publicAPI.getProduct(id);
      setProduct(data.data.product);
    } catch {
      toast.error("Product not found"); navigate("/products");
    } finally { setLoading(false); }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error("Please login to add items to cart"); navigate("/login"); return; }
    if (user.role !== "buyer") { toast.error("Only buyers can add items to cart"); return; }
    console.log("user info:", user);
    console.log("Adding to cart:", { product, quantity });
    dispatch(addToCart({ product, quantity }));
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => { handleAddToCart(); navigate("/cart"); };

  const imgSrc = (img) => img?.url?.startsWith("http") ? img.url : `http://localhost:3000${img?.url||""}`;

  if (loading) return (
    <div className="pd-page">
      <GlobalStyles /><BG />
      <div style={{ position:'relative', zIndex:2 }}><LoadingSkeleton /></div>
    </div>
  );

  if (!product) return (
    <div className="pd-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <GlobalStyles /><BG />
      <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', position:'relative', zIndex:2 }}>
        <p style={{ fontSize:64, marginBottom:16 }}>📦</p>
        <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,.5)', fontSize:18 }}>Product not found</p>
      </motion.div>
    </div>
  );

  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <div className="pd-page">
      <GlobalStyles />
      <BG />

      <div style={{ position:'relative', zIndex:2, maxWidth:1240, margin:'0 auto', padding:'32px 24px 100px' }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.5 }}
          style={{ display:'flex', alignItems:'center', gap:8, marginBottom:36, flexWrap:'wrap' }}
        >
          {['Home','Products',product.name].map((crumb, i) => (
            <span key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
              {i > 0 && <FiChevronRight size={13} style={{ color:'rgba(255,255,255,.25)' }} />}
              <span
                onClick={() => i===0 ? navigate('/') : i===1 ? navigate('/products') : null}
                style={{
                  fontFamily:'DM Sans,sans-serif', fontSize:13,
                  color: i===2 ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.38)',
                  cursor: i<2 ? 'pointer' : 'default',
                  maxWidth: i===2 ? 220 : 'none',
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  transition:'color .2s',
                }}
                onMouseEnter={e => i<2 && (e.target.style.color='rgba(167,139,250,.85)')}
                onMouseLeave={e => i<2 && (e.target.style.color='rgba(255,255,255,.38)')}
              >{crumb}</span>
            </span>
          ))}
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:52, marginBottom:60 }}>

          {/* ── IMAGE GALLERY ── */}
          <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7, ease:[.22,1,.36,1] }}>
            <div className="pd-main-img-wrap" style={{ marginBottom:16 }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity:0, scale:1.04 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:.97 }}
                  transition={{ duration:.35 }}
                  className="pd-main-img"
                  src={imgSrc(product.images?.[selectedImage])}
                  alt={product.name}
                  onError={e=>{ e.target.src='https://placehold.co/600x460/0d0d1f/7c3aed?text=✦'; }}
                  onLoad={() => setImgLoaded(true)}
                />
              </AnimatePresence>
              {discount > 0 && (
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:.4, type:'spring' }}
                  style={{ position:'absolute', top:18, left:18 }}
                >
                  <span className="pd-disc-badge">{discount}% OFF</span>
                </motion.div>
              )}
            </div>

            {product.images?.length > 1 && (
              <motion.div
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
                style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}
              >
                {product.images.map((img, i) => (
                  <motion.div
                    key={i} className={`pd-thumb ${selectedImage===i?'active':''}`}
                    onClick={() => setSelectedImage(i)}
                    whileHover={{ scale:1.05 }} whileTap={{ scale:.97 }}
                  >
                    <img src={imgSrc(img)} alt={`${product.name} ${i+1}`} onError={e=>{ e.target.src='https://placehold.co/100x80/0d0d1f/7c3aed?text=✦'; }} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* ── PRODUCT INFO ── */}
          <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7, ease:[.22,1,.36,1] }}>

            {/* Category + stock */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
              style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}
            >
              <span className="cat-chip">{product.category}</span>
              {product.stock > 0
                ? <span className="badge-in">✓ In Stock ({product.stock} left)</span>
                : <span className="badge-out">✕ Out of Stock</span>}
            </motion.div>

            {/* Name */}
            <motion.h1 initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
              style={{ fontFamily:'Clash Display,sans-serif', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'#fff', lineHeight:1.2, marginBottom:18 }}
            >{product.name}</motion.h1>

            {/* Stars */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
              style={{ display:'flex', alignItems:'center', gap:6, marginBottom:24 }}
            >
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="17" height="17" viewBox="0 0 24 24"
                  fill={s<=Math.floor(product.rating||5)?'#f59e0b':'none'}
                  stroke={s<=Math.floor(product.rating||5)?'#f59e0b':'rgba(255,255,255,.25)'}
                  strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
              <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.4)', marginLeft:4 }}>
                {(product.rating||5).toFixed(1)} · {product.reviewCount||0} reviews
              </span>
            </motion.div>

            {/* Price */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}
              style={{ paddingBottom:24, borderBottom:'1px solid rgba(255,255,255,.08)', marginBottom:24 }}
            >
              <div style={{ display:'flex', alignItems:'baseline', gap:14, flexWrap:'wrap' }}>
                <span className="ec-price-xl">${product.price}</span>
                {product.comparePrice && (
                  <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:18, color:'rgba(255,255,255,.3)', textDecoration:'line-through' }}>${product.comparePrice}</span>
                )}
                {discount > 0 && <span className="pd-disc-badge">{discount}% OFF</span>}
              </div>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'rgba(255,255,255,.28)', marginTop:6 }}>Inclusive of all taxes</p>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
              style={{ marginBottom:24 }}
            >
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'rgba(255,255,255,.35)', letterSpacing:3, textTransform:'uppercase', marginBottom:10 }}>About</p>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(255,255,255,.55)', lineHeight:1.75 }}>{product.description}</p>
            </motion.div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.35 }}
                style={{ paddingBottom:24, borderBottom:'1px solid rgba(255,255,255,.08)', marginBottom:24 }}
              >
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'rgba(255,255,255,.35)', letterSpacing:3, textTransform:'uppercase', marginBottom:14 }}>Specifications</p>
                {Object.entries(product.specifications).map(([k,v], i) => (
                  <motion.div key={k} className="pd-spec-row"
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:.4 + i*.04 }}
                  >
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.38)', minWidth:140 }}>{k}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:500 }}>{v}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Quantity */}
            {product.stock > 0 && (
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.38 }}
                style={{ marginBottom:24 }}
              >
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600, color:'rgba(255,255,255,.45)', marginBottom:12 }}>Quantity</p>
                <div className="pd-qty-wrap">
                  <button className="pd-qty-btn" onClick={() => setQuantity(Math.max(1, quantity-1))}><FiMinus size={15} /></button>
                  <span className="pd-qty-num">{quantity}</span>
                  <button className="pd-qty-btn" onClick={() => setQuantity(Math.min(product.stock, quantity+1))}><FiPlus size={15} /></button>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:.42 }}
              style={{ display:'flex', gap:12, marginBottom:14, flexWrap:'wrap' }}
            >
              <motion.button className="pd-btn-cart" onClick={handleAddToCart} disabled={product.stock===0} whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
                <FiShoppingCart size={17} /> Add to Cart
              </motion.button>
              <motion.button className="pd-btn-buy" onClick={handleBuyNow} disabled={product.stock===0} whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
                Buy Now →
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.46 }}
              style={{ display:'flex', gap:12 }}
            >
              <motion.button className="pd-btn-outline" onClick={() => setWishlist(w=>!w)} whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
                <FiHeart size={15} style={{ fill: wishlist ? '#ec4899' : 'none', color: wishlist ? '#ec4899' : 'inherit', transition:'all .2s' }} />
                {wishlist ? 'Wishlisted' : 'Wishlist'}
              </motion.button>
              <motion.button className="pd-btn-outline" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }} whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
                <FiShare2 size={15} /> Share
              </motion.button>
            </motion.div>

            {/* Seller */}
            {product.sellerId && (
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}
                style={{ marginTop:24 }}
              >
                <div className="pd-seller-card">
                  <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:600, color:'rgba(255,255,255,.3)', letterSpacing:3, textTransform:'uppercase', marginBottom:10 }}>Sold By</p>
                  <p style={{ fontFamily:'Clash Display,sans-serif', fontSize:18, fontWeight:700, background:'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:6 }}>
                    {product.sellerId.shopName}
                  </p>
                  {product.sellerId.rating && (
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      {[...Array(5)].map((_,i) => (
                        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i<Math.round(product.sellerId.rating)?'#f59e0b':'none'} stroke={i<Math.round(product.sellerId.rating)?'#f59e0b':'rgba(255,255,255,.2)'} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                      <span style={{ fontSize:12, color:'rgba(255,255,255,.35)', fontFamily:'DM Sans,sans-serif' }}>{product.sellerId.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── FEATURE CARDS ── */}
        <motion.div
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.7 }}
          style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20, marginBottom:60 }}
        >
          {[
            { icon:<FiPackage size={26}/>, label:'Fast Delivery', desc:'Quick shipping on all orders', color:'#7c3aed', bg:'rgba(124,58,237,.12)' },
            { icon:<FiTruck size={26}/>, label:'Free Shipping', desc:'On orders over $50', color:'#10b981', bg:'rgba(16,185,129,.12)' },
            { icon:<FiShield size={26}/>, label:'Secure Payment', desc:'100% secure transactions', color:'#f59e0b', bg:'rgba(245,158,11,.12)' },
          ].map((f,i) => (
            <motion.div key={i} className="pd-feat-card"
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*.12 }}
            >
              <div style={{ width:54, height:54, borderRadius:16, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:f.color }}>{f.icon}</div>
              <h3 style={{ fontFamily:'Clash Display,sans-serif', fontSize:16, fontWeight:600, color:'#fff', marginBottom:6 }}>{f.label}</h3>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.4)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── TAGS ── */}
        {product.tags?.length > 0 && (
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.6 }}>
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, fontWeight:600, color:'rgba(255,255,255,.3)', letterSpacing:3, textTransform:'uppercase', marginBottom:14 }}>Tags</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {product.tags.map((tag,i) => (
                <motion.span key={i} className="pd-tag"
                  initial={{ opacity:0, scale:.75 }} whileInView={{ opacity:1, scale:1 }}
                  viewport={{ once:true }} transition={{ delay:i*.05, type:'spring' }}
                >#{tag}</motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;