import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Heart,
  Maximize2,
  MessageSquarePlus,
  Minus,
  Plus,
  Rotate3d,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  ThumbsUp,
  X,
  ZoomIn,
} from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { CartItem, Product, ReviewItem, RouteId } from '../types/commerce';
import { formatKRW } from '../utils/format';
import { HardwareVisual, VisualAngle } from './HardwareVisual';

interface ProductDetailViewProps {
  product: Product;
  onSelectProduct: (productId: string) => void;
  onNavigate: (route: RouteId) => void;
  onAddToCart: (item: CartItem, openDrawer?: boolean) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  reviews: ReviewItem[];
  onAddReview: (review: ReviewItem) => void;
  onToggleHelpful: (reviewId: string) => void;
  onNotify: (msg: string) => void;
}

const GALLERY_ANGLES: { angle: VisualAngle; label: string }[] = [
  { angle: 'front', label: '01 메인' },
  { angle: 'side', label: '02 측면' },
  { angle: 'ports', label: '03 포트' },
  { angle: 'lifestyle', label: '04 무드' },
  { angle: 'exploded', label: '05 3D 분해' },
];

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onSelectProduct,
  onNavigate,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  reviews,
  onAddReview,
  onToggleHelpful,
  onNotify,
}) => {
  const [selectedFinishIdx, setSelectedFinishIdx] = useState(0);
  const [selectedStorageIdx, setSelectedStorageIdx] = useState(() => {
    const recIdx = product.storageOptions.findIndex((s) => s.recommended);
    return recIdx >= 0 ? recIdx : 0;
  });
  const [deliveryType, setDeliveryType] = useState<'pro-install' | 'courier'>('pro-install');
  const [quantity, setQuantity] = useState(1);
  const [activeAngle, setActiveAngle] = useState<VisualAngle>('front');
  const [activeSectionTab, setActiveSectionTab] = useState('features');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'photo' | 'month' | 'design' | 'install'>('all');
  const [openQnaIdx, setOpenQnaIdx] = useState<number | null>(0);

  // Interactive Modals
  const [viewer3dOpen, setViewer3dOpen] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  // Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Inquiry Form State
  const [inquiryText, setInquiryText] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  useEffect(() => {
    setSelectedFinishIdx(0);
    const recIdx = product.storageOptions.findIndex((s) => s.recommended);
    setSelectedStorageIdx(recIdx >= 0 ? recIdx : 0);
    setQuantity(1);
    setActiveAngle('front');
  }, [product]);

  const finish = product.finishes[selectedFinishIdx] || product.finishes[0];
  const storage = product.storageOptions[selectedStorageIdx] || product.storageOptions[0];

  const unitPrice = product.price + (finish?.priceDelta || 0) + (storage?.priceDelta || 0);
  const totalPrice = unitPrice * quantity;
  const rewardPoints = Math.round(totalPrice * 0.02);
  const monthlyInstallment = Math.round(totalPrice / 12);

  const isSaved = wishlistIds.includes(product.id);

  const productReviews = useMemo(() => {
    const base = reviews.filter((r) => r.productId === product.id);
    const list = base.length > 0 ? base : reviews;
    if (reviewFilter === 'all') return list;
    return list.filter((r) => r.categoryTag === reviewFilter);
  }, [reviews, product.id, reviewFilter]);

  const buildCartItem = (): CartItem => ({
    cartItemId: `${product.id}-${finish.id}-${storage.id}-${deliveryType}`,
    productId: product.id,
    name: product.name,
    sku: product.sku,
    visualType: product.visualType,
    finishName: finish.name,
    finishHex: finish.swatchHex,
    storageLabel: storage.label,
    deliveryType,
    unitPrice,
    quantity,
  });

  const handleShare = () => {
    if (navigator.clipboard && window.location) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    onNotify(`${product.shortName} 제품 링크가 클립보드에 복사되었습니다.`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: reviewAuthor.trim() || '인증 구매 고객님',
      badge: '신규 작성 리뷰',
      optionText: `${finish.name} · ${storage.label}`,
      date: '2025.02.20',
      rating: reviewRating,
      content: reviewText.trim(),
      categoryTag: 'design',
      helpfulCount: 0,
    };
    onAddReview(newRev);
    setReviewAuthor('');
    setReviewText('');
    setReviewModalOpen(false);
    onNotify('소중한 구매 후기가 등록되었습니다.');
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setInquiryText('');
    setInquiryModalOpen(false);
    onNotify('1:1 상품 문의가 접수되었습니다. 담당 엔지니어가 곧 답변드립니다.');
  };

  const handleSendGift = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart(buildCartItem(), true);
    setGiftModalOpen(false);
    onNotify('선물 메시지와 함께 장바구니에 담겼습니다.');
  };

  const jumpToSection = (id: string) => {
    setActiveSectionTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb & Model Switcher */}
      <section className="w-full bg-[#F3F4F6] border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-2 text-xs text-[#6E6E73]" aria-label="경로">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="hover:text-[#1B1B1B] cursor-pointer"
            >
              홈
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="hover:text-[#1B1B1B] cursor-pointer"
            >
              {product.categoryLabel}
            </button>
            <span>/</span>
            <span className="font-semibold text-[#1B1B1B]">{product.shortName}</span>
          </nav>

          {/* Quick Model Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6E6E73] hidden sm:inline">모델 전환:</span>
            <select
              value={product.id}
              onChange={(e) => onSelectProduct(e.target.value)}
              aria-label="상세 제품 선택"
              className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium text-[#1B1B1B] cursor-pointer"
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.shortName} ({formatKRW(p.price)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main 50/50 Asymmetric Purchase Module */}
      <section className="w-full bg-white py-10 lg:py-14 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sticky Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="relative aspect-square w-full rounded-2xl border border-gray-200 overflow-hidden bg-[#F4F5F7]">
              <HardwareVisual
                type={product.visualType}
                finishHex={finish.swatchHex}
                angle={activeAngle}
                className="w-full h-full"
              />

              {/* Top Right Zoom Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  aria-label="이미지 확대 보기"
                  className="w-10 h-10 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-[#1B1B1B] hover:bg-white transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  aria-label="전체 화면 보기"
                  className="w-10 h-10 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-[#1B1B1B] hover:bg-white transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full bg-white/90 border border-gray-200 text-xs font-medium text-[#1B1B1B]">
                  {finish.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRotationDeg(0);
                    setViewer3dOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#1B1B1B] text-white text-xs font-semibold hover:bg-[#0043CD] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Rotate3d className="w-4 h-4" />
                  <span>3D 입체 뷰어</span>
                </button>
              </div>
            </div>

            {/* 5 Angle Thumbnails */}
            <div className="grid grid-cols-5 gap-2.5">
              {GALLERY_ANGLES.map((item) => {
                const active = activeAngle === item.angle;
                return (
                  <button
                    key={item.angle}
                    type="button"
                    onClick={() => setActiveAngle(item.angle)}
                    className={`rounded-xl overflow-hidden border transition-all flex flex-col items-center cursor-pointer ${
                      active
                        ? 'border-[#0043CD] ring-2 ring-[#0043CD]/20 bg-white'
                        : 'border-gray-200 bg-[#F7F7F7] hover:border-gray-300'
                    }`}
                  >
                    <HardwareVisual
                      type={product.visualType}
                      finishHex={finish.swatchHex}
                      angle={item.angle}
                      className="w-full aspect-square"
                    />
                    <span className="py-1 text-[11px] font-medium text-[#434656]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-[#F7F7F7] border border-gray-200/70 flex items-center justify-between text-xs text-[#434656]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0043CD]" />
                <span>{product.specs.warranty}</span>
              </div>
              <span className="font-mono text-[#6E6E73]">{product.specs.kcCode}</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Configurator */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#6E6E73] mb-2">
                <span className="font-mono">
                  {product.series} · {product.sku} · {product.specs.energyGrade}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-[#1B1B1B] cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>공유</span>
                </button>
              </div>

              <h1 className="text-3xl font-bold text-[#1B1B1B] tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-base text-[#6E6E73] mt-2 leading-relaxed">
                {product.summary}
              </p>

              <div className="flex items-center gap-2.5 mt-3">
                <div className="flex items-center text-[#0043CD]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#1B1B1B] tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[#6E6E73]">·</span>
                <button
                  type="button"
                  onClick={() => jumpToSection('reviews')}
                  className="text-sm font-medium text-[#0043CD] hover:underline cursor-pointer tabular-nums"
                >
                  리뷰 {product.reviewCount.toLocaleString()}건 보기
                </button>
              </div>
            </div>

            {/* Price & Financing Card */}
            <div className="p-5 rounded-2xl bg-[#F7F7F7] border border-gray-200 flex flex-col gap-3">
              <div>
                <div className="text-xs text-[#6E6E73] line-through tabular-nums">
                  정상가 {formatKRW(product.originalPrice)}
                </div>
                <div className="flex items-baseline gap-3 mt-0.5 flex-wrap">
                  <span className="text-xl font-bold text-[#9A2A00] tabular-nums">
                    {product.discountPercent}% OFF
                  </span>
                  <span className="text-3xl font-extrabold text-[#1B1B1B] tabular-nums">
                    {formatKRW(unitPrice)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs text-[#434656]">
                <div className="flex items-center justify-between">
                  <span>멤버십 포인트 적립 (2%)</span>
                  <span className="font-semibold text-[#1B1B1B] tabular-nums">
                    +{rewardPoints.toLocaleString()} P
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>제휴 카드 12개월 무이자</span>
                  <span className="font-semibold text-[#1B1B1B] tabular-nums">
                    월 {formatKRW(monthlyInstallment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Option 1: Finish */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#1B1B1B]">1. 색상 · 마감재</span>
                <span className="text-xs text-[#6E6E73]">{finish.name}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.finishes.map((f, idx) => {
                  const active = idx === selectedFinishIdx;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFinishIdx(idx)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        active
                          ? 'border-[#0043CD] bg-[#DCE6FF]/35 ring-1 ring-[#0043CD]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-300 shrink-0"
                        style={{ backgroundColor: f.swatchHex }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#1B1B1B] truncate">
                          {f.name}
                        </div>
                        <div className="text-[11px] text-[#6E6E73] tabular-nums">
                          {f.priceDelta > 0 ? `+${formatKRW(f.priceDelta)}` : '기본 포함'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 2: Storage / Configuration */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#1B1B1B]">2. 스펙 · 패키지 구성</span>
                <span className="text-xs text-[#0043CD] font-medium">
                  {storage.recommended ? '추천 사양 선택됨' : storage.subtitle}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {product.storageOptions.map((opt, idx) => {
                  const active = idx === selectedStorageIdx;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedStorageIdx(idx)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'border-[#0043CD] bg-[#DCE6FF]/35 ring-1 ring-[#0043CD]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#1B1B1B]">{opt.label}</div>
                      <div className="text-[11px] text-[#6E6E73] mt-0.5 tabular-nums">
                        {opt.priceDelta > 0 ? `+${formatKRW(opt.priceDelta)}` : opt.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 3: Delivery */}
            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-semibold text-[#1B1B1B]">3. 배송 및 설치 방식</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    deliveryType === 'pro-install'
                      ? 'border-[#0043CD] bg-[#DCE6FF]/35 ring-1 ring-[#0043CD]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'pro-install'}
                    onChange={() => setDeliveryType('pro-install')}
                    className="mt-1 accent-[#0043CD]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#1B1B1B]">전문 기사 동행 설치 (무료)</div>
                    <div className="text-[11px] text-[#6E6E73] mt-0.5">
                      희망일 지정 · 기존 폐가전 무상 수거
                    </div>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    deliveryType === 'courier'
                      ? 'border-[#0043CD] bg-[#DCE6FF]/35 ring-1 ring-[#0043CD]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'courier'}
                    onChange={() => setDeliveryType('courier')}
                    className="mt-1 accent-[#0043CD]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#1B1B1B]">안심 택배 출고</div>
                    <div className="text-[11px] text-[#6E6E73] mt-0.5">
                      평일 오후 2시 이전 주문 시 당일 발송
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Quantity & Total Bar */}
            <div className="p-4 rounded-xl bg-[#F3F4F6] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#434656]">수량</span>
                <div className="flex items-center bg-white rounded-full border border-gray-200 p-0.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="수량 감소"
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="수량 증가"
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-[#6E6E73]">총 결제 예정 금액</div>
                <div className="text-2xl font-extrabold text-[#1B1B1B] tabular-nums">
                  {formatKRW(totalPrice)}
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onAddToCart(buildCartItem(), true)}
                className="w-full h-13 rounded-full bg-[#0043CD] text-white font-semibold text-sm hover:bg-[#1259FF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>바로 구매하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(buildCartItem(), false);
                    onNotify(`${product.shortName} 상품이 장바구니에 담겼습니다.`);
                  }}
                  className="h-11 rounded-full border border-gray-300 bg-white text-xs font-semibold text-[#1B1B1B] hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>장바구니</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGiftModalOpen(true)}
                  className="h-11 rounded-full border border-gray-300 bg-white text-xs font-semibold text-[#1B1B1B] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  선물하기
                </button>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`h-11 rounded-full border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSaved
                      ? 'border-[#0043CD] bg-[#DCE6FF]/50 text-[#0043CD]'
                      : 'border-gray-300 bg-white text-[#1B1B1B] hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? '저장됨' : '위시리스트'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6E6E73] px-1">
              <span className="text-[#0043CD] font-medium tabular-nums">
                국내 물류센터 잔여 재고 {product.stockCount}대
              </span>
              <span>서울/수도권 익일 도착 가능</span>
            </div>
          </div>
        </div>
      </section>

      {/* In-Page Tab Bar (Desktop sticky) */}
      <nav className="md:sticky md:top-16 z-30 w-full bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between overflow-x-auto py-2.5">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'features', label: '제품 상세 정보' },
              { id: 'specs', label: '기술 제원' },
              { id: 'reviews', label: `고객 리뷰 (${productReviews.length})` },
              { id: 'qna', label: 'Q&A · 배송' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => jumpToSection(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeSectionTab === tab.id
                    ? 'bg-[#1B1B1B] text-white'
                    : 'text-[#434656] hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <span className="text-sm font-bold text-[#1B1B1B] tabular-nums">
              {formatKRW(totalPrice)}
            </span>
            <button
              type="button"
              onClick={() => onAddToCart(buildCartItem(), true)}
              className="px-5 py-2 rounded-full bg-[#0043CD] text-white text-xs font-semibold hover:bg-[#1259FF] transition-colors cursor-pointer"
            >
              구매하기
            </button>
          </div>
        </div>
      </nav>

      {/* Deep Dive Storytelling Section */}
      <section id="features" className="w-full py-16 bg-[#F9F9F9] flex flex-col gap-16">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="rounded-3xl overflow-hidden bg-[#031C38] text-white p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="text-xs font-semibold text-blue-300 tracking-wider uppercase">
                AUTO-CALIBRATION AMBIENT ENGINE
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                공간의 빛을 읽고 반응하는 오토-캘리브레이션 엔진.
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                24개의 환경 센서가 실내 조도와 색온도를 실시간으로 감지하여 낮에는 눈부심 없는 선명도를, 밤에는 눈에 편안한 웜톤 밸런스를 자동으로 유지합니다.
              </p>
            </div>
            <div className="lg:col-span-5">
              <HardwareVisual
                type={product.visualType}
                angle="lifestyle"
                finishHex={finish.swatchHex}
                className="w-full aspect-[4/3] rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* NPU 48 TOPS Split */}
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider">
              ON-DEVICE NPU COMPUTE
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] leading-snug">
              온디바이스 AI가 제어하는 초저지연 하드웨어 최적화.
            </h3>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              클라우드 왕복 없이 기기 내부 3nm 뉴럴 칩셋에서 직접 추론을 완결해 0.01ms 수준의 즉각 응답과 완벽한 프라이버시 격리를 달성했습니다.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200">
                <div className="text-xs text-[#6E6E73]">연산 처리 능력</div>
                <div className="text-3xl font-extrabold text-[#0043CD] tabular-nums mt-1">
                  48 TOPS
                </div>
                <div className="text-xs text-[#6E6E73] mt-1">전작 대비 320% 향상</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gray-200">
                <div className="text-xs text-[#6E6E73]">대기전력 절감률</div>
                <div className="text-3xl font-extrabold text-[#1B1B1B] tabular-nums mt-1">
                  -42%
                </div>
                <div className="text-xs text-[#6E6E73] mt-1">초저전력 스탠바이</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HardwareVisual
              type={product.visualType}
              angle="exploded"
              finishHex={finish.swatchHex}
              className="w-full aspect-[4/3] rounded-2xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* Technical Specification Sheet */}
      <section id="specs" className="w-full bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider">
                SPECIFICATION SHEET
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] mt-1">
                상세 기술 제원
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#1B1B1B] hover:bg-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>스펙 시트 인쇄</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('solutions')}
                className="px-4 py-2 rounded-full bg-[#1B1B1B] text-white text-xs font-semibold hover:bg-[#0043CD] transition-colors cursor-pointer"
              >
                타 모델과 비교하기
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '화면 · 폼팩터', value: product.specs.screenSize },
              { label: '패널 · 하우징', value: product.specs.panelType },
              { label: '해상도 · 성능', value: product.specs.resolution },
              { label: 'AI 프로세서', value: product.specs.aiProcessor },
              { label: '공간 음향', value: product.specs.spatialAudio },
              { label: '연결 포트', value: product.specs.ports },
              { label: '무선 프로토콜', value: product.specs.wireless },
              { label: '외형 치수', value: product.specs.dimensions },
              { label: '본체 중량', value: product.specs.weight },
              { label: '에너지 등급', value: product.specs.energyGrade },
              { label: '연간 에너지 비용', value: product.specs.annualEnergyCost },
              { label: 'KC 인증 코드', value: product.specs.kcCode },
            ].map((spec) => (
              <div
                key={spec.label}
                className="p-4 rounded-xl bg-[#F7F7F7] border border-gray-200/70 flex flex-col gap-1"
              >
                <span className="text-[11px] font-medium text-[#6E6E73]">{spec.label}</span>
                <span className="text-sm font-semibold text-[#1B1B1B] tabular-nums">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="w-full bg-[#F9F9F9] py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-[#1B1B1B] tabular-nums">
                  {product.rating.toFixed(1)}
                </div>
                <div className="flex text-[#0043CD] mt-1 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-[#6E6E73] mt-1 tabular-nums">
                  총 {product.reviewCount.toLocaleString()}건 평가
                </div>
              </div>

              <div className="h-14 w-px bg-gray-200" />

              <div className="text-sm text-[#434656]">
                <div className="font-bold text-[#1B1B1B]">구매 고객 만족도 98.4%</div>
                <div className="text-xs text-[#6E6E73] mt-0.5">
                  디자인 마감과 전문 기사 설치 항목 최고 평점
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#1B1B1B] text-white text-xs font-semibold hover:bg-[#0043CD] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>구매 후기 작성하기</span>
            </button>
          </div>

          {/* Review Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(
              [
                { id: 'all', label: '전체 리뷰' },
                { id: 'photo', label: '포토 · 설치' },
                { id: 'month', label: '한 달 사용기' },
                { id: 'design', label: '디자인 · 음질' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setReviewFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  reviewFilter === tab.id
                    ? 'bg-[#1B1B1B] text-white'
                    : 'bg-white border border-gray-200 text-[#434656] hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {productReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-bold text-[#1B1B1B]">{rev.author}</div>
                      <div className="text-xs text-[#6E6E73]">
                        {rev.badge} · {rev.optionText} · {rev.date}
                      </div>
                    </div>
                    <div className="flex text-[#0043CD]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#434656] leading-relaxed">{rev.content}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onToggleHelpful(rev.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      rev.isHelpful
                        ? 'bg-[#DCE6FF] text-[#0043CD]'
                        : 'bg-[#F3F4F6] text-[#434656] hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="tabular-nums">도움이 돼요 {rev.helpfulCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A Section */}
      <section id="qna" className="w-full bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider">
              Q&A & INSTALLATION
            </div>
            <h2 className="text-2xl font-bold text-[#1B1B1B]">궁금한 점이 있으신가요?</h2>
            <p className="text-sm text-[#6E6E73] leading-relaxed">
              설치 환경 호환성이나 희망일 배송 일정에 대해 전담 엔지니어에게 직접 문의하실 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => setInquiryModalOpen(true)}
              className="mt-2 py-3 px-6 rounded-full bg-[#1B1B1B] text-white text-xs font-semibold hover:bg-[#0043CD] transition-colors cursor-pointer self-start"
            >
              1:1 상품 문의 작성하기
            </button>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-3">
            {[
              {
                q: '전문 기사 설치 시 기존 가전 무료 수거가 가능한가요?',
                a: '네, 전문 기사 동행 설치 옵션 선택 시 동일 품목군의 노후 제품에 대해 1:1 무상 철거 및 친환경 수거 서비스를 제공합니다.',
              },
              {
                q: '기존 스마트홈 센서나 타사 기기와 Matter로 호환되나요?',
                a: '표준 Matter 1.3 및 Thread 보더 라우터를 기본 지원하므로 타사 인증 조명·센서와도 즉시 로컬 연동이 가능합니다.',
              },
              {
                q: '무상 보증 기간과 OS 보안 업데이트 지원 기간은 어떻게 되나요?',
                a: '공식 무상 AS 3년 보증(B2B 라인업 5년)과 함께 출시일 기준 5년간의 메이저 OS 및 보안 업데이트를 보장합니다.',
              },
            ].map((item, idx) => {
              const open = openQnaIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#F7F7F7] border border-gray-200/80 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenQnaIdx(open ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-bold text-[#1B1B1B] cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {open ? (
                      <ChevronUp className="w-4 h-4 text-[#0043CD] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6E6E73] shrink-0" />
                    )}
                  </button>
                  {open && (
                    <div className="px-5 pb-4 text-sm text-[#434656] leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3D Interactive Viewer Modal */}
      {viewer3dOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewer3dOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1B1B1B]">{product.shortName} · 3D 뷰어</h3>
                <p className="text-xs text-[#6E6E73]">
                  슬라이더를 조절해 프레임 두께와 마감 각도를 확인하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewer3dOpen(false)}
                aria-label="3D 뷰어 닫기"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <HardwareVisual
              type={product.visualType}
              finishHex={finish.swatchHex}
              angle={Math.abs(rotationDeg) > 35 ? 'side' : 'front'}
              rotationDeg={rotationDeg}
              className="w-full h-72 rounded-xl border border-gray-200"
            />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-[#6E6E73] tabular-nums">
                <span>좌측 -45°</span>
                <span className="font-semibold text-[#0043CD]">회전 각도: {rotationDeg}°</span>
                <span>우측 +45°</span>
              </div>
              <input
                type="range"
                min={-45}
                max={45}
                value={rotationDeg}
                onChange={(e) => setRotationDeg(Number(e.target.value))}
                className="w-full accent-[#0043CD] cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-[#6E6E73] pt-2 border-t border-gray-100">
              <span>규격: {product.specs.dimensions}</span>
              <span>중량: {product.specs.weight}</span>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#1B1B1B]">
                {product.name} · 고해상도 상세 뷰
              </span>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="닫기"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <HardwareVisual
              type={product.visualType}
              finishHex={finish.swatchHex}
              angle={activeAngle}
              className="w-full h-[420px] rounded-xl border border-gray-200"
            />
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setReviewModalOpen(false)}
        >
          <form
            onSubmit={handleSubmitReview}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B1B1B]">구매 후기 작성</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#434656]">작성자 이름</label>
              <input
                type="text"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="예: 홍*동 고객님"
                className="h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0043CD]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#434656]">만족도 평점</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating ? 'text-[#0043CD] fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#434656]">사용 후기 *</label>
              <textarea
                required
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="설치 품질, 화질/음질, 스마트홈 연동 경험을 공유해 주세요."
                className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0043CD] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-full bg-[#0043CD] text-white text-sm font-semibold hover:bg-[#1259FF] transition-colors cursor-pointer"
            >
              후기 등록하기
            </button>
          </form>
        </div>
      )}

      {/* 1:1 Product Inquiry Modal */}
      {inquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInquiryModalOpen(false)}
        >
          <form
            onSubmit={handleSubmitInquiry}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B1B1B]">1:1 상품 기술 문의</h3>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-[#6E6E73]">
              대상 모델: <strong className="text-[#1B1B1B]">{product.name}</strong>
            </div>
            <textarea
              required
              rows={4}
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              placeholder="벽면 재질(아트월/석고보드), 기존 기기 호환성 또는 설치 일정을 입력해 주세요."
              className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0043CD] resize-none"
            />
            <button
              type="submit"
              className="w-full h-11 rounded-full bg-[#1B1B1B] text-white text-sm font-semibold hover:bg-[#0043CD] transition-colors cursor-pointer"
            >
              문의 접수하기
            </button>
          </form>
        </div>
      )}

      {/* Gift Message Modal */}
      {giftModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setGiftModalOpen(false)}
        >
          <form
            onSubmit={handleSendGift}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B1B1B]">선물하기 메시지 작성</h3>
              <button
                type="button"
                onClick={() => setGiftModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#6E6E73]">
              받는 분이 배송지와 설치 희망일을 직접 선택할 수 있는 모바일 알림톡이 함께 발송됩니다.
            </p>
            <textarea
              rows={3}
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="따뜻한 축하 메시지를 입력해 주세요 (선택)"
              className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0043CD] resize-none"
            />
            <button
              type="submit"
              className="w-full h-11 rounded-full bg-[#0043CD] text-white text-sm font-semibold hover:bg-[#1259FF] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>선물 결제로 진행</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
