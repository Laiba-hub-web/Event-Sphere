import React, { useState } from 'react'
import { PanelLeft, X } from 'lucide-react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Mobile & Tablet Menu Bar (< lg) */}
      <div className="lg:hidden bg-white px-4 py-2.5 flex items-center justify-between border-b border-slate-200 no-print">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg"
        >
          <PanelLeft size={15} className="text-blue-600" />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw] bg-white h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4 pb-1 bg-white">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
