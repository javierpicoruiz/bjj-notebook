import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { DeleteButton, Empty, Field, PageHeader } from '../components/UI'
import { POSITIONS, STUDY_STATUSES, STUDY_TYPES, TECHNIQUE_TYPES, shortDate, today, uid } from '../lib'

const makeBlank = () => ({ date: today(), title: '', instructorOrChannel: '', url: '', position: 'Standing', type: 'Technique', status: 'To watch', summary: '', keyDetail: '', timestamps: '', drillPlan: '', relatedTechniqueId: '', notes: '' })

function StudyForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial), set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => { event.preventDefault(); onSave(form) }
  return <form className="panel form-grid study-form" onSubmit={submit}>
    <Field label="Video title" wide><input required autoFocus value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="What are you studying?" /></Field>
    <Field label="Instructor or channel"><input value={form.instructorOrChannel} onChange={(e) => set('instructorOrChannel', e.target.value)} placeholder="Name or source" /></Field>
    <Field label="Date"><input required type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></Field>
    <Field label="Video link" wide><input required type="url" value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://…" /></Field>
    <Field label="Position"><select value={form.position} onChange={(e) => set('position', e.target.value)}>{POSITIONS.map((item) => <option key={item}>{item}</option>)}</select></Field>
    <Field label="Study type"><select value={form.type} onChange={(e) => set('type', e.target.value)}>{STUDY_TYPES.map((item) => <option key={item}>{item}</option>)}</select></Field>
    <Field label="Status" wide><select value={form.status} onChange={(e) => set('status', e.target.value)}>{STUDY_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></Field>
    <Field label="Summary" wide><textarea rows="3" value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Explain the idea in your own words." /></Field>
    <Field label="Key detail" wide><textarea rows="2" value={form.keyDetail} onChange={(e) => set('keyDetail', e.target.value)} placeholder="The detail most likely to change the outcome…" /></Field>
    <Field label="Useful timestamps"><input value={form.timestamps} onChange={(e) => set('timestamps', e.target.value)} placeholder="02:14 entry · 06:40 reaction" /></Field>
    <Field label="Drill plan"><input value={form.drillPlan} onChange={(e) => set('drillPlan', e.target.value)} placeholder="Reps, resistance, starting position…" /></Field>
    <Field label="Additional notes" wide><textarea rows="2" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Questions, sparring problems, follow-up…" /></Field>
    <div className="form-actions wide"><button className="ghost" type="button" onClick={onCancel}>Cancel</button><button className="primary" type="submit">Save study item</button></div>
  </form>
}

export default function Study({ data, add, update, remove }) {
  const [form, setForm] = useState(null), [position, setPosition] = useState('All'), [type, setType] = useState('All'), [status, setStatus] = useState('All')
  const items = useMemo(() => data.study.filter((item) => (position === 'All' || item.position === position) && (type === 'All' || item.type === type) && (status === 'All' || item.status === status)), [data.study, position, type, status])
  const save = (item) => { if (item.id) update('study', item.id, item); else add('study', { ...item, id: uid() }); setForm(null) }
  const convert = (item) => {
    if (item.relatedTechniqueId) return
    const techniqueId = uid(), techniqueType = TECHNIQUE_TYPES.includes(item.type) ? item.type : 'Control'
    add('techniques', { id: techniqueId, name: item.title, position: item.position, type: techniqueType, uniform: 'both', confidence: 1, notes: [item.keyDetail, item.summary, item.drillPlan && `Drill: ${item.drillPlan}`, `Source: ${item.url}`].filter(Boolean).join('\n\n'), mistakes: '' })
    update('study', item.id, { relatedTechniqueId: techniqueId, status: item.status === 'To watch' ? 'Drill this' : item.status })
  }
  return <><PageHeader eyebrow="Deliberate technical study" title="Study room" description="Turn instructionals into details to remember, drills to run, and ideas to test under resistance." action={<button className="primary" onClick={() => setForm(form ? null : makeBlank())}><Icon name={form ? 'close' : 'plus'} size={17} />{form ? 'Close' : 'Add video'}</button>} />
    {form && <StudyForm key={form.id || 'new'} initial={form} onCancel={() => setForm(null)} onSave={save} />}
    <div className="filters study-filters"><select aria-label="Filter by position" value={position} onChange={(e) => setPosition(e.target.value)}><option>All</option>{POSITIONS.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by type" value={type} onChange={(e) => setType(e.target.value)}><option>All</option>{STUDY_TYPES.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{STUDY_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></div>
    {items.length === 0 ? <Empty title={data.study.length ? 'No matching study items' : 'Build a study queue with intent'} text={data.study.length ? 'Adjust the filters to see more of your library.' : 'Save one useful video, extract its key detail, and decide exactly how you will test it.'} action={!data.study.length && <button className="secondary" onClick={() => setForm(makeBlank())}>Add first video</button>} /> : <div className="study-list">{items.map((item) => <article className="study-card" key={item.id}>
      <div className="study-card-main"><div className="card-head"><div><span className={`status-badge status-${item.status.toLowerCase().replaceAll(' ', '-')}`}>{item.status}</span><span className="pill">{item.type}</span><span className="pill accent">{item.position}</span></div><div className="card-tools"><button className="icon-btn" onClick={() => { setForm({ ...makeBlank(), ...item }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} title="Edit" aria-label={`Edit ${item.title}`}><Icon name="edit" size={17} /></button><DeleteButton onClick={() => remove('study', item.id)} label={`Delete ${item.title}`} /></div></div>
        <h3>{item.title}</h3><p className="study-meta">{shortDate(item.date)}{item.instructorOrChannel && ` · ${item.instructorOrChannel}`}</p>
        {item.summary && <p className="study-copy">{item.summary}</p>}
        {item.keyDetail && <div className="key-detail"><span>Key detail</span><p>{item.keyDetail}</p></div>}
        <div className="study-details">{item.timestamps && <div><span>Timestamps</span><p>{item.timestamps}</p></div>}{item.drillPlan && <div><span>Drill plan</span><p>{item.drillPlan}</p></div>}{item.notes && <div><span>Notes</span><p>{item.notes}</p></div>}</div>
      </div>
      <div className="study-actions"><a className="secondary" href={item.url} target="_blank" rel="noreferrer">Open video <Icon name="external" size={15} /></a><button className="text-button" disabled={Boolean(item.relatedTechniqueId)} onClick={() => convert(item)}>{item.relatedTechniqueId ? 'Technique created' : 'Convert to technique'}<Icon name="chevron" size={15} /></button></div>
    </article>)}</div>}
  </>
}
