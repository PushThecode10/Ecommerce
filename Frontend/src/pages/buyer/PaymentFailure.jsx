import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  FiAlertTriangle, FiRefreshCw, FiShoppingCart, FiHome,
  FiChevronDown, FiChevronUp, FiHeadphones, FiArrowRight,
} from 'react-icons/fi';

/* ─── Keyframes ──────────────────────────────────────────────────────────── */
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
    @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
    @keyframes glitch-1 { 0%,100%{clip-path:inset(0 0 95% 0)} 25%{clip-path:inset(15% 0 60% 0)} 50%{clip-path:inset(50% 0 30% 0)} 75%{clip-path:inset(75% 0 5% 0)} }
    @keyframes glitch-2 { 0%,100%{clip-path:inset(80% 0 5% 0);transform:translate(-3px,0)} 25%{clip-path:inset(40% 0 45% 0);transform:translate(3px,0)} 50%{clip-path:inset(10% 0 75% 0);transform:translate(-2px,0)} 75%{clip-path:inset(60% 0 20% 0);transform:translate(2px,0)} }
    @keyframes x-draw   { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
    @keyframes ring-err { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.2);opacity:.12} }
    @keyframes scan     { 0%{top:0;opacity:.6} 100%{top:100%;opacity:0} }

    .orb-a-anim  { animation: orb-a 22s ease-in-out infinite; }
    .orb-b-anim  { animation: orb-b 26s ease-in-out infinite 3s; }
    .grid-anim   { animation: grid-p 8s ease-in-out infinite; }
    .float-p     { animation: float-up var(--dur,5s) ease-in-out var(--delay,0s) infinite; }
    .shake-anim  { animation: shake .6s ease .5s both; }
    .ring-err    { animation: ring-err 2.6s ease-in-out infinite; }

    .grad-red    { background: linear-gradient(135deg,#ef4444,#b91c1c) !important; }
    .grad-text-r { background: linear-gradient(135deg,#fca5a5,#ef4444); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .grad-purple { background: linear-gradient(135deg,#7c3aed,#6d28d9) !important; }

    .card-glass {
      background: rgba(255,255,255,.042) !important;
      border: 1px solid rgba(255,255,255,.09) !important;
      backdrop-filter: blur(12px);
    }
    .card-red {
      background: rgba(239,68,68,.06) !important;
      border: 1px solid rgba(239,68,68,.18) !important;
    }
    .row-sep { border-bottom: 1px solid rgba(255,255,255,.06); }
    .row-sep:last-child { border-bottom: none; }

    .btn-red {
      background: linear-gradient(135deg,#ef4444,#b91c1c) !important;
      box-shadow: 0 6px 28px rgba(239,68,68,.38);
      transition: transform .2s, box-shadow .2s;
    }
    .btn-red:hover { transform: scale(1.02); box-shadow: 0 8px 40px rgba(239,68,68,.55) !important; }

    .btn-purple {
      background: linear-gradient(135deg,#7c3aed,#6d28d9) !important;
      box-shadow: 0 6px 28px rgba(124,58,237,.38);
      transition: transform .2s, box-shadow .2s;
    }
    .btn-purple:hover { transform: scale(1.02); box-shadow: 0 8px 40px rgba(124,58,237,.55) !important; }

    .btn-ghost {
      background: rgba(255,255,255,.07) !important;
      border: 1px solid rgba(255,255,255,.1) !important;
      transition: background .2s, border-color .2s;
    }
    .btn-ghost:hover { background: rgba(255,255,255,.11) !important; }

    ::selection { background: rgba(239,68,68,.3); color: #fff; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #060612; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#ef4444,#b91c1c); border-radius: 4px; }
  `}</style>
);

/* ─── Animated X icon ────────────────────────────────────────────────────── */
const AnimatedX = () => (
  <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
    {/* Outer ring pulse */}
    <div className="ring-err absolute inset-0 rounded-full" style={{ border: '2px solid rgba(239,68,68,.35)' }} />
    {/* Mid ring */}
    <motion.div
      className="absolute rounded-full"
      style={{ inset: 8, border: '1.5px solid rgba(239,68,68,.18)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: .25, duration: .5, ease: [.22,1,.36,1] }}
    />
    {/* Red circle */}
    <motion.div
      className="grad-red absolute rounded-full flex items-center justify-center shake-anim"
      style={{ inset: 16, boxShadow: '0 0 40px rgba(239,68,68,.45), 0 0 80px rgba(239,68,68,.18)' }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: .1, duration: .55, type: 'spring', stiffness: 260, damping: 18 }}
    >
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <motion.path d="M12 12 L26 26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: .6, duration: .35 }}
        />
        <motion.path d="M26 12 L12 26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: .75, duration: .35 }}
        />
      </svg>
    </motion.div>
    {/* Warning triangles orbiting */}
    {[0, 120, 240].map((deg, i) => (
      <motion.div key={i}
        style={{
          position: 'absolute',
          fontSize: 10,
          transformOrigin: '0 0',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, .7, 0], rotate: [deg, deg + 30] }}
        transition={{ delay: .9 + i * .12, duration: 1.2, repeat: 2, repeatType: 'reverse' }}
      >
        ⚠️
      </motion.div>
    ))}
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

/* ─── Common failure reasons ─────────────────────────────────────────────── */
const reasons = [
  { icon: '💳', title: 'Insufficient Balance',    desc: 'Your eSewa wallet or linked account had insufficient funds.' },
  { icon: '⏱️', title: 'Session Timeout',         desc: 'The payment session expired before it was completed.' },
  { icon: '🔒', title: 'Authentication Failed',   desc: 'Incorrect PIN/password or OTP mismatch.' },
  { icon: '🌐', title: 'Network Interruption',    desc: 'Poor connection caused the payment to drop mid-process.' },
  { icon: '🚫', title: 'Transaction Declined',    desc: 'Your bank or eSewa declined this transaction.' },
];

/* ─── PaymentFailure ─────────────────────────────────────────────────────── */
const PaymentFailure = () => {
  const navigate         = useNavigate();
  const [params]         = useSearchParams();
  const [showReasons, setShowReasons] = useState(false);
  const [showRaw, setShowRaw]         = useState(false);
  const [retrying, setRetrying]       = useState(false);

  const status          = params.get('status') || 'FAILED';
  const transactionUuid = params.get('transaction_uuid') || params.get('refId') || '—';
  const productCode     = params.get('product_code')     || 'EPAYTEST';
  const totalAmount     = params.get('total_amount')     || params.get('amt')   || '—';

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => navigate('/checkout'), 900);
  };

  return (
    <>
      <Keyframes />

      {/* Background — red-tinted orbs */}
      <div className="fixed top-0 right-0 w-[560px] h-[560px] rounded-full orb-a-anim pointer-events-none z-0 blur-[130px] opacity-[.10]" style={{ background: '#ef4444' }} />
      <div className="fixed bottom-0 left-0 w-[480px] h-[480px] rounded-full orb-b-anim pointer-events-none z-0 blur-[120px] opacity-[.08]" style={{ background: '#7c3aed' }} />
      <div className="grid-anim fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)', backgroundSize:'64px 64px' }} />

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="float-p absolute rounded-full"
            style={{ left:`${(i*73+11)%100}%`, top:`${(i*41+7)%100}%`, width:`${i%3+1}px`, height:`${i%3+1}px`, background:'rgba(239,68,68,.45)', '--dur':`${5+i%4}s`, '--delay':`${i*.35}s` }}
          />
        ))}
      </div>

      <div className="relative z-[2] min-h-screen flex flex-col items-center justify-start px-4 py-12 max-w-xl mx-auto">

        {/* ── Icon + Heading ── */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5 }}
        >
          <AnimatedX />

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .85, duration: .5 }}
          >
            <span className="block font-dm text-[11px] font-semibold tracking-[4px] uppercase text-[#fca5a5] mb-2">
              Payment Failed
            </span>
            <h1 className="font-clash text-4xl font-bold text-white leading-tight">
              Oops! Something<br />Went Wrong
            </h1>
            <p className="font-dm text-base text-white/45 mt-3 leading-relaxed max-w-sm mx-auto">
              Your payment could not be processed. Don't worry — no money has been deducted from your account.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Transaction info card ── */}
        <motion.div
          className="card-glass w-full rounded-2xl p-6 mb-5"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: .5, ease: [.22,1,.36,1] }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <EsewaLogo size={22} />
              <span className="font-clash text-[15px] font-bold text-white">eSewa Payment</span>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full font-dm text-[11px] font-semibold text-[#fca5a5]"
              style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.28)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] inline-block" />
              {status}
            </span>
          </div>

          {/* Details */}
          {[
            { label: 'Transaction UUID', value: transactionUuid.length > 18 ? transactionUuid.slice(0,18)+'…' : transactionUuid, mono: true },
            { label: 'Product Code',     value: productCode },
            { label: 'Attempted Amount', value: totalAmount !== '—' ? `Rs. ${totalAmount}` : '—', red: true },
          ].map((r, i) => (
            <div key={i} className="row-sep flex items-center justify-between py-2.5">
              <span className="font-dm text-[13px] text-white/45">{r.label}</span>
              <span className={`font-dm text-[13px] font-semibold ${r.red ? 'text-[#fca5a5]' : r.mono ? 'font-mono text-white/60' : 'text-white/75'}`}>
                {r.value}
              </span>
            </div>
          ))}

          {/* Raw params toggle */}
          <button onClick={() => setShowRaw(v => !v)}
            className="mt-3 w-full py-2 font-dm text-[12px] text-white/30 hover:text-white/55 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center gap-1.5"
          >
            {showRaw ? <FiChevronUp size={12}/> : <FiChevronDown size={12}/>}
            {showRaw ? 'Hide raw params' : 'Show raw params'}
          </button>
          <AnimatePresence>
            {showRaw && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }}
                className="overflow-hidden"
              >
                <pre className="mt-2 p-3 rounded-xl font-mono text-[11px] text-white/35 overflow-x-auto"
                  style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  {JSON.stringify(Object.fromEntries(params.entries()), null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Why did this happen? ── */}
        <motion.div
          className="card-glass w-full rounded-2xl overflow-hidden mb-5"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: .5 }}
        >
          <button
            onClick={() => setShowReasons(v => !v)}
            className="w-full flex items-center justify-between p-5 bg-transparent border-none cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl grad-red flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: '0 3px 12px rgba(239,68,68,.3)' }}>
                <FiAlertTriangle size={14} color="#fff" />
              </div>
              <span className="font-clash text-[14px] font-bold text-white">Why did this happen?</span>
            </div>
            <motion.div animate={{ rotate: showReasons ? 180 : 0 }} transition={{ duration: .25 }}>
              <FiChevronDown size={16} className="text-white/35" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showReasons && (
              <motion.div
                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                transition={{ duration: .3 }} className="overflow-hidden"
              >
                <div className="px-5 pb-5 flex flex-col gap-2.5">
                  {reasons.map((r, i) => (
                    <motion.div key={i}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)' }}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * .06 }}
                    >
                      <span className="text-base mt-0.5 flex-shrink-0">{r.icon}</span>
                      <div>
                        <p className="font-clash text-[13px] font-semibold text-white/85">{r.title}</p>
                        <p className="font-dm text-[11px] text-white/35 mt-0.5 leading-relaxed">{r.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── What to do next ── */}
        <motion.div
          className="w-full rounded-2xl p-5 mb-5"
          style={{ background: 'rgba(167,139,250,.07)', border: '1px solid rgba(167,139,250,.14)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <p className="font-clash text-[13px] font-bold text-[#a78bfa] mb-3">What to do next</p>
          {[
            'Check your eSewa balance or linked bank balance',
            'Ensure your internet connection is stable',
            'Verify your eSewa PIN / OTP is correct',
            'Try a different payment method if the issue persists',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
              <span className="w-4 h-4 rounded-full grad-purple flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ fontSize: 9, color: '#fff', fontWeight: 700, minWidth: 16 }}>
                {i + 1}
              </span>
              <p className="font-dm text-[12px] text-white/50 leading-relaxed">{tip}</p>
            </div>
          ))}
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          className="w-full flex flex-col gap-3"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45 }}
        >
          {/* Primary: retry */}
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="btn-red w-full py-4 rounded-2xl border-none text-white font-clash text-base font-bold cursor-pointer flex items-center justify-center gap-2.5"
          >
            {retrying ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .8, ease: 'linear' }}>
                  <FiRefreshCw size={17} />
                </motion.div>
                Returning to Checkout…
              </>
            ) : (
              <>
                <FiRefreshCw size={17} /> Try Again <FiArrowRight size={16} />
              </>
            )}
          </button>

          {/* Secondary row */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/checkout')}
              className="btn-purple flex-1 py-3.5 rounded-2xl border-none text-white font-dm text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              <FiShoppingCart size={15} /> Back to Cart
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-ghost flex-1 py-3.5 rounded-2xl font-dm text-sm font-semibold text-white/55 cursor-pointer flex items-center justify-center gap-2"
            >
              <FiHome size={15} /> Go Home
            </button>
          </div>
        </motion.div>

        {/* ── Support ── */}
        <motion.div
          className="mt-6 flex items-center gap-3 py-3.5 px-5 rounded-2xl w-full"
          style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.65 }}
        >
          <FiHeadphones size={16} className="text-white/30 flex-shrink-0" />
          <div>
            <p className="font-dm text-[12px] text-white/50">Still having trouble?</p>
            <button
              onClick={() => navigate('/support')}
              className="font-dm text-[12px] text-[#a78bfa] bg-transparent border-none cursor-pointer p-0 hover:underline"
            >
              Contact our support team →
            </button>
          </div>
        </motion.div>

      </div>
    </>
  );
};

export default PaymentFailure;