import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import CardContent from '../components/CardContent'
import BlogListCard from '../components/BlogListCard'
import { projects } from '../data/projects'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const navigate = useNavigate()
  const goTOMore = () => {
    navigate('/blogList')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-[88vw] mx-auto px-6 -mt-35">
        <div className="grid gap-20 mb-20" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'center' }}>

          <div className={`bg-white/95 border border-gray-100 rounded-lg p-6 px-8 shadow-2xl relative transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms', height: '90%' }}>

            {/* 博客标签 */}
            <div className="absolute text-2xl -top-17 text-gray-500 left-0 z-10 hover:font-bold cursor-pointer" onClick={goTOMore}>
              ← 更多博客
            </div>
            <BlogListCard
              title="技术文章"
              blogs={projects.slice(0, 2).map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                tags: p.tags,
              }))}
            />
          </div>

          <div className={`card-glow bg-white/90 border border-gray-100 rounded-lg p-6 px-8 shadow-2xl relative transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '450ms', height: '100%' }}>

            {/* 博客标签 */}
            <div className="absolute text-4xl -top-20 text-gray-500 right-10 z-10 hover:font-bold cursor-pointer flex items-center gap-2" onClick={() => window.open('https://github.com/YiYamimimi/learning-assistant', '_blank')}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              作品 →
            </div>
            <div className='cursor-pointer h-full' onClick={() => window.open('http://47.107.143.203:3000/', '_blank')}>
              <CardContent
                title="多模态AI辅助学习平台"
                titleColor="text-amber-800"
                titleSize="2.5rem"
                descSize="1.2rem"
                linkSize="1.2rem"
                descriptions={[
                  '一款 AI 辅助学习视频的工具，保留视频观看过程，提供实时问答、核心主题提取、语音字幕等辅助功能。',
                  '核心优势：解决在看长视频中的痛点。不是直接将视频丢给 AI 做出长篇大文，而是保留看视频的方式，在观看过程中辅助我们从视频中学到东西。',
                  '技术实现：Next+ Tailwind CSS+ Turborepo+ Supabase+ openai API',
                ]}
                linkText="查看项目 →"
                linkColor="text-amber-800"
                style={{ height: '100%' }}
              />

              {/* 鼠标箭头 + 持续波纹 */}
              <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
                <svg width="32" height="48" viewBox="0 0 24 36" fill="none" className="drop-shadow-lg animate-arrow-bounce-strong">
                  <path d="M2 2L2 28L8 22L14 34L18 32L12 20L20 20L2 2Z" fill="white" stroke="#8ab46c" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-accent-green/15 animate-ripple-loop-strong" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-accent-green/10 animate-ripple-loop-strong" style={{ animationDelay: '0.5s' }} />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-accent-green/5 animate-ripple-loop-strong" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>

      </div>


    </div>
  )
}
