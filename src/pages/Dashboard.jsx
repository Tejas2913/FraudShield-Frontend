import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from 'recharts'
import { getStats, getHistory } from '../services/api'
import StatsCard from '../components/StatsCard'
import Loader from '../components/Loader'
import { Activity, Shield, AlertTriangle, TrendingUp, Clock } from 'lucide-react'

const RISK_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' }
const CHART_COLORS = ['#00d4ff', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f97316']

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="glass-card p-3 text-xs" style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
            <p className="text-slate-300 mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value < 2 ? (p.value * 100).toFixed(0) + '%' : p.value}</p>
            ))}
        </div>
    )
}

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, histRes] = await Promise.all([getStats(), getHistory(0, 10)])
                setStats(statsRes.data)
                setHistory(histRes.data)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <div className="pt-28"><Loader /></div>

    const hasStat = stats && stats.total_analyses > 0

    // Transform data for charts
    const riskPieData = hasStat
        ? Object.entries(stats.risk_distribution).map(([name, value]) => ({ name, value }))
        : []

    const scamBarData = hasStat
        ? Object.entries(stats.scam_type_distribution).map(([name, value]) => ({ name: name.replace(' Fraud', '').replace(' Scam', ''), value }))
        : []

    const trendData = hasStat
        ? stats.daily_trend.slice(-10).map((d) => ({ date: d.date.slice(5), count: d.count, score: parseFloat((d.avg_score * 100).toFixed(1)) }))
        : []

    return (
        <div className="min-h-screen pt-28 pb-16 px-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-black text-white mb-2">
                    Security <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-slate-400 mb-8">Your personal fraud detection analytics and history.</p>
            </motion.div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard icon={Activity} label="Total Analyses" value={stats?.total_analyses ?? 0} color="#00d4ff" delay={0} />
                <StatsCard icon={AlertTriangle} label="High Risk" value={stats?.risk_distribution?.HIGH ?? 0} color="#ef4444" delay={0.1} />
                <StatsCard icon={Shield} label="Low Risk" value={stats?.risk_distribution?.LOW ?? 0} color="#10b981" delay={0.2} />
                <StatsCard icon={TrendingUp} label="Avg Score" value={hasStat ? `${(stats.average_score * 100).toFixed(0)}%` : '—'} color="#a855f7" delay={0.3} />
            </div>

            {!hasStat ? (
                <motion.div className="glass-card p-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Shield size={48} className="text-slate-600 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">No analysis data yet</h3>
                    <p className="text-slate-400 text-sm">Go to the Analyzer and analyze your first message to see your dashboard.</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {/* Charts row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Pie – risk distribution */}
                        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h3 className="text-white font-bold mb-4 text-sm">Risk Distribution</h3>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                                        {riskPieData.map((entry) => (
                                            <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#00d4ff'} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 mt-2">
                                {riskPieData.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: RISK_COLORS[entry.name] }} />
                                        {entry.name} ({entry.value})
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Bar – scam types */}
                        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h3 className="text-white font-bold mb-4 text-sm">Scam Types</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={scamBarData} margin={{ left: -20, right: 5, bottom: 20 }}>
                                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} angle={-30} textAnchor="end" />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                                        {scamBarData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Line – daily trend */}
                        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h3 className="text-white font-bold mb-4 text-sm">10-Day Risk Trend</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="score" name="Avg Risk %" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="count" name="Scans" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', strokeWidth: 0, r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>

                    {/* Recent history table */}
                    <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <div className="p-5 border-b" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
                            <h3 className="text-white font-bold flex items-center gap-2"><Clock size={16} className="text-cyan-400" /> Recent Analyses</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
                                        {['Message', 'Risk', 'Score', 'Scam Type', 'Date'].map((h) => (
                                            <th key={h} className="text-left px-5 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((row, i) => (
                                        <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/3 transition-colors">
                                            <td className="px-5 py-3 text-slate-400 max-w-xs truncate">{row.message}</td>
                                            <td className="px-5 py-3">
                                                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: RISK_COLORS[row.risk_level], background: `${RISK_COLORS[row.risk_level]}15`, border: `1px solid ${RISK_COLORS[row.risk_level]}30` }}>
                                                    {row.risk_level}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-slate-300 font-mono">{(row.final_score * 100).toFixed(0)}%</td>
                                            <td className="px-5 py-3 text-slate-400 text-xs">{row.scam_type}</td>
                                            <td className="px-5 py-3 text-slate-500 text-xs">{new Date(row.created_at).toLocaleDateString('en-IN')}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
