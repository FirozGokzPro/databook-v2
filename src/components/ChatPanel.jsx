import { useState, useRef, useEffect } from 'react'
import './ChatPanel.css'

const SAMPLE_MESSAGES = [
  {
    id: 1, role: 'assistant',
    text: 'Hello! I\'ve analyzed your sources. Ask me anything about your data — I can summarize, compare, extract insights, or answer specific questions.',
    time: '10:32 AM',
  },
  {
    id: 2, role: 'user',
    text: 'What are the top insights from the sales data?',
    time: '10:33 AM',
  },
  {
    id: 3, role: 'assistant',
    text: 'Based on **sales_data_2024.csv**, here are the top insights:\n\n1. **Q3 2024** saw highest revenue — $2.4M, up 18% from Q2\n2. **Product category A** dominates at 43% of total sales\n3. **North region** outperforms others by 2.1x\n4. Average deal size increased from $1,200 to $1,580 YoY\n\nWould you like me to drill deeper into any of these?',
    time: '10:33 AM',
  },
]

const Avatar = ({ role }) => (
  <div className={`avatar avatar-${role}`}>
    {role === 'user' ? (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </div>
)

const MessageBubble = ({ msg }) => {
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />
    })
  }

  return (
    <div className={`message message-${msg.role}`}>
      <Avatar role={msg.role} />
      <div className="message-body">
        <div className="message-bubble">{renderText(msg.text)}</div>
        <span className="message-time">{msg.time}</span>
      </div>
    </div>
  )
}

export default function ChatPanel() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = () => {
    const text = input.trim()
    if (!text || loading) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text, time: now }])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'I\'m analyzing your sources to answer that. This is a demo — connect your LLM API to get real responses.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
      setLoading(false)
    }, 1200)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    const el = textareaRef.current
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <section className="chat-panel">
      <div className="panel-header chat-header">
        <h2 className="panel-title">Chat</h2>
        <div className="chat-meta">
          <span className="status-dot" />
          <span className="status-label">3 sources active</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {loading && (
          <div className="message message-assistant">
            <Avatar role="assistant" />
            <div className="message-body">
              <div className="message-bubble thinking">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask anything about your sources…"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            rows={1}
          />
          <button className={`send-btn ${input.trim() ? 'active' : ''}`} onClick={send} disabled={!input.trim() || loading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="input-hint">Enter to send · Shift+Enter for new line</p>
      </div>
    </section>
  )
}
