import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Navbar } from '@/components/custom/Navbar';
import { Footer } from '@/components/custom/Footer';
import { CartDrawer } from '@/components/custom/CartDrawer';
import { Home } from '@/pages/Home';
import { Menu } from '@/pages/Menu';
import { Checkout } from '@/pages/Checkout';
import { OrderSuccess } from '@/pages/OrderSuccess';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminMenu } from '@/pages/AdminMenu';
import { AdminCategories } from '@/pages/AdminCategories';
import { AdminSlider } from '@/pages/AdminSlider';
import { AdminCoupons } from '@/pages/AdminCoupons';
import { AdminSettings } from '@/pages/AdminSettings';
import { useCartStore } from '@/stores/cartStore';
import { useAdminStore } from '@/stores/adminStore';
import type { MenuItem, OrderLog } from '@/types';

// Protected Route Component
function ProtectedRoute({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: React.ReactNode;
}) {
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  return <>{children}</>;
}

function App() {
  // Cart Store
  const {
    cartItems,
    appliedCoupon,
    couponError,
    couponSuccess,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemCount,
    getSubtotal,
    getDiscountAmount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  // Admin Store
  const {
    categories,
    menuItems,
    slides,
    coupons,
    settings,
    orders,
    isAuthenticated,
    isLoading,
    login,
    logout,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    saveCategories,
    addSlide,
    updateSlide,
    deleteSlide,
    saveSlides,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    saveCoupons,
    saveSettings,
    addOrder,
  } = useAdminStore();

  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderLog | null>(null);

  // Initialize sample data if empty
  useEffect(() => {
    if (menuItems.length === 0 && categories.length > 0) {
      // Add sample menu items
      const sampleItems = [
        {
          name: 'Classic Cheese Burger',
          description: 'Juicy beef patty with melted cheddar, fresh lettuce, tomato & special sauce',
          image: '/assets/food/burger-classic.jpg',
          categoryId: categories[0]?.id || '1',
          mrp: 249,
          sellingPrice: 199,
          showDiscount: true,
          inStock: true,
          isBestSeller: true,
          active: true,
        },
        {
          name: 'Crispy Chicken Burger',
          description: 'Golden fried chicken with spicy mayo, pickles & coleslaw',
          image: '/assets/food/burger-chicken.jpg',
          categoryId: categories[0]?.id || '1',
          mrp: 279,
          sellingPrice: 229,
          showDiscount: true,
          inStock: true,
          isBestSeller: true,
          active: true,
        },
        {
          name: 'Veggie Delight Burger',
          description: 'Grilled veggie patty with avocado, lettuce, tomato & herb mayo',
          image: '/assets/food/burger-veggie.jpg',
          categoryId: categories[0]?.id || '1',
          mrp: 199,
          sellingPrice: 169,
          showDiscount: true,
          inStock: true,
          isBestSeller: false,
          active: true,
        },
        {
          name: 'Classic Fries',
          description: 'Crispy golden fries sprinkled with sea salt',
          image: '/assets/food/fries-classic.jpg',
          categoryId: categories[1]?.id || '2',
          mrp: 129,
          sellingPrice: 99,
          showDiscount: true,
          inStock: true,
          isBestSeller: false,
          active: true,
        },
        {
          name: 'Loaded Cheese Fries',
          description: 'Fries topped with melted cheese, bacon bits & green onions',
          image: '/assets/food/fries-loaded.jpg',
          categoryId: categories[1]?.id || '2',
          mrp: 199,
          sellingPrice: 159,
          showDiscount: true,
          inStock: true,
          isBestSeller: true,
          active: true,
        },
        {
          name: 'Pepperoni Pizza',
          description: 'Classic pizza with pepperoni, mozzarella & tomato sauce',
          image: '/assets/food/pizza-pepperoni.jpg',
          categoryId: categories[2]?.id || '3',
          mrp: 399,
          sellingPrice: 349,
          showDiscount: true,
          inStock: true,
          isBestSeller: true,
          active: true,
        },
        {
          name: 'Margherita Pizza',
          description: 'Fresh mozzarella, tomato sauce & basil on crispy crust',
          image: '/assets/food/pizza-margherita.jpg',
          categoryId: categories[2]?.id || '3',
          mrp: 299,
          sellingPrice: 249,
          showDiscount: true,
          inStock: true,
          isBestSeller: false,
          active: true,
        },
        {
          name: 'Cold Cola',
          description: 'Refreshing chilled cola with ice',
          image: '/assets/food/drink-cola.jpg',
          categoryId: categories[3]?.id || '4',
          mrp: 79,
          sellingPrice: 59,
          showDiscount: true,
          inStock: true,
          isBestSeller: false,
          active: true,
        },
        {
          name: 'Strawberry Milkshake',
          description: 'Creamy milkshake with fresh strawberry flavor',
          image: '/assets/food/drink-milkshake.jpg',
          categoryId: categories[3]?.id || '4',
          mrp: 149,
          sellingPrice: 119,
          showDiscount: true,
          inStock: true,
          isBestSeller: true,
          active: true,
        },
        {
          name: 'Burger Combo Meal',
          description: 'Double cheeseburger + fries + drink - Perfect meal deal!',
          image: '/assets/food/combo-meal.jpg',
          categoryId: categories[4]?.id || '5',
          mrp: 499,
          sellingPrice: 399,
          showDiscount: true,
          inStock: true,
          isBestSeller: true,
          active: true,
        },
      ];

      sampleItems.forEach((item) => addMenuItem(item as Omit<MenuItem, 'id' | 'discountPercent'>));
    }

    // Add sample slides if empty
    if (slides.length === 0 && menuItems.length > 0) {
      const sampleSlides = [
        {
          image: '/assets/food/slider-1.jpg',
          title: 'Double Cheese Perfection',
          offerText: 'FLAT 20% OFF',
          linkedItemId: menuItems[0]?.id,
          active: true,
          order: 1,
        },
        {
          image: '/assets/food/slider-2.jpg',
          title: 'Crispy Fried Chicken',
          offerText: 'BUY 1 GET 1',
          linkedItemId: menuItems[1]?.id,
          active: true,
          order: 2,
        },
        {
          image: '/assets/food/slider-3.jpg',
          title: 'The Ultimate Burger',
          offerText: 'COMBO DEAL',
          linkedItemId: menuItems[menuItems.length - 1]?.id,
          active: true,
          order: 3,
        },
      ];

      sampleSlides.forEach((slide) => addSlide(slide));
    }

    // Add sample coupon if empty
    if (coupons.length === 0) {
      const sampleCoupon = {
        code: 'BURGO20',
        type: 'percentage' as const,
        value: 20,
        minOrder: 199,
        maxCap: 100,
        validFrom: new Date().toISOString(),
        validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: undefined,
        active: true,
        applicableTo: 'all' as const,
      };
      addCoupon(sampleCoupon);
    }
  }, [categories.length, menuItems.length, slides.length, coupons.length]);

  // Handle coupon apply
  const handleApplyCoupon = (code: string) => {
    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
    );
    if (coupon) {
      const subtotal = getSubtotal();
      applyCoupon(coupon, subtotal);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  // Handle place order
  const handlePlaceOrder = (orderData: {
    name: string;
    phone: string;
    address: string;
    deliveryType: 'delivery' | 'takeaway';
  }) => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount(subtotal);
    
    let deliveryFee = 0;
    if (orderData.deliveryType === 'delivery' && settings.deliveryFee.enabled) {
      const isFreeDelivery =
        settings.deliveryFee.freeDeliveryEnabled &&
        subtotal >= settings.deliveryFee.freeDeliveryAbove;
      if (!isFreeDelivery) {
        deliveryFee = settings.deliveryFee.amount;
      }
    }

    const grandTotal = subtotal - discount + deliveryFee;

    // Create order log
    const order = addOrder({
      customerName: orderData.name,
      customerPhone: orderData.phone,
      address: orderData.address,
      deliveryType: orderData.deliveryType,
      items: cartItems,
      subtotal,
      couponDiscount: discount,
      deliveryFee,
      grandTotal,
      couponCode: appliedCoupon?.code,
    });

    // Increment coupon usage
    if (appliedCoupon) {
      const couponIndex = coupons.findIndex((c) => c.id === appliedCoupon.id);
      if (couponIndex !== -1) {
        const updatedCoupons = [...coupons];
        updatedCoupons[couponIndex] = {
          ...updatedCoupons[couponIndex],
          usageCount: updatedCoupons[couponIndex].usageCount + 1,
        };
        saveCoupons(updatedCoupons);
      }
    }

    // Build WhatsApp message
    const message = buildWhatsAppMessage({
      ...orderData,
      items: cartItems,
      subtotal,
      couponDiscount: discount,
      deliveryFee,
      grandTotal,
      couponCode: appliedCoupon?.code,
    });

    // Clear cart and save order
    setLastOrder(order);
    
    // Open WhatsApp
    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );

    // Clear cart
    // Note: We don't clear cart immediately to allow success page to show
  };

  // Build WhatsApp message
  const buildWhatsAppMessage = (data: {
    name: string;
    phone: string;
    address: string;
    deliveryType: 'delivery' | 'takeaway';
    items: { item: MenuItem; quantity: number }[];
    subtotal: number;
    couponDiscount: number;
    deliveryFee: number;
    grandTotal: number;
    couponCode?: string;
  }) => {
    const lines = [
      '🍔 *BURGO ORDER* 🍔',
      '',
      '👤 *Customer Details*',
      `Name: ${data.name}`,
      `Phone: +91 ${data.phone}`,
      `Type: ${data.deliveryType === 'delivery' ? 'Delivery' : 'Takeaway'}`,
      '',
    ];

    if (data.deliveryType === 'delivery') {
      lines.push('📍 *Delivery Address*', data.address, '');
    }

    lines.push('🛒 *Order Items*');
    data.items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.item.name} x${item.quantity} - ₹${
          item.item.sellingPrice * item.quantity
        }`
      );
    });

    lines.push(
      '',
      '💰 *Bill Summary*',
      `Subtotal: ₹${data.subtotal}`
    );

    if (data.couponDiscount > 0) {
      lines.push(`Coupon Discount (${data.couponCode}): -₹${data.couponDiscount}`);
    }

    if (data.deliveryFee > 0) {
      lines.push(`Delivery Fee: ₹${data.deliveryFee}`);
    }

    lines.push(
      '',
      `*Grand Total: ₹${data.grandTotal}*`,
      '',
      `📅 ${new Date().toLocaleString('en-IN')}`,
      '',
      'Thank you for choosing BURGO! 🙏'
    );

    return lines.join('\n');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0074E4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar
                cartCount={getItemCount()}
                onCartClick={() => setIsCartOpen(true)}
                settings={settings}
              />
              <Home
                categories={categories}
                menuItems={menuItems}
                slides={slides}
                settings={settings}
                cartItems={cartItems}
                onAddToCart={addToCart}
                onUpdateQuantity={updateQuantity}
              />
              <Footer settings={settings} />
              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                appliedCoupon={appliedCoupon}
                couponError={couponError}
                couponSuccess={couponSuccess}
                settings={settings}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={removeCoupon}
              />
            </>
          }
        />
        <Route
          path="/menu"
          element={
            <>
              <Navbar
                cartCount={getItemCount()}
                onCartClick={() => setIsCartOpen(true)}
                settings={settings}
              />
              <Menu
                categories={categories}
                menuItems={menuItems}
                cartItems={cartItems}
                onAddToCart={addToCart}
                onUpdateQuantity={updateQuantity}
              />
              <Footer settings={settings} />
              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                appliedCoupon={appliedCoupon}
                couponError={couponError}
                couponSuccess={couponSuccess}
                settings={settings}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={removeCoupon}
              />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <Navbar
                cartCount={getItemCount()}
                onCartClick={() => setIsCartOpen(true)}
                settings={settings}
              />
              <Checkout
                cartItems={cartItems}
                couponDiscount={getDiscountAmount(getSubtotal())}
                settings={settings}
                onPlaceOrder={handlePlaceOrder}
              />
              <Footer settings={settings} />
              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                appliedCoupon={appliedCoupon}
                couponError={couponError}
                couponSuccess={couponSuccess}
                settings={settings}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={removeCoupon}
              />
            </>
          }
        />
        <Route
          path="/order-success"
          element={
            <>
              <Navbar
                cartCount={getItemCount()}
                onCartClick={() => setIsCartOpen(true)}
                settings={settings}
              />
              <OrderSuccess lastOrder={lastOrder} />
              <Footer settings={settings} />
            </>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin onLogin={login} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard
                categories={categories}
                menuItems={menuItems}
                orders={orders}
                coupons={coupons}
                slides={slides}
                onLogout={logout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminMenu
                categories={categories}
                menuItems={menuItems}
                onAddItem={addMenuItem}
                onUpdateItem={updateMenuItem}
                onDeleteItem={deleteMenuItem}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminCategories
                categories={categories}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
                onReorder={saveCategories}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/slider"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminSlider
                slides={slides}
                menuItems={menuItems}
                onAddSlide={addSlide}
                onUpdateSlide={updateSlide}
                onDeleteSlide={deleteSlide}
                onReorder={saveSlides}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminCoupons
                coupons={coupons}
                categories={categories}
                menuItems={menuItems}
                onAddCoupon={addCoupon}
                onUpdateCoupon={updateCoupon}
                onDeleteCoupon={deleteCoupon}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminSettings settings={settings} onSaveSettings={saveSettings} />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
