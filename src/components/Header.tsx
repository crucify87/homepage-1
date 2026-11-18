import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { RouteId } from '../types/commerce';

interface HeaderProps {
  activeRoute: RouteId;
  onNavigate: (route: RouteId) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

const NAV_ITEMS: { id: RouteId; label: string }[] = [
  { id: 'overview', label: '홈' },
  { id: 'catalog', label: '제품 라인업' },
  { id: 'pdp', label: '플래그십 상세' },
  { id: 'solutions', label: '솔루션 · 비교' },
  { id: 'support', label: '기획전 · 지원' },
];

export const Header: React.FC<HeaderProps> = ({
  activeRoute,
  onNavigate,
  onOpenSearch,
  onOpenCart,
  cartCount,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: RouteId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => handleNav('overview')}
          className="text-lg font-extrabold tracking-[0.14em] text-[#1B1B1B] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0043CD] rounded-sm"
        >
          AETHER
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="주 메뉴">
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0043CD] rounded-sm ${
                  isActive
                    ? 'text-[#0043CD] font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1B1B1B]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0043CD] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search & Cart Utility Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="통합 검색 열기"
            className="h-10 px-3 rounded-lg text-sm text-[#434656] hover:bg-gray-100 hover:text-[#1B1B1B] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0043CD]"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">검색</span>
            <kbd className="hidden md:inline-block text-[11px] font-mono text-[#6E6E73] ml-0.5">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label="장바구니 열기"
            className="h-10 px-3.5 rounded-lg bg-[#1B1B1B] text-white text-sm font-medium hover:bg-[#0043CD] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0043CD]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>장바구니</span>
            <span className="tabular-nums font-mono text-xs bg-white/15 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="모바일 메뉴 토글"
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#1B1B1B] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#DCE6FF] text-[#0043CD] font-semibold'
                    : 'text-[#434656] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
