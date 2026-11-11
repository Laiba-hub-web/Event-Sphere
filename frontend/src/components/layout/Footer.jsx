import React from 'react'
import { Link } from 'react-router-dom'
import {
  Globe2,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 no-print">
      {/* Top Newsletter & CTA Strip */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
              <Sparkles size={14} /> Global Trade Show Intelligence
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Stay ahead of international expos & keynote announcements
            </h3>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.target.reset()
            }}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your corporate email..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Brand */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white font-extrabold text-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Globe2 size={22} className="text-white" />
            </div>
            <span>EventSphere</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            The enterprise platform for orchestrating large-scale international trade shows,
            interactive 2D booth floor plans, keynote schedules, and real-time B2B exhibitor
            networking.
          </p>
          <div className="pt-2 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-400" />
              <span>100 Innovation Way, Silicon Valley, CA 94107</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-blue-400" />
              <span>concierge@eventsphere-global.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-blue-400" />
              <span>+1 (800) 555-EXPO · 24/7 Organizer Desk</span>
            </div>
          </div>
        </div>

        {/* Col 2: Platform */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/expos" className="hover:text-white transition-colors inline-flex items-center gap-1">
                Explore All Expos <ArrowUpRight size={13} />
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">
                Exhibitor Registration
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">
                Attendee VIP Passes
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Organizer Portal
              </Link>
            </li>
            <li>
              <Link to="/messages" className="hover:text-white transition-colors">
                Real-Time B2B Chat
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Industry Verticals */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Industries</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/expos" className="hover:text-white transition-colors">
                AI & Autonomous Robotics
              </Link>
            </li>
            <li>
              <Link to="/expos" className="hover:text-white transition-colors">
                Healthcare & Biotechnology
              </Link>
            </li>
            <li>
              <Link to="/expos" className="hover:text-white transition-colors">
                Clean Energy & Smart EV
              </Link>
            </li>
            <li>
              <Link to="/expos" className="hover:text-white transition-colors">
                Cybersecurity & Cloud
              </Link>
            </li>
            <li>
              <Link to="/expos" className="hover:text-white transition-colors">
                FinTech & Digital Banking
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Enterprise Security */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trust & Compliance</h4>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secured with JWT Authentication, Bcrypt Encryption, and Real-Time WebSocket Sync.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium pt-1">
              <ShieldCheck size={14} className="text-blue-400" />
              GDPR & WCAG 2.1 Ready
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EventSphere Management Inc. Engineered for Aptech eProject Excellence.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

