import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Clock,
  MapPin,
  User,
  Trash2,
  Edit3,
  Loader2,
  Mic2,
  Users,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { expoService, sessionService } from '../../api/services'

export default function ScheduleManagerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expo, setExpo] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    loadSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const [expoRes, sessRes] = await Promise.all([
        expoService.getOne(id),
        sessionService.getByExpo(id),
      ])
      setExpo(expoRes.data.expo)
      setSessions(sessRes.data.sessions || [])
    } catch (err) {
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingSession(null)
    reset({
      title: '',
      speaker: '',
      speakerBio: '',
      topic: '',
      description: '',
      location: 'Grand Keynote Auditorium A',
      startTime: '',
      endTime: '',
      capacity: 150,
    })
    setModalOpen(true)
  }

  const openEditModal = (sess) => {
    setEditingSession(sess)
    reset({
      title: sess.title,
      speaker: sess.speaker || '',
      speakerBio: sess.speakerBio || '',
      topic: sess.topic || '',
      description: sess.description || '',
      location: sess.location || '',
      startTime: sess.startTime ? new Date(sess.startTime).toISOString().slice(0, 16) : '',
      endTime: sess.endTime ? new Date(sess.endTime).toISOString().slice(0, 16) : '',
      capacity: sess.capacity || 150,
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        expoId: id,
        capacity: Number(data.capacity),
      }
      if (editingSession) {
        await sessionService.update(editingSession._id, payload)
        toast.success('Session updated')
      } else {
        await sessionService.create(payload)
        toast.success('Keynote session added to schedule')
      }
      setModalOpen(false)
      loadSessions()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Delete this session from the schedule?')) return
    try {
      await sessionService.delete(sessionId)
      toast.success('Session removed')
      loadSessions()
    } catch (err) {
      toast.error('Failed to delete session')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div>
            <button
              onClick={() => navigate('/admin/expos')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Events
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Conference &amp; Session Schedule
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{expo?.title}</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all self-start sm:self-auto shrink-0"
          >
            <Plus size={18} />
            Schedule New Session
          </button>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading keynote schedule..." />
            </div>
          ) : sessions.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No sessions scheduled yet"
              description="Add keynotes, panel discussions, or technical workshops to this expo."
              actionLabel="Add First Session"
              onAction={openCreateModal}
            />
          ) : (
            <div className="space-y-4">
              {sessions.map((sess) => {
                const count = sess.attendees?.length || 0
                const cap = sess.capacity || 150
                const pct = Math.min(100, Math.round((count / cap) * 100))

                return (
                  <div
                    key={sess._id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border border-slate-200 rounded-2xl hover:border-blue-300 transition-all gap-4 bg-slate-50/40"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold">
                          <Mic2 size={11} /> {sess.topic || 'Keynote Track'}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900">{sess.title}</h3>
                      </div>

                      {sess.description && (
                        <p className="text-xs text-slate-600 line-clamp-2">{sess.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <User size={14} className="text-blue-600" />
                          {sess.speaker || 'Keynote Speaker'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          {sess.location || 'Main Auditorium'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          {new Date(sess.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          –{' '}
                          {new Date(sess.endTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:items-center gap-4 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200/70">
                      <div className="w-full sm:w-44">
                        <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span className="flex items-center gap-1">
                            <Users size={12} className="text-blue-600" /> Seat Capacity
                          </span>
                          <span>
                            {count} / {cap}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => openEditModal(sess)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
                          title="Edit Session"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sess._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Session Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSession ? 'Edit Keynote Session' : 'Schedule New Keynote Session'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700">Session Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
              placeholder="e.g. Keynote: The Sovereign Frontier of Agentic AI"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-0.5">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">Speaker Name</label>
              <input
                type="text"
                {...register('speaker')}
                className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                placeholder="Dr. Evelyn Martinez"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Track / Category</label>
              <input
                type="text"
                {...register('topic')}
                className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                placeholder="AI & Robotics"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">Start Time</label>
              <input
                type="datetime-local"
                {...register('startTime', { required: 'Start time is required' })}
                className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
              />
              {errors.startTime && (
                <p className="text-xs text-rose-600 mt-0.5">{errors.startTime.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">End Time</label>
              <input
                type="datetime-local"
                {...register('endTime', { required: 'End time is required' })}
                className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
              />
              {errors.endTime && (
                <p className="text-xs text-rose-600 mt-0.5">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">Auditorium / Stage</label>
              <input
                type="text"
                {...register('location')}
                className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                placeholder="Main Auditorium A"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Seat Capacity</label>
              <input
                type="number"
                min="10"
                {...register('capacity')}
                className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">Session Abstract</label>
            <textarea
              rows={3}
              {...register('description')}
              className="mt-1 block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
              placeholder="Session abstract, technical takeaways, and target audience..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Save Session
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
