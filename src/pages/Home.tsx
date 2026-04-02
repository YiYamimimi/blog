import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ProjectCard from '../components/ProjectCard'
import CardContent from '../components/CardContent'
import { projects } from '../data/projects'

export default function Home() {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filteredProjects = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects

  const navigate = useNavigate()

  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag))
  }
  const goTOMore = () => {
    navigate('/blog')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onTagClick={handleTagClick} />

      <div className="max-w-[88vw] mx-auto px-6 -mt-35">
        <div className="grid  gap-15 mb-16" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', }}>

          <div className="bg-white/95 border border-gray-100 rounded-lg p-6 px-8 shadow-2xl relative ">

            {/* 博客标签 */}
            <div className="absolute text-2xl -top-17 text-gray-500 left-0 z-10 cursor-pointer" onClick={goTOMore}>
              ← 更多博客
            </div>
            <div className='cursor-pointer' >
              <CardContent
                title="DeepView"
                titleColor="text-cyan-800"
                descriptions={[
                  '为了帮助我们更好地从长视频中学习，高效地吸收长视频的信息。',
                  '出发点：解决在看长视频中的痛点。不是直接将视频丢给 AI 做出长篇大文，而是保留看视频的方式，在观看过程中辅助我们从视频中学到东西。',
                  '视频包含丰富的视觉信息，这是文字总结无法带出来的。',
                ]}
                linkText="阅读全文 →"
                linkColor="text-blue-800"
              />
            </div>
          </div>

          <div className="card-glow bg-white/90 border border-gray-100 rounded-lg p-6 px-8 shadow-2xl relative ">

            {/* 博客标签 */}
            <div className="absolute text-4xl -top-20 text-gray-500 right-10 z-10 cursor-pointer">
              作品集 →
            </div>
            <div className='cursor-pointer'>
              <CardContent
                title="多模态AI辅助学习平台"
                titleColor="text-amber-800"
                descriptions={[
                  '为了帮助我们更好地从长视频中学习，高效地吸收长视频的信息。',
                  '出发点：解决在看长视频中的痛点。不是直接将视频丢给 AI 做出长篇大文，而是保留看视频的方式，在观看过程中辅助我们从视频中学到东西。',
                  '视频包含丰富的视觉信息，这是文字总结无法带出来的。',
                ]}
                linkText="查看项目 →"
                linkColor="text-amber-800"
              />

              {/* 鼠标箭头 + 持续波纹 */}
              <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none" className="drop-shadow-md animate-arrow-bounce">
                  <path d="M2 2L2 28L8 22L14 34L18 32L12 20L20 20L2 2Z" fill="white" stroke="#555" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent-green/10 animate-ripple-loop" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent-green/5 animate-ripple-loop" style={{ animationDelay: '0.6s' }} />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent-green animate-ripple-loop" style={{ animationDelay: '1.2s' }} />
              </div>
            </div>
          </div>
        </div>

      </div>


    </div>
  )
}
