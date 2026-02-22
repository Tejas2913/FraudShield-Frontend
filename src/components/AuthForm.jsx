import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Shield, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { login, signup } from '../services/api'

function PasswordStrength({ password }) {
    const score = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length

    const levels = [
        { label: 'Weak', color: '#ef4444' },
        { label: 'Fair', color: '#f59e0b' },
        { label: 'Good', color: '#3b82f6' },
        { label: 'Strong', color: '#10b981' },
    ]
    if (!password) return null
    const level = levels[score - 1] || levels[0]

    return (
        <div className="mt-1.5">
            <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i < score ? level.color : 'rgba(255,255,255,0.1)' }} />
                ))}
            </div>
            <p className="text-xs" style={{ color: level.color }}>{level.label} password</p>
        </div>
    )
}

export default function AuthForm({ mode = 'login' }) {
    const { loginUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const isLogin = mode === 'login'
    const signupSuccess = isLogin && location.state?.signupSuccess

    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const fn = isLogin ? login : signup
            const payload = isLogin ? { email: form.email, password: form.password } : form
            const { data } = await fn(payload)
            if (isLogin) {
                loginUser(data.access_token, data.user)
                navigate('/analyzer')
            } else {
                // Redirect to login page after successful signup
                navigate('/login', { state: { signupSuccess: true } })
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            className="glass-card p-8 w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                    <Shield size={22} className="text-cyan-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">{isLogin ? 'Welcome back' : 'Create account'}</h2>
                    <p className="text-slate-400 text-sm">{isLogin ? 'Sign in to your account' : 'Join FraudShield AI today'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {signupSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg text-sm text-green-300"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                        <CheckCircle size={15} />
                        Account created successfully! Please sign in.
                    </motion.div>
                )}
                {!isLogin && (
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            name="name"
                            type="text"
                            placeholder="Full name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="input-glow pl-10"
                        />
                    </div>
                )}

                <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="input-glow pl-10"
                    />
                </div>

                <div>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            name="password"
                            type={showPass ? 'text' : 'password'}
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="input-glow pl-10 pr-10"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {!isLogin && <PasswordStrength password={form.password} />}
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 p-3 rounded-lg text-sm text-red-300"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
                    >
                        <AlertCircle size={15} />
                        {error}
                    </motion.div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
                            {isLogin ? 'Signing in...' : 'Creating account...'}
                        </span>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link to={isLogin ? '/signup' : '/login'} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    {isLogin ? 'Sign up free' : 'Sign in'}
                </Link>
            </p>
        </motion.div>
    )
}
