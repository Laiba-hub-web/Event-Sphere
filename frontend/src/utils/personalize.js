// Personalization helpers shared across dashboards, sidebar, and navbar

// "Sarah Jenkins (Chief Organizer)" -> "Sarah"
export const getFirstName = (name = '') => {
  const clean = String(name).replace(/\(.*?\)/g, '').trim()
  return clean.split(/\s+/)[0] || 'there'
}

// "Sarah Jenkins (Chief Organizer)" -> "Chief Organizer"
export const getTitleFromName = (name = '') => {
  const match = String(name).match(/\((.*?)\)/)
  return match ? match[1] : ''
}

export const getInitials = (name = '') => {
  const clean = String(name).replace(/\(.*?\)/g, '').trim()
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

export const getGreeting = (date = new Date()) => {
  const h = date.getHours()
  if (h < 5) return 'Working late'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export const getTodayLabel = (date = new Date()) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

// Role-based visual identity (subtle, professional accents)
export const ROLE_THEME = {
  admin: {
    label: 'Organizer',
    chip: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    avatar: 'bg-indigo-600',
    ring: 'ring-indigo-100',
    accentBar: 'from-indigo-600 to-blue-600',
    soft: 'from-indigo-50/80',
  },
  exhibitor: {
    label: 'Exhibitor',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    avatar: 'bg-emerald-600',
    ring: 'ring-emerald-100',
    accentBar: 'from-emerald-600 to-teal-600',
    soft: 'from-emerald-50/80',
  },
  attendee: {
    label: 'Attendee',
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    avatar: 'bg-blue-600',
    ring: 'ring-blue-100',
    accentBar: 'from-blue-600 to-sky-500',
    soft: 'from-blue-50/80',
  },
}

export const getRoleTheme = (role) => {
  const theme = ROLE_THEME[role] || ROLE_THEME.attendee
  return {
    ...theme,
    bgClass: theme.avatar,
    pillClass: theme.chip,
  }
}

export const getUserInitials = getInitials

