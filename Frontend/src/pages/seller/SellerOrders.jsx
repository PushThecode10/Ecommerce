import { useEffect, useState } from 'react';
import { sellerAPI } from '../../service/apiAuth.js';
import {
  FiPackage, FiClock, FiTruck, FiCheckCircle,
  FiXCircle, FiArrowRight, FiUser, FiMapPin, FiDollarSign,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    html,body,#root{background:#1a0a00!important;color:#ffedd5!important;font-family:'DM Sans',sans-serif!important;}
    .so-page{background:#1a0a00!important;min-height:100vh;color:#ffedd5;font-family:'DM Sans',sans-serif;position:relative;}
    .font-clash{font-family:'Clash Display',sans-serif!important;}

    @keyframes orb-a{0%,100%{transform:translate(0,0)scale(1)}40%{transform:translate(45px,-38px)scale(1.1)}75%{transform:translate(-28px,25px)scale(.93)}}
    @keyframes orb-b{0%,100%{transform:translate(0,0)scale(1)}45%{transform:translate(-36px,30px)scale(1.08)}}
    @keyframes grid-p{0%,100%{opacity:.04}50%{opacity:.08}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes float-up{0%,100%{transform:translateY(0);opacity:.15}50%{transform:translateY(-20px);opacity:.5}}
    @keyframes border-glow{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0)}50%{box-shadow:0 0 20px 4px rgba(220,38,38,.15)}}

    .orb-a-anim{animation:orb-a 24s ease-in-out infinite;}
    .orb-b-anim{animation:orb-b 28s ease-in-out infinite 3s;}
    .grid-anim{animation:grid-p 8s ease-in-out infinite;}
    .float-p{animation:float-up var(--dur,5s) ease-in-out var(--delay,0s) infinite;}
    .spinner{animation:spin 1s linear infinite;}

    /* Order card */
    .order-card{
      background:linear-gradient(135deg,rgba(220,38,38,.07),rgba(249,115,22,.04),rgba(255,237,213,.02))!important;
      border:1px solid rgba(220,38,38,.2)!important;border-radius:22px;padding:26px;
      transition:border-color .3s,box-shadow .3s,transform .3s;
    }
    .order-card:hover{border-color:rgba(220,38,38,.45)!important;box-shadow:0 20px 50px rgba(220,38,38,.15)!important;transform:translateY(-3px);}

    /* Filter tabs */
    .filter-tab{padding:8px 18px;border-radius:30px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .22s;white-space:nowrap;text-transform:capitalize;}
    .filter-tab.active{background:linear-gradient(135deg,#dc2626,#b91c1c)!important;color:#fff!important;box-shadow:0 4px 16px rgba(220,38,38,.42);}
    .filter-tab.inactive{background:rgba(255,237,213,.07)!important;color:rgba(255,237,213,.55)!important;border:1px solid rgba(255,237,213,.12)!important;}
    .filter-tab.inactive:hover{background:rgba(255,237,213,.12)!important;color:rgba(255,237,213,.85)!important;}

    /* Status pill */
    .status-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;text-transform:capitalize;}

    /* Item row */
    .item-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,237,213,.06);}
    .item-row:last-child{border-bottom:none;}
    .item-img{width:56px;height:56px;border-radius:12px;object-fit:cover;flex-shrink:0;border:1px solid rgba(220,38,38,.2);}

    /* Mark as button */
    .mark-btn{width:100%;padding:13px 20px;border-radius:12px;border:none;background:linear-gradient(135deg,#dc2626,#b91c1c)!important;color:#fff!important;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(220,38,38,.38);transition:transform .2s,box-shadow .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
    .mark-btn:hover{transform:scale(1.02);box-shadow:0 6px 28px rgba(220,38,38,.55)!important;}

    /* Section divider */
    .sec-div{height:1px;background:linear-gradient(90deg,transparent,rgba(220,38,38,.25),rgba(249,115,22,.2),transparent);margin:16px 0;}

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
      {Array.from({length:12},(_,i) => (
        <div key={i} className="float-p absolute rounded-full" style={{ left:`${(i*67+11)%100}%`, top:`${(i*43+7)%100}%`, width:`${i%3+1}px`, height:`${i%3+1}px`, background:i%2===0?'rgba(220,38,38,.5)':'rgba(255,237,213,.35)', '--dur':`${5+i%4}s`, '--delay':`${i*.38}s` }}/>
      ))}
    </div>
  </>
);

/* Status configs */
const STATUS_CFG = {
  pending:    { color:'#fbbf24', bg:'rgba(251,191,36,.15)',  border:'rgba(251,191,36,.3)', icon:<FiClock size={13}/> },
  confirmed:  { color:'#60a5fa', bg:'rgba(96,165,250,.15)',  border:'rgba(96,165,250,.3)', icon:<FiPackage size={13}/> },
  processing: { color:'#a78bfa', bg:'rgba(167,139,250,.15)', border:'rgba(167,139,250,.3)',icon:<FiPackage size={13}/> },
  shipped:    { color:'#38bdf8', bg:'rgba(56,189,248,.15)',   border:'rgba(56,189,248,.3)', icon:<FiTruck size={13}/> },
  delivered:  { color:'#34d399', bg:'rgba(52,211,153,.15)',   border:'rgba(52,211,153,.3)', icon:<FiCheckCircle size={13}/> },
  cancelled:  { color:'#f87171', bg:'rgba(248,113,113,.15)',  border:'rgba(248,113,113,.3)',icon:<FiXCircle size={13}/> },
};
const getStatus = s => STATUS_CFG[s] || { color:'rgba(255,237,213,.5)', bg:'rgba(255,237,213,.07)', border:'rgba(255,237,213,.15)', icon:<FiPackage size={13}/> };

const STATUS_FLOW = { pending:'confirmed', confirmed:'processing', processing:'shipped', shipped:'delivered' };

const Orders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [updating, setUpdating] = useState({});

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try { const { data } = await sellerAPI.getOrders(); setOrders(data.data.orders||[]); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStatus = async (orderId, newStatus) => {
    setUpdating(p=>({...p,[orderId]:true}));
    try {
      await sellerAPI.updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      loadOrders();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(p=>({...p,[orderId]:false})); }
  };

  const tabs = ['all','pending','processing','shipped','delivered'];
  const filtered = filter==='all' ? orders : orders.filter(o=>o.status===filter);

  return (
    <div className="so-page"><Styles/><BG/>
      <div className="relative z-[2] pb-20">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }} transition={{ duration:.65, ease:[.22,1,.36,1] }}
          className="flex flex-wrap items-start justify-between gap-4 mb-8"
        >
          <div>
            <span className="block font-dm text-[11px] font-bold tracking-[4px] uppercase mb-1.5" style={{ color:'#f97316' }}>Seller Panel</span>
            <h1 className="font-clash font-bold grad-text" style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)' }}>Orders</h1>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.2 }}
              className="font-dm text-sm mt-1" style={{ color:'rgba(255,237,213,.38)' }}
            >{orders.length} total orders</motion.p>
          </div>

          {/* Summary badges */}
          <motion.div initial={{ opacity:0, scale:.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.25 }}
            className="flex gap-2 flex-wrap"
          >
            {[
              { label:'Pending', count: orders.filter(o=>o.status==='pending').length, color:'#fbbf24', bg:'rgba(251,191,36,.15)', border:'rgba(251,191,36,.3)' },
              { label:'Shipped', count: orders.filter(o=>o.status==='shipped').length, color:'#38bdf8', bg:'rgba(56,189,248,.15)', border:'rgba(56,189,248,.3)' },
            ].map(b=>(
              <div key={b.label} className="px-3 py-1.5 rounded-full font-dm text-xs font-bold"
                style={{ background:b.bg, border:`1px solid ${b.border}`, color:b.color }}
              >{b.count} {b.label}</div>
            ))}
          </motion.div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
          className="flex gap-2 mb-7 overflow-x-auto pb-1 flex-wrap"
        >
          {tabs.map(t => (
            <button key={t} className={`filter-tab ${filter===t?'active':'inactive'}`} onClick={()=>setFilter(t)}>
              {t==='all'?'All Orders':t}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_,i)=><div key={i} className="skeleton h-[220px]"/>)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity:0, scale:.94 }} animate={{ opacity:1, scale:1 }}
            className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
            style={{ background:'rgba(255,237,213,.03)', border:'1px solid rgba(255,237,213,.07)' }}
          >
            <motion.div animate={{ y:[0,-10,0], rotate:[0,5,-5,0] }} transition={{ duration:3, repeat:Infinity }}>
              <FiPackage size={56} style={{ color:'rgba(220,38,38,.4)', marginBottom:16 }}/>
            </motion.div>
            <p className="font-clash text-xl font-bold mb-2" style={{ color:'rgba(255,237,213,.6)' }}>No orders found</p>
            <p className="font-dm text-sm" style={{ color:'rgba(255,237,213,.3)' }}>
              {filter!=='all' ? `No ${filter} orders at the moment` : 'Orders will appear here'}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((order, i) => {
                const st = getStatus(order.status);
                const next = STATUS_FLOW[order.status];
                const busy = updating[order._id];

                return (
                  <motion.div key={order._id} className="order-card"
                    layout
                    initial={{ opacity:0, y:32, scale:.97 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, x:40, scale:.95 }}
                    transition={{ duration:.45, delay:i*.06, ease:[.22,1,.36,1] }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                      <div>
                        <p className="font-clash text-base font-bold" style={{ color:'#ffedd5' }}>
                          #{order.orderId?.slice(-10) || order._id?.slice(-10)}
                        </p>
                        <p className="font-dm text-xs mt-0.5" style={{ color:'rgba(255,237,213,.38)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US',{ day:'numeric', month:'short', year:'numeric' })}
                        </p>
                      </div>
                      <span className="status-pill" style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>
                        {st.icon} {order.status}
                      </span>
                    </div>

                    <div className="sec-div"/>

                    {/* Items */}
                    <div className="mb-4">
                      {order.items?.filter(item=>item.sellerId===order.sellerId)?.map((item,j) => (
                        <div key={j} className="item-row">
                          <img className="item-img"
                            src={item.image?.startsWith('http') ? item.image : `http://localhost:3000${item.image}`}
                            alt={item.name}
                            onError={e=>{e.target.src='https://placehold.co/56x56/2a1000/dc2626?text=✦';}}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-dm text-sm font-semibold truncate" style={{ color:'rgba(255,237,213,.85)' }}>{item.name}</p>
                            <p className="font-dm text-xs mt-0.5" style={{ color:'rgba(255,237,213,.38)' }}>× {item.quantity}</p>
                          </div>
                          <p className="font-clash text-sm font-bold flex-shrink-0" style={{ color:'#fca5a5' }}>${item.price}</p>
                        </div>
                      ))}
                    </div>

                    <div className="sec-div"/>

                    {/* Customer + Total */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:'rgba(220,38,38,.18)', border:'1px solid rgba(220,38,38,.3)' }}>
                          <FiUser size={14} style={{ color:'#fca5a5' }}/>
                        </div>
                        <div>
                          <p className="font-dm text-sm font-semibold" style={{ color:'rgba(255,237,213,.8)' }}>{order.shippingAddress?.name}</p>
                          <p className="font-dm text-xs flex items-center gap-1 mt-0.5" style={{ color:'rgba(255,237,213,.38)' }}>
                            <FiMapPin size={10}/> {order.shippingAddress?.city}, {order.shippingAddress?.state}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-dm text-xs mb-1" style={{ color:'rgba(255,237,213,.35)' }}>Total Amount</p>
                        <p className="font-clash text-2xl font-bold" style={{ background:'linear-gradient(135deg,#dc2626,#f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                          ${order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    {next && (
                      <motion.button className="mark-btn" onClick={()=>handleStatus(order._id,next)}
                        disabled={busy} whileHover={{ scale:busy?1:1.02 }} whileTap={{ scale:busy?1:.97 }}
                      >
                        {busy
                          ? <><div className="spinner w-4 h-4 rounded-full border-2 border-white/25 border-t-white flex-shrink-0"/>Updating…</>
                          : <>Mark as {next.charAt(0).toUpperCase()+next.slice(1)} <FiArrowRight size={15}/></>
                        }
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;