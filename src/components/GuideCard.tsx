import Image from 'next/image';

export interface GuideData {
  id: number;
  title: string;
  image: string;
  summary: string;
}

interface GuideCardProps {
  guide: GuideData;
}

export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden hover:border-gray-600 transition-colors bg-white/5">
      <div className="relative aspect-[15/7] overflow-hidden">
        <Image src={guide.image} alt={guide.title} fill className="object-cover " />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-white text-[12px] sm:text-[14px] leading-[16px] sm:leading-[18px] line-clamp-1">
          {guide.title}
        </h3>
        <p className="mt-1 text-[10px] sm:text-[12px] text-white/70 leading-[14px] sm:leading-[16px] line-clamp-2">
          {guide.summary}
        </p>
      </div>
    </div>
  );
}


