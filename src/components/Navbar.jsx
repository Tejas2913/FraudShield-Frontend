import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/api'
import { Shield, LayoutDashboard, Scan, Info, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
    const { isAuthenticated, user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        try { await logout() } catch { }
        logoutUser()
        navigate('/')
    }

    const isActive = (path) => location.pathname === path

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                    ? 'bg-blue-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
                }`}
        >
            <Icon size={16} />
            {label}
        </Link>
    )

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all">
                        <Shield size={20} className="text-cyan-400" />
                    </div>
                    <span className="text-lg font-bold gradient-text">FraudShield</span>
                    <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">AI</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-2">
                    <NavLink to="/about" icon={Info} label="About" />
                    {isAuthenticated && (
                        <>
                            <NavLink to="/analyzer" icon={Scan} label="Analyzer" />
                            <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        </>
                    )}
                </div>

                {/* Auth buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-slate-400">
                                Hi, <span className="text-cyan-400 font-semibold">{user?.name?.split(' ')[0]}</span>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/30">
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-outline text-sm px-4 py-2">Sign In</Link>
                            <Link to="/signup" className="btn-primary text-sm px-4 py-2">Get Started</Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button className="md:hidden text-slate-400 hover:text-cyan-400 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden mt-4 p-4 glass-card space-y-2"
                    >
                        <NavLink to="/about" icon={Info} label="About" />
                        {isAuthenticated && (
                            <>
                                <NavLink to="/analyzer" icon={Scan} label="Analyzer" />
                                <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        )}
                        {!isAuthenticated && (
                            <div className="flex gap-2 pt-2">
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm px-4 py-2 flex-1 text-center">Sign In</Link>
                                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm px-4 py-2 flex-1 text-center">Get Started</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
