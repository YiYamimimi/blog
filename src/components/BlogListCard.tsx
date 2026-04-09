import { useNavigate } from 'react-router-dom'

interface BlogItem {
  id: string
  title: string
  description: string
  tags: string[]
}

interface BlogListCardProps {
  title: string
  blogs: BlogItem[]
  isVisible?: boolean
}

export default function BlogListCard({ title, blogs, isVisible = false }: BlogListCardProps) {
  const navigate = useNavigate()
  const goTOMore = () => {
    navigate("/blogList")
  }

  return (
    <div
      className={`bg-white/95 border border-gray-100 rounded-lg p-4 lg:mt-0 lg:p-6 lg:px-8 shadow-2xl relative transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: "500ms", minHeight: "300px" }}
    >
      <div
        className="absolute text-xs xl:text-lg xl:text-2xl top-2 xl:-top-17 text-gray-500 xl:right-0 z-10 hover:font-bold cursor-pointer right-4 "
        onClick={goTOMore}
      >
        更多博客 →
      </div>
      <div className="h-full flex flex-col">
      <h3
        className="font-[var(--font-display)] font-semibold text-cyan-800 mb-4"
        style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)' }}
      >
        {title}
      </h3>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/95 to-transparent z-10 pointer-events-none" />

        <div className="h-full  py-2 space-y-3 scrollbar-hide" style={{ scrollbarGutter: 'stable' }}>
          {blogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => navigate(`/blogList`)}
              className="group p-3 rounded-lg border border-gray-100 hover:border-accent-green/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(ellipse at center, rgba(138, 180, 108, 0.15) 0%, rgba(138, 180, 108, 0.05) 50%, transparent 100%)' }} />
              <div className="relative z-10">
                <h4
                  className="font-medium text-gray-800 group-hover:text-accent-green transition-colors mb-1"
                  style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}
                >
                  {blog.title}
                </h4>
                <p
                  className="text-text-secondary line-clamp-2"
                  style={{ fontSize: 'clamp(0.7rem, 1vw, 0.85rem)' }}
                >
                  {blog.description}
                </p>
                <div className="flex gap-2 mt-2">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-accent-green/10 text-accent-green rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/95 to-transparent z-10 pointer-events-none" />
      </div>
      </div>
    </div>
  )
}
