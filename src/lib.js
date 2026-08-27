export const POSITIONS = ['Standing', 'Closed guard', 'Open guard', 'Half guard', 'Side control', 'Mount', 'Back', 'Turtle', 'Leg entanglement']
export const TECHNIQUE_TYPES = ['Takedown', 'Sweep', 'Pass', 'Submission', 'Escape', 'Control', 'Transition', 'Defence']
export const STUDY_TYPES = ['Technique', 'Concept', 'Troubleshooting', 'Strategy', 'Match study', 'Seminar']
export const STUDY_STATUSES = ['To watch', 'Watched', 'Drill this', 'Tested in sparring', 'Integrated', 'Discarded']
export const SESSION_TYPES = ['Class', 'Sparring', 'Open mat', 'Private', 'Competition']
export const OPPONENT_TYPES = ['Stronger', 'Faster', 'Wrestler', 'Flexible', 'Pressure passer', 'Guard player', 'Beginner', 'Advanced']
export const initialData = { sessions: [], techniques: [], sparring: [], study: [], gamePlan: { aGame: '', bGame: '', emergencies: '', competition: '' } }
export const normalizeData = (value = {}) => ({
  ...initialData,
  ...value,
  sessions: Array.isArray(value.sessions) ? value.sessions : [],
  techniques: Array.isArray(value.techniques) ? value.techniques : [],
  sparring: Array.isArray(value.sparring) ? value.sparring : [],
  study: Array.isArray(value.study) ? value.study : [],
  gamePlan: { ...initialData.gamePlan, ...(value.gamePlan || {}) },
})
export const today = () => new Date().toISOString().slice(0, 10)
export const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`
export const titleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1)
export const minutesLabel = (minutes) => minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60 ? `${minutes % 60}m` : ''}`.trim() : `${minutes}m`
export const shortDate = (date) => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`))
export function getAnalytics(data) {
  const now = new Date(), start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const week = data.sessions.filter((s) => new Date(`${s.date}T12:00:00`) >= start), counts = {}, problems = {}
  data.techniques.forEach((t) => { if (t.position) counts[t.position] = (counts[t.position] || 0) + 1 })
  data.sparring.forEach((s) => { if (s.position) problems[s.position] = (problems[s.position] || 0) + 1 })
  const top = (object) => Object.entries(object).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not enough data'
  const avg = data.techniques.length ? data.techniques.reduce((sum, t) => sum + Number(t.confidence), 0) / data.techniques.length : 0
  const problem = top(problems), lowest = [...data.techniques].sort((a, b) => Number(a.confidence) - Number(b.confidence))[0]?.position
  return { sessions: week.length, minutes: week.reduce((sum, s) => sum + Number(s.duration || 0), 0), topPosition: top(counts), problem, confidence: avg, focus: problem !== 'Not enough data' ? problem : (lowest || 'Log a session to reveal patterns'), positions: counts }
}
