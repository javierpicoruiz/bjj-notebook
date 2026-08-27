import Icon from './Icon'
export function PageHeader({ eyebrow, title, description, action }) { return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="lede">{description}</p>}</div>{action}</header> }
export function Field({ label, children, wide, hint }) { return <label className={`field ${wide ? 'wide' : ''}`}><span>{label}</span>{children}{hint && <small>{hint}</small>}</label> }
export function Empty({ title, text, action }) { return <div className="empty"><span className="empty-mark">◫</span><h3>{title}</h3><p>{text}</p>{action}</div> }
export function DeleteButton({ onClick, label = 'Delete' }) { return <button className="icon-btn danger" onClick={onClick} title={label} aria-label={label}><Icon name="trash" size={17} /></button> }
export function Segmented({ name, options, value, onChange }) { return <div className="segmented">{options.map((o) => { const optionValue = o.toLowerCase().replace('-', ''); return <label key={o}><input type="radio" name={name} checked={value === optionValue} onChange={() => onChange(optionValue)} /><span>{o}</span></label> })}</div> }
