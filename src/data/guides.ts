import { GuideData } from '@/components/GuideCard';

const baseSummary = '在经历了一场毁灭性的战争过后，高级生物决定不再进行无意义的厮杀，开始探索新的文明秩序与生存之道。';

// 简单生成 88 条攻略数据，图片复用默认图
export const guides: GuideData[] = Array.from({ length: 8 }).map((_, index) => {
  const id = index + 1;
  return {
    id,
    title: `新世勇者传·实用攻略 ${id}`,
    image: '/default.webp',
    summary: baseSummary,
  };
});


