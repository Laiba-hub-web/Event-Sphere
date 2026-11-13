import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Globe,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Calendar,
  Tag,
} from 'lucide-react'

export default function ExhibitorCard({
  exhibitor,
  boothNumber,
  onContact,
  onLocateBooth,
}) {
  const navigate = useNavigate()
  const profile = exhibitor.exhibitorProfile || exhibitor
  const companyName =
    profile.company || exhibitor.user?.name || 'Exhibiting Company'
  const resolvedBooth = boothNumber || exhibitor.booth?.number

  const handleInquire = (mode = 'inquiry') => {
    if (onContact) {
      onContact(exhibitor, mode)
    } else {
      navigate('/messages')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div className="p-5 space-y-4">
        {/* Top Row: Logo + Booth Location Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {profile.logo ? (
                <img
                  src={profile.logo}
                  alt={companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {companyName[0]}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-base truncate">
                  {companyName}
                </h4>
                <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
              </div>
              {exhibitor.user?.name && (
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Rep: {exhibitor.user.name}
                </p>
              )}
            </div>
          </div>

          {resolvedBooth ? (
            <button
              type="button"
              onClick={() => onLocateBooth && onLocateBooth(resolvedBooth, exhibitor)}
              className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl shrink-0 transition-colors cursor-pointer"
              title="Click to view booth on floor plan"
            >
              <MapPin size={12} /> Booth {resolvedBooth}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl shrink-0">
              Exhibitor
            </span>
          )}
        </div>

        {/* Description */}
        {profile.description && (
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {profile.description}
          </p>
        )}

        {/* Products & Categories Showcase */}
        {profile.products?.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Tag size={11} className="text-blue-600" /> Products &amp; Solutions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.products.map((p, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-lg border border-blue-100"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Services / Categories */}
        {profile.services?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.services.map((s, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Contact Info Strip */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          {(profile.contactEmail || exhibitor.user?.email) && (
            <a
              href={`mailto:${profile.contactEmail || exhibitor.user?.email}?subject=EventSphere Inquiry - ${companyName}`}
              className="hover:text-blue-600 inline-flex items-center gap-1 truncate"
            >
              <Mail size={13} className="text-blue-600 shrink-0" />
              <span className="truncate max-w-[150px]">
                {profile.contactEmail || exhibitor.user?.email}
              </span>
            </a>
          )}
          {profile.contactPhone && (
            <span className="inline-flex items-center gap-1 text-xs">
              <Phone size={12} className="text-slate-400" /> {profile.contactPhone}
            </span>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline ml-auto"
            >
              <Globe size={12} /> Website <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* Action Footer: Locate Booth, Book Appointment, Chat */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        {onLocateBooth && resolvedBooth ? (
          <button
            type="button"
            onClick={() => onLocateBooth(resolvedBooth, exhibitor)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <MapPin size={13} className="text-blue-600" /> View on Floor Plan
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">
            Direct Contact Available
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleInquire('appointment')}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Calendar size={12} /> Book Demo
          </button>
          <button
            type="button"
            onClick={() => handleInquire('inquiry')}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <MessageSquare size={12} /> Chat
          </button>
        </div>
      </div>
    </div>
  )
}
