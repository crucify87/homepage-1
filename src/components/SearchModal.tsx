import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { ARTICLES, PRODUCTS, SCENARIO_TOPOLOGIES } from '../data/catalog';
import { Article, RouteId } from '../types/commerce';
import { formatKRW } from '../utils/format';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onOpenProduct: (productId: string) => void;
  onOpenArticle: (article: Article) => void;
  onNavigate: (route: RouteId) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onClose,
  onOpenProduct,
  onOpenArticle,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [open]);

  const matchedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
    );
  }, [query]);

  const matchedArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ARTICLES.slice(0, 2);
    return ARTICLES.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    );
  }, [query]);

  const matchedScenarios = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SCENARIO_TOPOLOGIES.filter(
      (s) => s.title.toLowerCase().includes(q) || s.tabLabel.toLowerCase().includes(q)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#0043CD] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="모델명(8K, OLED, 사운드바), 솔루션, 아티클 검색..."
            className="flex-1 text-sm text-[#1B1B1B] placeholder:text-[#6E6E73] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="검색 닫기"
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[#6E6E73] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Products */}
          <div>
            <div className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2 px-2">
              하드웨어 제품 ({matchedProducts.length})
            </div>
            {matchedProducts.length === 0 ? (
              <div className="text-xs text-[#6E6E73] px-2 py-2">일치하는 제품이 없습니다.</div>
            ) : (
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onOpenProduct(p.id);
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#F3F4F6] flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#1B1B1B]">{p.name}</div>
                      <div className="text-xs text-[#6E6E73]">
                        {p.series} · {p.categoryLabel}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#0043CD] tabular-nums">
                      {formatKRW(p.price)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scenarios */}
          {matchedScenarios.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2 px-2">
                솔루션 아키텍처
              </div>
              {matchedScenarios.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    onNavigate('solutions');
                    onClose();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-[#F3F4F6] flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-[#1B1B1B]">{sc.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0043CD]" />
                </button>
              ))}
            </div>
          )}

          {/* Articles */}
          {matchedArticles.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2 px-2">
                아키텍처 저널
              </div>
              {matchedArticles.map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => {
                    onOpenArticle(art);
                    onClose();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-[#F3F4F6] flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-[#1B1B1B] truncate pr-3">
                    {art.title}
                  </span>
                  <span className="text-xs text-[#6E6E73] shrink-0">{art.readTime}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
