import { useState, useEffect, useCallback } from 'react'
import { expoService } from '../api/services'

export function useExpos(params = {}) {
  const [expos, setExpos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({})

  const fetchExpos = useCallback(async (queryParams = params) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await expoService.getAll(queryParams)
      setExpos(data.expos || data.data || data)
      if (data.pagination) setPagination(data.pagination)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expos')
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    fetchExpos()
  }, []) // eslint-disable-line

  return { expos, loading, error, pagination, refetch: fetchExpos }
}
