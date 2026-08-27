import { useEffect, useState } from 'react'
import { initialData } from '../lib'
const KEY = 'bjj-notebook-v1'
export function useNotebook() {
  const [data, setData] = useState(() => { try { return { ...initialData, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return initialData } })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(data)) }, [data])
  const add = (collection, item) => setData((current) => ({ ...current, [collection]: [item, ...current[collection]] }))
  const remove = (collection, id) => setData((current) => ({ ...current, [collection]: current[collection].filter((item) => item.id !== id) }))
  return { data, setData, add, remove, reset: () => setData(initialData) }
}
