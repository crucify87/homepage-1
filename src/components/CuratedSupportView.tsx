import React, { useMemo, useState } from 'react';
import { ArrowRight, CalendarCheck, ChevronDown, ChevronUp, MapPin, Search } from 'lucide-react';
import { ARTICLES, CATEGORY_FAQS, PRODUCTS } from '../data/catalog';
import { Article, RouteId } from '../types/commerce';
import { formatKRW } from '../utils/format';
import { HardwareVisual } from './HardwareVisual';

interface CuratedSupportViewProps {
  onOpenProduct: (productId: string) => void;
  onOpenArticle: (article: Article) => void;
  onNavigate: (route: RouteId) => void;
  onNotify: (msg: string) => void;
}

const SHOWROOMS = [
  { name: 'AETHER 플래그십 강남', address: '서울 강남구 테헤란로 428', hours: '매일 10:30 – 20:30' },
  { name: 'AETHER 한남 아카이브', address: '서울 용산구 이태원로 240', hours: '화–일 11:00 – 20:00' },
  { name: 'AETHER 센텀 스튜디오', address: '부산 해운대구 센텀남대로 35', hours: '매일 10:30 – 20:00' },
];

export const CuratedSupportView: React.FC<CuratedSupportViewProps> = ({
  onOpenProduct,
  onOpenArticle,
  onNavigate,
  onNotify,
}) => {
  const [faqQuery, setFaqQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [asModel, setAsModel] = useState(PRODUCTS[0].shortName);
  const [asDate, setAsDate] = useState('2025-03-05');
  const [asPhone, setAsPhone] = useState('');
  const [asReservedCode, setAsReservedCode] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    if (!q) return CATEGORY_FAQS;
    return CATEGORY_FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [faqQuery]);

  const handleReserveAs = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `AS-${Math.floor(10000 + Math.random() * 90000)}`;
    setAsReservedCode(code);
    setAsPhone('');
    onNotify(`방문 점검 예약(${code})이 완료되었습니다.`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Curated Seasonal Promotion Hero */}
      <section className="w-full bg-[#031C38] text-white py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              NEW & CURATED · 2025 SPRING
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              신제품 론칭 기획전 & 전담 고객지원 센터
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
              새롭게 출시된 2025 플래그십 라인업의 단독 혜택을 확인하고, 전문 기사 방문 설치 예약부터 아키텍처 매거진까지 한 곳에서 이용해 보세요.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('solutions')}
                className="px-6 py-3 rounded-full bg-white text-[#1B1B1B] text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                25% 결합 할인 보기
              </button>
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="px-6 py-3 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors cursor-pointer"
              >
                전체 제품 탐색
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {PRODUCTS.slice(0, 2).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenProduct(p.id)}
                className="bg-white rounded-xl p-4 text-left text-[#1B1B1B] hover:-translate-y-0.5 transition-transform cursor-pointer"
              >
                <HardwareVisual
                  type={p.visualType}
                  finishHex={p.finishes[0]?.swatchHex}
                  className="w-full aspect-square rounded-lg mb-3"
                />
                <div className="text-[11px] text-[#0043CD] font-semibold">{p.discountPercent}% OFF</div>
                <div className="text-xs font-bold truncate mt-0.5">{p.shortName}</div>
                <div className="text-xs font-semibold text-[#434656] tabular-nums mt-0.5">
                  {formatKRW(p.price)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Brand Story & Editorial Magazine */}
      <section className="w-full bg-white py-14 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div>
            <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider mb-1">
              BRAND STORY & EDITORIAL
            </div>
            <h2 className="text-2xl font-bold text-[#1B1B1B]">엔지니어링 아카이브 매거진</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTICLES.map((art) => (
              <article
                key={art.id}
                onClick={() => onOpenArticle(art)}
                className="p-5 rounded-2xl border border-gray-200 bg-[#FAFAFA] hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 cursor-pointer"
              >
                <HardwareVisual
                  type={art.visualType}
                  angle={art.visualType === 'display' ? 'exploded' : 'front'}
                  className="w-full sm:w-40 h-40 rounded-xl border border-gray-200 shrink-0"
                />
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <div className="text-xs text-[#6E6E73]">
                      {art.tag} · {art.date} · {art.readTime}
                    </div>
                    <h3 className="text-base font-bold text-[#1B1B1B] mt-1 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#6E6E73] mt-1.5 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-[#0043CD] flex items-center gap-1">
                    <span>전문 읽기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Customer Support FAQ + A/S Reservation + Showrooms */}
      <section className="w-full bg-[#F9F9F9] py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Searchable FAQ */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#1B1B1B]">자주 묻는 질문 (FAQ)</h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqQuery}
                  onChange={(e) => setFaqQuery(e.target.value)}
                  placeholder="질문 키워드 검색..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-gray-200 text-xs focus:outline-none focus:border-[#0043CD]"
                />
              </div>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-gray-200 text-center text-sm text-[#6E6E73]">
                검색어와 일치하는 FAQ 항목이 없습니다.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const open = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-white border border-gray-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-bold text-[#1B1B1B] cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {open ? (
                        <ChevronUp className="w-4 h-4 text-[#0043CD] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6E6E73] shrink-0" />
                      )}
                    </button>
                    {open && (
                      <div className="px-5 pb-4 text-sm text-[#434656] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Offline Showrooms */}
            <div className="pt-4">
              <h3 className="text-base font-bold text-[#1B1B1B] mb-3">오프라인 쇼룸 안내</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SHOWROOMS.map((room) => (
                  <div
                    key={room.name}
                    className="p-4 rounded-xl bg-white border border-gray-200 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B1B1B]">
                      <MapPin className="w-3.5 h-3.5 text-[#0043CD]" />
                      <span>{room.name}</span>
                    </div>
                    <div className="text-xs text-[#6E6E73]">{room.address}</div>
                    <div className="text-[11px] text-[#434656] mt-1">{room.hours}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* A/S & Installation Reservation Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#0043CD]" />
              <h3 className="text-lg font-bold text-[#1B1B1B]">방문 설치 · A/S 점검 예약</h3>
            </div>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              전문 엔지니어 방문 설치 일정 변경이나 제품 점검이 필요하신 경우 희망 날짜를 예약해 주세요.
            </p>

            <form onSubmit={handleReserveAs} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1B1B1B]">보유 제품 모델</label>
                <select
                  value={asModel}
                  onChange={(e) => setAsModel(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-300 text-sm bg-white"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.shortName}>
                      {p.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1B1B1B]">방문 희망일</label>
                <input
                  type="date"
                  required
                  value={asDate}
                  onChange={(e) => setAsDate(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1B1B1B]">연락처 *</label>
                <input
                  type="tel"
                  required
                  value={asPhone}
                  onChange={(e) => setAsPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="h-10 px-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="h-11 rounded-full bg-[#1B1B1B] text-white text-xs font-semibold hover:bg-[#0043CD] transition-colors mt-1 cursor-pointer"
              >
                방문 점검 예약하기
              </button>

              {asReservedCode && (
                <div className="p-3 rounded-lg bg-[#DCE6FF] text-[#0043CD] text-xs font-semibold">
                  예약번호 {asReservedCode} ({asModel} · {asDate}) 접수가 완료되었습니다.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
