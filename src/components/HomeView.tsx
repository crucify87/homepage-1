import React, { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Check, ChevronRight } from 'lucide-react';
import { ARTICLES, PRODUCTS } from '../data/catalog';
import { Article, Product, RouteId } from '../types/commerce';
import { formatKRW } from '../utils/format';
import { HardwareVisual } from './HardwareVisual';

interface HomeViewProps {
  onNavigate: (route: RouteId) => void;
  onOpenProduct: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onOpenArticle: (article: Article) => void;
  onSelectCatalogCategory: (category: string) => void;
}

type HomeFilterTab = 'all' | 'display' | 'audio' | 'hub';

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  onOpenArticle,
  onSelectCatalogCategory,
}) => {
  const [activeTab, setActiveTab] = useState<HomeFilterTab>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  const flagship = PRODUCTS[0];
  const campaignItems = PRODUCTS.slice(0, 4);

  const featuredProducts = useMemo(() => {
    if (activeTab === 'all') return PRODUCTS.slice(0, 4);
    if (activeTab === 'display') {
      return PRODUCTS.filter(
        (p) => p.category === 'display-8k' || p.category === 'display-oled' || p.category === 'b2b'
      ).slice(0, 4);
    }
    if (activeTab === 'audio') {
      return PRODUCTS.filter((p) => p.category === 'audio');
    }
    return PRODUCTS.filter((p) => p.category === 'hub');
  }, [activeTab]);

  const handleAdd = (product: Product) => {
    onQuickAdd(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Storefront Hero Showcase */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Copy & CTA */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <div className="text-xs font-semibold tracking-wider text-[#0043CD] uppercase">
              2025 FLAGSHIP COLLECTION · NQ8 AI GEN3
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#1B1B1B] tracking-tight leading-[1.15]">
              공간의 빛을 읽는
              <br />
              차세대 8K 아키텍처.
            </h1>

            <p className="text-base sm:text-lg text-[#6E6E73] leading-relaxed max-w-xl">
              512개 온디바이스 신경망이 조도와 음향을 실시간으로 조율하는 네오 크로노 X9. 무반사 글래스와 13.3mm 티타늄 프레임으로 공간의 밀도를 완성합니다.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onOpenProduct(flagship.id)}
                className="h-12 px-7 rounded-full bg-[#1B1B1B] text-white text-sm font-semibold hover:bg-[#0043CD] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>플래그십 구성 및 구매</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="h-12 px-7 rounded-full bg-white border border-gray-300 text-[#1B1B1B] text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                전체 라인업 보기
              </button>
            </div>

            {/* 3 Spec Pillars */}
            <div className="grid grid-cols-3 gap-6 pt-6 mt-2 border-t border-gray-200 w-full max-w-lg">
              <div>
                <div className="text-base font-bold text-[#1B1B1B] tabular-nums">48 TOPS</div>
                <div className="text-xs text-[#6E6E73] mt-0.5">온디바이스 NPU</div>
              </div>
              <div>
                <div className="text-base font-bold text-[#1B1B1B] tabular-nums">13.3 mm</div>
                <div className="text-xs text-[#6E6E73] mt-0.5">티타늄 에어 슬림</div>
              </div>
              <div>
                <div className="text-base font-bold text-[#1B1B1B] tabular-nums">EAL6+</div>
                <div className="text-xs text-[#6E6E73] mt-0.5">하드웨어 보안 볼트</div>
              </div>
            </div>
          </div>

          {/* Right 4:3 Visual Frame */}
          <div className="lg:col-span-6">
            <div
              onClick={() => onOpenProduct(flagship.id)}
              className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-[#F4F5F7] aspect-[4/3] cursor-pointer"
            >
              <HardwareVisual
                type="display"
                finishHex="#262629"
                className="w-full h-full group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 border border-gray-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#6E6E73]">
                    {flagship.series} · {flagship.specs.screenSize}
                  </div>
                  <div className="text-sm font-bold text-[#1B1B1B]">{flagship.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#9A2A00] font-semibold tabular-nums">
                    {flagship.discountPercent}% 혜택가
                  </div>
                  <div className="text-sm font-bold text-[#1B1B1B] tabular-nums">
                    {formatKRW(flagship.price)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Special Season Campaign Showcase (#031C38) */}
      <section className="w-full bg-[#031C38] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/15">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold tracking-wider text-blue-300">
                2025 SPRING ARCHITECTURAL CAMPAIGN · 2025.02.01 — 03.31
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                디스플레이와 공간 오디오의 완벽한 동기화, 시즌 결합 혜택
              </h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('solutions')}
                className="h-11 px-6 rounded-full bg-white text-[#1B1B1B] text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                25% 패키지 구성하기
              </button>
              <button
                type="button"
                onClick={() => onNavigate('support')}
                className="h-11 px-5 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
              >
                기획전 상세 안내
              </button>
            </div>
          </div>

          {/* 3 Campaign Benefit Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-semibold text-blue-300 mb-1.5">01. 결합 패키지</div>
              <h3 className="text-base font-bold text-white mb-1.5">동시 구매 시 최대 25% 즉시 할인</h3>
              <p className="text-xs text-white/75 leading-relaxed">
                85인치 Neo QLED, Q-시리즈 사운드바, 스마트 싱스 허브 v4 패키지 구성 시 약 99만원의 결합 할인 혜택을 제공합니다.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-semibold text-blue-300 mb-1.5">02. 금융 & 적립</div>
              <h3 className="text-base font-bold text-white mb-1.5">최대 24개월 무이자 · 2% 포인트</h3>
              <p className="text-xs text-white/75 leading-relaxed">
                주요 제휴 카드 최대 24개월 무이자 할부 및 VIP 멤버십 구매 시 최대 45,084P 리워드 적립을 지원합니다.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-semibold text-blue-300 mb-1.5">03. 프리미엄 설치</div>
              <h3 className="text-base font-bold text-white mb-1.5">전문 기사 무료 설치 & 폐가전 수거</h3>
              <p className="text-xs text-white/75 leading-relaxed">
                희망일 지정 배송부터 레이저 수평 벽걸이 시공, 기존 노후 가전 1:1 친환경 무료 수거까지 원스톱으로 진행됩니다.
              </p>
            </div>
          </div>

          {/* 4 Campaign Product Shortcuts */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {campaignItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 text-[#1B1B1B] flex flex-col gap-3 hover:-translate-y-0.5 transition-transform"
              >
                <HardwareVisual
                  type={item.visualType}
                  finishHex={item.finishes[0]?.swatchHex}
                  className="w-full aspect-square rounded-lg border border-gray-100"
                />
                <div>
                  <div className="text-xs text-[#6E6E73]">{item.categoryLabel}</div>
                  <div className="text-sm font-bold text-[#1B1B1B] truncate mt-0.5">
                    {item.shortName}
                  </div>
                  <div className="text-sm font-bold text-[#0043CD] tabular-nums mt-1">
                    {formatKRW(item.price)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenProduct(item.id)}
                  className="mt-auto py-2 px-3 rounded-lg bg-[#F3F4F6] text-[#1B1B1B] text-xs font-semibold hover:bg-[#1B1B1B] hover:text-white transition-colors cursor-pointer"
                >
                  상세 구성 보기
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Product Collection Grid */}
      <section className="w-full py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider mb-1">
                FEATURED HARDWARE LINEUP
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] tracking-tight">
                카테고리별 주요 하드웨어 컬렉션
              </h2>
            </div>

            {/* Interactive Segmented Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#F3F4F6] rounded-xl overflow-x-auto">
              {(
                [
                  { id: 'all', label: '전체' },
                  { id: 'display', label: '디스플레이' },
                  { id: 'audio', label: '공간 오디오' },
                  { id: 'hub', label: '스마트 허브' },
                ] as { id: HomeFilterTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-[#1B1B1B] shadow-xs'
                      : 'text-[#6E6E73] hover:text-[#1B1B1B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const isSaved = wishlistIds.includes(product.id);
              const isJustAdded = addedId === product.id;
              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-3">
                      <span className="font-medium text-[#0043CD]">{product.series}</span>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(product.id)}
                        aria-label={`${product.shortName} 관심 상품 저장`}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isSaved ? 'text-[#0043CD]' : 'text-[#6E6E73] hover:text-[#1B1B1B]'
                        }`}
                      >
                        <Bookmark
                          className="w-4 h-4"
                          fill={isSaved ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>

                    <div
                      onClick={() => onOpenProduct(product.id)}
                      className="cursor-pointer rounded-xl overflow-hidden border border-gray-200/70 mb-4"
                    >
                      <HardwareVisual
                        type={product.visualType}
                        finishHex={product.finishes[0]?.swatchHex}
                        className="w-full aspect-square"
                      />
                    </div>

                    <div className="text-xs text-[#6E6E73] mb-1">
                      {product.categoryLabel} · {product.quickMetricValue}
                    </div>
                    <h3
                      onClick={() => onOpenProduct(product.id)}
                      className="text-base font-bold text-[#1B1B1B] hover:text-[#0043CD] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.shortName}
                    </h3>
                    <p className="text-xs text-[#6E6E73] mt-1 line-clamp-2 leading-relaxed">
                      {product.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-[#9A2A00] tabular-nums">
                        {product.discountPercent}% OFF
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-[#6E6E73] line-through mr-1.5 tabular-nums">
                          {formatKRW(product.originalPrice)}
                        </span>
                        <span className="text-base font-bold text-[#1B1B1B] tabular-nums">
                          {formatKRW(product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenProduct(product.id)}
                        className="py-2 px-3 rounded-lg bg-[#1B1B1B] text-white text-xs font-semibold hover:bg-[#0043CD] transition-colors cursor-pointer"
                      >
                        상세보기
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          isJustAdded
                            ? 'border-[#0043CD] bg-[#DCE6FF] text-[#0043CD]'
                            : 'border-gray-300 bg-white text-[#1B1B1B] hover:bg-gray-50'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>담김</span>
                          </>
                        ) : (
                          <span>장바구니</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                onSelectCatalogCategory('all');
                onNavigate('catalog');
              }}
              className="px-6 py-2.5 rounded-full border border-gray-300 bg-white text-sm font-semibold text-[#1B1B1B] hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>전체 {PRODUCTS.length}종 제품 필터링 및 비교하기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Editorial Stories & Engineering Journal */}
      <section className="w-full py-16 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider mb-1">
                ENGINEERING JOURNAL & INSIGHTS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] tracking-tight">
                브랜드 스토리 & 아키텍처 매거진
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('solutions')}
              className="text-sm font-semibold text-[#0043CD] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>솔루션 토폴로지 살펴보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                onClick={() => onOpenArticle(article)}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-all cursor-pointer"
              >
                <HardwareVisual
                  type={article.visualType}
                  angle={article.visualType === 'display' ? 'exploded' : 'front'}
                  className="w-full h-44 border-b border-gray-100"
                />
                <div className="p-5 flex flex-col flex-1 gap-2">
                  <div className="text-xs text-[#6E6E73]">
                    <span>{article.tag}</span>
                    <span className="mx-1.5">·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1B1B1B] group-hover:text-[#0043CD] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#6E6E73] line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                  <div className="mt-auto pt-3 text-xs font-semibold text-[#0043CD] flex items-center gap-1">
                    <span>아티클 읽기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
