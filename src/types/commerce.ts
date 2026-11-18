export type RouteId = 'overview' | 'catalog' | 'pdp' | 'solutions' | 'support';

export type ProductCategory =
  | 'display-8k'
  | 'display-oled'
  | 'audio'
  | 'hub'
  | 'b2b';

export type SeriesLine =
  | 'Flagship Pro'
  | 'Standard Plus'
  | 'Essential Lite'
  | 'Commercial B2B';

export type FinishId = 'graphite' | 'silver' | 'bronze' | 'navy' | 'emerald';

export interface ProductFinish {
  id: FinishId;
  name: string;
  swatchHex: string;
  priceDelta: number;
}

export interface StorageOption {
  id: string;
  label: string;
  subtitle: string;
  priceDelta: number;
  recommended?: boolean;
}

export interface ProductSpecs {
  screenSize: string;
  panelType: string;
  resolution: string;
  aiProcessor: string;
  aiProcessorSupported: boolean;
  voiceControl: string;
  spatialAudio: string;
  ports: string;
  wireless: string;
  dimensions: string;
  weight: string;
  energyGrade: string;
  annualEnergyCost: string;
  warranty: string;
  kcCode: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  shortName: string;
  series: SeriesLine;
  category: ProductCategory;
  categoryLabel: string;
  visualType: 'display' | 'oled' | 'audio' | 'hub' | 'b2b';
  badge?: string;
  summary: string;
  originalPrice: number;
  price: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stockCount: number;
  isEcoGrade1: boolean;
  isMatterReady: boolean;
  isFastDelivery: boolean;
  isFreeInstall: boolean;
  isNoInterest24: boolean;
  isIp68: boolean;
  isAiProcessor: boolean;
  isOledOr8k: boolean;
  keyBullets: [string, string];
  quickMetricLabel: string;
  quickMetricValue: string;
  finishes: ProductFinish[];
  storageOptions: StorageOption[];
  specs: ProductSpecs;
}

export interface ReviewItem {
  id: string;
  productId: string;
  author: string;
  badge: string;
  optionText: string;
  date: string;
  rating: number;
  content: string;
  categoryTag: 'photo' | 'month' | 'design' | 'install';
  helpfulCount: number;
  isHelpful?: boolean;
}

export interface TopologyNode {
  id: string;
  role: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  statusText: string;
}

export interface ScenarioTopology {
  id: 'home' | 'office' | 'eco' | 'ai';
  tabLabel: string;
  title: string;
  nodesCountText: string;
  protocolSpec: string;
  encryptionProfile: string;
  nodes: [TopologyNode, TopologyNode, TopologyNode];
}

export interface Article {
  id: string;
  tag: string;
  title: string;
  summary: string;
  readTime: string;
  date: string;
  body: string[];
  visualType: 'display' | 'oled' | 'audio' | 'hub';
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  sku: string;
  visualType: Product['visualType'];
  finishName: string;
  finishHex: string;
  storageLabel: string;
  deliveryType: 'pro-install' | 'courier';
  unitPrice: number;
  quantity: number;
  isBundle?: boolean;
}

export interface OrderReceipt {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}
