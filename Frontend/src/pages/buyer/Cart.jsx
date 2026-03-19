import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  removeFromCart, selectCartItems,
  selectCartTotal, updateQuantity,
} from '../../Redux/createSlice';
import toast from 'react-hot-toast';
import {
  FiMinus, FiPlus, FiTrash2, FiShoppingBag,
  FiArrowRight, FiTag, FiPackage, FiShield, FiTruck,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    html,body,#root{background:#060612!important;color:#fff!important;font-family:'DM Sans',sans-serif!important;}
    .cart-page{background:#060612!important;min-height:100vh;font-family:'DM Sans',sans-serif;color:#fff;position:relative;}

    @keyframes orb-a{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(50px,-40px) scale(1.1)}75%{transform:translate(-30px,25px) scale(.93)}}
    @keyframes orb-b{0%,100%{transform:translate(0,0) scale(1)}45%{transform:translate(-40px,35px) scale(1.08)}}
    @keyframes grid-pulse{0%,100%{opacity:.03}50%{opacity:.055}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes price-pop{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
    @keyframes shimmer-swipe{0%{background-position:-400px 0}100%{background-position:400px 0}}

    .cart-orb1{position:fixed;top:-12%;right:-8%;width:600px;height:600px;border-radius:50%;background:#7c3aed;filter:blur(130px);opacity:.15;pointer-events:none;z-index:0;animation:orb-a 22s ease-in-out infinite;}
    .cart-orb2{position:fixed;bottom:5%;left:-8%;width:520px;height:520px;border-radius:50%;background:#db2777;filter:blur(120px);opacity:.11;pointer-events:none;z-index:0;animation:orb-b 26s ease-in-out infinite 3s;}
    .cart-grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);background-size:64px 64px;animation:grid-pulse 7s ease-in-out infinite;}

    /* Cart item card */
    .cart-item-card{
      display:flex;gap:0;
      background:rgba(255,255,255,.044)!important;
      border:1px solid rgba(255,255,255,.09)!important;
      border-radius:20px;overflow:hidden;
      transition:border-color .3s,box-shadow .3s;
    }
    .cart-item-card:hover{border-color:rgba(124,58,237,.45)!important;box-shadow:0 16px 48px rgba(124,58,237,.18)!important;}
    .cart-item-card:hover .cart-item-img{transform:scale(1.06);}
    .cart-item-img{width:120px;height:120px;object-fit:cover;flex-shrink:0;transition:transform .4s ease;display:block;}

    /* Qty stepper */
    .qty-wrap{display:inline-flex;align-items:center;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;overflow:hidden;}
    .qty-btn{width:36px;height:36px;border:none;background:transparent;color:rgba(255,255,255,.7);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s;}
    .qty-btn:hover{background:rgba(124,58,237,.25);color:#fff;}
    .qty-btn:disabled{opacity:.35;cursor:not-allowed;}
    .qty-num{padding:0 16px;font-family:'Clash Display',sans-serif;font-size:16px;font-weight:700;color:#fff;min-width:44px;text-align:center;}

    /* Remove btn */
    .remove-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;border:none;background:rgba(239,68,68,.12)!important;color:#f87171!important;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}
    .remove-btn:hover{background:rgba(239,68,68,.25)!important;color:#fca5a5!important;transform:scale(1.04);}

    /* Summary card */
    .summary-card{background:rgba(255,255,255,.044)!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:24px;padding:32px;position:sticky;top:90px;}

    /* Checkout btn */
    .checkout-btn{width:100%;padding:16px 24px;border-radius:14px;border:none;background:linear-gradient(135deg,#7c3aed,#6d28d9)!important;color:#fff!important;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 6px 28px rgba(124,58,237,.4);transition:transform .2s,box-shadow .2s;}
    .checkout-btn:hover{transform:scale(1.02);box-shadow:0 8px 40px rgba(124,58,237,.6)!important;}

    /* Promo input */
    .promo-input{flex:1;background:rgba(255,255,255,.07)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:11px 0 0 11px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:14px;color:#fff!important;outline:none;transition:border-color .2s;}
    .promo-input::placeholder{color:rgba(255,255,255,.28);}
    .promo-input:focus{border-color:rgba(124,58,237,.5)!important;}
    .promo-btn{padding:11px 18px;border-radius:0 11px 11px 0;border:none;background:rgba(124,58,237,.3)!important;color:#a78bfa!important;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:background .2s;}
    .promo-btn:hover{background:rgba(124,58,237,.5)!important;}

    /* Assurance strip */
    .assurance-strip{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:16px 20px;display:flex;gap:20px;flex-wrap:wrap;justify-content:center;}
    .assurance-item{display:flex;align-items:center;gap:7px;font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(255,255,255,.4);}

    /* Empty state */
    .empty-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center;position:relative;z-index:2;}

    /* Price change pop */
    .price-pop{animation:price-pop .35s ease;}

    /* Summary row */
    .sum-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);}
    .sum-row:last-of-type{border-bottom:none;}

    /* Progress bar – free shipping */
    .ship-track{height:5px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden;margin:8px 0 4px;}
    .ship-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#7c3aed,#10b981);transition:width .6s ease;}

    .ec-eyebrow{display:block;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:4px;color:#a78bfa;text-transform:uppercase;margin-bottom:10px;}
    .ec-h1{font-family:'Clash Display',sans-serif;font-size:clamp(2rem,4vw,3rem);font-weight:700;color:#fff;line-height:1.1;}
    .ec-price{font-family:'Clash Display',sans-serif;background:linear-gradient(135deg,#a78bfa,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

    ::selection{background:rgba(124,58,237,.4);color:#fff;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-track{background:#060612;}
    ::-webkit-scrollbar-thumb{background:linear-gradient(#7c3aed,#ec4899);border-radius:4px;}
  `}</style>
);

/* ─── Cart Item ──────────────────────────────────────────────────────────── */
const CartItem = ({ item, index, onQuantityChange, onRemove }) => {
  console.log('Rendering CartItem:', item);
  const [removing, setRemoving] = useState(false);
  const itemTotal = (item.price * item.quantity).toFixed(2);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.productId), 200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity:0, x:-40, scale:.97 }}
      animate={{ opacity:1, x:0, scale:1 }}
      exit={{ opacity:0, x:60, scale:.95, transition:{ duration:.28 } }}
      transition={{ duration:.5, delay:index*.07, ease:[.22,1,.36,1] }}
      className="cart-item-card"
    >
      {/* Image */}
      <div style={{ position:'relative', overflow:'hidden', flexShrink:0, width:120 }}>
        <img
          className="cart-item-img"
          src={item.image || 'https://placehold.co/120x120/0d0d1f/7c3aed?text=✦'}
          alt={item.name}
          onError={e=>{ e.target.src='https://placehold.co/120x120/0d0d1f/7c3aed?text=✦'; }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,transparent 60%,rgba(6,6,18,.5))' }} />
      </div>

      {/* Body */}
      <div style={{ flex:1, padding:'18px 20px', display:'flex', flexDirection:'column', justifyContent:'space-between', minWidth:0 }}>
        <div>
          <p style={{ fontFamily:'Clash Display,sans-serif', fontWeight:600, fontSize:16, color:'rgba(255,255,255,.9)', lineHeight:1.3, marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {item.name}
          </p>
          <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.35)', marginBottom:12 }}>
            Unit price: <span style={{ color:'rgba(255,255,255,.6)', fontWeight:500 }}>${item.price}</span>
          </p>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          {/* Qty stepper */}
          <div className="qty-wrap">
            <button className="qty-btn" onClick={() => onQuantityChange(item.productId, item.quantity-1)} disabled={item.quantity<=1}>
              <FiMinus size={13}/>
            </button>
            <span className="qty-num">{item.quantity}</span>
            <button className="qty-btn" onClick={() => onQuantityChange(item.productId, item.quantity+1)}>
              <FiPlus size={13}/>
            </button>
          </div>

          {/* Subtotal */}
          <motion.p
            key={itemTotal}
            initial={{ scale:.85, opacity:.5 }}
            animate={{ scale:1, opacity:1 }}
            transition={{ type:'spring', stiffness:400, damping:20 }}
            style={{ fontFamily:'Clash Display,sans-serif', fontSize:20, fontWeight:700, background:'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}
          >
            ${itemTotal}
          </motion.p>

          {/* Remove */}
          <button className="remove-btn" onClick={handleRemove}>
            <FiTrash2 size={13}/> Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Empty Cart ─────────────────────────────────────────────────────────── */
const EmptyCart = () => (
  <div className="empty-wrap">
    <motion.div
      animate={{ y:[0,-14,0], rotate:[0,4,-4,0] }}
      transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }}
      style={{ fontSize:80, marginBottom:28 }}
    >🛒</motion.div>

    <motion.span initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }} className="ec-eyebrow">
      Nothing here yet
    </motion.span>
    <motion.h2 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
      style={{ fontFamily:'Clash Display,sans-serif', fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:700, color:'#fff', marginBottom:14 }}
    >Your cart is empty</motion.h2>
    <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
      style={{ fontFamily:'DM Sans,sans-serif', fontSize:16, color:'rgba(255,255,255,.4)', marginBottom:40, maxWidth:380, lineHeight:1.65 }}
    >Looks like you haven't added anything yet. Discover thousands of amazing products waiting for you.</motion.p>

    <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.4, type:'spring' }}>
      <NavLink to="/products" style={{
        display:'inline-flex', alignItems:'center', gap:10,
        padding:'16px 36px', borderRadius:50, border:'none',
        background:'linear-gradient(135deg,#7c3aed,#6d28d9)',
        color:'#fff', fontFamily:'DM Sans,sans-serif',
        fontSize:16, fontWeight:700, textDecoration:'none',
        boxShadow:'0 6px 28px rgba(124,58,237,.42)',
      }}>
        <FiShoppingBag size={18}/> Start Shopping <FiArrowRight size={16}/>
      </NavLink>
    </motion.div>
  </div>
);

/* ─── Cart ───────────────────────────────────────────────────────────────── */
const Cart = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const [promo, setPromo]   = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 50;
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99;
  const discount = promoApplied ? cartTotal * 0.1 : 0;
  const grandTotal = (cartTotal - discount + shipping).toFixed(2);
  const shipProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0).toFixed(2);

  const handleQuantityChange = (productId, qty) => {
    if (qty < 1) return;
    dispatch(updateQuantity({ productId, quantity: qty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) { toast.error('Please login to checkout'); navigate('/login'); return; }
    if (user.role !== 'buyer') { toast.error('Only buyers can checkout'); return; }
    navigate('/buyer/checkout');
  };

  const handlePromo = () => {
    if (promo.trim().toUpperCase() === 'SAVE10') {
      setPromoApplied(true); toast.success('10% discount applied! 🎉');
    } else {
      toast.error('Invalid promo code');
    }
  };

  if (cartItems.length === 0) return (
    <div className="cart-page">
      <GlobalStyles/>
      <div className="cart-orb1"/><div className="cart-orb2"/><div className="cart-grid-bg"/>
      <div style={{ position:'relative', zIndex:2, maxWidth:1240, margin:'0 auto', padding:'40px 24px' }}>
        <EmptyCart />
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <GlobalStyles/>
      <div className="cart-orb1"/><div className="cart-orb2"/><div className="cart-grid-bg"/>

      <div style={{ position:'relative', zIndex:2, maxWidth:1240, margin:'0 auto', padding:'40px 24px 100px' }}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }} style={{ marginBottom:40 }}>
          <span className="ec-eyebrow">Your selections</span>
          <div style={{ display:'flex', alignItems:'baseline', gap:16, flexWrap:'wrap' }}>
            <h1 className="ec-h1">Shopping Cart</h1>
            <motion.span
              key={cartItems.length}
              initial={{ scale:.7, opacity:0 }} animate={{ scale:1, opacity:1 }}
              transition={{ type:'spring', stiffness:400 }}
              style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, color:'rgba(255,255,255,.35)', fontWeight:500 }}
            >
              {cartItems.length} item{cartItems.length!==1?'s':''}
            </motion.span>
          </div>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:28, alignItems:'start' }}>

          {/* ── ITEMS LIST ── */}
          <div>
            <motion.ul layout style={{ display:'flex', flexDirection:'column', gap:14, listStyle:'none', padding:0 }}>
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, i) => (
                  <li key={item.productId}>
                    <CartItem
                      item={item} index={i}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                    />
                  </li>
                ))}
              </AnimatePresence>
            </motion.ul>

            {/* Assurance strip */}
            <motion.div
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}
              className="assurance-strip" style={{ marginTop:24 }}
            >
              {[
                { icon:<FiTruck size={14}/>,   label:'Free shipping over $50' },
                { icon:<FiShield size={14}/>,  label:'100% secure checkout' },
                { icon:<FiPackage size={14}/>, label:'Easy 30-day returns' },
              ].map((a,i) => (
                <div key={i} className="assurance-item">{a.icon}{a.label}</div>
              ))}
            </motion.div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <motion.div
            initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:.6, delay:.2, ease:[.22,1,.36,1] }}
            className="summary-card"
          >
            <p style={{ fontFamily:'Clash Display,sans-serif', fontSize:20, fontWeight:700, color:'#fff', marginBottom:24 }}>Order Summary</p>

            {/* Free shipping progress */}
            <div style={{ marginBottom:22, padding:'14px 16px', background:'rgba(124,58,237,.1)', border:'1px solid rgba(124,58,237,.2)', borderRadius:14 }}>
              {shipping === 0 ? (
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'#34d399', fontWeight:600 }}>🎉 You've unlocked free shipping!</p>
              ) : (
                <>
                  <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:13, color:'rgba(255,255,255,.55)', marginBottom:6 }}>
                    Add <span style={{ color:'#a78bfa', fontWeight:600 }}>${remaining}</span> more for free shipping
                  </p>
                  <div className="ship-track">
                    <motion.div className="ship-fill"
                      initial={{ width:0 }} animate={{ width:`${shipProgress}%` }}
                      transition={{ duration:.8, ease:'easeOut' }}
                    />
                  </div>
                  <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:'rgba(255,255,255,.28)', marginTop:4 }}>{Math.round(shipProgress)}% towards free shipping</p>
                </>
              )}
            </div>

            {/* Promo code */}
            <div style={{ marginBottom:22 }}>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:600, color:'rgba(255,255,255,.35)', letterSpacing:2.5, textTransform:'uppercase', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                <FiTag size={12}/> Promo Code
              </p>
              {promoApplied ? (
                <motion.div initial={{ scale:.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.25)', borderRadius:11 }}
                >
                  <span style={{ fontSize:14, color:'#34d399', fontWeight:600, fontFamily:'DM Sans,sans-serif' }}>✓ SAVE10 applied — 10% off!</span>
                </motion.div>
              ) : (
                <div style={{ display:'flex' }}>
                  <input className="promo-input" placeholder="Enter code (SAVE10)" value={promo} onChange={e=>setPromo(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&handlePromo()} />
                  <button className="promo-btn" onClick={handlePromo}>Apply</button>
                </div>
              )}
            </div> 

            {/* Line items */}
            <div style={{ marginBottom:20 }}>
              <div className="sum-row">
                <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.5)' }}>Subtotal ({cartItems.length} items)</span>
                <motion.span key={cartTotal}
                  initial={{ scale:.85 }} animate={{ scale:1 }}
                  transition={{ type:'spring', stiffness:400 }}
                  style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.8)', fontWeight:600 }}
                >${cartTotal.toFixed(2)}</motion.span>
              </div>

              {promoApplied && (
                <motion.div className="sum-row" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}>
                  <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#34d399' }}>Promo (SAVE10)</span>
                  <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#34d399', fontWeight:600 }}>−${discount.toFixed(2)}</span>
                </motion.div>
              )}

              <div className="sum-row">
                <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,.5)' }}>Shipping</span>
                <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600, color: shipping===0 ? '#34d399' : 'rgba(255,255,255,.8)' }}>
                  {shipping===0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div style={{ padding:'18px 0 22px', borderTop:'1px solid rgba(255,255,255,.1)', marginBottom:22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:15, fontWeight:600, color:'rgba(255,255,255,.7)' }}>Total</span>
                <motion.span
                  key={grandTotal}
                  initial={{ scale:.8, opacity:.5 }} animate={{ scale:1, opacity:1 }}
                  transition={{ type:'spring', stiffness:350, damping:18 }}
                  style={{ fontFamily:'Clash Display,sans-serif', fontSize:28, fontWeight:700, background:'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}
                >
                  ${grandTotal}
                </motion.span>
              </div>
              <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:11, color:'rgba(255,255,255,.25)', marginTop:4 }}>Inclusive of all taxes</p>
            </div>

            {/* Checkout */}
            <motion.button
              className="checkout-btn"
              onClick={handleCheckout}
              whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
            >
              Proceed to Checkout <FiArrowRight size={17}/>
            </motion.button>

            {/* Continue shopping */}
            <motion.div style={{ textAlign:'center', marginTop:16 }}>
              <NavLink to="/products" style={{
                fontFamily:'DM Sans,sans-serif', fontSize:13,
                color:'rgba(255,255,255,.32)', textDecoration:'none',
                display:'inline-flex', alignItems:'center', gap:5, transition:'color .2s'
              }}
                onMouseEnter={e=>e.currentTarget.style.color='rgba(167,139,250,.75)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.32)'}
              >
                ← Continue shopping
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Responsive grid breakpoint */}
      <style>{`
        @media(max-width:860px){
          .cart-page [style*="grid-template-columns"]{
            display:flex!important;flex-direction:column!important;
          }
          .summary-card{position:static!important;}
          .cart-item-img{width:90px!important;height:90px!important;}
        }
        @media(max-width:520px){
          .cart-item-card{flex-direction:column!important;}
          .cart-item-img{width:100%!important;height:180px!important;}
        }
      `}</style>
    </div>
  );
};

export default Cart;