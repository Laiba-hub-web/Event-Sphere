import React from 'react'
import { Globe, Mail, Phone, Building2 } from 'lucide-react'

export default function ExhibitorCard({ exhibitor, onContact }) {
  const profile = exhibitor.exhibitorProfile || exhibitor
  const companyName = profile.company || exhibitor.user?.name || 'Company'

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {profile.logo ? (
            <img src={profile.logo} alt={companyName} className="w-full h-full object-cover" />
          ) : (
            <Building2 size={24} className="text-primary-600" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-base">{companyName}</h4>
          {profile.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{profile.description}</p>
          )}

          {profile.products?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {profile.products.slice(0, 3).map((p, i) => (
                <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full border border-primary-100">
                  {p}
                </span>
              ))}
              {profile.products.length > 3 && (
                <span className="text-xs text-gray-400">+{profile.products.length - 3} more</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-3">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Globe size={15} />
              </a>
            )}
            {profile.contactEmail && (
              <a href={`mailto:${profile.contactEmail}`} className="text-gray-400 hover:text-primary-600 transition-colors">
                <Mail size={15} />
              </a>
            )}
            {profile.contactPhone && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Phone size={13} /> {profile.contactPhone}
              </span>
            )}
          </div>
        </div>
      </div>

      {onContact && (
        <button
          onClick={() => onContact(exhibitor)}
          className="w-full mt-4 px-4 py-2 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-sm font-medium rounded-lg transition-colors"
        >
          Contact Exhibitor
        </button>
      )}
    </div>
  )
}
