import React, { useState } from 'react'
import { PanelLeft, X } from 'lucide-react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Mobile & Tablet Workspace Drawer Bar (< lg) */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 no-print">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
        >
          <PanelLeft size={15} className="text-blue-400" />
          <span>Workspace Menu</span>
        </button>
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
          {user?.role || 'Portal'} Hub
        </span>
      </div>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw] bg-slate-900 h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4 pb-1 bg-slate-900">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Portal Navigation
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 min-w-0">
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
