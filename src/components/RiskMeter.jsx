import { motion } from 'framer-motion'

const COLORS = {
    HIGH: { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)', text: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    MEDIUM: { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.4)', text: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    LOW: { stroke: '#10b981', glow: 'rgba(16,185,129,0.4)', text: '#10b981', bg: 'rgba(16,185,129,0.1)' },
}

export default function RiskMeter({ score = 0, riskLevel = 'LOW', size = 180 }) {
    const color = COLORS[riskLevel] || COLORS.LOW
    const radius = (size - 24) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDash = circumference * score

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Glow aura */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 30px ${color.glow}`, borderRadius: '50%' }}
                />
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={10}
                    />
                    {/* Animated fill */}
                    <motion.circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={color.stroke}
                        strokeWidth={10}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - strokeDash }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        style={{ filter: `drop-shadow(0 0 8px ${color.stroke})` }}
                    />
                </svg>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className="text-3xl font-black"
                        style={{ color: color.text, textShadow: `0 0 10px ${color.text}` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {(score * 100).toFixed(0)}%
                    </motion.span>
                    <span className="text-xs text-slate-400 font-medium mt-1">Risk Score</span>
                </div>
            </div>

            {/* Badge */}
            <motion.div
                className="px-4 py-1.5 rounded-full text-sm font-bold"
                style={{ color: color.text, background: color.bg, border: `1px solid ${color.stroke}`, boxShadow: `0 0 10px ${color.glow}` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
            >
                {riskLevel} RISK
            </motion.div>
        </div>
    )
}
