import { motion } from 'framer-motion'
import { Brain, Shield, Cpu, BarChart2, GitBranch, CheckCircle, Target, Layers } from 'lucide-react'

// ─── Updated metrics from real evaluation ─────────────────────────────────────
const METRICS = [
    { label: 'Accuracy', value: 97, color: '#10b981', desc: 'Correctly classified spam vs. legitimate' },
    { label: 'Spam Precision', value: 93, color: '#00d4ff', desc: 'Of messages flagged, % actually fraudulent' },
    { label: 'Spam Recall', value: 95, color: '#a855f7', desc: 'Of real scams, % successfully detected' },
    { label: 'F1 Score', value: 94, color: '#f59e0b', desc: 'Harmonic mean of precision & recall' },
]

// ─── Real confusion matrix from held-out validation ───────────────────────────
const CM = { TN: 1602, FP: 34, FN: 23, TP: 469 }
const TOTAL_SAMPLES = CM.TN + CM.FP + CM.FN + CM.TP  // 2128

// ─── Updated pipeline steps ───────────────────────────────────────────────────
const PIPELINE_STEPS = [
    { icon: Brain, title: 'Text Preprocessing', desc: 'Lowercasing, URL normalization, digit masking, punctuation removal, and behavioral feature extraction (length, digit count, exclaim count, keyword score, phishing pattern detection)', color: '#00d4ff' },
    { icon: Cpu, title: 'TF-IDF Vectorization', desc: 'Term Frequency–Inverse Document Frequency transforms text into 30,000-dimensional sparse vectors with (1,3) n-gram range and sublinear TF scaling', color: '#a855f7' },
    { icon: Layers, title: 'Ensemble Classification', desc: 'Calibrated voting ensemble of Logistic Regression + SVM with StandardScaler-normalized behavioral features, producing soft probability estimates', color: '#ec4899' },
    { icon: GitBranch, title: 'Rule-Based Layer', desc: '7 weighted rule categories (OTP, urgency, links, banking, lottery, govt, personal info) with context-aware gating to reduce false positives', color: '#f59e0b' },
    { icon: Shield, title: 'Hybrid Fusion Engine', desc: 'ML-dominant fusion: AI override at ≥ 0.75 confidence, otherwise 0.7 × AI + 0.3 × Rules with calibrated risk band thresholds', color: '#10b981' },
]

// ─── Components ───────────────────────────────────────────────────────────────
function MetricBar({ label, value, color, desc, delay }) {
    return (
        <motion.div className="glass-card p-5" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay }}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">{label}</span>
                <span className="text-2xl font-black" style={{ color }}>{value}%</span>
            </div>
            <div className="h-2 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
                />
            </div>
            <p className="text-slate-400 text-xs">{desc}</p>
        </motion.div>
    )
}

