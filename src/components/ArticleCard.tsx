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

export default function ArticleCard({ guide }: GuideCardProps) {
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
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-white text-[12px] sm:text-[14px] leading-[16px] sm:leading-[18px] line-clamp-1 group-hover:text-blue-300 transition-colors">
            {guide.title}
          </h3>
          <p className="mt-1 text-[10px] sm:text-[12px] text-white/70 leading-[14px] sm:leading-[16px] line-clamp-1">
            {guide.summary}
          </p>
          
          <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-white/50">
            <div className="flex items-center gap-2">
              {guide.publishDate && <span>{guide.publishDate}</span>}
            </div>
            <div className="flex items-center gap-2">
              {guide.views && (
                  <span>{guide.views.toLocaleString()} 阅读</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


