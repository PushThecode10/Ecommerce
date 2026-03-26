import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FiShoppingBag, FiArrowRight, FiHome, FiCheckCircle, FiPackage, FiClock } from 'react-icons/fi';

/* ─── Shared keyframes ───────────────────────────────────────────────────── */
const Keyframes = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    html, body, #root {
      background: #060612 !important;
      color: #fff !important;
      font-family: 'DM Sans', sans-serif !important;
      margin: 0; padding: 0;
    }

    .font-clash { font-family: 'Clash Display', sans-serif !important; }
    .font-dm    { font-family: 'DM Sans', sans-serif !important; }

    @keyframes orb-a    { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-40px) scale(1.1)} 75%{transform:translate(-30px,25px) scale(.93)} }
    @keyframes orb-b    { 0%,100%{transform:translate(0,0) scale(1)} 45%{transform:translate(-40px,35px) scale(1.08)} }
    @keyframes grid-p   { 0%,100%{opacity:.025} 50%{opacity:.05} }
    @keyframes float-up { 0%,100%{transform:translateY(0);opacity:.2} 50%{transform:translateY(-20px);opacity:.55} }
    @keyframes spin-slow { to { transform: rotate(360deg); } }
    @keyframes burst     { 0%{transform:scale(0) rotate(0deg);opacity:1} 100%{transform:scale(1.8) rotate(180deg);opacity:0} }
    @keyframes check-in  { 0%{stroke-dashoffset:80;opacity:0} 60%{opacity:1} 100%{stroke-dashoffset:0;opacity:1} }
    @keyframes ring-pulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.18);opacity:.15} }
    @keyframes confetti-fall {
      0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
    @keyframes count-up  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer-g { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

    .orb-a-anim  { animation: orb-a 22s ease-in-out infinite; }
    .orb-b-anim  { animation: orb-b 26s ease-in-out infinite 3s; }
    .grid-anim   { animation: grid-p 8s ease-in-out infinite; }
    .float-p     { animation: float-up var(--dur,5s) ease-in-out var(--delay,0s) infinite; }
    .ring-anim   { animation: ring-pulse 2.4s ease-in-out infinite; }
    .spin-slow   { animation: spin-slow 12s linear infinite; }
    .count-up    { animation: count-up .5s ease forwards; }

    .grad-green  { background: linear-gradient(135deg,#22c55e,#16a34a) !important; }
    .grad-text-g { background: linear-gradient(135deg,#4ade80,#22c55e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .grad-purple { background: linear-gradient(135deg,#7c3aed,#6d28d9) !important; }

    .card-glass {
      background: rgba(255,255,255,.042) !important;
      border: 1px solid rgba(255,255,255,.09) !important;
      backdrop-filter: blur(12px);
    }
    .card-green {
      background: rgba(34,197,94,.07) !important;
      border: 1px solid rgba(34,197,94,.18) !important;
    }
    .step-item { border-bottom: 1px solid rgba(255,255,255,.06); }
    .step-item:last-child { border-bottom: none; }

    .btn-green {
      background: linear-gradient(135deg,#22c55e,#16a34a) !important;
      box-shadow: 0 6px 28px rgba(34,197,94,.4);
      transition: transform .2s, box-shadow .2s;
    }
    .btn-green:hover { transform: scale(1.02); box-shadow: 0 8px 40px rgba(34,197,94,.6) !important; }

    .btn-ghost {
      background: rgba(255,255,255,.07) !important;
      border: 1px solid rgba(255,255,255,.1) !important;
      transition: background .2s, border-color .2s;
    }
    .btn-ghost:hover { background: rgba(255,255,255,.11) !important; border-color: rgba(255,255,255,.18) !important; }

    /* Ticker */
    .ticker-wrap { overflow: hidden; white-space: nowrap; }
    .ticker-inner { display: inline-block; animation: ticker 18s linear infinite; }

    ::selection { background: rgba(34,197,94,.35); color: #fff; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #060612; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#22c55e,#16a34a); border-radius: 4px; }
  `}</style>
);

/* ─── Confetti piece ─────────────────────────────────────────────────────── */
const Confetti = ({ pieces }) => (
  <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    {pieces.map((p, i) => (
      <div key={i} style={{
        position: 'absolute',
        left: `${p.x}%`,
        top: '-10px',
        width: `${p.size}px`,
        height: `${p.size * 2.2}px`,
        background: p.color,
        borderRadius: p.round ? '50%' : '2px',
        opacity: 0,
        animation: `confetti-fall ${p.dur}s ease-in ${p.delay}s forwards`,
        transform: `rotate(${p.rot}deg)`,
      }} />
    ))}
  </div>
);

/* ─── Animated check SVG ─────────────────────────────────────────────────── */
const AnimatedCheck = () => (
  <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
    {/* Outer ring pulse */}
    <div className="ring-anim absolute inset-0 rounded-full" style={{ border: '2px solid rgba(34,197,94,.35)' }} />
    {/* Mid ring */}
    <motion.div
      className="absolute rounded-full"
      style={{ inset: 8, border: '1.5px solid rgba(34,197,94,.2)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: .3, duration: .5, ease: [.22,1,.36,1] }}
    />
    {/* Green circle */}
    <motion.div
      className="grad-green absolute rounded-full flex items-center justify-center"
      style={{ inset: 16, boxShadow: '0 0 40px rgba(34,197,94,.5), 0 0 80px rgba(34,197,94,.2)' }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: .15, duration: .55, type: 'spring', stiffness: 260, damping: 18 }}
    >
      {/* Check SVG */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <motion.path
          d="M10 21 L17 28 L30 13"
          stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: .55, duration: .5, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
    {/* Burst rays */}
    {[0,45,90,135,180,225,270,315].map((deg, i) => (
      <motion.div key={i}
        style={{
          position: 'absolute',
          width: 3, height: 14,
          borderRadius: 4,
          background: 'rgba(34,197,94,.6)',
          transformOrigin: '50% 68px',
          transform: `rotate(${deg}deg)`,
          top: '50%', left: '50%', marginLeft: -1.5, marginTop: -68,
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ delay: .65 + i * .03, duration: .6 }}
      />
    ))}
  </div>
);

/* ─── Detail row ─────────────────────────────────────────────────────────── */
const DetailRow = ({ label, value, highlight, mono }) => (
  <div className="flex items-center justify-between py-2.5 step-item">
    <span className="font-dm text-[13px] text-white/45">{label}</span>
    <span className={`font-dm text-[13px] font-semibold ${highlight ? 'text-[#4ade80]' : mono ? 'font-mono text-white/70' : 'text-white/80'}`}>
      {value}
    </span>
  </div>
);

/* ─── EsewaLogo ──────────────────────────────────────────────────────────── */
const EsewaLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#4caf50"/>
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
      style={{ fontSize: 11, fontWeight: 700, fill: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
      eSewa
    </text>
  </svg>
);

/* ─── PaymentSuccess ─────────────────────────────────────────────────────── */
const PaymentSuccess = () => {
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const [confetti, setConfetti] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const fired = useRef(false);

  // eSewa returns these query params on success
  const transactionCode = params.get('transaction_code') || params.get('oid')         || '—';
  const status          = params.get('status')           || 'COMPLETE';
  const totalAmount     = params.get('total_amount')     || params.get('amt')          || '—';
  const transactionUuid = params.get('transaction_uuid') || params.get('refId')        || '—';
  const productCode     = params.get('product_code')     || 'EPAYTEST';

  // Generate confetti once
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const colors = ['#22c55e','#4ade80','#86efac','#a78bfa','#ec4899','#fbbf24','#60a5fa'];
    const pieces = Array.from({ length: 80 }, (_, i) => ({
      x:     Math.random() * 100,
      size:  Math.random() * 7 + 4,
      color: colors[i % colors.length],
      round: Math.random() > .5,
      rot:   Math.random() * 360,
      dur:   2.5 + Math.random() * 2.5,
      delay: Math.random() * 1.8,
    }));
    setConfetti(pieces);
  }, []);

  const steps = [
    { icon: '📦', label: 'Order Confirmed',  sub: 'Your order has been received',   time: 'Just now',     done: true  },
    { icon: '🏭', label: 'Processing',        sub: 'Items being prepared',           time: '~2 hours',     done: false },
    { icon: '🚚', label: 'Out for Delivery',  sub: 'On the way to you',              time: '1–3 days',     done: false },
    { icon: '🎉', label: 'Delivered',         sub: 'Enjoy your purchase!',           time: 'ETA 3–5 days', done: false },
  ];

  return (
    <>
      <Keyframes />
      <Confetti pieces={confetti} />

      {/* Background orbs */}
      <div className="fixed top-0 right-0 w-[560px] h-[560px] rounded-full orb-a-anim pointer-events-none z-0 blur-[130px] opacity-[.12]" style={{ background: '#22c55e' }} />
      <div className="fixed bottom-0 left-0 w-[480px] h-[480px] rounded-full orb-b-anim pointer-events-none z-0 blur-[120px] opacity-[.09]" style={{ background: '#7c3aed' }} />
      <div className="grid-anim fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)', backgroundSize:'64px 64px' }} />

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="float-p absolute rounded-full"
            style={{ left:`${(i*73+11)%100}%`, top:`${(i*41+7)%100}%`, width:`${i%3+1}px`, height:`${i%3+1}px`, background:'rgba(34,197,94,.5)', '--dur':`${5+i%4}s`, '--delay':`${i*.35}s` }}
          />
        ))}
      </div>

      <div className="relative z-[2] min-h-screen flex flex-col items-center justify-start px-4 py-12 max-w-xl mx-auto">

        {/* ── Check animation ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5 }}
          className="flex flex-col items-center mb-8"
        >
          <AnimatedCheck />

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .8, duration: .5 }}
          >
            <span className="block font-dm text-[11px] font-semibold tracking-[4px] uppercase text-[#4ade80] mb-2">
              Payment Successful
            </span>
            <h1 className="font-clash text-4xl font-bold text-white leading-tight">
              Order Placed! 🎉
            </h1>
            <p className="font-dm text-base text-white/45 mt-3 leading-relaxed">
              Your payment via eSewa was processed successfully.<br />
              We'll start preparing your order right away.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Transaction details card ── */}
        <motion.div
          className="card-glass w-full rounded-2xl p-6 mb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: .5, ease: [.22,1,.36,1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <EsewaLogo size={22} />
              <span className="font-clash text-[15px] font-bold text-white">eSewa Payment</span>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full font-dm text-[11px] font-semibold text-[#4ade80]"
              style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block" style={{ boxShadow: '0 0 6px #22c55e' }} />
              {status}
            </span>
          </div>

          <DetailRow label="Transaction Code" value={transactionCode} mono />
          <DetailRow label="Transaction UUID" value={transactionUuid.length > 18 ? transactionUuid.slice(0,18)+'…' : transactionUuid} mono />
          <DetailRow label="Product Code"     value={productCode} />
          <DetailRow label="Amount Paid"      value={`Rs. ${totalAmount}`} highlight />

          {/* Toggle full details */}
          <button
            onClick={() => setShowDetails(v => !v)}
            className="mt-3 w-full py-2 font-dm text-[12px] text-white/35 hover:text-white/60 transition-colors text-center cursor-pointer bg-transparent border-none"
          >
            {showDetails ? '▲ Hide details' : '▼ Show raw params'}
          </button>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }}
                className="overflow-hidden"
              >
                <pre className="mt-2 p-3 rounded-xl font-mono text-[11px] text-white/40 overflow-x-auto"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  {JSON.stringify(Object.fromEntries(params.entries()), null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Order tracking steps ── */}
        <motion.div
          className="card-glass w-full rounded-2xl p-6 mb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: .5, ease: [.22,1,.36,1] }}
        >
          <h2 className="font-clash text-[15px] font-bold text-white mb-4">Order Status</h2>
          <div>
            {steps.map((s, i) => (
              <motion.div
                key={i}
                className="step-item flex items-center gap-4 py-3"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.25 + i * .1 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                  ${s.done ? 'grad-green' : 'bg-white/[.06]'}`}
                  style={s.done ? { boxShadow: '0 4px 14px rgba(34,197,94,.35)' } : {}}
                >
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-clash text-[13px] font-semibold ${s.done ? 'text-white' : 'text-white/40'}`}>{s.label}</p>
                  <p className="font-dm text-[11px] text-white/30 mt-0.5">{s.sub}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {s.done
                    ? <FiCheckCircle size={16} className="text-[#4ade80]" />
                    : <FiClock size={15} className="text-white/20" />
                  }
                  <span className="font-dm text-[10px] text-white/25">{s.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Info strip ── */}
        <motion.div
          className="w-full rounded-2xl py-3.5 px-5 mb-6 flex items-center gap-3"
          style={{ background: 'rgba(167,139,250,.08)', border: '1px solid rgba(167,139,250,.15)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}
        >
          <FiPackage size={15} className="text-[#a78bfa] flex-shrink-0" />
          <p className="font-dm text-[12px] text-white/45 leading-relaxed">
            A confirmation email will be sent to your registered address. You can track your order from your dashboard.
          </p>
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          className="w-full flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: .45 }}
        >
          <button
            onClick={() => navigate('/buyer/orders')}
            className="btn-green flex-1 py-4 rounded-2xl border-none text-white font-clash text-base font-bold cursor-pointer flex items-center justify-center gap-2.5"
          >
            <FiPackage size={17} /> Track My Order <FiArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/products')}
            className="btn-ghost flex-1 py-4 rounded-2xl font-dm text-sm font-semibold text-white/65 cursor-pointer flex items-center justify-center gap-2"
          >
            <FiShoppingBag size={15} /> Continue Shopping
          </button>
        </motion.div>

        {/* ── Go home link ── */}
        <motion.button
          onClick={() => navigate('/')}
          className="mt-5 font-dm text-[12px] text-white/25 hover:text-white/50 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        >
          <FiHome size={12} /> Back to Home
        </motion.button>

      </div>
    </>
  );
};

export default PaymentSuccess;