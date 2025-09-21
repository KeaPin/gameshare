import Image from 'next/image';
import Link from 'next/link';

export interface GuideData {
  id: number;
  title: string;
  image: string;
  summary: string;
  author?: string;
  publishDate?: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  views?: number;
  content?: string;
}

interface GuideCardProps {
  guide: GuideData;
}

export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link href={`/article/${guide.id}`} className="block">
      <div className="rounded-xl sm:rounded-2xl overflow-hidden hover:border-gray-600 hover:bg-white/10 transition-all duration-300 bg-white/5 cursor-pointer group">
        <div className="relative aspect-[15/7] overflow-hidden">
          <Image 
            src={guide.image} 
            alt={guide.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          {guide.category && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {guide.category}
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-white text-[12px] sm:text-[14px] leading-[16px] sm:leading-[18px] line-clamp-1 group-hover:text-blue-300 transition-colors">
            {guide.title}
          </h3>
          <p className="mt-1 text-[10px] sm:text-[12px] text-white/70 leading-[14px] sm:leading-[16px] line-clamp-2">
            {guide.summary}
          </p>
          
          <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-white/50">
            <div className="flex items-center gap-2">
              {guide.author && <span>{guide.author}</span>}
              {guide.publishDate && <span>•</span>}
              {guide.publishDate && <span>{guide.publishDate}</span>}
            </div>
            <div className="flex items-center gap-2">
              {guide.readTime && <span>{guide.readTime}</span>}
              {guide.views && (
                <>
                  <span>•</span>
                  <span>{guide.views.toLocaleString()} 阅读</span>
                </>
              )}
            </div>
          </div>
          
          {guide.tags && guide.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {guide.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-1.5 py-0.5 text-[8px] sm:text-[9px] text-blue-300 bg-blue-400/20 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}


