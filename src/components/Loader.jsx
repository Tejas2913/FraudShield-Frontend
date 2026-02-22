import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function Loader({ fullscreen = false }) {
    const content = (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <motion.div
                    className="w-16 h-16 rounded-full"
                    style={{ border: '2px solid rgba(0,212,255,0.1)', borderTop: '2px solid #00d4ff' }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Shield size={22} className="text-cyan-400" />
                </div>
            </div>
            <motion.p
                className="text-sm text-slate-400 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                Scanning...
            </motion.p>
        </div>
    )

    if (fullscreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#030712' }}>
                {content}
            </div>
        )
    }

    return <div className="flex items-center justify-center py-12">{content}</div>
}
