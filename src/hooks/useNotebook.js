import { useEffect, useState } from 'react'
import { initialData, normalizeData } from '../lib'
const KEY = 'bjj-notebook-v1'
export function useNotebook() {
  const [data, setData] = useState(() => { try { return normalizeData(JSON.parse(localStorage.getItem(KEY)) || {}) } catch { return initialData } })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(data)) }, [data])
  const add = (collection, item) => setData((current) => ({ ...current, [collection]: [item, ...current[collection]] }))
  const remove = (collection, id) => setData((current) => ({ ...current, [collection]: current[collection].filter((item) => item.id !== id) }))
  const update = (collection, id, item) => setData((current) => ({ ...current, [collection]: current[collection].map((existing) => existing.id === id ? { ...existing, ...item } : existing) }))
  return { data, setData, add, update, remove, reset: () => setData(initialData) }
}
