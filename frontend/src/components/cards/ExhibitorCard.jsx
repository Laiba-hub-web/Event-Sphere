import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Globe,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

export default function ExhibitorCard({ exhibitor, boothNumber, onContact }) {
  const navigate = useNavigate()
  const profile = exhibitor.exhibitorProfile || exhibitor
  const companyName = profile.company || exhibitor.user?.name || 'Enterprise Exhibitor'

  const handleInquire = () => {
    if (onContact) {
      onContact(exhibitor)
    } else {
      navigate('/messages')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Top Accent Banner */}
        <div className="h-16 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 relative px-5 flex items-center justify-end">
          {boothNumber && (
            <span className="text-[11px] font-extrabold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              Booth {boothNumber}
            </span>
          )}
          {!boothNumber && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300">
              <CheckCircle2 size={12} className="text-emerald-400" /> Verified Exhibitor
            </span>
          )}
        </div>

        {/* Company Logo & Header */}
        <div className="px-5 pb-5 -mt-8 relative">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-slate-100 overflow-hidden flex items-center justify-center">
              {profile.logo ? (
                <img
                  src={profile.logo}
                  alt={companyName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl">
                  {companyName[0]}
                </div>
              )}
            </div>

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Globe size={13} /> Website <ExternalLink size={11} />
              </a>
            )}
          </div>

          <h4 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">
            {companyName}
          </h4>
          {exhibitor.user?.name && (
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Rep: {exhibitor.user.name}
            </p>
          )}

          {profile.description && (
            <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
              {profile.description}
            </p>
          )}

          {/* Products Showcase */}
          {profile.products?.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles size={11} className="text-blue-500" /> Showcased Products
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.products.map((p, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-blue-50/80 text-blue-700 px-2.5 py-0.5 rounded-lg border border-blue-100"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {profile.services?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profile.services.map((s, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-violet-50 text-violet-700 px-2 py-0.5 rounded-md"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Footer */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-500 truncate">
          {profile.contactEmail && (
            <a
              href={`mailto:${profile.contactEmail}`}
              className="hover:text-blue-600 flex items-center gap-1 truncate"
              title={profile.contactEmail}
            >
              <Mail size={13} />
              <span className="truncate max-w-[120px]">{profile.contactEmail}</span>
            </a>
          )}
          {profile.contactPhone && (
            <span className="hidden sm:flex items-center gap-1 text-[11px]">
              <Phone size={12} /> {profile.contactPhone}
            </span>
          )}
        </div>

        <button
          onClick={handleInquire}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
        >
          <MessageSquare size={13} /> Message
        </button>
      </div>
    </div>
  )
}
