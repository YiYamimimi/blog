import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects, techTags } from '../data/projects'

export default function BlogList() {
  const navigate = useNavigate()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredProjects = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[min(90vw,900px)] mx-auto px-6 py-16">
        <div
          className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <button
            onClick={() => navigate('/')}
            className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-8 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.8rem, 1vw, 0.95rem)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回首页
          </button>

          <h1
            className="font-[var(--font-display)] font-semibold text-text-primary mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.2' }}
          >
            博客文章
          </h1>

          <div className="accent-line mb-8" style={{ margin: 0, marginBottom: '2rem' }} />

          <p
            className="text-text-secondary leading-relaxed mb-10"
            style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)' }}
          >
            记录开发中的思考与实践，分享技术成长路上的点滴收获。
          </p>
        </div>

        <div
          className={`flex flex-wrap gap-2 mb-10 transition-all duration-700 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {techTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
              className={`px-4 py-1.5 rounded border cursor-pointer transition-all duration-300 ${activeTag === tag
                ? 'bg-accent-green text-white border-accent-green'
                : 'bg-tag-bg border-accent-green text-tag-text hover:bg-accent-green hover:text-white'
                }`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.7rem, 1vw, 0.875rem)',
                letterSpacing: '0.05em',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`bg-white/90 border border-gray-100 rounded-lg p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 cursor-pointer group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
              onClick={() => navigate(project.docPath, { state: { title: project.title } })}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-tag-bg border border-accent-green/50 rounded text-tag-text"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.65rem, 0.85vw, 0.75rem)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3
                className="font-[var(--font-display)] font-semibold text-text-primary mb-3 group-hover:text-accent-green transition-colors"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', lineHeight: '1.4' }}
              >
                {project.title}
              </h3>

              <p
                className="text-text-secondary leading-relaxed mb-4"
                style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)' }}
              >
                {project.description}
              </p>

              <span
                className="inline-flex items-center gap-1 text-accent-teal group-hover:text-accent-green transition-colors"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)' }}
              >
                阅读全文
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-text-secondary">
            暂无相关文章
          </div>
        )}
      </div>

      <footer className="border-t border-black/5 py-8 text-center">
        <p
          className="text-text-secondary"
          style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)' }}
        >
          © 2026 yiyamimimi · 开发工程师
        </p>
      </footer>
    </div>
  )
}
