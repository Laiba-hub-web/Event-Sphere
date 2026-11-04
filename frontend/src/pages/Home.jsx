import React from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Grid,
  Users,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Calendar,
      title: 'Full Expo Lifecycle Management',
      desc: 'Create, schedule, and orchestrate large-scale industrial trade shows and exhibitions with ease.',
    },
    {
      icon: Grid,
      title: 'Interactive Floor Plans & Booths',
      desc: 'Visual grid booth mapping, automated allocations, real-time reservations, and custom booth sizing.',
    },
    {
      icon: Users,
      title: 'Exhibitor & Attendee Hubs',
      desc: 'Streamlined approval workflows, company profiles, product showcases, and seamless attendee passes.',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Messaging',
      desc: 'Instant direct communication between organizers, exhibitors, and attendees powered by WebSockets.',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics & Reports',
      desc: 'Track attendee engagement, session popularity, booth occupancy metrics, and feedback summaries.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Security & Roles',
      desc: 'Role-based access control (Admin, Exhibitor, Attendee), encrypted passwords, and secure JWT auth.',
    },
  ]

  const steps = [
    {
      num: '01',
      title: 'Discover & Plan',
      desc: 'Explore published trade shows and conventions across industries, view agendas and speaker lineups.',
    },
    {
      num: '02',
      title: 'Register & Reserve',
      desc: 'Attendees secure event passes; exhibitors submit applications and reserve premium booth locations.',
    },
    {
      num: '03',
      title: 'Engage & Network',
      desc: 'Attend bookmarked sessions, connect directly with exhibitors, and receive live event updates.',
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-950 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-primary-200 text-sm font-medium mb-8 backdrop-blur-sm border border-white/10">
            <Sparkles size={16} />
            <span>Next-Generation Expo & Trade Show Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-6">
            Revolutionizing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-300">Expo Experience</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            EventSphere simplifies complex trade shows for organizers, exhibitors, and attendees.
            From interactive floor plans and live agendas to instant messaging and deep analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/expos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base shadow-lg shadow-blue-500/30 transition-all"
            >
              Explore Expos
              <ArrowRight size={18} />
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-sm border border-white/20 transition-all"
              >
                Create Free Account
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-sm border border-white/20 transition-all"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="bg-primary-50 border-b border-primary-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extrabold text-primary-900">500+</div>
            <div className="text-sm font-medium text-gray-600 mt-1">Expos Hosted</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary-900">12,000+</div>
            <div className="text-sm font-medium text-gray-600 mt-1">Exhibitor Booths</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary-900">250,000+</div>
            <div className="text-sm font-medium text-gray-600 mt-1">Active Attendees</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary-900">99.9%</div>
            <div className="text-sm font-medium text-gray-600 mt-1">Uptime Reliability</div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything You Need for Seamless Expos</h2>
          <p className="mt-4 text-gray-600 text-lg">
            Purpose-built tools for event organizers, participating companies, and visiting attendees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-100 bg-white hover:border-primary-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mb-5">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Step by Step Laddered Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">Simple & Phased</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">How EventSphere Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
                <span className="text-5xl font-black text-primary-100 absolute top-4 right-6 select-none">{s.num}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-primary-900 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to transform your next expo?</h2>
          <p className="text-primary-200 text-base">
            Join thousands of event organizers, exhibitors, and trade visitors using EventSphere today.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition-colors"
            >
              Get Started Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm">
            © {new Date().getFullYear()} EventSphere Management. Aptech eProject Architecture.
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/expos" className="hover:text-white transition-colors">Expos</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

