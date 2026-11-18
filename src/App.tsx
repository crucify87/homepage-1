import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ArticleModal } from './components/ArticleModal';
import { CartDrawer } from './components/CartDrawer';
import { CatalogView } from './components/CatalogView';
import { CuratedSupportView } from './components/CuratedSupportView';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ProductDetailView } from './components/ProductDetailView';
import { SearchModal } from './components/SearchModal';
import { SolutionsView } from './components/SolutionsView';
import { INITIAL_REVIEWS, PRODUCTS } from './data/catalog';
import { Article, CartItem, Product, ReviewItem, RouteId } from './types/commerce';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<RouteId>('overview');
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [catalogCategory, setCatalogCategory] = useState<string>('all');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['neo-chrono-x9']);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0],
    [selectedProductId]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const notify = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setCartOpen(false);
        setActiveArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (route: RouteId) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setActiveRoute('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (newItem: CartItem, openDrawer = false) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === newItem.cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === newItem.cartItemId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
    if (openDrawer) {
      setCartOpen(true);
    }
  };

  const handleQuickAddProduct = (product: Product) => {
    const defaultFinish = product.finishes[0];
    const defaultStorage =
      product.storageOptions.find((s) => s.recommended) || product.storageOptions[0];
    const unitPrice =
      product.price + (defaultFinish?.priceDelta || 0) + (defaultStorage?.priceDelta || 0);

    handleAddToCart(
      {
        cartItemId: `${product.id}-${defaultFinish?.id || 'std'}-${defaultStorage?.id || 'std'}`,
        productId: product.id,
        name: product.name,
        sku: product.sku,
        visualType: product.visualType,
        finishName: defaultFinish?.name || '기본 마감',
        finishHex: defaultFinish?.swatchHex || '#262629',
        storageLabel: defaultStorage?.label || '표준',
        deliveryType: product.isFreeInstall ? 'pro-install' : 'courier',
        unitPrice,
        quantity: 1,
      },
      false
    );
    notify(`${product.shortName} 상품이 장바구니에 담겼습니다.`);
  };

  const handleUpdateQty = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      notify(exists ? '관심 상품에서 제거되었습니다.' : '관심 상품에 저장되었습니다.');
      return next;
    });
  };

  const handleAddReview = (review: ReviewItem) => {
    setReviews((prev) => [review, ...prev]);
  };

  const handleToggleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              isHelpful: !r.isHelpful,
              helpfulCount: r.isHelpful ? r.helpfulCount - 1 : r.helpfulCount + 1,
            }
          : r
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] text-[#1B1B1B]">
      <Header
        activeRoute={activeRoute}
        onNavigate={navigateTo}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        cartCount={cartCount}
      />

      <main className="flex-1 pt-16">
        {activeRoute === 'overview' && (
          <HomeView
            onNavigate={navigateTo}
            onOpenProduct={openProductDetail}
            onQuickAdd={handleQuickAddProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onOpenArticle={setActiveArticle}
            onSelectCatalogCategory={setCatalogCategory}
          />
        )}

        {activeRoute === 'catalog' && (
          <CatalogView
            selectedCategory={catalogCategory}
            onSelectCategory={setCatalogCategory}
            onOpenProduct={openProductDetail}
            onQuickAdd={handleQuickAddProduct}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={navigateTo}
          />
        )}

        {activeRoute === 'pdp' && (
          <ProductDetailView
            product={selectedProduct}
            onSelectProduct={setSelectedProductId}
            onNavigate={navigateTo}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            reviews={reviews}
            onAddReview={handleAddReview}
            onToggleHelpful={handleToggleHelpful}
            onNotify={notify}
          />
        )}

        {activeRoute === 'solutions' && (
          <SolutionsView
            onOpenProduct={openProductDetail}
            onAddToCart={handleAddToCart}
            onNavigate={navigateTo}
            onNotify={notify}
          />
        )}

        {activeRoute === 'support' && (
          <CuratedSupportView
            onOpenProduct={openProductDetail}
            onOpenArticle={setActiveArticle}
            onNavigate={navigateTo}
            onNotify={notify}
          />
        )}
      </main>

      <Footer
        onNavigate={navigateTo}
        onSelectCategory={setCatalogCategory}
      />

      {/* Global Overlays */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenProduct={openProductDetail}
        onOpenArticle={setActiveArticle}
        onNavigate={navigateTo}
      />

      <ArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        onExploreProducts={() => navigateTo('catalog')}
      />

      {/* Non-intrusive Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#1B1B1B] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-medium max-w-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
