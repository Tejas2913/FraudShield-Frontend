export default function HighlightedText({ text = '', phrases = [] }) {
    if (!text || !phrases.length) {
        return <span style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{text}</span>
    }

    const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
    const parts = text.split(regex)

    return (
        <span style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
            {parts.map((part, i) => {
                if (regex.test(part)) {
                    return (
                        <mark
                            key={i}
                            style={{
                                background: 'rgba(239,68,68,0.25)',
                                color: '#fca5a5',
                                borderBottom: '2px solid #ef4444',
                                borderRadius: '3px',
                                padding: '1px 3px',
                                fontWeight: 600,
                            }}
                        >
                            {part}
                        </mark>
                    )
                }
                return <span key={i}>{part}</span>
            })}
        </span>
    )
}
