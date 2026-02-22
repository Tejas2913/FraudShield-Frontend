import AuthForm from '../components/AuthForm'
import { motion } from 'framer-motion'
import { Shield, CheckCircle } from 'lucide-react'

const PERKS = [
    'Analyze unlimited suspicious messages',
    'Full analysis history & trends',
    'AI-powered scam classification',
    'Real-time risk scoring',
    'Safety advice for every message',
]

export default function Signup() {
    return (
        <div className="min-h-screen flex pt-20">
            {/* Left panel */}
            <motion.div
                className="hidden lg:flex flex-1 flex-col justify-center px-16 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(236,72,153,0.08))' }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.15), transparent 60%)' }} />
                <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                        <Shield size={32} className="text-purple-400" />
                        <span className="text-2xl font-black gradient-text">FraudShield AI</span>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 leading-tight">Start protecting yourself <span className="gradient-text">today</span></h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">Free forever. No credit card required. Get protected in 30 seconds.</p>
                    <div className="space-y-3">
                        {PERKS.map((perk, i) => (
                            <motion.div key={perk} className="flex items-center gap-3 text-slate-300" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                                <CheckCircle size={18} className="text-purple-400 flex-shrink-0" />
                                <span className="text-sm">{perk}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <AuthForm mode="signup" />
            </div>
        </div>
    )
}
