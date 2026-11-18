import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem, OrderReceipt } from '../types/commerce';
import { formatKRW } from '../utils/format';
import { HardwareVisual } from './HardwareVisual';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'receipt'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'cod'>('card');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  if (!open) return null;

  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  const multiItemDiscount =
    items.length >= 2 && !items.some((i) => i.isBundle) ? Math.round(subtotal * 0.05) : 0;
  const finalTotal = Math.max(0, subtotal - multiItemDiscount);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `AE-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: OrderReceipt = {
      orderNumber: orderNum,
      createdAt: new Date().toLocaleString('ko-KR'),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: `${address.trim()} (${postalCode.trim()})`,
      paymentMethod:
        paymentMethod === 'card'
          ? '신용카드 (무이자 할부 적용)'
          : paymentMethod === 'transfer'
          ? '실시간 계좌이체'
          : '방문 설치 후 현장 결제 (COD)',
      items: [...items],
      subtotal,
      discount: multiItemDiscount,
      total: finalTotal,
    };
    setReceipt(newReceipt);
    setStep('receipt');
    onClearCart();
  };

  const handleCloseDrawer = () => {
    if (step === 'receipt') {
      setStep('cart');
      setReceipt(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end"
      onClick={handleCloseDrawer}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#0043CD]" />
            <h2 className="text-base font-bold text-[#1B1B1B]">
              {step === 'cart'
                ? `장바구니 (${items.reduce((a, b) => a + b.quantity, 0)})`
                : step === 'checkout'
                ? '주문 · 배송지 입력'
                : '주문 접수 완료'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="장바구니 닫기"
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'receipt' && receipt ? (
            <div className="flex flex-col gap-5">
              <div className="p-5 rounded-2xl bg-[#DCE6FF]/45 border border-[#0043CD]/20 flex flex-col items-center text-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-[#0043CD]" />
                <div className="text-xs font-mono font-semibold text-[#0043CD]">
                  ORDER #{receipt.orderNumber} CONFIRMED
                </div>
                <h3 className="text-lg font-bold text-[#1B1B1B]">
                  주문이 정상적으로 확정되었습니다
                </h3>
                <p className="text-xs text-[#434656]">
                  {receipt.customerName}님, 전문 설치 기사 배정 안내 알림톡을 곧 발송해 드립니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">수령인</span>
                  <span className="font-semibold text-[#1B1B1B]">{receipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">연락처</span>
                  <span className="font-semibold text-[#1B1B1B] tabular-nums">{receipt.phone}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6E6E73] shrink-0">배송지</span>
                  <span className="font-semibold text-[#1B1B1B] text-right">{receipt.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6E73]">결제 수단</span>
                  <span className="font-semibold text-[#1B1B1B]">{receipt.paymentMethod}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-[#0043CD]">
                  <span>최종 결제 금액</span>
                  <span className="tabular-nums">{formatKRW(receipt.total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="w-full h-11 rounded-full bg-[#1B1B1B] text-white text-sm font-semibold hover:bg-[#0043CD] transition-colors cursor-pointer"
              >
                쇼핑 계속하기
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12">
              <div className="w-14 h-14 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6E6E73]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-[#1B1B1B]">장바구니가 비어 있습니다</div>
              <p className="text-xs text-[#6E6E73] max-w-xs">
                제품 라인업이나 솔루션 패키지에서 원하시는 하드웨어를 담아보세요.
              </p>
            </div>
          ) : step === 'cart' ? (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-4 rounded-xl border border-gray-200 bg-[#FAFAFA] flex gap-3.5"
                >
                  <HardwareVisual
                    type={item.visualType}
                    finishHex={item.finishHex}
                    className="w-20 h-20 rounded-lg border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-bold text-[#1B1B1B] line-clamp-2">
                          {item.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          aria-label="상품 삭제"
                          className="text-[#6E6E73] hover:text-red-600 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#6E6E73] mt-0.5">
                        {item.finishName} · {item.storageLabel}
                      </div>
                      <div className="text-[11px] text-[#0043CD]">
                        {item.deliveryType === 'pro-install' ? '전문 기사 무료 설치' : '안심 택배 출고'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center bg-white border border-gray-200 rounded-full">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.cartItemId, -1)}
                          aria-label="수량 감소"
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.cartItemId, 1)}
                          aria-label="수량 증가"
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#1B1B1B] tabular-nums">
                        {formatKRW(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1B1B1B]">받는 분 성함 *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="홍길동"
                  className="h-10 px-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1B1B1B]">휴대전화 번호 *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="h-10 px-3 rounded-lg border border-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#1B1B1B]">우편번호 *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="06194"
                    className="h-10 px-3 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#1B1B1B]">배송 주소 *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="서울 강남구 테헤란로 428"
                    className="h-10 px-3 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-xs font-semibold text-[#1B1B1B]">결제 방식 선택</label>
                {[
                  { id: 'card' as const, label: '신용카드 (최대 24개월 무이자)' },
                  { id: 'transfer' as const, label: '실시간 계좌이체' },
                  { id: 'cod' as const, label: '전문 기사 설치 확인 후 현장 결제 (COD)' },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`p-3 rounded-lg border text-xs flex items-center gap-2 cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'border-[#0043CD] bg-[#DCE6FF]/35 font-semibold'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="accent-[#0043CD]"
                    />
                    <span>{pm.label}</span>
                  </label>
                ))}
              </div>
            </form>
          )}
        </div>

        {/* Footer Totals */}
        {items.length > 0 && step !== 'receipt' && (
          <div className="p-6 border-t border-gray-200 bg-[#F9FAFB] flex flex-col gap-3">
            <div className="space-y-1.5 text-xs text-[#434656]">
              <div className="flex justify-between">
                <span>상품 합계</span>
                <span className="tabular-nums">{formatKRW(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>배송 및 전문 설치비</span>
                <span className="text-[#0043CD] font-semibold">무료</span>
              </div>
              {multiItemDiscount > 0 && (
                <div className="flex justify-between text-[#9A2A00] font-semibold">
                  <span>다품목 동시 구매 5% 추가 할인</span>
                  <span className="tabular-nums">-{formatKRW(multiItemDiscount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-bold text-[#1B1B1B]">
                <span>총 결제 예상 금액</span>
                <span className="tabular-nums">{formatKRW(finalTotal)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full h-12 rounded-full bg-[#0043CD] text-white text-sm font-semibold hover:bg-[#1259FF] transition-colors cursor-pointer"
              >
                주문서 작성하기
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="col-span-1 h-12 rounded-full border border-gray-300 bg-white text-xs font-semibold text-[#1B1B1B] cursor-pointer"
                >
                  이전
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="col-span-2 h-12 rounded-full bg-[#0043CD] text-white text-sm font-semibold hover:bg-[#1259FF] transition-colors cursor-pointer"
                >
                  {formatKRW(finalTotal)} 결제 확정
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
