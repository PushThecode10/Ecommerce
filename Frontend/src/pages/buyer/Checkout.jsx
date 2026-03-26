import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../../Redux/createSlice.js';
import { buyerAPI } from '../../service/apiAuth.js';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import {
  FiCreditCard, FiDollarSign, FiMapPin, FiUser,
  FiPhone, FiArrowRight, FiShoppingBag, FiShield,
  FiTruck, FiCheck, FiChevronRight, FiMail, FiGlobe,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Keyframes + non-Tailwind bits ─────────────────────────────────────── */
const Keyframes = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    html, body, #root {
      background: #060612 !important;
      color: #fff !important;
      font-family: 'DM Sans', sans-serif !important;
    }

    @keyframes orb-a { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-40px) scale(1.1)} 75%{transform:translate(-30px,25px) scale(.93)} }
    @keyframes orb-b { 0%,100%{transform:translate(0,0) scale(1)} 45%{transform:translate(-40px,35px) scale(1.08)} }
    @keyframes grid-p { 0%,100%{opacity:.025} 50%{opacity:.05} }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes float-up { 0%,100%{transform:translateY(0);opacity:.2} 50%{transform:translateY(-20px);opacity:.55} }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes check-draw { from{stroke-dashoffset:30} to{stroke-dashoffset:0} }

    .font-clash { font-family: 'Clash Display', sans-serif !important; }
    .font-dm    { font-family: 'DM Sans', sans-serif !important; }

    .orb-a-anim { animation: orb-a 22s ease-in-out infinite; }
    .orb-b-anim { animation: orb-b 26s ease-in-out infinite 3s; }
    .grid-anim  { animation: grid-p 8s ease-in-out infinite; }
    .float-p    { animation: float-up var(--dur,5s) ease-in-out var(--delay,0s) infinite; }
    .spinner    { animation: spin 1s linear infinite; }

    .grad-purple  { background: linear-gradient(135deg,#7c3aed,#6d28d9) !important; }
    .grad-text    { background: linear-gradient(135deg,#a78bfa,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .grad-pink    { background: linear-gradient(135deg,#ec4899,#be185d) !important; }
    .grad-esewa   { background: linear-gradient(135deg,#4caf50,#2e7d32) !important; }
    .section-card { background: rgba(255,255,255,.045) !important; border: 1px solid rgba(255,255,255,.09) !important; }
    .input-dark {
      background: rgba(255,255,255,.07) !important;
      border: 1px solid rgba(255,255,255,.12) !important;
      color: #fff !important;
      font-family: 'DM Sans', sans-serif;
      transition: border-color .25s, box-shadow .25s;
    }
    .input-dark::placeholder { color: rgba(255,255,255,.25); }
    .input-dark:focus {
      outline: none;
      border-color: rgba(124,58,237,.6) !important;
      box-shadow: 0 0 0 3px rgba(124,58,237,.15);
    }
    .pay-option {
      background: rgba(255,255,255,.045) !important;
      border: 1px solid rgba(255,255,255,.1) !important;
      border-radius: 14px;
      cursor: pointer;
      transition: border-color .25s, box-shadow .25s, background .25s;
    }
    .pay-option:hover {
      border-color: rgba(124,58,237,.4) !important;
      background: rgba(124,58,237,.07) !important;
    }
    .pay-option.selected {
      border-color: rgba(124,58,237,.55) !important;
      background: rgba(124,58,237,.12) !important;
      box-shadow: 0 0 0 3px rgba(124,58,237,.12);
    }
    .pay-option.esewa-selected {
      border-color: rgba(76,175,80,.55) !important;
      background: rgba(76,175,80,.1) !important;
      box-shadow: 0 0 0 3px rgba(76,175,80,.12);
    }
    .pay-option input[type="radio"] { display: none; }
    .radio-dot {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,.25);
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: border-color .2s, background .2s;
    }
    .pay-option.selected .radio-dot,
    .pay-option.esewa-selected .radio-dot {
      border-color: #7c3aed;
      background: #7c3aed;
    }
    .pay-option.esewa-selected .radio-dot { border-color: #4caf50; background: #4caf50; }
    .radio-inner {
      width: 7px; height: 7px; border-radius: 50%; background: #fff;
      transform: scale(0); transition: transform .2s;
    }
    .pay-option.selected .radio-inner,
    .pay-option.esewa-selected .radio-inner { transform: scale(1); }

    .submit-btn {
      background: linear-gradient(135deg,#7c3aed,#6d28d9) !important;
      box-shadow: 0 6px 28px rgba(124,58,237,.42);
      transition: transform .2s, box-shadow .2s;
    }
    .submit-btn:hover { transform: scale(1.02); box-shadow: 0 8px 40px rgba(124,58,237,.6) !important; }
    .submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

    .esewa-btn {
      background: linear-gradient(135deg,#4caf50,#2e7d32) !important;
      box-shadow: 0 6px 28px rgba(76,175,80,.42);
      transition: transform .2s, box-shadow .2s;
    }
    .esewa-btn:hover { transform: scale(1.02); box-shadow: 0 8px 40px rgba(76,175,80,.6) !important; }

    .step-line { background: rgba(255,255,255,.08); }
    .step-line.done { background: linear-gradient(90deg,#7c3aed,#ec4899); }

    .order-item-row { border-bottom: 1px solid rgba(255,255,255,.06); }
    .order-item-row:last-child { border-bottom: none; }

    .summary-card {
      background: rgba(255,255,255,.042) !important;
      border: 1px solid rgba(255,255,255,.09) !important;
    }

    /* eSewa badge */
    .esewa-badge {
      background: linear-gradient(135deg, rgba(76,175,80,.15), rgba(46,125,50,.1));
      border: 1px solid rgba(76,175,80,.3);
      border-radius: 12px;
    }

    ::selection { background: rgba(124,58,237,.4); color: #fff; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #060612; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#7c3aed,#ec4899); border-radius: 4px; }
  `}</style>
);

/* ─── eSewa logo SVG ─────────────────────────────────────────────────────── */
const EsewaLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#4caf50"/>
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
      style={{ fontSize: 11, fontWeight: 700, fill: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
      eSewa
    </text>
  </svg>
);

/* ─── Section wrapper ────────────────────────────────────────────────────── */
const Section = ({ title, icon, children, delay = 0 }) => (
  <motion.div
    className="section-card rounded-2xl p-6 md:p-7"
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: .6, delay, ease: [.22, 1, .36, 1] }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="grad-purple w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
        style={{ boxShadow: '0 4px 16px rgba(124,58,237,.4)' }}>
        {icon}
      </div>
      <h2 className="font-clash text-lg font-bold text-white">{title}</h2>
    </div>
    {children}
  </motion.div>
);

/* ─── Input field ────────────────────────────────────────────────────────── */
const Field = ({ label, name, type = 'text', value, onChange, required, placeholder, icon }) => (
  <div>
    <label className="block font-dm text-[12px] font-semibold text-white/40 uppercase tracking-[2.5px] mb-2">
      {label}{required && <span className="text-[#ec4899] ml-1">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        className={`input-dark w-full rounded-xl py-3 pr-4 text-sm font-dm ${icon ? 'pl-10' : 'pl-4'}`}
      />
    </div>
  </div>
);

/* ─── Payment option ─────────────────────────────────────────────────────── */
const PayOption = ({ value, selected, onChange, icon, label, sub, isEsewa }) => {
  const selClass = isEsewa && selected ? 'esewa-selected' : selected ? 'selected' : '';
  return (
    <label className={`pay-option flex items-center gap-4 p-4 ${selClass}`}
      onClick={() => onChange(value)}
    >
      <input type="radio" name="paymentMethod" value={value} checked={selected} readOnly />
      <div className="radio-dot"><div className="radio-inner" /></div>
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
          ${selected ? (isEsewa ? 'grad-esewa' : 'grad-purple') : 'bg-white/[.07]'}`}
          style={selected ? { boxShadow: isEsewa ? '0 4px 14px rgba(76,175,80,.35)' : '0 4px 14px rgba(124,58,237,.35)' } : {}}
        >
          {icon}
        </div>
        <div>
          <p className="font-clash text-[14px] font-semibold text-white">{label}</p>
          <p className="font-dm text-[12px] text-white/40 mt-0.5">{sub}</p>
        </div>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className={`w-5 h-5 rounded-full flex items-center justify-center ml-auto flex-shrink-0 ${isEsewa ? 'grad-esewa' : 'grad-purple'}`}
        >
          <FiCheck size={11} color="#fff" />
        </motion.div>
      )}
    </label>
  );
};

/* ─── Empty state ────────────────────────────────────────────────────────── */
const EmptyCheckout = ({ onBrowse }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center relative z-[2]">
    <motion.div animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
      <span className="text-7xl">🛒</span>
    </motion.div>
    <h1 className="font-clash text-3xl font-bold text-white mt-6 mb-3">Nothing to Checkout</h1>
    <p className="font-dm text-base text-white/40 mb-8 max-w-sm leading-relaxed">
      Your cart is empty. Add some products before checking out.
    </p>
    <motion.button
      onClick={onBrowse}
      className="submit-btn flex items-center gap-2.5 px-9 py-4 rounded-full border-none text-white font-dm text-base font-bold cursor-pointer"
      whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
    >
      <FiShoppingBag size={17} /> Browse Products <FiArrowRight size={16} />
    </motion.button>
  </div>
);

/* ─── eSewa hidden form submitter ───────────────────────────────────────── */
const submitEsewaForm = ({ totalPayable, transactionUuid, signature, formData, taxAmount }) => {
  // Remove any existing eSewa form
  const existing = document.getElementById('esewa-form');
  if (existing) existing.remove();

  const form = document.createElement('form');
  form.id = 'esewa-form';
  form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
  form.method = 'POST';
  form.style.display = 'none';

  const fields = {
    amount:                   formData.cartTotal,
    tax_amount:               taxAmount,
    total_amount:             totalPayable,
    transaction_uuid:         transactionUuid,
    product_code:             'EPAYTEST',
    product_service_charge:   '0',
    product_delivery_charge:  '0',
    success_url:              `${window.location.origin}/success`,
    failure_url:              `${window.location.origin}/failure`,
    signed_field_names:       'total_amount,transaction_uuid,product_code',
    signature:                signature,
  };

  Object.entries(fields).forEach(([k, v]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = k;
    input.value = v;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

/* ─── Checkout ───────────────────────────────────────────────────────────── */
const Checkout = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { user }  = useSelector(s => s.auth);

  const [formData, setFormData] = useState({
    // Personal info
    name:          user?.name            || '',
    email:         user?.email           || '',
    phone:         user?.phone           || '',
    // Address
    street:        user?.address?.street || '',
    city:          user?.address?.city   || '',
    state:         user?.address?.state  || '',
    zipCode:       user?.address?.zipCode|| '',
    country:       user?.address?.country|| 'Nepal',
    // Payment
    paymentMethod: 'cod',
    // Card fields
    cardNumber:    '',
    expiry:        '',
    cvv:           '',
    cardName:      '',
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(1); // 1 = shipping, 2 = payment

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const setPayment   = v => setFormData({ ...formData, paymentMethod: v });

  // eSewa amounts
  const taxAmount      = 0;
  const serviceCharge  = 0;
  const deliveryCharge = cartTotal >= 50 ? 0 : 4.99;
  const totalPayable   = parseFloat((cartTotal + deliveryCharge + taxAmount + serviceCharge).toFixed(2));

  const handleSubmit = async e => {
    e.preventDefault();
    if (cartItems.length === 0) { toast.error('Cart is empty'); return; }

    // ─── eSewa flow ───────────────────────────────────────────────────────
    if (formData.paymentMethod === 'esewa') {
      setLoading(true);
      try {
        // Save order first (pending), then redirect to eSewa
        const transactionUuid = uuidv4();
        const product_code    = 'EPAYTEST';
        const message         = `total_amount=${totalPayable},transaction_uuid=${transactionUuid},product_code=${product_code}`;
        const hash            = CryptoJS.HmacSHA256(message, '8gBm/:&EnhH.1/q');
        const signature       = CryptoJS.enc.Base64.stringify(hash);

        // Optionally: save a pending order to your backend before redirecting
        // await buyerAPI.createOrder({ ...orderData, paymentMethod: 'esewa', transactionUuid });

        toast.success('Redirecting to eSewa…');
        submitEsewaForm({
          totalPayable,
          transactionUuid,
          signature,
          formData: { ...formData, cartTotal },
          taxAmount,
        });
      } catch (err) {
        console.error(err);
        toast.error('eSewa redirect failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ─── COD / Card / UPI flow ────────────────────────────────────────────
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: {
          name:    formData.name,
          email:   formData.email,
          phone:   formData.phone,
          street:  formData.street,
          city:    formData.city,
          state:   formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };
      await buyerAPI.createOrder(orderData);
      dispatch(clearCart());
      toast.success('🎉 Order placed successfully!');
      navigate('/buyer/orders');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shipping   = deliveryCharge;
  const grandTotal = totalPayable.toFixed(2);

  const paymentOptions = [
    { value: 'cod',   icon: <FiDollarSign size={18} style={{ color: '#34d399' }} />, label: 'Cash on Delivery',    sub: 'Pay when you receive your order' },
    { value: 'esewa', icon: <EsewaLogo size={22} />,                                  label: 'eSewa',               sub: 'Fast & secure digital wallet', isEsewa: true },
    { value: 'card',  icon: <FiCreditCard size={18} style={{ color: '#60a5fa' }} />, label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex & more' },
    { value: 'upi',   icon: <span style={{ fontSize: 18 }}>💳</span>,                label: 'UPI',                 sub: 'PhonePe, Google Pay, Paytm' },
  ];

  if (cartItems.length === 0) return (
    <>
      <Keyframes />
      <div className="min-h-screen" style={{ background: '#060612' }}>
        <div className="fixed top-0 right-0 -translate-y-[12%] w-[560px] h-[560px] rounded-full orb-a-anim pointer-events-none z-0 blur-[130px] opacity-[.13]" style={{ background: '#7c3aed' }} />
        <div className="fixed bottom-0 left-0 -translate-x-[6%] w-[480px] h-[480px] rounded-full orb-b-anim pointer-events-none z-0 blur-[120px] opacity-[.1]" style={{ background: '#db2777' }} />
        <div className="relative z-[2] max-w-5xl mx-auto px-6">
          <EmptyCheckout onBrowse={() => navigate('/products')} />
        </div>
      </div>
    </>
  );

  return (
    <>
      <Keyframes />

      {/* Background */}
      <div className="fixed top-0 right-0 -translate-y-[12%] w-[560px] h-[560px] rounded-full orb-a-anim pointer-events-none z-0 blur-[130px] opacity-[.13]" style={{ background: '#7c3aed' }} />
      <div className="fixed bottom-0 left-0 -translate-x-[6%] w-[480px] h-[480px] rounded-full orb-b-anim pointer-events-none z-0 blur-[120px] opacity-[.1]" style={{ background: '#db2777' }} />
      <div className="grid-anim fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'64px 64px' }} />

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="float-p absolute rounded-full"
            style={{ left:`${(i*73+11)%100}%`, top:`${(i*41+7)%100}%`, width:`${i%3+1}px`, height:`${i%3+1}px`, background:'rgba(255,255,255,.4)', '--dur':`${5+i%4}s`, '--delay':`${i*.35}s` }}
          />
        ))}
      </div>

      <div className="relative z-[2] max-w-6xl mx-auto px-4 md:px-6 pb-24">

        {/* ── Header ── */}
        <motion.div initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-5 text-xs font-dm">
            {['Cart','Checkout','Confirmation'].map((crumb,i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <FiChevronRight size={12} className="text-white/20" />}
                <span className={i === 1 ? 'text-[#a78bfa] font-semibold' : 'text-white/30'}>{crumb}</span>
              </span>
            ))}
          </div>
          <span className="block font-dm text-[11px] font-semibold tracking-[4px] uppercase text-[#a78bfa] mb-2">
            Almost there
          </span>
          <h1 className="font-clash text-3xl md:text-4xl font-bold text-white">Checkout</h1>
        </motion.div>

        {/* ── Step pills ── */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.12 }}
          className="flex items-center gap-3 mb-8"
        >
          {[{ n:1, label:'Shipping' }, { n:2, label:'Payment' }].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              {i > 0 && <div className="hidden sm:block h-0.5 w-12 rounded-full step-line" />}
              <button
                onClick={() => setStep(s.n)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-dm text-sm font-semibold transition-all border-none cursor-pointer
                  ${step === s.n
                    ? 'grad-purple text-white'
                    : step > s.n
                      ? 'text-[#34d399] bg-[rgba(52,211,153,.12)]'
                      : 'bg-white/[.07] text-white/45'
                  }`}
                style={step === s.n ? { boxShadow: '0 4px 16px rgba(124,58,237,.38)' } : {}}
              >
                {step > s.n
                  ? <FiCheck size={14} />
                  : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{s.n}</span>
                }
                {s.label}
              </button>
            </div>
          ))}
        </motion.div>

        {/* ── Grid ── */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT — form */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="shipping"
                    initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                    exit={{ opacity:0, x:20 }}
                    transition={{ duration:.35, ease:[.22,1,.36,1] }}
                    className="flex flex-col gap-5"
                  >
                    {/* ── Personal Information ── */}
                    <Section title="Personal Information" icon={<FiUser size={16}/>} delay={.05}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Full Name"     name="name"  value={formData.name}  onChange={handleChange} required placeholder="John Doe"           icon={<FiUser size={15}/>} />
                        <Field label="Email Address" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com"   icon={<FiMail size={15}/>} type="email" />
                      </div>
                      <div className="mt-4">
                        <Field label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+977 9800000000" icon={<FiPhone size={15}/>} />
                      </div>
                    </Section>

                    {/* ── Shipping Address ── */}
                    <Section title="Shipping Address" icon={<FiMapPin size={16}/>} delay={.1}>
                      <div className="mt-0">
                        <Field label="Street Address" name="street" value={formData.street} onChange={handleChange} required placeholder="123 Main Street, Thamel" icon={<FiMapPin size={15}/>} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <Field label="City"     name="city"    value={formData.city}    onChange={handleChange} required placeholder="Kathmandu" />
                        <Field label="Province" name="state"   value={formData.state}   onChange={handleChange} required placeholder="Bagmati" />
                        <Field label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleChange} required placeholder="44600" />
                      </div>

                      <div className="mt-4">
                        <label className="block font-dm text-[12px] font-semibold text-white/40 uppercase tracking-[2.5px] mb-2">
                          Country <span className="text-[#ec4899] ml-1">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                            <FiGlobe size={15}/>
                          </span>
                          <select name="country" value={formData.country} onChange={handleChange}
                            className="input-dark w-full rounded-xl py-3 pl-10 pr-4 text-sm font-dm appearance-none"
                          >
                            {['Nepal','USA','Canada','UK','Australia','India','Germany','France'].map(c => (
                              <option key={c} value={c} style={{ background:'#0f0f1f', color:'#fff' }}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </Section>

                    {/* Assurance strip */}
                    <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
                      className="flex flex-wrap gap-4 justify-center py-4 px-6 rounded-2xl"
                      style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)' }}
                    >
                      {[
                        { icon:<FiShield size={14}/>, label:'Secure Checkout' },
                        { icon:<FiTruck size={14}/>,  label:'Free over $50' },
                        { icon:<FiCheck size={14}/>,  label:'Easy Returns' },
                      ].map((a,i) => (
                        <div key={i} className="flex items-center gap-2 font-dm text-[12px] text-white/35">
                          <span className="text-[#a78bfa]">{a.icon}</span> {a.label}
                        </div>
                      ))}
                    </motion.div>

                    {/* Next step */}
                    <motion.button type="button"
                      onClick={() => setStep(2)}
                      className="submit-btn w-full py-4 rounded-2xl border-none text-white font-dm text-base font-bold cursor-pointer flex items-center justify-center gap-3"
                      whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                      initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.35 }}
                    >
                      Continue to Payment <FiArrowRight size={17}/>
                    </motion.button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="payment"
                    initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                    exit={{ opacity:0, x:-20 }}
                    transition={{ duration:.35, ease:[.22,1,.36,1] }}
                    className="flex flex-col gap-5"
                  >
                    <Section title="Payment Method" icon={<FiCreditCard size={16}/>} delay={.05}>
                      <div className="flex flex-col gap-3">
                        {paymentOptions.map(opt => (
                          <PayOption key={opt.value}
                            value={opt.value} selected={formData.paymentMethod === opt.value}
                            onChange={setPayment} icon={opt.icon} label={opt.label} sub={opt.sub}
                            isEsewa={opt.isEsewa}
                          />
                        ))}
                      </div>

                      {/* eSewa info panel */}
                      <AnimatePresence>
                        {formData.paymentMethod === 'esewa' && (
                          <motion.div
                            initial={{ opacity:0, height:0, y:-10 }}
                            animate={{ opacity:1, height:'auto', y:0 }}
                            exit={{ opacity:0, height:0, y:-10 }}
                            transition={{ duration:.35 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 p-4 esewa-badge flex flex-col gap-3">
                              <div className="flex items-center gap-2.5">
                                <EsewaLogo size={28} />
                                <div>
                                  <p className="font-clash text-[13px] font-semibold text-[#4caf50]">Pay with eSewa</p>
                                  <p className="font-dm text-[11px] text-white/40 mt-0.5">You'll be redirected to eSewa to complete payment</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2"
                                style={{ borderTop: '1px solid rgba(76,175,80,.2)' }}
                              >
                                <span className="font-dm text-[12px] text-white/50">Total payable via eSewa</span>
                                <span className="font-clash text-[18px] font-bold text-[#4caf50]">Rs. {grandTotal}</span>
                              </div>
                              <p className="font-dm text-[11px] text-white/30 flex items-center gap-1.5">
                                <FiShield size={11} className="text-[#4caf50]" />
                                Encrypted & secured by eSewa Payment Gateway (Test Mode)
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Card fields */}
                      <AnimatePresence>
                        {formData.paymentMethod === 'card' && (
                          <motion.div
                            initial={{ opacity:0, height:0, y:-10 }}
                            animate={{ opacity:1, height:'auto', y:0 }}
                            exit={{ opacity:0, height:0, y:-10 }}
                            transition={{ duration:.35 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 p-4 rounded-xl flex flex-col gap-3"
                              style={{ background:'rgba(124,58,237,.08)', border:'1px solid rgba(124,58,237,.2)' }}
                            >
                              <p className="font-dm text-[11px] font-semibold text-[#a78bfa] tracking-[2px] uppercase">Card Details</p>
                              <Field label="Name on Card"  name="cardName"   value={formData.cardName}   onChange={handleChange} placeholder="John Doe"              icon={<FiUser size={15}/>} />
                              <Field label="Card Number"   name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456"   icon={<FiCreditCard size={15}/>} />
                              <div className="grid grid-cols-2 gap-3">
                                <Field label="Expiry" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="MM / YY" />
                                <Field label="CVV"    name="cvv"    value={formData.cvv}    onChange={handleChange} placeholder="•••" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Section>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-2xl border-none font-dm text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all text-white/60 hover:text-white/90"
                        style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)' }}
                      >
                        ← Back
                      </button>

                      <motion.button type="submit"
                        disabled={loading}
                        className={`flex-[3] py-4 rounded-2xl border-none text-white font-clash text-base font-bold cursor-pointer flex items-center justify-center gap-3
                          ${formData.paymentMethod === 'esewa' ? 'esewa-btn' : 'submit-btn'}`}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : .97 }}
                      >
                        {loading ? (
                          <>
                            <div className="spinner w-5 h-5 rounded-full border-2 border-white/25 border-t-white flex-shrink-0" />
                            {formData.paymentMethod === 'esewa' ? 'Redirecting to eSewa…' : 'Placing Order…'}
                          </>
                        ) : formData.paymentMethod === 'esewa' ? (
                          <>
                            <EsewaLogo size={20} />
                            Pay Rs.{grandTotal} via eSewa <FiArrowRight size={17}/>
                          </>
                        ) : (
                          <>
                            Place Order · ${grandTotal} <FiArrowRight size={17}/>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT — Order summary */}
            <div className="lg:col-span-1">
              <motion.div
                className="summary-card rounded-2xl p-6 sticky top-24"
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                transition={{ duration:.6, delay:.2, ease:[.22,1,.36,1] }}
              >
                <h2 className="font-clash text-lg font-bold text-white mb-5">Order Summary</h2>

                {/* Items */}
                <div className="mb-4">
                  {cartItems.map((item, i) => (
                    <motion.div key={item.productId}
                      className="order-item-row flex items-center gap-3 py-3"
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:.25 + i*.05 }}
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.09)' }}
                      >
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e=>{ e.target.src='https://placehold.co/40x40/0d0d1f/7c3aed?text=✦'; }}/>
                          : <div className="w-full h-full flex items-center justify-center text-white/20 text-lg">✦</div>
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-dm text-[13px] font-medium text-white/80 truncate">{item.name}</p>
                        <p className="font-dm text-[11px] text-white/35 mt-0.5">× {item.quantity}</p>
                      </div>

                      <span className="font-clash text-[14px] font-bold flex-shrink-0 grad-text">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-dm text-[13px] text-white/45">Subtotal</span>
                    <span className="font-dm text-[13px] text-white/75 font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-dm text-[13px] text-white/45">Shipping</span>
                    <span className={`font-dm text-[13px] font-semibold ${shipping === 0 ? 'text-[#34d399]' : 'text-white/75'}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {taxAmount > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-dm text-[13px] text-white/45">Tax</span>
                      <span className="font-dm text-[13px] text-white/75">${taxAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline pt-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}
                  >
                    <span className="font-dm text-[14px] font-semibold text-white/60">Total</span>
                    <motion.span
                      key={grandTotal}
                      className={`font-clash text-2xl font-bold ${formData.paymentMethod === 'esewa' ? 'text-[#4caf50]' : 'grad-text'}`}
                      initial={{ scale:.85, opacity:.5 }} animate={{ scale:1, opacity:1 }}
                      transition={{ type:'spring', stiffness:350, damping:18 }}
                    >
                      {formData.paymentMethod === 'esewa' ? `Rs. ${grandTotal}` : `$${grandTotal}`}
                    </motion.span>
                  </div>
                  <p className="font-dm text-[11px] text-white/22 mt-1.5">Inclusive of all taxes</p>
                </div>

                {/* Payment badge */}
                <div className="mt-5 flex items-center gap-2.5 py-3 px-4 rounded-xl"
                  style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)' }}
                >
                  <FiShield size={14} className="text-[#34d399] flex-shrink-0" />
                  <span className="font-dm text-[12px] text-white/38">100% secure & encrypted checkout</span>
                </div>

                {/* eSewa badge in summary */}
                <AnimatePresence>
                  {formData.paymentMethod === 'esewa' && (
                    <motion.div
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
                      className="mt-3 flex items-center gap-2.5 py-3 px-4 rounded-xl esewa-badge"
                    >
                      <EsewaLogo size={16} />
                      <span className="font-dm text-[12px] text-[#4caf50]/80">Paying via eSewa Gateway</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;