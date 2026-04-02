import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownViewer() {
  const { '*': docPath } = useParams()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useState(() => {
    if (!docPath) {
      setError('未指定文档路径')
      setLoading(false)
      return
    }

    fetch(`/${docPath}`)
      .then((res) => {
        if (!res.ok) throw new Error('文档加载失败')
        return res.text()
      })
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-bg-primary">
        <div className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-body)' }}>
          加载中...
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-bg-primary">
        <div className="text-accent-warm text-lg" style={{ fontFamily: 'var(--font-body)' }}>
          {error || '文档未找到'}
        </div>
        <Link
          to="/blog"
          className="text-accent-teal hover:text-accent-green transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          返回首页
        </Link>
      </div>
    )
  }

  const title = docPath?.split('/').pop()?.replace('.md', '').replace(/-/g, ' ') || '文档'

  return (
    <div className="min-h-screen bg-bg-primary relative">
      <div className="abstract-shape shape-1" />
      <div className="abstract-shape shape-2" />
      <div className="vertical-line" />

      <div className="max-w-[min(90vw,800px)] mx-auto px-6 py-10 relative">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent-warm transition-colors mb-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)',
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>

        <h1
          className="font-[var(--font-display)] font-semibold text-text-primary mb-8 capitalize"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: '1.3' }}
        >
          {title}
        </h1>

        <div className="accent-line mb-10" style={{ margin: '0 0 2.5rem 0' }} />

        <article className="markdown-body">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </article>
      </div>
    </div>
  )
}
