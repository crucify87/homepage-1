import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Grid2x2,
  Grid3x3,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CATEGORY_FAQS, PRODUCTS } from '../data/catalog';
import { FinishId, Product, RouteId, SeriesLine } from '../types/commerce';
import { formatKRW } from '../utils/format';
import { HardwareVisual } from './HardwareVisual';

interface CatalogViewProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenProduct: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigate: (route: RouteId) => void;
}

type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

const SUBCATEGORIES = [
  { id: 'all', label: '전체보기' },
  { id: 'display-8k', label: 'Neo QLED 8K' },
  { id: 'display-oled', label: 'OLED & 4K' },
  { id: 'audio', label: '공간 오디오' },
  { id: 'hub', label: '스마트 홈 허브' },
  { id: 'b2b', label: 'B2B 사이니지' },
];

const SERIES_LIST: SeriesLine[] = [
  'Flagship Pro',
  'Standard Plus',
  'Essential Lite',
  'Commercial B2B',
];

const COLOR_FILTERS: { id: FinishId; label: string; hex: string }[] = [
  { id: 'graphite', label: '그라파이트 · 블랙', hex: '#262629' },
  { id: 'silver', label: '실버 · 세라믹', hex: '#CBD5E1' },
  { id: 'bronze', label: '브론즈 · 골드', hex: '#8C6239' },
  { id: 'navy', label: '딥 네이비', hex: '#1E3A8A' },
  { id: 'emerald', label: '포레스트 그린', hex: '#064E3B' },
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  onNavigate,
}) => {
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [selectedSeries, setSelectedSeries] = useState<SeriesLine[]>([]);
  const [requireAi, setRequireAi] = useState(false);
  const [requireEco, setRequireEco] = useState(false);
  const [requireMatter, setRequireMatter] = useState(false);
  const [requireFastDelivery, setRequireFastDelivery] = useState(false);
  const [requireFreeInstall, setRequireFreeInstall] = useState(false);
  const [selectedColor, setSelectedColor] = useState<FinishId | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [gridCols, setGridCols] = useState<2 | 3>(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedRoomTier, setSelectedRoomTier] = useState<'small' | 'family' | 'studio' | null>(null);

  const toggleSeries = (series: SeriesLine) => {
    setSelectedSeries((prev) =>
      prev.includes(series) ? prev.filter((s) => s !== series) : [...prev, series]
    );
  };

  const resetFilters = () => {
    onSelectCategory('all');
    setMaxPrice(3000000);
    setSelectedSeries([]);
    setRequireAi(false);
    setRequireEco(false);
    setRequireMatter(false);
    setRequireFastDelivery(false);
    setRequireFreeInstall(false);
    setSelectedColor(null);
    setSelectedRoomTier(null);
  };

  const handleRoomRecommend = (tier: 'small' | 'family' | 'studio') => {
    setSelectedRoomTier(tier);
    if (tier === 'small') {
      setSelectedSeries(['Essential Lite']);
    } else if (tier === 'family') {
      setSelectedSeries(['Standard Plus']);
    } else {
      setSelectedSeries(['Flagship Pro']);
    }
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (p.price > maxPrice) return false;
      if (selectedSeries.length > 0 && !selectedSeries.includes(p.series)) return false;
      if (requireAi && !p.isAiProcessor) return false;
      if (requireEco && !p.isEcoGrade1) return false;
      if (requireMatter && !p.isMatterReady) return false;
      if (requireFastDelivery && !p.isFastDelivery) return false;
      if (requireFreeInstall && !p.isFreeInstall) return false;
      if (selectedColor && !p.finishes.some((f) => f.id === selectedColor)) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }
    return list;
  }, [
    selectedCategory,
    maxPrice,
    selectedSeries,
    requireAi,
    requireEco,
    requireMatter,
    requireFastDelivery,
    requireFreeInstall,
    selectedColor,
    sortBy,
  ]);

  const activeFilterLabels = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (selectedCategory !== 'all') {
      const found = SUBCATEGORIES.find((c) => c.id === selectedCategory);
      chips.push({
        key: 'cat',
        label: found?.label || selectedCategory,
        clear: () => onSelectCategory('all'),
      });
    }
    if (maxPrice < 3000000) {
      chips.push({
        key: 'price',
        label: `${formatKRW(maxPrice)} 이하`,
        clear: () => setMaxPrice(3000000),
      });
    }
    selectedSeries.forEach((s) => {
      chips.push({
        key: `series-${s}`,
        label: s,
        clear: () => toggleSeries(s),
      });
    });
    if (requireAi) chips.push({ key: 'ai', label: 'AI 프로세서 탑재', clear: () => setRequireAi(false) });
    if (requireEco) chips.push({ key: 'eco', label: '에너지 1등급', clear: () => setRequireEco(false) });
    if (requireMatter) chips.push({ key: 'matter', label: 'Matter 스마트 연동', clear: () => setRequireMatter(false) });
    if (requireFastDelivery) chips.push({ key: 'fast', label: '내일 도착 보장', clear: () => setRequireFastDelivery(false) });
    if (requireFreeInstall) chips.push({ key: 'install', label: '무료 전문 설치', clear: () => setRequireFreeInstall(false) });
    if (selectedColor) {
      const c = COLOR_FILTERS.find((x) => x.id === selectedColor);
      chips.push({
        key: 'color',
        label: `마감: ${c?.label || selectedColor}`,
        clear: () => setSelectedColor(null),
      });
    }
    return chips;
  }, [
    selectedCategory,
    maxPrice,
    selectedSeries,
    requireAi,
    requireEco,
    requireMatter,
    requireFastDelivery,
    requireFreeInstall,
    selectedColor,
    onSelectCategory,
  ]);

  const handleAdd = (p: Product) => {
    onQuickAdd(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1300);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-[#1B1B1B]">
          <SlidersHorizontal className="w-4 h-4 text-[#0043CD]" />
          <span>상세 필터</span>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-medium text-[#6E6E73] hover:text-[#1B1B1B] flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </button>
      </div>

      {/* Price Filter */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1B1B1B]">최대 가격대</span>
          <span className="text-xs font-mono font-semibold text-[#0043CD] tabular-nums">
            {formatKRW(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={200000}
          max={3000000}
          step={100000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="최대 가격 필터"
          className="w-full accent-[#0043CD] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#6E6E73] tabular-nums">
          <span>₩200,000</span>
          <span>₩3,000,000</span>
        </div>
      </div>

      {/* Series Filter */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-2.5">
        <span className="text-sm font-semibold text-[#1B1B1B]">라인업 시리즈</span>
        {SERIES_LIST.map((series) => {
          const count = PRODUCTS.filter((p) => p.series === series).length;
          return (
            <label
              key={series}
              className="flex items-center gap-2.5 text-sm text-[#434656] hover:text-[#1B1B1B] cursor-pointer py-0.5"
            >
              <input
                type="checkbox"
                checked={selectedSeries.includes(series)}
                onChange={() => toggleSeries(series)}
                className="w-4 h-4 rounded accent-[#0043CD]"
              />
              <span className="flex-1">{series}</span>
              <span className="text-xs text-[#6E6E73] tabular-nums">{count}</span>
            </label>
          );
        })}
      </div>

      {/* Core Specs */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-2.5">
        <span className="text-sm font-semibold text-[#1B1B1B]">핵심 기능 및 인증</span>
        <label className="flex items-center gap-2.5 text-sm text-[#434656] cursor-pointer py-0.5">
          <input
            type="checkbox"
            checked={requireAi}
            onChange={(e) => setRequireAi(e.target.checked)}
            className="w-4 h-4 rounded accent-[#0043CD]"
          />
          <span className="flex-1">AI 지능형 프로세서</span>
        </label>
        <label className="flex items-center gap-2.5 text-sm text-[#434656] cursor-pointer py-0.5">
          <input
            type="checkbox"
            checked={requireEco}
            onChange={(e) => setRequireEco(e.target.checked)}
            className="w-4 h-4 rounded accent-[#0043CD]"
          />
          <span className="flex-1">에너지효율 1등급</span>
        </label>
        <label className="flex items-center gap-2.5 text-sm text-[#434656] cursor-pointer py-0.5">
          <input
            type="checkbox"
            checked={requireMatter}
            onChange={(e) => setRequireMatter(e.target.checked)}
            className="w-4 h-4 rounded accent-[#0043CD]"
          />
          <span className="flex-1">Matter 스마트 싱크</span>
        </label>
      </div>

      {/* Finish Swatches */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1B1B1B]">색상 · 마감재</span>
          {selectedColor && (
            <button
              type="button"
              onClick={() => setSelectedColor(null)}
              className="text-xs text-[#0043CD] hover:underline cursor-pointer"
            >
              해제
            </button>
          )}
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {COLOR_FILTERS.map((swatch) => {
            const active = selectedColor === swatch.id;
            return (
              <button
                key={swatch.id}
                type="button"
                title={swatch.label}
                aria-label={swatch.label}
                onClick={() => setSelectedColor(active ? null : swatch.id)}
                className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-transform cursor-pointer ${
                  active ? 'ring-2 ring-[#0043CD] ring-offset-2 scale-105' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: swatch.hex }}
              >
                {active && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      swatch.id === 'silver' ? 'text-[#1B1B1B]' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delivery Options */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-2.5">
        <span className="text-sm font-semibold text-[#1B1B1B]">배송 · 설치 혜택</span>
        <label className="flex items-center gap-2.5 text-sm text-[#434656] cursor-pointer py-0.5">
          <input
            type="checkbox"
            checked={requireFastDelivery}
            onChange={(e) => setRequireFastDelivery(e.target.checked)}
            className="w-4 h-4 rounded accent-[#0043CD]"
          />
          <span>내일 도착 보장</span>
        </label>
        <label className="flex items-center gap-2.5 text-sm text-[#434656] cursor-pointer py-0.5">
          <input
            type="checkbox"
            checked={requireFreeInstall}
            onChange={(e) => setRequireFreeInstall(e.target.checked)}
            className="w-4 h-4 rounded accent-[#0043CD]"
          />
          <span>무료 전문 기사 설치</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb Bar */}
      <section className="w-full bg-[#F3F4F6] border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-xs text-[#6E6E73]">
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="hover:text-[#1B1B1B] cursor-pointer"
          >
            홈
          </button>
          <span>/</span>
          <span className="font-semibold text-[#1B1B1B]">제품 라인업 카탈로그</span>
        </div>
      </section>

      {/* Category Hero & Subcategory Chips */}
      <section className="w-full bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider">
              HARDWARE CATALOG · 2025 EDITION
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1B1B1B] tracking-tight">
              디스플레이 · 공간 오디오 · 스마트 허브
            </h1>
            <p className="text-base text-[#6E6E73] max-w-2xl">
              주거 공간과 엔터프라이즈 오피스의 규모에 맞춰 설계된 고효율 하드웨어 라인업을 세부 스펙 조건으로 필터링해 보세요.
            </p>

            {/* Interactive Subcategory Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {SUBCATEGORIES.map((sub) => {
                const count =
                  sub.id === 'all'
                    ? PRODUCTS.length
                    : PRODUCTS.filter((p) => p.category === sub.id).length;
                const active = selectedCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => onSelectCategory(sub.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#1B1B1B] text-white'
                        : 'bg-[#F3F4F6] text-[#434656] hover:bg-gray-200'
                    }`}
                  >
                    <span>{sub.label}</span>
                    <span className={`tabular-nums ${active ? 'text-white/75' : 'text-[#6E6E73]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curated Promo Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#031C38] text-white p-6 flex flex-col justify-between gap-5">
              <div className="flex items-center justify-between text-xs text-blue-300 font-semibold">
                <span>SEASON LAUNCH OFFER</span>
                <span>최대 25% 결합 지원</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  2025 신형 8K · 사운드바 · 허브 통합 패키지
                </h2>
                <p className="text-xs text-white/75 mt-1">
                  동시 구매 시 약 99만원 할인 혜택과 무료 전문 기사 설치가 기본 제공됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('solutions')}
                className="self-start px-4 py-2 rounded-full bg-white text-[#1B1B1B] text-xs font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>패키지 비교 보러가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter Sidebar + Product Grid */}
      <section className="w-full py-10 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
            {renderSidebarContent()}
          </aside>

          {/* Right Column */}
          <div className="flex-1 w-full flex flex-col gap-5">
            {/* Control Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen((prev) => !prev)}
                  className="lg:hidden px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>필터</span>
                </button>
                <div className="text-sm font-bold text-[#1B1B1B] tabular-nums">
                  총 {filteredProducts.length}개 제품
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="정렬 기준"
                  className="bg-[#F3F4F6] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#1B1B1B] border border-transparent focus:border-[#0043CD] focus:outline-none cursor-pointer"
                >
                  <option value="recommended">추천순</option>
                  <option value="rating">평점 높은순</option>
                  <option value="price-asc">낮은 가격순</option>
                  <option value="price-desc">높은 가격순</option>
                </select>

                <div className="hidden sm:flex items-center bg-[#F3F4F6] p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    aria-label="3열 보기"
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      gridCols === 3 ? 'bg-white text-[#1B1B1B] shadow-xs' : 'text-[#6E6E73]'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(2)}
                    aria-label="2열 보기"
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      gridCols === 2 ? 'bg-white text-[#1B1B1B] shadow-xs' : 'text-[#6E6E73]'
                    }`}
                  >
                    <Grid2x2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer Inline */}
            {mobileFilterOpen && (
              <div className="lg:hidden">{renderSidebarContent()}</div>
            )}

            {/* Active Filter Chips */}
            {activeFilterLabels.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-[#6E6E73]">적용 필터:</span>
                {activeFilterLabels.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-[#1B1B1B] hover:border-[#0043CD] transition-colors cursor-pointer"
                  >
                    <span>{chip.label}</span>
                    <X className="w-3 h-3 text-[#6E6E73]" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#0043CD] hover:underline ml-1 cursor-pointer"
                >
                  전체 해제
                </button>
              </div>
            )}

            {/* Empty State or Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center gap-4">
                <p className="text-base font-bold text-[#1B1B1B]">
                  선택하신 필터 조건에 일치하는 제품이 없습니다.
                </p>
                <p className="text-sm text-[#6E6E73]">
                  가격 범위나 기능 필터 조건을 완화해 보세요.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-full bg-[#1B1B1B] text-white text-xs font-semibold hover:bg-[#0043CD] transition-colors cursor-pointer"
                >
                  필터 전체 초기화
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  gridCols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
                } gap-6`}
              >
                {filteredProducts.map((product) => {
                  const isSaved = wishlistIds.includes(product.id);
                  const isJustAdded = addedId === product.id;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="font-semibold text-[#0043CD]">
                            {product.badge || product.series}
                          </span>
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(product.id)}
                            aria-label={`${product.shortName} 북마크`}
                            className={`p-1 rounded-md cursor-pointer transition-colors ${
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
                          className="relative rounded-xl overflow-hidden border border-gray-100 cursor-pointer mb-3"
                        >
                          <HardwareVisual
                            type={product.visualType}
                            finishHex={product.finishes[0]?.swatchHex}
                            className="w-full aspect-square"
                          />
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-between text-[11px] text-[#1B1B1B]">
                            <span className="text-[#6E6E73] font-mono">{product.quickMetricLabel}</span>
                            <span className="font-semibold tabular-nums">{product.quickMetricValue}</span>
                          </div>
                        </div>

                        {/* Swatches Row */}
                        <div className="flex items-center gap-1.5 mb-2.5">
                          {product.finishes.map((f) => (
                            <span
                              key={f.id}
                              title={f.name}
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: f.swatchHex }}
                            />
                          ))}
                          <span className="text-[11px] text-[#6E6E73] ml-1">
                            {product.finishes.length}가지 마감
                          </span>
                        </div>

                        <div className="text-xs text-[#6E6E73] mb-0.5">
                          {product.series} · ★ {product.rating.toFixed(1)} ({product.reviewCount})
                        </div>
                        <h3
                          onClick={() => onOpenProduct(product.id)}
                          className="text-base font-bold text-[#1B1B1B] hover:text-[#0043CD] transition-colors cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h3>

                        <ul className="mt-2 space-y-1 text-xs text-[#6E6E73]">
                          {product.keyBullets.map((b, i) => (
                            <li key={i} className="truncate">
                              · {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-[#9A2A00] tabular-nums">
                              {product.discountPercent}%
                            </span>
                            <span className="text-lg font-bold text-[#1B1B1B] tabular-nums">
                              {formatKRW(product.price)}
                            </span>
                            <span className="text-xs text-[#6E6E73] line-through tabular-nums">
                              {formatKRW(product.originalPrice)}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#0043CD] font-medium mt-0.5">
                            {product.isFreeInstall
                              ? '무료 전문 기사 설치 · 최대 24개월 무이자'
                              : '당일 출고 · 내일 도착 보장'}
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenProduct(product.id)}
                            className="col-span-4 py-2.5 rounded-full bg-[#1B1B1B] text-white text-xs font-semibold hover:bg-[#0043CD] transition-colors cursor-pointer"
                          >
                            상세 구성 보기
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdd(product)}
                            aria-label={`${product.shortName} 장바구니 담기`}
                            className={`col-span-1 py-2.5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              isJustAdded
                                ? 'bg-[#DCE6FF] text-[#0043CD]'
                                : 'bg-[#F3F4F6] text-[#1B1B1B] hover:bg-gray-200'
                            }`}
                          >
                            {isJustAdded ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <ShoppingBag className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Buyer Guide & FAQ */}
      <section className="w-full bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left FAQs */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider">
              BUYER GUIDE & FAQ
            </div>
            <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">
              구매 가이드 및 자주 묻는 질문
            </h2>

            {CATEGORY_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#F7F7F7] border border-gray-200/80 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-bold text-[#1B1B1B] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#0043CD] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6E6E73] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-[#434656] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Room Size Matrix */}
          <div className="lg:col-span-5 bg-[#F7F7F7] border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#1B1B1B]">공간 크기별 추천 라인업</h3>
            <p className="text-xs text-[#6E6E73]">
              설치 공간 평형을 클릭하면 해당 라인업으로 즉시 필터링됩니다.
            </p>

            <div className="flex flex-col gap-3">
              {[
                {
                  tier: 'small' as const,
                  area: '10~20평형 · 원룸 / 개인 서재',
                  lineup: 'Essential Lite 시리즈',
                  note: '추천 1순위',
                },
                {
                  tier: 'family' as const,
                  area: '25~35평형 · 표준 패밀리 거실',
                  lineup: 'Standard Plus 시리즈',
                  note: '가장 인기',
                },
                {
                  tier: 'studio' as const,
                  area: '40평형 이상 · 프리미엄 스튜디오',
                  lineup: 'Flagship Pro 시리즈',
                  note: '최고 성능',
                },
              ].map((row) => {
                const active = selectedRoomTier === row.tier;
                return (
                  <button
                    key={row.tier}
                    type="button"
                    onClick={() => handleRoomRecommend(row.tier)}
                    className={`w-full p-4 rounded-xl bg-white border text-left flex items-center justify-between transition-all cursor-pointer ${
                      active ? 'border-[#0043CD] ring-1 ring-[#0043CD]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#0043CD]">{row.area}</div>
                      <div className="text-sm font-bold text-[#1B1B1B] mt-0.5">{row.lineup}</div>
                    </div>
                    <span className="text-xs font-semibold text-[#434656]">{row.note} →</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
