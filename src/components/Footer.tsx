import React, { useState } from 'react';
import { PhoneCall, X } from 'lucide-react';
import { RouteId } from '../types/commerce';

interface FooterProps {
  onNavigate: (route: RouteId) => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);

  const goCategory = (cat: string) => {
    if (onSelectCategory) onSelectCategory(cat);
    onNavigate('catalog');
  };

  return (
    <footer className="w-full bg-[#F3F4F6] text-[#434656] border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        {/* 5-Column Sitemap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-gray-200">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <span className="text-base font-extrabold tracking-[0.12em] text-[#1B1B1B]">
              AETHER
            </span>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              온디바이스 AI 프로세서와 건축적 하드웨어 설계를 결합한 차세대 공간 디스플레이·오디오·스마트홈 커머스.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-[#1B1B1B]">디스플레이 & 오디오</span>
            <ul className="flex flex-col gap-2 text-xs text-[#6E6E73]">
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('display-8k')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  Neo QLED 8K
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('display-oled')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  스튜디오 OLED
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('audio')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  Q-시리즈 공간 오디오
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goCategory('hub')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  스마트 홈 허브
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-[#1B1B1B]">솔루션 & 아키텍처</span>
            <ul className="flex flex-col gap-2 text-xs text-[#6E6E73]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  공간 토폴로지 설계
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  모델별 상세 스펙 비교
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  25% 결합 패키지
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  B2B 엔터프라이즈 상담
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-[#1B1B1B]">기획전 & 스토리</span>
            <ul className="flex flex-col gap-2 text-xs text-[#6E6E73]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('support')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  2025 시즌 기획전
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('support')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  아키텍처 저널
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('pdp')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  플래그십 X9 쇼케이스
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-[#1B1B1B]">고객지원</span>
            <ul className="flex flex-col gap-2 text-xs text-[#6E6E73]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('support')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  자주 묻는 질문 (FAQ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('support')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  전문 기사 설치 및 A/S
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('support')}
                  className="hover:text-[#1B1B1B] transition-colors cursor-pointer text-left"
                >
                  매장 및 쇼룸 안내
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Support Bar */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#0043CD]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1B1B1B] tabular-nums">
                고객지원 대표번호 1588-4200
              </div>
              <div className="text-xs text-[#6E6E73]">
                평일 09:00 ~ 18:00 · 주말 및 공휴일 1:1 온라인 접수 운영
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#6E6E73]">
            <button
              type="button"
              onClick={() => setPolicyModal('privacy')}
              className="font-semibold text-[#1B1B1B] hover:underline cursor-pointer"
            >
              개인정보처리방침
            </button>
            <button
              type="button"
              onClick={() => setPolicyModal('terms')}
              className="hover:text-[#1B1B1B] cursor-pointer"
            >
              이용약관
            </button>
            <button
              type="button"
              onClick={() => onNavigate('solutions')}
              className="hover:text-[#1B1B1B] cursor-pointer"
            >
              B2B 포털
            </button>
          </div>
        </div>

        {/* Legal Line */}
        <div className="pt-6 text-[11px] text-[#6E6E73] leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p>
            (주)에테르랩스 코리아 · 서울특별시 강남구 테헤란로 428 · 사업자등록번호 211-88-90412 · 통신판매업신고 제2025-서울강남-0184호
          </p>
          <p>© 2025 AETHER LABS Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Legal Policy Modal */}
      {policyModal && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPolicyModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B1B1B]">
                {policyModal === 'privacy' ? '개인정보처리방침' : '전자상거래 이용약관'}
              </h3>
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-[#434656] leading-relaxed space-y-2 max-h-72 overflow-y-auto">
              {policyModal === 'privacy' ? (
                <>
                  <p>
                    (주)에테르랩스 코리아는 주문 처리, 전문 기사 방문 설치 예약, B2B 기술 상담 및 무상 보증(AS) 제공을 위해 필요한 최소한의 개인정보만 수집합니다.
                  </p>
                  <p>
                    수집된 모든 데이터는 하드웨어 암호화 정책에 따라 안전하게 관리되며, 법령상 보존 기간 종료 후 지체 없이 파기됩니다.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    본 스토어에서 판매되는 모든 디스플레이·오디오·스마트홈 하드웨어는 국내 KC 인증 및 공식 무상 보증 기준을 준수합니다.
                  </p>
                  <p>
                    전문 기사 동행 설치 상품은 배송 희망일 지정 및 기존 폐가전 1:1 무상 수거를 지원하며, 단순 변심 시 수령 후 7일 이내 청약 철회가 가능합니다.
                  </p>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPolicyModal(null)}
              className="self-end px-5 py-2 rounded-lg bg-[#1B1B1B] text-white text-sm font-medium hover:bg-[#0043CD] transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
