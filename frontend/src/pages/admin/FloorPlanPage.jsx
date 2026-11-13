import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Compass,
  Coffee,
  Mic2,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Store,
  CheckCircle2,
  Building2,
  DollarSign,
  Tag,
  ShieldCheck,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'
import { expoService, boothService, exhibitorService } from '../../api/services'

const FALLBACK_EXHIBITORS = [
  {
    _id: 'fallback-techcorp',
    company: 'TechCorp Autonomous Systems',
    user: { _id: 'fallback-techcorp', name: 'David Vance', email: 'sales@techcorp.com' },
    category: 'Autonomous Systems & AI',
    products: ['LiDAR-X9 Vision Sensor', 'NeuralEdge Compute Node'],
  },
  {
    _id: 'fallback-biogenix',
    company: 'BioGenix Precision Therapeutics',
    user: { _id: 'fallback-biogenix', name: 'Dr. Elena Rostova', email: 'partner@biogenix.com' },
    category: 'Biotechnology & Genomics',
    products: ['NanoTarget LNP Core', 'GeneSeq Rapid Analyzer'],
  },
  {
    _id: 'fallback-voltdynamics',
    company: 'VoltDynamics Power Systems',
    user: { _id: 'fallback-voltdynamics', name: 'Marcus Chen', email: 'info@voltdynamics.com' },
    category: 'Clean Energy & Storage',
    products: ['SolidVolt 500 Cell', 'MegaCharge 800kW'],
  },
  {
    _id: 'fallback-quantumleap',
    company: 'QuantumLeap Computing',
    user: { _id: 'fallback-quantumleap', name: 'Dr. Alistair Finch', email: 'support@quantumleap.com' },
    category: 'Quantum Computing',
    products: ['Leap-1024 QPU Chip', 'CryoControl Rack V3'],
  },
  {
    _id: 'fallback-apexrobotics',
    company: 'Apex Robotics International',
    user: { _id: 'fallback-apexrobotics', name: 'Camilla Hayes', email: 'sales@apexrobotics.com' },
    category: 'Industrial Robotics',
    products: ['ApexHumanoid Model 2', 'TactileHand 5D'],
  },
  {
    _id: 'fallback-cybershield',
    company: 'CyberShield Global Systems',
    user: { _id: 'fallback-cybershield', name: 'Vikram Patel', email: 'defense@cybershield.com' },
    category: 'Cybersecurity',
    products: ['CyberShield Sentinel AI', 'ThreatDeception Grid'],
  },
  {
    _id: 'fallback-yousuf',
    company: 'M Yousuf Enterprises',
    user: { _id: 'fallback-yousuf', name: 'M Yousuf', email: 'yousuf@gmail.com' },
    category: 'Enterprise Solutions',
    products: ['Enterprise Cloud Suite', 'B2B Analytics Hub'],
  },
]

