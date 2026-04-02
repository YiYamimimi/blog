import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
      <h3
        className="font-[var(--font-display)] font-semibold text-accent-warm mb-3"
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

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-tag-bg border border-accent-green rounded text-tag-text"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
              letterSpacing: '0.03em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        to={project.docPath}
        className="inline-block text-accent-teal no-underline border-b border-accent-teal transition-all duration-300 hover:text-accent-green hover:border-accent-green"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)',
        }}
      >
        查看文档 →
      </Link>
    </div>
  )
}
