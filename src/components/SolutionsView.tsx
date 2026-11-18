import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Download,
  Filter,
  Leaf,
  MinusCircle,
  Network,
  Plus,
  Printer,
  Send,
  Shield,
  ShoppingCart,
  Wifi,
} from 'lucide-react';
import { PRODUCTS, SCENARIO_TOPOLOGIES } from '../data/catalog';
import { CartItem, Product, RouteId } from '../types/commerce';
import { formatKRW } from '../utils/format';
import { HardwareVisual } from './HardwareVisual';

interface SolutionsViewProps {
  onOpenProduct: (productId: string) => void;
  onAddToCart: (item: CartItem, openDrawer?: boolean) => void;
  onNavigate: (route: RouteId) => void;
  onNotify: (msg: string) => void;
}

type SpecRowKey =
  | 'screenSize'
  | 'panelType'
  | 'resolution'
  | 'aiProcessor'
  | 'voiceControl'
  | 'spatialAudio'
  | 'ports'
  | 'wireless'
  | 'dimensions'
  | 'weight'
  | 'energyGrade'
  | 'annualEnergyCost';

const SPEC_ROWS: { category: string; key: SpecRowKey; label: string }[] = [
  { category: '기본 사양', key: 'screenSize', label: '디스플레이 · 폼팩터' },
  { category: '기본 사양', key: 'panelType', label: '패널 · 하우징' },
  { category: '기본 사양', key: 'resolution', label: '해상도 규격' },
  { category: 'AI · 스마트 기능', key: 'aiProcessor', label: 'AI 프로세서' },
  { category: 'AI · 스마트 기능', key: 'voiceControl', label: '음성 인식 지원' },
  { category: 'AI · 스마트 기능', key: 'spatialAudio', label: '공간 음향 최적화' },
  { category: '연결성 · 포트', key: 'ports', label: 'HDMI / USB 포트' },
  { category: '연결성 · 포트', key: 'wireless', label: '무선 통신 규격' },
  { category: '규격 · 효율', key: 'dimensions', label: '외형 치수' },
  { category: '규격 · 효율', key: 'weight', label: '본체 순중량' },
  { category: '규격 · 효율', key: 'energyGrade', label: '에너지소비효율등급' },
  { category: '규격 · 효율', key: 'annualEnergyCost', label: '연간 예상 에너지 비용' },
];

