import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Clock, MapPin, User, Trash2, Edit3, Loader2 } from 'lucide-react'
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
      location: 'Stage A',
      startTime: '',
      endTime: '',
      capacity: 100,
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
      capacity: sess.capacity || 100,
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
        toast.success('Session added to schedule')
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
      toast.success('Session deleted')
      loadSessions()
    } catch (err) {
      toast.error('Failed to delete session')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/admin/expos')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Expos
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Event Schedule Manager</h1>
            <p className="text-sm text-gray-500">{expo?.title}</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
          >
            <Plus size={18} />
            Add Session
          </button>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="py-16 flex justify-center">
              <LoadingSpinner text="Loading schedule..." />
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
              {sessions.map((sess) => (
                <div
                  key={sess._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-gray-900">{sess.title}</span>
                      {sess.topic && (
                        <span className="px-2 py-0.5 text-xs bg-primary-50 text-primary-700 rounded-full font-medium">
                          {sess.topic}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={14} className="text-gray-400" />
                        {sess.speaker || 'No speaker listed'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        {sess.location || 'TBD'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
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
                      <span className="font-semibold text-gray-700">
                        {sess.attendees?.length || 0} / {sess.capacity} Registered
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEditModal(sess)}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded"
                      title="Edit Session"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(sess._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Session"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Session Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSession ? 'Edit Session' : 'Add New Session'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700">Session Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="e.g. Keynote: The Future of Quantum AI"
            />
            {errors.title && <p className="text-xs text-red-600 mt-0.5">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Speaker Name</label>
              <input
                type="text"
                {...register('speaker')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Dr. Elena Vance"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Topic / Category</label>
              <input
                type="text"
                {...register('topic')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="AI & Robotics"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                {...register('startTime', { required: 'Start time is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              {errors.startTime && (
                <p className="text-xs text-red-600 mt-0.5">{errors.startTime.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">End Time</label>
              <input
                type="datetime-local"
                {...register('endTime', { required: 'End time is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              {errors.endTime && (
                <p className="text-xs text-red-600 mt-0.5">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Location / Stage</label>
              <input
                type="text"
                {...register('location')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Main Auditorium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Seat Capacity</label>
              <input
                type="number"
                min="10"
                {...register('capacity')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Session abstract, topics covered, target audience..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
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