export default function FloorPlanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expo, setExpo] = useState(null)
  const [booths, setBooths] = useState([])
  const [exhibitors, setExhibitors] = useState(FALLBACK_EXHIBITORS)
  const [loading, setLoading] = useState(true)
  const [selectedBooth, setSelectedBooth] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [boothSearch, setBoothSearch] = useState('')
  const [zoomScale, setZoomScale] = useState(1)

  // Edit form state in modal
  const [size, setSize] = useState('medium')
  const [price, setPrice] = useState(0)
  const [notes, setNotes] = useState('')
  const [selectedExhibitorId, setSelectedExhibitorId] = useState('')
  const [exhibitorFilterQuery, setExhibitorFilterQuery] = useState('')
  const [showReassignFlow, setShowReassignFlow] = useState(false)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [expoRes, boothRes, exhRes] = await Promise.all([
        expoService.getOne(id),
        boothService.getByExpo(id),
        exhibitorService.getByExpo(id, { all: true }).catch(() => ({ data: { exhibitors: [] } })),
      ])
      setExpo(expoRes.data.expo)
      setBooths(boothRes.data.booths || [])

      const fetchedExhibitors = exhRes.data?.exhibitors || []
      // Merge unique companies so dropdown is always fully populated
      const companyMap = new Map()
      FALLBACK_EXHIBITORS.forEach((f) => companyMap.set(f.company.toLowerCase(), f))
      fetchedExhibitors.forEach((item) => {
        if (item.company) {
          companyMap.set(item.company.toLowerCase(), item)
        }
      })
      const merged = Array.from(companyMap.values())
      setExhibitors(merged.length > 0 ? merged : FALLBACK_EXHIBITORS)
    } catch (err) {
      toast.error('Failed to load floor plan')
    } finally {
      setLoading(false)
    }
  }

  const openBoothModal = (booth) => {
    setSelectedBooth(booth)
    setSize(booth.size || 'medium')
    setPrice(booth.price || 0)
    setNotes(booth.notes || '')
    setShowReassignFlow(false)
    setExhibitorFilterQuery('')

    const currentExhId =
      booth.exhibitorProfile?._id ||
      booth.exhibitor?._id ||
      (typeof booth.exhibitor === 'string' ? booth.exhibitor : '')
    setSelectedExhibitorId(currentExhId || '')
  }

  const handleUpdateBooth = async (e) => {
    e.preventDefault()
    if (!selectedBooth) return
    setUpdating(true)
    try {
      await boothService.update(selectedBooth._id, { size, price: Number(price), notes })
      toast.success(`Booth ${selectedBooth.number} details updated`)
      setSelectedBooth(null)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booth')
    } finally {
      setUpdating(false)
    }
  }

  const handleAssignExhibitor = async (overrideExhId) => {
    const targetId = overrideExhId || selectedExhibitorId
    if (!selectedBooth || !targetId) {
      toast.error('Please select an exhibitor company first')
      return
    }
    setUpdating(true)
    try {
      const chosen = exhibitors.find(
        (exh) =>
          (exh.user?._id || exh._id) === targetId ||
          exh._id === targetId ||
          exh.user?._id === targetId
      )
      await boothService.assign(selectedBooth._id, {
        exhibitorId: chosen?.user?._id || targetId,
        exhibitorProfileId: chosen?._id,
        company: chosen?.company,
      })
      toast.success(
        `Booth ${selectedBooth.number} successfully assigned to ${chosen?.company || 'exhibitor'}`
      )
      setSelectedBooth(null)
      setShowReassignFlow(false)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign booth')
    } finally {
      setUpdating(false)
    }
  }

  const handleReleaseBooth = async () => {
    if (!selectedBooth) return
    setUpdating(true)
    try {
      await boothService.release(selectedBooth._id)
      toast.success(`Booth ${selectedBooth.number} released and marked available`)
      setSelectedBooth(null)
      setShowReassignFlow(false)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to release booth')
    } finally {
      setUpdating(false)
    }
  }

  // Filtered booths on floor plan
  const filteredBooths = useMemo(() => {
    return booths.filter((booth) => {
      if (statusFilter !== 'all' && booth.status !== statusFilter) return false
      if (!boothSearch.trim()) return true
      const q = boothSearch.toLowerCase().trim()
      const matchNum = booth.number?.toLowerCase().includes(q)
      const matchCompany = booth.exhibitorProfile?.company?.toLowerCase().includes(q)
      const matchSize = booth.size?.toLowerCase().includes(q)
      return matchNum || matchCompany || matchSize
    })
  }, [booths, statusFilter, boothSearch])

  // Filtered exhibitors inside modal
  const filteredExhibitors = useMemo(() => {
    if (!exhibitorFilterQuery.trim()) return exhibitors
    const q = exhibitorFilterQuery.toLowerCase().trim()
    return exhibitors.filter((exh) => {
      const matchComp = exh.company?.toLowerCase().includes(q)
      const matchUser = exh.user?.name?.toLowerCase().includes(q)
      const matchEmail = exh.user?.email?.toLowerCase().includes(q) || exh.contactEmail?.toLowerCase().includes(q)
      const matchCat = exh.category?.toLowerCase().includes(q)
      return matchComp || matchUser || matchEmail || matchCat
    })
  }, [exhibitors, exhibitorFilterQuery])

  // Currently selected exhibitor preview
  const activeSelectedCompany = useMemo(() => {
    if (!selectedExhibitorId) return null
    return exhibitors.find(
      (e) =>
        (e.user?._id || e._id) === selectedExhibitorId ||
        e._id === selectedExhibitorId ||
        e.user?._id === selectedExhibitorId
    )
  }, [exhibitors, selectedExhibitorId])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-16 flex justify-center">
          <LoadingSpinner text="Loading interactive floor plan..." />
        </div>
      </DashboardLayout>
    )
  }

  const availableCount = booths.filter((b) => b.status === 'available').length
  const reservedCount = booths.filter((b) => b.status === 'reserved').length
  const occupiedCount = booths.filter((b) => b.status === 'occupied').length
  const totalRevenue = booths
    .filter((b) => b.status === 'occupied' || b.status === 'reserved')
    .reduce((sum, b) => sum + (Number(b.price) || 0), 0)
  const occupancyPct =
    booths.length > 0 ? Math.round(((occupiedCount + reservedCount) / booths.length) * 100) : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="min-w-0">
            <button
              onClick={() => navigate('/admin/expos')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Events
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <span>Floor Plan &amp; Booth Management</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Interactive Studio
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
              {expo?.title} &bull; {expo?.location}
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Total:</span>{' '}
              <strong className="text-slate-800">{booths.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span className="font-medium">Available:</span>{' '}
              <strong>{availableCount}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
              <span className="font-medium">Occupied:</span>{' '}
              <strong>{occupiedCount}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-800">
              <span className="font-medium">Booked Revenue:</span>{' '}
              <strong>${totalRevenue.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Filter and Control Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search by booth # or company */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={boothSearch}
              onChange={(e) => setBoothSearch(e.target.value)}
              placeholder="Search booth (e.g. A-3) or company..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {boothSearch && (
              <button
                type="button"
                onClick={() => setBoothSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `All (${booths.length})`, activeCls: 'bg-blue-600 text-white border-blue-600' },
              {
                id: 'available',
                label: `Available (${availableCount})`,
                activeCls: 'bg-emerald-600 text-white border-emerald-600',
              },
              {
                id: 'reserved',
                label: `Reserved (${reservedCount})`,
                activeCls: 'bg-amber-500 text-white border-amber-500',
              },
              {
                id: 'occupied',
                label: `Occupied (${occupiedCount})`,
                activeCls: 'bg-blue-600 text-white border-blue-600',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? tab.activeCls
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 shrink-0 bg-slate-50 border border-slate-200 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setZoomScale((z) => Math.max(0.75, +(z - 0.1).toFixed(2)))}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[11px] font-bold text-slate-600 px-2 min-w-[42px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              title="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(1)}
              className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-slate-700 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>
                Floor Booked ({occupiedCount + reservedCount} of {booths.length} Booths)
              </span>
              <span className="text-blue-600 font-bold">{occupancyPct}% Occupancy</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500 shrink-0 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Available
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-2" /> Reserved
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 ml-2" /> Occupied
          </div>
        </div>

        {/* 2D Floor Plan Grid Container */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
          {/* Top Hall Landmarks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-semibold text-slate-600">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-center gap-2 text-center">
              <Compass size={15} className="text-blue-600 shrink-0" />
              <span>Main Hall Entrance &bull; Registration Desk</span>
            </div>
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex items-center justify-center gap-2 text-blue-800 text-center">
              <Mic2 size={15} className="text-blue-600 shrink-0" />
              <span>Main Keynote Stage &amp; Auditorium</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-center gap-2 text-center">
              <Coffee size={15} className="text-amber-600 shrink-0" />
              <span>VIP B2B Networking Lounge</span>
            </div>
          </div>

          {/* Interactive Scroll & Zoom Wrapper */}
          <div className="w-full overflow-x-auto pb-4">
            <div
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top left',
                transition: 'transform 150ms ease-out',
              }}
            >
              <div
                className="grid gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-w-[720px]"
                style={{
                  gridTemplateColumns: `repeat(${expo?.boothColumns || 8}, minmax(105px, 1fr))`,
                }}
              >
                {filteredBooths.map((booth) => {
                  const isOccupied = booth.status === 'occupied'
                  const isReserved = booth.status === 'reserved'
                  const statusStyle = isOccupied
                    ? 'bg-blue-50 hover:bg-blue-100/90 border-blue-200 text-blue-900 ring-blue-500/10'
                    : isReserved
                    ? 'bg-amber-50 hover:bg-amber-100/90 border-amber-200 text-amber-900 ring-amber-500/10'
                    : 'bg-emerald-50 hover:bg-emerald-100/90 border-emerald-200 text-emerald-900 ring-emerald-500/10'

                  const badgeDot = isOccupied
                    ? 'bg-blue-600 text-white'
                    : isReserved
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'

                  return (
                    <button
                      type="button"
                      key={booth._id}
                      onClick={() => openBoothModal(booth)}
                      className={`h-28 border rounded-xl p-3 flex flex-col justify-between items-center text-center transition-all cursor-pointer shadow-2xs hover:shadow-card hover:-translate-y-0.5 active:scale-[0.98] ${statusStyle}`}
                    >
                      <div className="flex justify-between items-center w-full text-[10px] font-bold">
                        <span className={`px-1.5 py-0.5 rounded-md ${badgeDot}`}>
                          {booth.number}
                        </span>
                        <span className="uppercase text-slate-500 tracking-wider">
                          {booth.size}
                        </span>
                      </div>
                      <div className="w-full my-auto py-1">
                        <div className="text-xs font-bold truncate text-slate-900 leading-tight">
                          {booth.exhibitorProfile?.company || (
                            <span className="capitalize font-semibold opacity-75">
                              {booth.status}
                            </span>
                          )}
                        </div>
                        {booth.exhibitorProfile?.company && (
                          <p className="text-[10px] text-blue-600 font-medium truncate mt-0.5">
                            Assigned
                          </p>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        {booth.price ? `$${booth.price}` : 'Free'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Interactive Modal for Booth Editing & Exhibitor Assignment */}
      <Modal
        isOpen={!!selectedBooth}
        onClose={() => setSelectedBooth(null)}
        title={`Configure Booth ${selectedBooth?.number}`}
      >
        <div className="space-y-6">
          {/* Booth Status Overview Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3 h-3 rounded-full ${
                  selectedBooth?.status === 'occupied'
                    ? 'bg-blue-600 ring-4 ring-blue-100'
                    : selectedBooth?.status === 'reserved'
                    ? 'bg-amber-500 ring-4 ring-amber-100'
                    : 'bg-emerald-500 ring-4 ring-emerald-100'
                }`}
              />
              <div>
                <span className="text-xs font-medium text-slate-500">Current Status:</span>
                <span className="ml-1.5 text-xs font-bold capitalize text-slate-900">
                  {selectedBooth?.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 uppercase">
                {selectedBooth?.size}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 font-bold text-blue-700">
                {selectedBooth?.price ? `$${selectedBooth.price}` : 'Complimentary'}
              </span>
            </div>
          </div>

          {/* Form Section 1: Booth Specs & Pricing */}
          <form onSubmit={handleUpdateBooth} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={13} className="text-blue-600" />
                Booth Dimensions &amp; Pricing
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Booth Size Tier
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="small">Small (3×3m Standard Booth)</option>
                  <option value="medium">Medium (6×3m Premium Booth)</option>
                  <option value="large">Large (9×6m Island Pavilion)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rate (USD)
                </label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Power, Wi-Fi &amp; Location Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Corner spot near main entrance, 10Gbps dedicated fiber"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Save Booth Specs
              </button>
            </div>
          </form>

          {/* Form Section 2: Exhibitor Allocation & Release */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} className="text-blue-600" />
                Exhibitor Allocation &amp; Release
              </h4>
              {selectedBooth?.status !== 'available' && !showReassignFlow && (
                <button
                  type="button"
                  onClick={() => setShowReassignFlow(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  Reassign Company
                </button>
              )}
            </div>

            {/* CASE A: Booth is currently assigned and not in reassign mode */}
            {selectedBooth?.status !== 'available' && !showReassignFlow ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {selectedBooth?.exhibitorProfile?.company?.[0]?.toUpperCase() || 'E'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedBooth?.exhibitorProfile?.company || 'Assigned Exhibitor'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedBooth?.exhibitor?.name || 'Verified Exhibitor Partner'} &bull;{' '}
                        {selectedBooth?.exhibitor?.email || 'sales@company.com'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="blue">Occupied</Badge>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-200 gap-2">
                  <span className="text-xs text-slate-500">
                    Releasing this booth will make it available on the public floor plan immediately.
                  </span>
                  <button
                    type="button"
                    onClick={handleReleaseBooth}
                    disabled={updating}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    Release Booth
                  </button>
                </div>
              </div>
            ) : (
              /* CASE B: Booth is Available OR Admin clicked Reassign Company */
              <div className="space-y-3">
                {showReassignFlow && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <span>Reassigning booth from previous company</span>
                    <button
                      type="button"
                      onClick={() => setShowReassignFlow(false)}
                      className="font-bold underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Search input for company */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={exhibitorFilterQuery}
                    onChange={(e) => setExhibitorFilterQuery(e.target.value)}
                    placeholder="Search company name, contact, or category..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Primary Company Dropdown */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Select an exhibitor company:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={selectedExhibitorId}
                      onChange={(e) => setSelectedExhibitorId(e.target.value)}
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    >
                      <option value="">Select an exhibitor company...</option>
                      {filteredExhibitors.map((exh) => {
                        const val = exh.user?._id || exh._id
                        const contact = exh.user?.name ? ` • ${exh.user.name}` : ''
                        return (
                          <option key={exh._id || val} value={val}>
                            {exh.company}
                            {contact}
                          </option>
                        )
                      })}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleAssignExhibitor()}
                      disabled={updating || !selectedExhibitorId}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer shadow-xs transition-colors shrink-0"
                    >
                      Assign Booth
                    </button>
                  </div>
                </div>

                {/* Selected Company Preview Card */}
                {activeSelectedCompany && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-blue-900 truncate">
                        {activeSelectedCompany.company}
                      </p>
                      <p className="text-blue-700 truncate">
                        Contact: {activeSelectedCompany.user?.name || 'Authorized Rep'} &bull;{' '}
                        {activeSelectedCompany.user?.email || activeSelectedCompany.contactEmail || ''}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase shrink-0">
                      Selected
                    </span>
                  </div>
                )}

                {/* Quick Pick Cards (top 3 filtered companies) */}
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Pick Verified Companies
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {filteredExhibitors.slice(0, 6).map((exh) => {
                      const val = exh.user?._id || exh._id
                      const isChosen = selectedExhibitorId === val
                      return (
                        <div
                          key={exh._id || val}
                          onClick={() => setSelectedExhibitorId(val)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isChosen
                              ? 'bg-blue-50/80 border-blue-500 shadow-2xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {exh.company}
                            </p>
                            {isChosen && <CheckCircle2 size={13} className="text-blue-600 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {exh.user?.name || 'Partner Rep'} &bull; {exh.category || 'Tech Partner'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
