import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { analyzeMessage } from '../services/api'
import RiskMeter from '../components/RiskMeter'
import HighlightedText from '../components/HighlightedText'
import Loader from '../components/Loader'
import {
    Scan, Mic, MicOff, ChevronDown, ChevronUp,
    AlertTriangle, Shield, Lightbulb, Tag, Trash2, Brain, Bookmark
} from 'lucide-react'

// ─── Stopwords to strip from feature display ──────────────────────────────────
const STOP_WORDS = new Set([
    'to', 'the', 'is', 'and', 'a', 'of', 'in', 'for', 'on', 'it', 'at', 'an', 'or', 'by',
    'be', 'was', 'are', 'has', 'had', 'do', 'did', 'no', 'not', 'you', 'we', 'he', 'she',
    'this', 'that', 'with', 'from', 'but', 'so', 'if', 'as', 'up', 'than', 'its',
])

function cleanFeatureWords(words) {
    if (!words || words.length === 0) return []
    const seen = new Set()
    return words
        .filter(w => {
            const lower = w.word.toLowerCase().trim()
            if (lower.length <= 2) return false
            if (STOP_WORDS.has(lower)) return false
            // deduplicate n-grams that overlap
            if (seen.has(lower)) return false
            seen.add(lower)
            return true
        })
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 8)
}

// ─── Risk-based color palettes ────────────────────────────────────────────────
const RISK_BAR_COLORS = {
    HIGH: { base: '#ef4444', glow: 'rgba(239,68,68,0.4)', gradient: ['#fca5a5', '#ef4444', '#dc2626'] },
    MEDIUM: { base: '#f59e0b', glow: 'rgba(245,158,11,0.4)', gradient: ['#fcd34d', '#f59e0b', '#d97706'] },
    LOW: { base: '#10b981', glow: 'rgba(16,185,129,0.4)', gradient: ['#6ee7b7', '#10b981', '#059669'] },
}

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const { word, impact } = payload[0].payload
    return (
        <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(0,212,255,0.2)', backdropFilter: 'blur(12px)' }}>
            <p className="text-white font-bold mb-1">{word}</p>
            <p className="text-slate-400">Impact: <span className="text-cyan-400 font-mono font-bold">{impact.toFixed(4)}</span></p>
        </div>
    )
}

// ─── Feature Importance Chart (Recharts Horizontal Bars) ──────────────────────
function FeatureImportanceChart({ words, riskLevel }) {
    const palette = RISK_BAR_COLORS[riskLevel] || RISK_BAR_COLORS.MEDIUM
    const data = useMemo(() => cleanFeatureWords(words), [words])
    const maxImpact = data.length ? Math.max(...data.map(d => d.impact)) : 1

    if (data.length === 0) return null

    return (
        <div>
            <ResponsiveContainer width="100%" height={data.length * 44 + 20}>
                <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }} barCategoryGap="20%">
                    <XAxis
                        type="number"
                        domain={[0, 'auto']}
                        tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        tickLine={false}
                        tickFormatter={v => v.toFixed(2)}
                    />
                    <YAxis
                        type="category"
                        dataKey="word"
                        width={100}
                        tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="impact" radius={[0, 6, 6, 0]} animationDuration={800} animationEasing="ease-out">
                        {data.map((entry, i) => {
                            const intensity = entry.impact / maxImpact
                            const alpha = 0.5 + intensity * 0.5
                            return (
                                <Cell
                                    key={entry.word}
                                    fill={palette.base}
                                    fillOpacity={alpha}
                                    style={i === 0 ? { filter: `drop-shadow(0 0 8px ${palette.glow})` } : undefined}
                                />
                            )
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* SHAP-style note */}
            <p className="text-[11px] text-slate-600 mt-3 italic">
                Contribution values represent logistic regression coefficient influence weighted by TF-IDF.
            </p>
        </div>
    )
}

