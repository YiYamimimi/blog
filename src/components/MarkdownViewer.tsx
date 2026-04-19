import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface TocItem {
  id: string
  text: string
  level: number
}

interface MarkdownViewerProps {
  title?: string
}

function CodeBlock({ inline, className, children, ...props }: {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  const codeString = String(children).replace(/\n$/, '')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="relative group">
      {language && (
        <span className="absolute top-3 left-4 text-xs text-gray-400 font-mono uppercase">
          {language}
        </span>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? '已复制' : '复制'}
      </button>
      <code className={className} {...props}>
        {children}
      </code>
    </div>
  )
}

function extractToc(content: string): TocItem[] {
  const headings: TocItem[] = []
  const regex = /^(#{1,3})\s+(.+)$/gm
  let match

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    headings.push({ id, text, level })
  }

  return headings
}

export default function MarkdownViewer({ title: propTitle }: MarkdownViewerProps) {
  const { '*': docPath } = useParams()
  const location = useLocation()
  const stateTitle = location.state?.title
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string>('')

  const toc = useMemo(() => {
    if (!content) return []
    return extractToc(content)
  }, [content])

  useEffect(() => {
    if (!docPath) {
      setError('未指定文档路径')
      setLoading(false)
      return
    }

    const url = `/blog/docs/${docPath}`
    console.log('Fetching:', url)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('文档加载失败')
        return res.text()
      })
      .then((text) => {
        const cleanContent = text.replace(/^---\n[\s\S]*?\n---\n/, '')
        setContent(cleanContent)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [docPath])

  useEffect(() => {
    const handleScroll = () => {
      const headings = toc.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      }))

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading.element) {
          const rect = heading.element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveId(heading.id)
            return
          }
        }
      }
      if (headings.length > 0) {
        setActiveId(headings[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

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
          to="/blogList"
          className="text-accent-teal hover:text-accent-green transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          返回首页
        </Link>
      </div>
    )
  }

  const fallbackTitle = docPath?.split('/').pop()?.replace('.md', '').replace(/-/g, ' ') || '文档'
  const title = propTitle || stateTitle || fallbackTitle

  return (
    <div className="min-h-screen bg-bg-primary relative">
      <div className="abstract-shape shape-1" />
      <div className="abstract-shape shape-2" />
      <div className="vertical-line" />

      {toc.length > 0 && (
        <nav className="fixed right-8 top-32 w-48 hidden xl:block">
          <div className="text-xs text-text-secondary mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
            目录
          </div>
          <ul className="space-y-1.5 border-l border-gray-200">
            {toc.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={`text-left text-sm py-1 pl-3 transition-colors w-full truncate ${activeId === item.id
                      ? 'text-accent-green border-l-2 border-accent-green -ml-px pl-2.5'
                      : 'text-text-secondary hover:text-accent-warm'
                    }`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    paddingLeft: `${(item.level - 1) * 12 + 12}px`
                  }}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="max-w-[min(90vw,800px)] mx-auto px-6 py-10 relative">
        <Link
          to="/blogList"
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

        <div className="accent-line mb-10" style={{ margin: '0 0 2.5rem 0' }} />

        <article className="markdown-body">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code: CodeBlock,
              h1: ({ children }) => {
                const text = String(children)
                const id = text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '').replace(/\s+/g, '-')
                return <h1 id={id}>{children}</h1>
              },
              h2: ({ children }) => {
                const text = String(children)
                const id = text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '').replace(/\s+/g, '-')
                return <h2 id={id}>{children}</h2>
              },
              h3: ({ children }) => {
                const text = String(children)
                const id = text.toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '').replace(/\s+/g, '-')
                return <h3 id={id}>{children}</h3>
              },
            }}
          >
            {content}
          </Markdown>
        </article>
      </div>
    </div>
  )
}
