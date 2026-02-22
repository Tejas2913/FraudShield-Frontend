import AuthForm from '../components/AuthForm'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye } from 'lucide-react'

export default function Login() {
    return (
        <div className="min-h-screen flex pt-20">
            {/* Left panel */}
            <motion.div
                className="hidden lg:flex flex-1 flex-col justify-center px-16 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(168,85,247,0.1))' }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.15), transparent 60%)' }} />
                <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                        <Shield size={32} className="text-cyan-400" />
                        <span className="text-2xl font-black gradient-text">FraudShield AI</span>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 leading-tight">Welcome back, <span className="gradient-text">Guardian</span></h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">Sign in to continue protecting yourself with AI-powered scam detection.</p>
                    <div className="space-y-4">
                        {[
                            { icon: Lock, text: 'Your data is encrypted and secure' },
                            { icon: Eye, text: 'Real-time fraud analysis at your fingertips' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 rounded-lg" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                                    <Icon size={16} className="text-cyan-400" />
                                </div>
                                <span className="text-sm">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <AuthForm mode="login" />
            </div>
        </div>
    )
}
