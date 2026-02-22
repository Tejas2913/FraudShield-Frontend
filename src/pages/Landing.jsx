import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Zap, Eye, Brain, Lock, TrendingUp, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react'

const FEATURES = [
    { icon: Brain, title: 'AI-Powered Detection', desc: 'TF-IDF + Logistic Regression model trained on thousands of real fraud messages for high accuracy', color: '#00d4ff' },
    { icon: Shield, title: 'Hybrid Risk Engine', desc: 'Fuses rule-based patterns with ML probability for explainable, weighted fraud scoring', color: '#a855f7' },
    { icon: Eye, title: 'Explainable AI', desc: 'Every analysis comes with a human-readable explanation of exactly why a message is flagged', color: '#ec4899' },
    { icon: Zap, title: 'Real-Time Analysis', desc: 'Sub-second API response times with instant risk scoring in your browser', color: '#f59e0b' },
    { icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Track your scan history, scam type trends, and risk distributions over time', color: '#10b981' },
    { icon: Lock, title: 'Secure & Private', desc: 'JWT authentication, bcrypt password hashing, and encrypted session management', color: '#3b82f6' },
]

const SCAM_TYPES = [
    'OTP Fraud', 'Banking Fraud', 'Phishing', 'Lottery Scam',
    'Govt Impersonation', 'Courier Scam', 'UPI Fraud', 'KYC Scam',
    'Job Scam', 'Insurance Fraud', 'Loan Scam', 'Investment Fraud',
    'Tech Support Scam', 'Romance Scam',
]

const FloatingOrb = ({ style }) => (
    <div className="absolute rounded-full blur-3xl opacity-20 pointer-events-none" style={style} />
)

export default function Landing() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background orbs */}
            <FloatingOrb style={{ width: 600, height: 600, background: 'radial-gradient(circle, #0ea5e9, transparent)', top: -200, left: -200 }} />
            <FloatingOrb style={{ width: 500, height: 500, background: 'radial-gradient(circle, #a855f7, transparent)', top: 100, right: -200 }} />
            <FloatingOrb style={{ width: 400, height: 400, background: 'radial-gradient(circle, #ec4899, transparent)', bottom: 100, left: '30%' }} />

            {/* Hero */}
            <section className="relative pt-40 pb-24 px-6 text-center max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium text-cyan-300" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Live System Active — Real-Time Protection
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        <span className="text-white">Detect Scams.</span>
                        <br />
                        <span className="gradient-text">Before They Strike.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        AI-powered fraud detection for SMS, WhatsApp, and email messages.
                        Paste any suspicious text and get instant, explainable risk analysis.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/signup">
                            <motion.button className="btn-primary flex items-center gap-2 text-base px-6 py-3" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                Get Started Free <ChevronRight size={18} />
                            </motion.button>
                        </Link>
                        <Link to="/about">
                            <motion.button className="btn-outline flex items-center gap-2 text-base px-6 py-3" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Brain size={18} /> View AI Details
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Live demo preview */}
                <motion.div
                    className="glass-card neon-border mt-16 p-6 text-left max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-2 text-xs text-slate-500 font-mono">fraudshield://analyze</span>
                    </div>
                    <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-sm text-slate-400 font-mono leading-relaxed">
                            Dear customer, your SBI account will be{' '}
                            <mark style={{ background: 'rgba(239,68,68,0.25)', color: '#fca5a5', borderRadius: '3px', padding: '0 3px' }}>blocked</mark>.
                            Share your{' '}
                            <mark style={{ background: 'rgba(239,68,68,0.25)', color: '#fca5a5', borderRadius: '3px', padding: '0 3px' }}>OTP immediately</mark>{' '}
                            to avoid <mark style={{ background: 'rgba(239,68,68,0.25)', color: '#fca5a5', borderRadius: '3px', padding: '0 3px' }}>legal action</mark>...
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={18} className="text-red-400" />
                            <span className="text-sm font-bold text-red-400">HIGH RISK — Score: 0.91</span>
                        </div>
                        <span className="text-xs text-slate-500 px-2 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>OTP Fraud</span>
                    </div>
                </motion.div>
            </section>

            {/* Scam types ticker */}
            <section className="py-8 border-y overflow-hidden" style={{ borderColor: 'rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.02)' }}>
                <div className="flex gap-10 whitespace-nowrap" style={{ animation: 'ticker 30s linear infinite', width: 'max-content' }}>
                    {[...SCAM_TYPES, ...SCAM_TYPES].map((type, i) => (
                        <span key={i} className="text-sm text-slate-500 font-medium inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            {type}
                        </span>
                    ))}
                </div>
                <style>{`
                    @keyframes ticker {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                `}</style>
            </section>

            {/* Features */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <h2 className="text-4xl font-black text-white mb-4">Everything You Need to <span className="gradient-text">Stay Safe</span></h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">Enterprise-grade fraud detection, made accessible for everyone.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            className="glass-card p-6 group hover:border-cyan-500/30 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="p-3 rounded-xl w-fit mb-4 transition-all duration-300" style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                                <f.icon size={22} style={{ color: f.color }} />
                            </div>
                            <h3 className="text-white font-bold mb-2">{f.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <motion.div
                    className="glass-card neon-border max-w-2xl mx-auto p-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <CheckCircle size={40} className="text-cyan-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-white mb-3">Ready to protect yourself?</h2>
                    <p className="text-slate-400 mb-8">Create a free account and analyze your first message in under 30 seconds.</p>
                    <Link to="/signup">
                        <button className="btn-primary text-base px-8 py-3">Start Free Analysis →</button>
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 text-center border-t" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
                <p className="text-slate-500 text-sm">
                    © 2024 FraudShield AI · Built to protect India's digital citizens ·{' '}
                    <Link to="/about" className="text-cyan-500 hover:text-cyan-400">About the AI</Link>
                </p>
            </footer>
        </div>
    )
}
