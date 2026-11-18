import React from 'react';
import { X } from 'lucide-react';
import { Article } from '../types/commerce';
import { HardwareVisual } from './HardwareVisual';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onExploreProducts: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onExploreProducts,
}) => {
  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="text-xs font-medium text-[#6E6E73]">
            <span>{article.tag}</span>
            <span className="mx-2">·</span>
            <span>{article.date}</span>
            <span className="mx-2">·</span>
            <span>{article.readTime}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="아티클 닫기"
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#434656] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#1B1B1B] leading-snug">
            {article.title}
          </h2>

          <HardwareVisual
            type={article.visualType}
            angle={article.visualType === 'display' ? 'exploded' : 'front'}
            className="w-full h-56 rounded-xl border border-gray-200"
          />

          <p className="text-base font-medium text-[#434656] leading-relaxed">
            {article.summary}
          </p>

          <div className="h-px bg-gray-100" />

          <div className="space-y-4 text-[15px] text-[#434656] leading-relaxed">
            {article.body.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#434656] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreProducts();
              }}
              className="px-5 py-2.5 rounded-lg bg-[#0043CD] text-white text-sm font-semibold hover:bg-[#1259FF] transition-colors cursor-pointer"
            >
              관련 제품 라인업 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
