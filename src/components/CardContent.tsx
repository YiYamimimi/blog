interface CardContentProps {
  onCardClick?: () => void;
  isVisible?: boolean;
}

export default function CardContent({ onCardClick, isVisible = true }: CardContentProps) {
  return (
    <div
      className={`card-glow bg-white/90 border border-gray-100 rounded-lg p-3 lg:p-6 lg:px-8 shadow-2xl relative transition-all duration-700 ease-out flex flex-col ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ transitionDelay: "450ms" }}
    >
      <div
        className="absolute text-xl xl:text-4xl -top-12 xl:-top-20 text-gray-500 left-4 xl:left-10 z-10 hover:font-bold cursor-pointer flex items-center gap-2 opacity-0 xl:opacity-100"
        onClick={() =>
          window.open(
            "https://github.com/YiYamimimi/learning-assistant",
            "_blank",
          )
        }
      >
        ← 作品
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </div>
      <div
        className={`flex-1 flex flex-col justify-center ${onCardClick ? 'cursor-pointer' : ''}`}
        onClick={onCardClick}
      >
        <h3
          className="font-[var(--font-display)] font-semibold text-amber-800 mb-3 lg:mb-4"
          style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}
        >
          项目：AI辅助学习助手
        </h3>
        <div className="space-y-2">
          <p
            className="text-text-secondary leading-relaxed line-clamp-1 lg:py-3 lg:line-clamp-2"
            style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.3rem)" }}
          >
            一款 AI 辅助学习视频的工具，保留视频观看过程，提供实时问答、核心主题提取、语音字幕等辅助功能。
          </p>
          <p
            className=" leading-relaxed line-clamp-2 lg:text-gray-500 text-gray-400"
            style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.4rem)" }}
          >
            核心优势：解决在看长视频中的痛点。不是直接将视频丢给 AI 做出长篇大文，而是保留看视频的方式，在观看过程中辅助我们从视频中学到东西。
          </p>
          <p
            className="text-text-secondary leading-relaxed line-clamp-1 lg:py-3 "
            style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.3rem)" }}
          >
            技术实现：Next+ Tailwind CSS+ Turborepo+ Supabase+ openai API
          </p>
        </div>
        <button
          className="text-amber-800 hover:text-accent-green transition-colors cursor-pointer mt-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
          }}
        >
          查看项目 →
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <svg
          width="32"
          height="48"
          viewBox="0 0 24 36"
          fill="none"
          className="drop-shadow-lg animate-arrow-bounce-strong"
        >
          <path
            d="M2 2L2 28L8 22L14 34L18 32L12 20L20 20L2 2Z"
            fill="white"
            stroke="#8ab46c"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-accent-green/15 animate-ripple-loop-strong" />
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-accent-green/10 animate-ripple-loop-strong"
          style={{ animationDelay: "0.5s" }}
        />
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-accent-green/5 animate-ripple-loop-strong"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
