interface CardContentProps {
  title: string
  titleColor: string
  descriptions: string[]
  linkText: string
  linkColor: string
  style?: React.CSSProperties
  titleSize?: string
  descSize?: string
  linkSize?: string
}

export default function CardContent({ title, titleColor, descriptions, linkText, linkColor, style, titleSize, descSize, linkSize }: CardContentProps) {
  return (
    <div style={style} className="h-full flex flex-col items-start justify-between">
      <h3
        className={`font-[var(--font-display)] font-semibold ${titleColor} mb-12`}
        style={{ fontSize: titleSize || 'clamp(1.2rem, 2.5vw, 1.75rem)' }}
      >
        {title}
      </h3>
      <div>
        {descriptions.map((desc, i) => (
          <p
            key={i}
            className="text-text-secondary leading-relaxed mb-3"
            style={{ fontSize: descSize || 'clamp(0.75rem, 1.1vw, 0.95rem)' }}
          >
            {desc}
          </p>
        ))}
      </div>
      <div className="mb-10" />
      <button
        className={`${linkColor} hover:text-accent-green transition-colors cursor-pointer`}
        style={{ fontFamily: 'var(--font-body)', fontSize: linkSize || 'clamp(0.7rem, 0.9vw, 0.85rem)' }}
      >
        {linkText}
      </button>
    </div>
  )
}