export const SolutionsView: React.FC<SolutionsViewProps> = ({
  onOpenProduct,
  onAddToCart,
  onNotify,
}) => {
  const [scenarioId, setScenarioId] = useState<'home' | 'office' | 'eco' | 'ai'>('home');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('core');
  const [compareIds, setCompareIds] = useState<[string, string, string]>([
    'neo-chrono-x9',
    'aether-oled-s8',
    'crystal-essential-c6',
  ]);
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  // B2B Form State
  const [b2bName, setB2bName] = useState('');
  const [b2bPhone, setB2bPhone] = useState('');
  const [b2bEmail, setB2bEmail] = useState('');
  const [b2bPurpose, setB2bPurpose] = useState('office');
  const [b2bMessage, setB2bMessage] = useState('');
  const [b2bTicket, setB2bTicket] = useState<string | null>(null);

  const activeTopology = useMemo(
    () => SCENARIO_TOPOLOGIES.find((s) => s.id === scenarioId) || SCENARIO_TOPOLOGIES[0],
    [scenarioId]
  );

  const inspectedNode = useMemo(
    () => activeTopology.nodes.find((n) => n.id === selectedNodeId) || activeTopology.nodes[1],
    [activeTopology, selectedNodeId]
  );

  const comparedProducts: [Product, Product, Product] = useMemo(() => {
    const findOrFirst = (id: string, fallbackIdx: number) =>
      PRODUCTS.find((p) => p.id === id) || PRODUCTS[fallbackIdx];
    return [
      findOrFirst(compareIds[0], 0),
      findOrFirst(compareIds[1], 1),
      findOrFirst(compareIds[2], 2),
    ];
  }, [compareIds]);

  const visibleSpecRows = useMemo(() => {
    if (!onlyDifferences) return SPEC_ROWS;
    return SPEC_ROWS.filter((row) => {
      const vals = comparedProducts.map((p) => p.specs[row.key]);
      return new Set(vals).size > 1;
    });
  }, [onlyDifferences, comparedProducts]);

  const updateCompareCol = (colIndex: 0 | 1 | 2, newId: string) => {
    setCompareIds((prev) => {
      const next: [string, string, string] = [...prev] as [string, string, string];
      next[colIndex] = newId;
      return next;
    });
  };

  // Curated Bundle Products
  const bundleTv = PRODUCTS[0];
  const bundleSoundbar = PRODUCTS[3];
  const bundleHub = PRODUCTS[4];
  const bundleOriginalSum = bundleTv.price + bundleSoundbar.price + bundleHub.price;
  const bundleDiscountedPrice = 2970000;

  const handleBuyBundle = () => {
    onAddToCart(
      {
        cartItemId: 'bundle-2025-spring-trio',
        productId: bundleTv.id,
        name: '시네마틱 스마트 홈 트리오 패키지 (X9 8K + 사운드바 + 허브 v4)',
        sku: 'BUNDLE-2025-TRIO',
        visualType: 'display',
        finishName: '티타늄 그라파이트 통합',
        finishHex: '#262629',
        storageLabel: '25% 결합 할인 적용',
        deliveryType: 'pro-install',
        unitPrice: bundleDiscountedPrice,
        quantity: 1,
        isBundle: true,
      },
      true
    );
    onNotify('25% 결합 할인 패키지가 장바구니에 추가되었습니다.');
  };

  const handleDownloadSpecJson = () => {
    const content = JSON.stringify(
      {
        scenario: activeTopology.title,
        protocol: activeTopology.protocolSpec,
        encryption: activeTopology.encryptionProfile,
        nodes: activeTopology.nodes,
      },
      null,
      2
    );
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-topology-${activeTopology.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('아키텍처 토폴로지 명세 파일이 저장되었습니다.');
  };

  const handleB2BSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = `B2B-${Math.floor(100000 + Math.random() * 900000)}`;
    setB2bTicket(ticket);
    setB2bName('');
    setB2bPhone('');
    setB2bEmail('');
    setB2bMessage('');
    onNotify(`기업 상담 요청(${ticket})이 정상 접수되었습니다.`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Section 1: Hero & Scenario Selector */}
      <section className="w-full bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
          <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider">
            SOLUTIONS & ARCHITECTURE SHOWCASE
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1B1B1B] tracking-tight leading-tight">
              스마트 라이프스타일 & 엔터프라이즈 솔루션 쇼케이스
            </h1>
            <p className="text-base sm:text-lg text-[#6E6E73] mt-3 leading-relaxed">
              주거 공간과 비즈니스 환경에 맞춘 기기 연결 토폴로지를 시뮬레이션하고, 라인업별 하드웨어 사양을 한눈에 정밀 비교하세요.
            </p>
          </div>

          {/* Interactive Scenario Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {SCENARIO_TOPOLOGIES.map((sc) => {
              const active = sc.id === scenarioId;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setScenarioId(sc.id);
                    setSelectedNodeId('core');
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#1B1B1B] text-white'
                      : 'bg-[#F3F4F6] text-[#434656] hover:bg-gray-200'
                  }`}
                >
                  {sc.tabLabel}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Topology Architecture Diagram */}
      <section className="w-full bg-[#F7F7F7] border-b border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider mb-1">
                SCENARIO TOPOLOGY
              </div>
              <h2 className="text-2xl font-bold text-[#1B1B1B]">{activeTopology.title}</h2>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-medium text-[#434656]">
              <Network className="w-4 h-4 text-[#0043CD]" />
              <span>{activeTopology.nodesCountText}</span>
            </div>
          </div>

          {/* Interactive Topology Canvas */}
          <div className="relative bg-white rounded-2xl border border-gray-200 p-6 md:p-10 overflow-hidden">
            {/* Subtle Architectural Grid Background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="solGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#solGrid)" />
            </svg>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {activeTopology.nodes.map((node, index) => {
                const isSelected = node.id === inspectedNode.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-6 rounded-xl text-left flex flex-col justify-between gap-4 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#F8FAFF] border-[#0043CD] ring-1 ring-[#0043CD]'
                        : 'bg-[#F9FAFB] border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#0043CD]">
                          {index === 0 ? (
                            <Wifi className="w-5 h-5" />
                          ) : index === 1 ? (
                            <Cpu className="w-5 h-5" />
                          ) : (
                            <Network className="w-5 h-5" />
                          )}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-[#6E6E73]">
                          {node.role}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#1B1B1B]">{node.title}</h3>
                      <p className="text-xs text-[#6E6E73] mt-1.5 leading-relaxed">
                        {node.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs">
                      <span className="text-[#6E6E73] font-mono">
                        {node.metricLabel}: <strong className="text-[#1B1B1B]">{node.metricValue}</strong>
                      </span>
                      <span className="font-semibold text-[#0043CD]">{node.statusText}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Metadata & Action */}
            <div className="relative z-10 mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-[#6E6E73]">
              <div>
                <span>프로토콜: {activeTopology.protocolSpec}</span>
                <span className="mx-2">·</span>
                <span>보안: {activeTopology.encryptionProfile}</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadSpecJson}
                className="text-[#0043CD] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>아키텍처 명세 저장</span>
              </button>
            </div>
          </div>

          {/* 3 Key Solution Benefit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DCE6FF] text-[#0043CD] flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1B1B1B]">원터치 스마트 연결</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                복잡한 수동 페어링 없이 전원 인가 즉시 주변 허브에 자동 등록되는 초저지연 아키텍처를 지원합니다.
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-[#6E6E73]">페어링 소요 시간</span>
                <span className="font-bold text-[#0043CD] tabular-nums">&lt; 0.8초</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DCE6FF] text-[#0043CD] flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1B1B1B]">탄소 저감 & AI 절전</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                실시간 재실 센서 및 일조량 알고리즘과 연계해 불필요한 대기전력을 98% 차단하고 소비전력을 절감합니다.
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-[#6E6E73]">전력 소비 감축률</span>
                <span className="font-bold text-[#0043CD] tabular-nums">최대 -34.6%</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DCE6FF] text-[#0043CD] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1B1B1B]">엔드포인트 E2EE 암호화</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                하드웨어 기반 보안 볼트(Knox Vault)로 외부 침입을 격리하고 설정 백업을 무손실 분산 보관합니다.
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-xs">
                <span className="text-[#6E6E73]">보안 인증 등급</span>
                <span className="font-bold text-[#0043CD]">CC EAL6+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Multi-Product Comparison Matrix */}
      <section className="w-full bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider mb-1">
                HARDWARE COMPARISON MATRIX
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
                제품군 라인업 정밀 비교
              </h2>
              <p className="text-sm text-[#6E6E73] mt-1">
                각 열의 드롭다운에서 비교할 모델을 자유롭게 변경할 수 있습니다.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setOnlyDifferences((prev) => !prev)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  onlyDifferences
                    ? 'bg-[#0043CD] text-white'
                    : 'bg-[#F3F4F6] text-[#1B1B1B] hover:bg-gray-200'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{onlyDifferences ? '전체 사양 보기' : '차이점만 보기'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-full bg-[#F3F4F6] text-[#1B1B1B] hover:bg-gray-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>비교표 인쇄</span>
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[820px] flex flex-col gap-2">
              {/* Matrix Header Row */}
              <div className="grid grid-cols-4 gap-4 items-end pb-4">
                <div className="p-4">
                  <div className="text-xs font-semibold text-[#6E6E73]">SPEC MATRIX</div>
                  <div className="text-base font-bold text-[#1B1B1B] mt-1">세부 비교 항목</div>
                  <div className="text-xs text-[#6E6E73] mt-0.5 tabular-nums">
                    표시 항목: {visibleSpecRows.length}개
                  </div>
                </div>

                {comparedProducts.map((prod, colIdx) => (
                  <div
                    key={`${prod.id}-${colIdx}`}
                    className="bg-[#F7F7F7] border border-gray-200 rounded-2xl p-4 flex flex-col items-center text-center gap-3"
                  >
                    <select
                      value={prod.id}
                      onChange={(e) =>
                        updateCompareCol(colIdx as 0 | 1 | 2, e.target.value)
                      }
                      aria-label={`비교 모델 ${colIdx + 1} 선택`}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1B1B1B] cursor-pointer"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.shortName}
                        </option>
                      ))}
                    </select>

                    <HardwareVisual
                      type={prod.visualType}
                      finishHex={prod.finishes[0]?.swatchHex}
                      className="w-32 h-32 rounded-xl border border-gray-200"
                    />

                    <div>
                      <div className="text-[11px] font-semibold text-[#0043CD]">
                        {prod.series}
                      </div>
                      <div className="text-sm font-bold text-[#1B1B1B] mt-0.5">
                        {prod.shortName}
                      </div>
                      <div className="text-sm font-bold text-[#1B1B1B] tabular-nums mt-1">
                        {formatKRW(prod.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Spec Rows */}
              {visibleSpecRows.map((row, idx) => (
                <div
                  key={row.key}
                  className={`grid grid-cols-4 gap-4 py-3.5 px-4 rounded-xl items-center ${
                    idx % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#434656]">
                    <span className="block text-[10px] text-[#6E6E73] font-normal">
                      {row.category}
                    </span>
                    {row.label}
                  </div>
                  {comparedProducts.map((prod, colIdx) => (
                    <div
                      key={`${row.key}-${colIdx}`}
                      className="text-xs sm:text-sm text-center text-[#1B1B1B] font-medium tabular-nums"
                    >
                      {row.key === 'aiProcessor' ? (
                        <span className="inline-flex items-center gap-1">
                          {prod.specs.aiProcessorSupported ? (
                            <CheckCircle2 className="w-4 h-4 text-[#0043CD] shrink-0" />
                          ) : (
                            <MinusCircle className="w-4 h-4 text-[#6E6E73] shrink-0" />
                          )}
                          <span>{prod.specs[row.key]}</span>
                        </span>
                      ) : (
                        prod.specs[row.key]
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Matrix Action Row */}
              <div className="grid grid-cols-4 gap-4 pt-5 items-center">
                <div className="px-4 text-xs font-semibold text-[#6E6E73]">
                  선택 모델 바로 구성
                </div>
                {comparedProducts.map((prod, colIdx) => (
                  <div key={`cta-${prod.id}-${colIdx}`} className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart(
                          {
                            cartItemId: `${prod.id}-default`,
                            productId: prod.id,
                            name: prod.name,
                            sku: prod.sku,
                            visualType: prod.visualType,
                            finishName: prod.finishes[0]?.name || '기본 마감',
                            finishHex: prod.finishes[0]?.swatchHex || '#262629',
                            storageLabel: prod.storageOptions[0]?.label || '표준',
                            deliveryType: prod.isFreeInstall ? 'pro-install' : 'courier',
                            unitPrice: prod.price,
                            quantity: 1,
                          },
                          true
                        )
                      }
                      className="w-full h-11 rounded-full bg-[#0043CD] text-white text-xs font-semibold hover:bg-[#1259FF] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>구매하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenProduct(prod.id)}
                      className="w-full h-9 rounded-full bg-[#F3F4F6] text-[#1B1B1B] text-xs font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      상세 스펙 보기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 25% OFF Curated Bundle */}
      <section className="w-full bg-[#F3F4F6] py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div>
            <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider mb-1">
              RECOMMENDED BUNDLE PACKAGE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B]">
              추천 결합 패키지 · 동시 구매 25% 할인
            </h2>
            <p className="text-sm text-[#6E6E73] mt-1">
              플래그십 디스플레이와 사운드바, 스마트 허브를 한 번에 구성해 최상의 공간 동기화를 경험하세요.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4 items-center relative">
              {[bundleTv, bundleSoundbar, bundleHub].map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => onOpenProduct(item.id)}
                  className="bg-[#F7F7F7] rounded-xl p-4 flex flex-col items-center text-center gap-2 border border-gray-200/70 hover:border-[#0043CD] transition-colors cursor-pointer relative"
                >
                  {i > 0 && (
                    <span className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-gray-200 items-center justify-center text-[#1B1B1B] shadow-xs z-10">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <HardwareVisual
                    type={item.visualType}
                    finishHex={item.finishes[0]?.swatchHex}
                    className="w-24 h-24 rounded-lg"
                  />
                  <div className="text-xs font-bold text-[#1B1B1B] line-clamp-1">
                    {item.shortName}
                  </div>
                  <div className="text-xs text-[#6E6E73] tabular-nums">
                    {formatKRW(item.price)}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/3 bg-[#F7F7F7] rounded-xl p-6 border border-gray-200 flex flex-col gap-4">
              <div>
                <div className="text-xs font-semibold text-[#0043CD]">
                  동시 구매 25% 특별 할인 적용
                </div>
                <div className="flex items-baseline gap-2.5 mt-1.5">
                  <span className="text-sm text-[#6E6E73] line-through tabular-nums">
                    {formatKRW(bundleOriginalSum)}
                  </span>
                  <span className="text-3xl font-extrabold text-[#1B1B1B] tabular-nums">
                    {formatKRW(bundleDiscountedPrice)}
                  </span>
                </div>
                <div className="text-xs text-[#9A2A00] font-semibold mt-1 tabular-nums">
                  {formatKRW(bundleOriginalSum - bundleDiscountedPrice)} 결합 절감 혜택
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuyBundle}
                className="w-full h-12 rounded-full bg-[#0043CD] text-white text-sm font-semibold hover:bg-[#1259FF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>패키지 일괄 구매하기</span>
              </button>
              <div className="text-center text-xs text-[#6E6E73]">
                무료 프리미엄 전문 기사 설치 포함
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: B2B Enterprise Inquiry Form */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl border border-gray-200 bg-[#F9FAFB] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs font-semibold text-[#0043CD] uppercase tracking-wider mb-2">
                  B2B & ENTERPRISE CONSULTATION
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1B1B] leading-snug">
                  전문 엔지니어 상담 & 맞춤 견적 신청
                </h2>
                <p className="text-sm text-[#6E6E73] mt-3 leading-relaxed">
                  오피스, 호텔, 상업 매장 및 공동주택 스마트홈 단지 구축을 위한 맞춤형 인프라 설계와 대량 납품 할인을 지원합니다.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 text-sm text-[#1B1B1B] font-medium">
                <div>· 전담 엔터프라이즈 솔루션 매니저 배정</div>
                <div>· 신청 후 2영업시간 이내 1차 기술 회신</div>
                <div>· 설계 도면 보안 유지 서약(NDA) 지원</div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <form onSubmit={handleB2BSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1B1B1B]">
                    담당자 성함 / 소속 기관명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={b2bName}
                    onChange={(e) => setB2bName(e.target.value)}
                    placeholder="예: 홍길동 팀장 / (주)테크솔루션즈"
                    className="h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0043CD]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1B1B1B]">연락처 *</label>
                    <input
                      type="tel"
                      required
                      value={b2bPhone}
                      onChange={(e) => setB2bPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      className="h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0043CD]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1B1B1B]">이메일 *</label>
                    <input
                      type="email"
                      required
                      value={b2bEmail}
                      onChange={(e) => setB2bEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="h-11 px-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0043CD]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1B1B1B]">도입 목적 및 산업군 *</label>
                  <select
                    value={b2bPurpose}
                    onChange={(e) => setB2bPurpose(e.target.value)}
                    className="h-11 px-3.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#0043CD]"
                  >
                    <option value="office">오피스 & 회의실 스마트 협업 환경</option>
                    <option value="residential">신축 공동주택 및 빌라 스마트홈 단지</option>
                    <option value="hospitality">호텔 & 리조트 객실 자동화</option>
                    <option value="retail">리테일 매장 디스플레이 & 사이니지</option>
                    <option value="custom">기타 맞춤형 SI 및 특수 인프라 구축</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1B1B1B]">
                    문의 내용 및 예상 수량 *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={b2bMessage}
                    onChange={(e) => setB2bMessage(e.target.value)}
                    placeholder="구축 희망 일정, 대상 기기 수량, 특별 요구 사항을 작성해 주세요."
                    className="p-3.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0043CD] resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-[#6E6E73] cursor-pointer">
                  <input type="checkbox" required className="w-4 h-4 accent-[#0043CD]" />
                  <span>개인정보 수집 및 기업 상담 목적 이용에 동의합니다 (필수)</span>
                </label>

                <button
                  type="submit"
                  className="h-12 rounded-full bg-[#0043CD] text-white text-sm font-semibold hover:bg-[#1259FF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>전문 상담 신청하기</span>
                </button>

                {b2bTicket && (
                  <div className="p-3.5 rounded-xl bg-[#DCE6FF] text-[#0043CD] text-xs font-semibold text-center">
                    상담 신청이 정상 접수되었습니다 (접수번호: {b2bTicket}). 전담 매니저가 2영업시간 내 연락드리겠습니다.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
