import { motion } from 'framer-motion'

export default function StatsCard({ icon: Icon, label, value, color = '#00d4ff', delay = 0 }) {
    return (
        <motion.div
            className="glass-card p-5 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <div
                className="p-3 rounded-xl flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
            >
                <Icon size={22} style={{ color }} />
            </div>
            <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
                <motion.p
                    className="text-2xl font-black mt-0.5"
                    style={{ color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.3 }}
                >
                    {value}
                </motion.p>
            </div>
        </motion.div>
    )
}