// ─── Main Analyzer Page ────────────────────────────────────────────────────────
export default function Analyzer() {
    const [message, setMessage] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [listening, setListening] = useState(false)
    const [showExplanation, setShowExplanation] = useState(true)
    const [showAdvice, setShowAdvice] = useState(true)
    const [showFeatures, setShowFeatures] = useState(true)
    const recogRef = useRef(null)

    const handleAnalyze = async () => {
        if (!message.trim() || loading) return
        setLoading(true)
        setError('')
        setResult(null)
        try {
            const { data } = await analyzeMessage(message)
            setResult(data)
        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const startVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) { setError('Voice input not supported in this browser.'); return }
        const recog = new SpeechRecognition()
        recog.lang = 'en-IN'
        recog.continuous = false
        recog.interimResults = false
        recog.onresult = (e) => { setMessage(prev => prev + ' ' + e.results[0][0].transcript); setListening(false) }
        recog.onend = () => setListening(false)
        recogRef.current = recog
        recog.start()
        setListening(true)
    }
    const stopVoice = () => { recogRef.current?.stop(); setListening(false) }

    const RISK_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' }
    const riskColor = result ? RISK_COLORS[result.risk_level] : '#00d4ff'

    // viz helpers
    const viz = result?.visualization
    const meterColor = viz?.risk_meter
        ? { red: '#ef4444', orange: '#f59e0b', green: '#10b981' }[viz.risk_meter.meter_color] ?? riskColor
        : riskColor

    return (
        <div className="min-h-screen pt-28 pb-16 px-6 max-w-5xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-white mb-2">
                    Message <span className="gradient-text">Analyzer</span>
                </h1>
                <p className="text-slate-400 mb-8">Paste a suspicious SMS, WhatsApp, or email message for instant AI-powered analysis.</p>
            </motion.div>

            {/* Input card */}
            <motion.div className="glass-card p-6 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <Scan size={15} className="text-cyan-400" /> Suspicious Message
                    </label>
                    <div className="flex gap-2 items-center">
                        <span className="text-xs text-slate-500">{message.length}/5000</span>
                        {message && (
                            <button onClick={() => { setMessage(''); setResult(null) }} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Paste suspicious message here…"
                    maxLength={5000}
                    rows={6}
                    className="input-glow resize-none w-full font-mono text-sm leading-relaxed"
                    style={{ borderColor: message ? 'rgba(0,212,255,0.3)' : undefined }}
                    onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handleAnalyze() }}
                />

                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={listening ? stopVoice : startVoice}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${listening ? 'text-red-400 bg-red-500/10 border border-red-500/30 animate-pulse' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                    >
                        {listening ? <><MicOff size={15} /> Stop</> : <><Mic size={15} /> Voice Input</>}
                    </button>

                    <motion.button
                        onClick={handleAnalyze}
                        disabled={!message.trim() || loading}
                        className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        whileHover={{ scale: message.trim() ? 1.03 : 1 }}
                        whileTap={{ scale: message.trim() ? 0.97 : 1 }}
                    >
                        {loading ? (
                            <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} /> Analyzing…</>
                        ) : (
                            <><Scan size={16} /> Analyze Message</>
                        )}
                    </motion.button>
                </div>
                <p className="text-xs text-slate-600 mt-2">Tip: Press Ctrl + Enter to analyze</p>
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg mb-6 text-red-300 text-sm flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <AlertTriangle size={16} /> {error}
                </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

                        {/* ── 1. Risk overview ──────────────────────────────────── */}
                        <div className="glass-card p-6">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0">
                                    <RiskMeter score={result.final_score} riskLevel={result.risk_level} size={180} />
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">
                                            Scam Type: <span style={{ color: riskColor }}>{result.scam_type}</span>
                                        </h3>
                                        <p className="text-slate-400 text-sm">{result.scam_type_info}</p>
                                    </div>

                                    {/* Score breakdown */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Final Score', val: result.final_score, color: meterColor },
                                            { label: 'Rule Score', val: result.rule_score, color: '#a855f7' },
                                            { label: 'AI Score', val: result.ai_score, color: '#00d4ff' },
                                        ].map(({ label, val, color }) => (
                                            <div key={label} className="p-3 rounded-lg text-center" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                                                <p className="text-xs text-slate-400 mb-1">{label}</p>
                                                <p className="text-lg font-black" style={{ color }}>{(val * 100).toFixed(0)}%</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Matched rule tags */}
                                    {result.matched_rules.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {result.matched_rules.map(rule => (
                                                <span key={rule} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                                                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                                                    <Tag size={11} /> {rule}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── 2. AI Explanation ────────────────────────────────── */}
                        <div className="glass-card overflow-hidden">
                            <button onClick={() => setShowExplanation(!showExplanation)} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <span className="font-bold text-white flex items-center gap-2"><Lightbulb size={16} className="text-cyan-400" /> AI Explanation</span>
                                {showExplanation ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </button>
                            <AnimatePresence>
                                {showExplanation && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                                        <div className="px-5 pb-5">
                                            <p className="text-slate-300 text-sm leading-relaxed">{result.explanation}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── 3. Safety advice ────────────────────────────────── */}
                        <div className="glass-card overflow-hidden">
                            <button onClick={() => setShowAdvice(!showAdvice)} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <span className="font-bold text-white flex items-center gap-2"><Shield size={16} className="text-green-400" /> Safety Recommendations</span>
                                {showAdvice ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </button>
                            <AnimatePresence>
                                {showAdvice && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                                        <div className="px-5 pb-5 space-y-2">
                                            {result.safety_advice.map((advice, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="text-sm text-slate-300">
                                                    {advice}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── 4. Matched rule badges (already in risk card) ──── */}

                        {/* ── 5. AI Feature Contribution Analysis ──────────── */}
                        {viz?.feature_importance && viz.feature_importance.length > 0 && (
                            <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <button onClick={() => setShowFeatures(!showFeatures)} className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <span className="font-bold text-white flex items-center gap-2">
                                        <Brain size={16} className="text-purple-400" /> 🧠 AI Feature Contribution Analysis
                                    </span>
                                    {showFeatures ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                </button>
                                <AnimatePresence>
                                    {showFeatures && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }} transition={{ duration: 0.35 }}>
                                            <div className="px-5 pb-6">
                                                <p className="text-sm text-slate-400 mb-5">
                                                    These are the words that most influenced the AI's fraud prediction.
                                                </p>
                                                <FeatureImportanceChart words={viz.feature_importance} riskLevel={result.risk_level} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* ── 6. Highlighted Suspicious Terms ──────────────── */}
                        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                <Bookmark size={16} className="text-yellow-400" /> 📌 Highlighted Suspicious Terms
                            </h3>
                            <div className="p-4 rounded-lg text-sm text-slate-300 leading-relaxed highlighted-text-panel"
                                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                {viz?.highlighted_text ? (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.6 }}
                                        dangerouslySetInnerHTML={{ __html: viz.highlighted_text }}
                                        style={{ '--mark-bg': `${meterColor}25`, '--mark-color': meterColor }}
                                    />
                                ) : (
                                    <HighlightedText text={message} phrases={result.suspicious_phrases} />
                                )}
                            </div>
                            {result.suspicious_phrases.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {result.suspicious_phrases.map(p => (
                                        <span key={p} className="text-xs px-2 py-0.5 rounded-md text-red-300" style={{ background: 'rgba(239,68,68,0.1)' }}>"{p}"</span>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inline styles for mark highlights + glow */}
            <style>{`
                mark.highlight-word {
                    background: var(--mark-bg, rgba(239,68,68,0.2));
                    color: var(--mark-color, #ef4444);
                    border-radius: 4px;
                    padding: 1px 4px;
                    font-weight: 600;
                    text-shadow: 0 0 8px var(--mark-color, rgba(239,68,68,0.3));
                    transition: background 0.3s ease, box-shadow 0.3s ease;
                }
                mark.highlight-word:hover {
                    box-shadow: 0 0 12px var(--mark-color, rgba(239,68,68,0.4));
                }
                .highlighted-text-panel {
                    animation: fadeInPanel 0.6s ease-out;
                }
                @keyframes fadeInPanel {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
