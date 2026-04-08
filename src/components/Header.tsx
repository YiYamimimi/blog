import { useEffect, useState } from 'react'

interface HeaderProps {
  onTagClick?: (tag: string) => void
}

export default function Header({ onTagClick }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative overflow-hidden flex flex-col items-center h-[66.666vh]  py-15 px-6">
      <div className="abstract-shape shape-1" />
      <div className="abstract-shape shape-2" />
      <div className="abstract-shape shape-3" />

      <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1
          className={`relative text-center font-[var(--font-display)] font-normal leading-[1.1] text-text-primary mb-6 transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.02em' }}
        >
          yiyamimimi
        </h1>

        <div className={`accent-line mb-6 transition-all duration-700 delay-200 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

        <div className="flex justify-center gap-3 mb-10 mt-2">
          <p
            className={`relative text-center text-gray-400 font-[var(--font-body)] transition-all duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', letterSpacing: '0.05em' }}
          >
            <svg className="inline-block w-5 text-text-secondary h-5 mb-0.5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" strokeWidth={1.5} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11v-2a4 4 0 00-3-3.87" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 17h-2" />
            </svg>
            前端开发工程师
          </p>
          <p
            className={`relative text-center text-gray-400 font-[var(--font-body)] transition-all duration-700 delay-350 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)', letterSpacing: '0.03em' }}
          >
            <svg className="inline-block w-5 h-5 mb-0.5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            2年经验
          </p>
        </div>
      </div>

      <div className={`relative flex flex-wrap justify-center gap-3 transition-all duration-700 delay-400 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {[
          { tag: 'Vue 3 生态', key: 'Vue' },
          { tag: 'React 技术栈', key: 'React' },
          { tag: 'TypeScript', key: 'TypeScript' },
          { tag: 'UniApp 跨端', key: 'UniApp' },
          { tag: 'Vite 构建', key: 'Vite' },
          { tag: 'Git 版本控制', key: 'Git' }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => onTagClick?.(item.key)}
            className="px-4 py-1.5 bg-tag-bg border border-accent-green rounded text-tag-text cursor-pointer transition-all duration-300 hover:bg-accent-green hover:text-white"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.7rem, 1vw, 0.875rem)',
              letterSpacing: '0.05em',
            }}
          >
            {item.tag}
          </button>
        ))}
      </div>
    </div>
  )
}