function CMCell({ label, value, color, sub }) {
    return (
        <div className="flex flex-col items-center justify-center p-5 rounded-xl" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
            <span className="text-2xl font-black" style={{ color }}>{value}</span>
            <span className="text-xs text-slate-400 mt-1 font-medium">{label}</span>
            {sub && <span className="text-[10px] text-slate-500 mt-0.5">{sub}</span>}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
    return (
        <div className="min-h-screen pt-28 pb-20 px-6 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-black text-white mb-2">About the <span className="gradient-text">AI Model</span></h1>
                <p className="text-slate-400 text-lg mb-4 max-w-3xl">
                    FraudShield AI uses a calibrated machine learning pipeline combining TF-IDF semantic analysis and behavioral features. The system employs an ensemble of Logistic Regression and Support Vector Machines for robust fraud probability estimation. A hybrid fusion engine combines AI confidence with contextual rule-based signals to determine final risk levels.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-300 mb-12" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
                    <Target size={12} /> Balanced Precision–Recall Optimized Model
                </div>
            </motion.div>

            {/* ─── Performance Metrics ─────────────────────────────────────────── */}
            <section className="mb-14">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><BarChart2 size={20} className="text-cyan-400" /> Model Performance Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {METRICS.map((m, i) => (
                        <MetricBar key={m.label} {...m} delay={i * 0.1} />
                    ))}
                </div>
            </section>

            {/* ─── Model Calibration ───────────────────────────────────────────── */}
            <section className="mb-14">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><Target size={20} className="text-orange-400" /> Model Calibration</h2>
                <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="flex-shrink-0 p-4 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(249,115,22,0.2)', minWidth: 160 }}>
                            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Best Threshold</p>
                            <p className="text-3xl font-black text-orange-400 font-mono">0.405</p>
                        </div>
                        <div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-2">Binary classification threshold optimized using F1-score on the validation set.</p>
                            <p className="text-slate-500 text-xs leading-relaxed">The decision threshold was tuned using precision-recall optimization to balance fraud detection accuracy and minimize missed scams.</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── Confusion Matrix ────────────────────────────────────────────── */}
            <section className="mb-14">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><CheckCircle size={20} className="text-purple-400" /> Confusion Matrix</h2>
                <p className="text-slate-400 text-sm mb-5">Results on held-out validation set ({TOTAL_SAMPLES.toLocaleString()} samples).</p>
                <motion.div className="glass-card p-6 max-w-md" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    {/* Column header */}
                    <div className="grid grid-cols-[80px_1fr_1fr] gap-3 mb-2 items-end">
                        <div />
                        <p className="text-xs text-slate-500 text-center">Predicted Legit</p>
                        <p className="text-xs text-slate-500 text-center">Predicted Scam</p>
                    </div>
                    {/* Row: Actual Legit */}
                    <div className="grid grid-cols-[80px_1fr_1fr] gap-3 mb-3">
                        <div className="flex items-center">
                            <span className="text-xs text-slate-500 font-medium">Actual Legit</span>
                        </div>
                        <CMCell label="True Negative" value={CM.TN} color="#10b981" sub="TN" />
                        <CMCell label="False Positive" value={CM.FP} color="#f59e0b" sub="FP" />
                    </div>
                    {/* Row: Actual Scam */}
                    <div className="grid grid-cols-[80px_1fr_1fr] gap-3">
                        <div className="flex items-center">
                            <span className="text-xs text-slate-500 font-medium">Actual Scam</span>
                        </div>
                        <CMCell label="False Negative" value={CM.FN} color="#f59e0b" sub="FN" />
                        <CMCell label="True Positive" value={CM.TP} color="#10b981" sub="TP" />
                    </div>
                    <div className="mt-4 pt-4 border-t text-xs text-slate-500" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        TP = Scam correctly detected · TN = Legit message correctly cleared<br />
                        FP = Legit flagged as scam · FN = Scam missed (only {CM.FN})
                    </div>
                </motion.div>
            </section>

            {/* ─── Detection Pipeline ──────────────────────────────────────────── */}
            <section className="mb-14">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><Cpu size={20} className="text-pink-400" /> Detection Pipeline</h2>
                <div className="space-y-4">
                    {PIPELINE_STEPS.map((step, i) => (
                        <motion.div key={step.title} className="glass-card p-5 flex items-start gap-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                            <div className="p-2.5 rounded-lg flex-shrink-0" style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                                <step.icon size={18} style={{ color: step.color }} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-500">Step {i + 1}</span>
                                </div>
                                <h3 className="text-white font-bold mb-1">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── Hybrid Risk Formula ─────────────────────────────────────────── */}
            <section className="mb-14">
                <h2 className="text-xl font-bold text-white mb-5">Hybrid Risk Formula</h2>
                <div className="glass-card p-6">
                    {/* AI Override */}
                    <motion.div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <p className="text-xs text-red-400 font-bold uppercase tracking-wide mb-2">Phase 1 — AI Override</p>
                        <p className="text-sm text-slate-300 font-mono">
                            If <span className="text-pink-400 font-bold">AI Probability</span> <span className="text-white">≥ 0.75</span> → <span className="text-red-400 font-bold">HIGH risk</span> <span className="text-slate-500">(direct override)</span>
                        </p>
                    </motion.div>

                    {/* Blended formula */}
                    <motion.div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,212,255,0.15)' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        <p className="text-xs text-cyan-400 font-bold uppercase tracking-wide mb-2">Phase 2 — Weighted Blend</p>
                        <p className="text-lg font-mono text-center py-2">
                            <span className="text-cyan-400 font-bold">Final Score</span>
                            <span className="text-white"> = 0.7 × </span>
                            <span className="text-pink-400 font-bold">AI Probability</span>
                            <span className="text-white"> + 0.3 × </span>
                            <span className="text-purple-400 font-bold">Rule Score</span>
                        </p>
                    </motion.div>

                    {/* Risk bands */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { range: '0.00 – 0.35', level: 'LOW', color: '#10b981' },
                            { range: '0.35 – 0.60', level: 'MEDIUM', color: '#f59e0b' },
                            { range: '0.60 – 1.00', level: 'HIGH', color: '#ef4444' },
                        ].map((r) => (
                            <div key={r.level} className="p-3 rounded-lg text-center" style={{ background: `${r.color}10`, border: `1px solid ${r.color}25` }}>
                                <p className="text-xs text-slate-400 mb-1">{r.range}</p>
                                <p className="font-black text-lg" style={{ color: r.color }}>{r.level}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Technology Stack ─────────────────────────────────────────────── */}
            <section>
                <h2 className="text-xl font-bold text-white mb-5">Technology Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { name: 'FastAPI', layer: 'Backend', color: '#10b981' },
                        { name: 'Scikit-learn', layer: 'ML Engine', color: '#f59e0b' },
                        { name: 'SQLite / PostgreSQL', layer: 'Database', color: '#3b82f6' },
                        { name: 'JWT + bcrypt', layer: 'Security', color: '#ec4899' },
                        { name: 'React + Vite', layer: 'Frontend', color: '#00d4ff' },
                        { name: 'Framer Motion', layer: 'Animations', color: '#a855f7' },
                        { name: 'Recharts', layer: 'Analytics', color: '#f97316' },
                        { name: 'TF-IDF + Ensemble (LR + SVM)', layer: 'Calibrated NLP Pipeline', color: '#06b6d4' },
                    ].map((t) => (
                        <div key={t.name} className="glass-card p-3 text-center">
                            <p className="text-white font-bold text-sm">{t.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: t.color }}>{t.layer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
