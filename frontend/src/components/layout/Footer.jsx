import React from 'react'
import { Link } from 'react-router-dom'
import { Globe2, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand */}
        <div className="space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5 text-slate-900 font-extrabold text-xl">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Globe2 size={20} />
            </div>
            <span>EventSphere</span>
          </Link>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Discover upcoming conferences, reserve exhibition booths, and build your personal speaker schedule.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/expos" className="hover:text-blue-600 transition-colors">
                Browse Events
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-blue-600 transition-colors">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-600 transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/messages" className="hover:text-blue-600 transition-colors">
                Messages
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/expos" className="hover:text-blue-600 transition-colors">
                Technology &amp; AI
              </Link>
            </li>
            <li>
              <Link to="/expos" className="hover:text-blue-600 transition-colors">
                Healthcare &amp; Medicine
              </Link>
            </li>
            <li>
              <Link to="/expos" className="hover:text-blue-600 transition-colors">
                Clean Energy
              </Link>
            </li>
            <li>
              <Link to="/expos" className="hover:text-blue-600 transition-colors">
                Business &amp; Finance
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Contact Us</h4>
          <div className="space-y-2 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-600 shrink-0" />
              <span>100 Innovation Way, San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-blue-600 shrink-0" />
              <span>support@eventsphere.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-blue-600 shrink-0" />
              <span>+1 (800) 555-0199</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} EventSphere. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
