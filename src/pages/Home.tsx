import { useState, useEffect } from "react";
import Header from "../components/Header";
import BlogListCard from "../components/BlogListCard";
import { projects } from "../data/projects";
import CardContent from '../components/CardContent';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-[88vw] mx-auto xl:px-6 p-2 -mt-35">
        <div className="grid gap-8 xl:gap-20 mb-12 xl:mb-20 grid-cols-1 xl:grid-cols-[1.2fr_1fr] xl:items-center">
          <CardContent
            onCardClick={() => window.open("http://106.12.6.136", "_blank")}
          />

          <BlogListCard
            title="技术文章"
            blogs={projects.slice(0, 2).map((p) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              tags: p.tags,
            }))}
            isVisible={isVisible}
          />
        </div>
      </div>
    </div>
  );
}
