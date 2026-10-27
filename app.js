/**
 * FreshPulse - Dynamic Pricing & Expiry-Based Grocery Platform
 * Lead Front-End & Algorithmic Engine Script
 */

// --- 1. Sound Synthesis Engine (Web Audio API) ---
class SoundController {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.3);
      });
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.15, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.45);
      });
    } catch (e) {}
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sounds = new SoundController();

// --- 2. Product Catalog Dataset ---
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Organic Sweet Strawberries',
    category: 'Produce',
    originalPrice: 497.17, // $5.99 * 83
    expirySecondsLeft: 4 * 3600 + 18 * 60 + 20, // ~4h 18m
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    unit: '1 lb clamshell',
    weightKg: 0.45,
    rating: 4.8,
    reviews: 142,
    organic: true,
    description: 'Fresh California sweet strawberries picked at peak ripeness. Perfect for smoothies or healthy snacks today!'
  },
  {
    id: 'prod-2',
    name: 'Artisanal Sourdough Country Loaf',
    category: 'Bakery',
    originalPrice: 539.50, // $6.50 * 83
    expirySecondsLeft: 6 * 3600 + 45 * 60 + 50, // ~6h 45m
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    stock: 5,
    unit: '750g crusty boule',
    weightKg: 0.75,
    rating: 4.9,
    reviews: 98,
    organic: false,
    description: 'Naturally fermented 36-hour sourdough with deep blistered crust and airy crumb. Baked fresh early this morning.'
  },
  {
    id: 'prod-3',
    name: 'Atlantic Salmon Fillets (2-Pack)',
    category: 'Meat & Seafood',
    originalPrice: 1327.17, // $15.99 * 83
    expirySecondsLeft: 3 * 3600 + 12 * 60 + 40, // ~3h 12m
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    stock: 4,
    unit: '12 oz (340g)',
    weightKg: 0.34,
    rating: 4.9,
    reviews: 210,
    organic: false,
    description: 'Sustainably farmed skin-on Atlantic salmon fillets rich in Omega-3. Kept continuously ice-chilled.'
  },
  {
    id: 'prod-4',
    name: '100% Grass-Fed Whole Milk',
    category: 'Dairy & Eggs',
    originalPrice: 405.87, // $4.89 * 83
    expirySecondsLeft: 13 * 3600 + 30 * 60 + 15, // ~13h 30m
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    stock: 12,
    unit: 'Half Gallon (1.89L)',
    weightKg: 1.9,
    rating: 4.7,
    reviews: 84,
    organic: true,
    description: 'Pasteurized whole milk from pasture-raised pasture cows. Creamy, nutrient-rich with natural golden tint.'
  },
  {
    id: 'prod-5',
    name: 'Ripe Hass Avocados 4-Pack',
    category: 'Produce',
    originalPrice: 455.67, // $5.49 * 83
    expirySecondsLeft: 10 * 3600 + 15 * 60 + 0, // ~10h 15m
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    stock: 14,
    unit: '4 count bag',
    weightKg: 0.8,
    rating: 4.6,
    reviews: 130,
    organic: true,
    description: 'Gently yielding to pressure, perfectly creamy inside. Ready for same-day guacamole or avocado toast.'
  },
  {
    id: 'prod-6',
    name: 'French Butter Croissants (4-Pack)',
    category: 'Bakery',
    originalPrice: 497.17, // $5.99 * 83
    expirySecondsLeft: 2 * 3600 + 55 * 60 + 30, // ~2h 55m (Urgent!)
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    stock: 6,
    unit: 'Pack of 4',
    weightKg: 0.32,
    rating: 4.9,
    reviews: 175,
    organic: false,
    description: 'Authentic 24-layer all-butter croissants. Golden flaky exterior with delicate honeycomb interior.'
  },
  {
    id: 'prod-7',
    name: 'Prime Angus Ribeye Steak',
    category: 'Meat & Seafood',
    originalPrice: 1659.17, // $19.99 * 83
    expirySecondsLeft: 8 * 3600 + 40 * 60 + 0, // ~8h 40m
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    stock: 3,
    unit: '14 oz center cut',
    weightKg: 0.4,
    rating: 4.9,
    reviews: 112,
    organic: false,
    description: 'USDA Prime marbled ribeye steak aged 21 days. Intense beef flavor that sears into steakhouse perfection.'
  },
  {
    id: 'prod-8',
    name: 'Greek Yogurt Honey & Vanilla',
    category: 'Dairy & Eggs',
    originalPrice: 480.57, // $5.79 * 83
    expirySecondsLeft: 21 * 3600 + 10 * 60 + 0, // ~21h 10m
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    stock: 9,
    unit: '32 oz tub',
    weightKg: 0.9,
    rating: 4.8,
    reviews: 94,
    organic: true,
    description: 'Triple-strained whole milk greek yogurt infused with wildflower honey and real Bourbon vanilla bean.'
  },
  {
    id: 'prod-9',
    name: 'Organic Tender Baby Spinach',
    category: 'Produce',
    originalPrice: 356.07, // $4.29 * 83
    expirySecondsLeft: 16 * 3600 + 20 * 60 + 0, // ~16h 20m
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    stock: 11,
    unit: '10 oz pre-washed',
    weightKg: 0.28,
    rating: 4.7,
    reviews: 88,
    organic: true,
    description: 'Triple-washed organic baby spinach leaves. Mild, sweet flavor, ideal for salads or quick pan wilt.'
  },
  {
    id: 'prod-10',
    name: 'Cage-Free Pasture Brown Eggs',
    category: 'Dairy & Eggs',
    originalPrice: 389.27, // $4.69 * 83
    expirySecondsLeft: 34 * 3600 + 0, // ~34h
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    unit: '1 Dozen Grade A',
    weightKg: 0.7,
    rating: 4.8,
    reviews: 160,
    organic: true,
    description: 'Rich amber yolks from hens with outdoor pasture access. Certified humane and cage-free.'
  },
  {
    id: 'prod-11',
    name: 'Wild Caught Jumbo Gulf Shrimp',
    category: 'Meat & Seafood',
    originalPrice: 1452.50, // $17.50 * 83
    expirySecondsLeft: 7 * 3600 + 15 * 60 + 0, // ~7h 15m
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    stock: 7,
    unit: '1 lb peeled & deveined (16/20)',
    weightKg: 0.45,
    rating: 4.8,
    reviews: 73,
    organic: false,
    description: 'Wild caught in the Gulf of Mexico. Clean, sweet taste with firm snap. Tail-on, ready for quick skillet sauté.'
  },
  {
    id: 'prod-12',
    name: 'Rosemary & Sea Salt Focaccia',
    category: 'Bakery',
    originalPrice: 435.75, // $5.25 * 83
    expirySecondsLeft: 5 * 3600 + 35 * 60 + 0, // ~5h 35m
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80',
    stock: 5,
    unit: '14 oz sheet',
    weightKg: 0.4,
    rating: 4.7,
    reviews: 62,
    organic: false,
    description: 'Dimpled Ligurian focaccia infused with Sicilian extra virgin olive oil, fresh garden rosemary, and Maldon flakes.'
  },
  {
    id: 'prod-13',
    name: 'San Marzano D.O.P. Whole Tomatoes',
    category: 'Pantry',
    originalPrice: 372.67, // $4.49 * 83
    expirySecondsLeft: 52 * 3600 + 0, // ~52h (cosmetic packaging dent clearance)
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    unit: '28 oz can',
    weightKg: 0.8,
    rating: 4.9,
    reviews: 310,
    organic: true,
    description: 'Certified D.O.P. volcanic soil Italian plum tomatoes in puree. Dented label clearance, factory airtight seal 100% verified.'
  },
  {
    id: 'prod-14',
    name: 'Extra Virgin Cold-Pressed Olive Oil',
    category: 'Pantry',
    originalPrice: 1410.17, // $16.99 * 83
    expirySecondsLeft: 68 * 3600 + 0, // ~68h
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    unit: '500ml dark glass bottle',
    weightKg: 0.5,
    rating: 4.9,
    reviews: 148,
    organic: true,
    description: 'Single-estate early harvest Koroneiki olives from Crete. Peppery finish with polyphenol content >420mg/kg.'
  },
  {
    id: 'prod-15',
    name: 'Aged White Cheddar Block (18 Mo)',
    category: 'Dairy & Eggs',
    originalPrice: 621.67, // $7.49 * 83
    expirySecondsLeft: 27 * 3600 + 40 * 60 + 0, // ~27h 40m
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80',
    stock: 9,
    unit: '8 oz block',
    weightKg: 0.23,
    rating: 4.8,
    reviews: 86,
    organic: false,
    description: 'Sharp Vermont artisan white cheddar aged 18 months with pleasant calcium lactate crunch crystals.'
  },
  {
    id: 'prod-16',
    name: 'Crisp Honeycrisp Apples (3 lb)',
    category: 'Produce',
    originalPrice: 580.17, // $6.99 * 83
    expirySecondsLeft: 18 * 3600 + 50 * 60 + 0, // ~18h 50m
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    stock: 10,
    unit: '3 lb bag',
    weightKg: 1.36,
    rating: 4.7,
    reviews: 95,
    organic: false,
    description: 'Washington orchard sweet Honeycrisp apples. Explosive juiciness with crisp balanced snap.'
  }
];

// --- 3. Dynamic Expiry Pricing Engine ---
class DynamicPricingEngine {
  /**
   * Calculates dynamic price and discount percentage based on remaining hours.
   * Model: Stepped exponential urgency decay curve to ensure 100% sell-through before expiry.
   */
  static calculate(originalPrice, secondsLeft) {
    const hours = Math.max(0.1, secondsLeft / 3600);
    let discountPercent = 10;

    if (hours <= 3.5) {
      // Urgent flash sale: 75% - 85% discount
      const ratio = 1 - (hours / 3.5);
      discountPercent = Math.round(75 + ratio * 10);
    } else if (hours <= 6) {
      // High urgency: 65% - 74%
      const ratio = 1 - ((hours - 3.5) / 2.5);
      discountPercent = Math.round(65 + ratio * 9);
    } else if (hours <= 12) {
      // Medium urgency: 50% - 64%
      const ratio = 1 - ((hours - 6) / 6);
      discountPercent = Math.round(50 + ratio * 14);
    } else if (hours <= 24) {
      // Day of expiry: 35% - 49%
      const ratio = 1 - ((hours - 12) / 12);
      discountPercent = Math.round(35 + ratio * 14);
    } else if (hours <= 48) {
      // Approaching shelf date: 20% - 34%
      const ratio = 1 - ((hours - 24) / 24);
      discountPercent = Math.round(20 + ratio * 14);
    } else {
      // Normal buffer discount: 10% - 19%
      const ratio = Math.max(0, 1 - ((hours - 48) / 48));
      discountPercent = Math.round(10 + ratio * 9);
    }

    // Clamp discount
    discountPercent = Math.min(85, Math.max(10, discountPercent));
    const dynamicPrice = Math.max(1.00, +(originalPrice * (1 - discountPercent / 100)).toFixed(2));
    const savings = +(originalPrice - dynamicPrice).toFixed(2);

    return {
      discountPercent,
      currentPrice: dynamicPrice,
      savings
    };
  }

  static getUrgencyLevel(secondsLeft) {
    const hours = secondsLeft / 3600;
    if (hours <= 6) return 'urgent'; // red
    if (hours <= 24) return 'amber';  // yellow/amber
    return 'normal';                 // emerald/green
  }

  static formatCountdown(seconds) {
    if (seconds <= 0) return 'EXPIRED';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const pad = (num) => String(num).padStart(2, '0');

    if (h >= 24) {
      const days = Math.floor(h / 24);
      const remH = h % 24;
      return `${days}d ${remH}h ${pad(m)}m`;
    }
    return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }
}

// --- 4. Main Application State & Manager ---
class FreshPulseApp {
  constructor() {
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.cart = [];
    this.selectedCategory = 'All';
    this.activeQuickTag = 'all';
    this.searchQuery = '';
    this.sortBy = 'discount-desc';
    this.appliedPromo = null;
    this.currentDeliveryLocation = 'Downtown Hub (15 min delivery)';
    
    // Community impact baseline ($14,890 * 83 = ₹12,35,870)
    this.communityStats = {
      mealsSaved: 3842,
      kgRescued: 1729,
      co2DivertedKg: 4322,
      totalSavedRupees: 1235870
    };

    // Calculate initial dynamic prices
    this.refreshAllDynamicPrices();
    
    // Initialize UI
    this.initElements();
    this.bindEvents();
    this.renderProducts();
    this.renderSimulator();
    this.updateCartSummary();
    this.startGlobalClock();
  }

  refreshAllDynamicPrices() {
    this.products.forEach(p => {
      const calc = DynamicPricingEngine.calculate(p.originalPrice, p.expirySecondsLeft);
      p.discountPercent = calc.discountPercent;
      p.currentPrice = calc.currentPrice;
      p.savings = calc.savings;
      p.urgency = DynamicPricingEngine.getUrgencyLevel(p.expirySecondsLeft);
    });
  }

  initElements() {
    // Dom pointers
    this.gridEl = document.getElementById('product-grid');
    this.productCountEl = document.getElementById('product-count-badge');
    this.cartBtn = document.getElementById('header-cart-btn');
    this.cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    this.closeCartBtn = document.getElementById('close-cart-btn');
    this.cartItemsList = document.getElementById('cart-items-list');
    this.cartCountBadge = document.getElementById('cart-count-badge');
    this.headerSavingsCounter = document.getElementById('header-savings-counter');
    
    // Cart totals
    this.cartSubtotalEl = document.getElementById('cart-subtotal');
    this.cartSavingsEl = document.getElementById('cart-savings');
    this.cartDeliveryEl = document.getElementById('cart-delivery');
    this.cartTotalEl = document.getElementById('cart-total');
    this.cartEcoKgEl = document.getElementById('cart-eco-kg');
    this.cartEcoCo2El = document.getElementById('cart-eco-co2');
    this.checkoutBtn = document.getElementById('checkout-btn');

    // Search & filter
    this.searchInput = document.getElementById('search-input');
    this.searchClearBtn = document.getElementById('search-clear-btn');
    this.autocompleteEl = document.getElementById('search-autocomplete');
    this.sortSelect = document.getElementById('sort-select');
    this.categoryChips = document.querySelectorAll('.category-chip');
    this.quickTags = document.querySelectorAll('.quick-tag');

    // Modals
    this.quickViewModal = document.getElementById('quickview-modal');
    this.pricingInfoModal = document.getElementById('pricing-info-modal');
    this.checkoutSuccessModal = document.getElementById('checkout-success-modal');
    this.locationModal = document.getElementById('location-modal');
    this.locationPill = document.getElementById('header-location-pill');
    this.locationDisplay = document.getElementById('location-display-text');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');

    // Simulator
    this.simSlider = document.getElementById('sim-hours-slider');
    this.simProductSelect = document.getElementById('sim-product-select');
    this.simCanvas = document.getElementById('sim-canvas');
  }

  bindEvents() {
    // Cart open/close
    this.cartBtn.addEventListener('click', () => this.toggleCart(true));
    this.closeCartBtn.addEventListener('click', () => this.toggleCart(false));
    this.cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === this.cartDrawerOverlay) this.toggleCart(false);
    });

    // Sound toggle
    this.soundToggleBtn.addEventListener('click', () => {
      const active = sounds.toggle();
      this.soundToggleBtn.innerHTML = active
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark text-red-400"></i>';
      this.showToast(active ? 'Sound effects enabled' : 'Sound muted', 'emerald');
    });

    // Location selector
    this.locationPill.addEventListener('click', () => {
      this.openModal(this.locationModal);
      sounds.playPop();
    });

    document.querySelectorAll('.location-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hub = e.currentTarget.dataset.location;
        this.currentDeliveryLocation = hub;
        this.locationDisplay.textContent = hub;
        this.closeModal(this.locationModal);
        this.showToast(`Delivery switched to: ${hub}`, 'emerald');
        sounds.playPop();
      });
    });

    // Search events
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.searchClearBtn.style.display = this.searchQuery ? 'block' : 'none';
      this.updateAutocomplete();
      this.renderProducts();
    });

    this.searchClearBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.searchQuery = '';
      this.searchClearBtn.style.display = 'none';
      this.autocompleteEl.classList.remove('active');
      this.renderProducts();
      sounds.playPop();
    });

    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.autocompleteEl.contains(e.target)) {
        this.autocompleteEl.classList.remove('active');
      }
    });

    // Category chips
    this.categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedCategory = chip.dataset.category;
        sounds.playPop();
        this.renderProducts();
      });
    });

    // Quick tags
    this.quickTags.forEach(tag => {
      tag.addEventListener('click', () => {
        this.quickTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        this.activeQuickTag = tag.dataset.tag;
        sounds.playPop();
        this.renderProducts();
      });
    });

    // Sorting
    this.sortSelect.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      sounds.playPop();
      this.renderProducts();
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) this.closeModal(modal);
      });
    });

    // Close modal on outer click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal);
      });
    });

    // Pricing info triggers
    document.querySelectorAll('.open-pricing-info-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openModal(this.pricingInfoModal);
        this.renderPricingInfoCurve();
        sounds.playPop();
      });
    });

    // Checkout trigger
    this.checkoutBtn.addEventListener('click', () => this.handleCheckout());

    // Promo code apply
    const promoBtn = document.getElementById('apply-promo-btn');
    const promoInput = document.getElementById('promo-input');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'ZEROWASTE' || code === 'ZEROWASTE10' || code === 'ZEROWASTE100' || code === 'ZEROWASTE830') {
          this.appliedPromo = { code: 'ZEROWASTE', discount: 830 };
          this.showToast('Promo code applied: ₹830.00 OFF ($10 converted at ₹83/$1)!', 'emerald');
          sounds.playChime();
        } else if (code === 'EARTH') {
          this.appliedPromo = { code: 'EARTH', freeShipping: true };
          this.showToast('Promo code applied: FREE Express Delivery!', 'emerald');
          sounds.playChime();
        } else {
          this.showToast('Invalid promo code. Try ZEROWASTE or EARTH', 'amber');
        }
        this.updateCartSummary();
      });
    }

    // Interactive Simulator controls
    if (this.simSlider && this.simProductSelect) {
      // Populate select
      this.products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name} (₹${p.originalPrice.toFixed(2)})`;
        this.simProductSelect.appendChild(opt);
      });

      this.simSlider.addEventListener('input', () => this.updateSimulatorState());
      this.simProductSelect.addEventListener('change', () => this.updateSimulatorState());
    }
  }

  // --- Real-time Countdown Timer ---
  startGlobalClock() {
    setInterval(() => {
      let needsRerender = false;

      this.products.forEach(p => {
        if (p.expirySecondsLeft > 0) {
          p.expirySecondsLeft -= 1;
        }

        // Recalculate dynamic pricing if hour threshold passed
        if (p.expirySecondsLeft % 30 === 0) {
          const calc = DynamicPricingEngine.calculate(p.originalPrice, p.expirySecondsLeft);
          if (calc.discountPercent !== p.discountPercent) {
            p.discountPercent = calc.discountPercent;
            p.currentPrice = calc.currentPrice;
            p.savings = calc.savings;
            p.urgency = DynamicPricingEngine.getUrgencyLevel(p.expirySecondsLeft);
            needsRerender = true;
          }
        }
      });

      if (needsRerender) {
        this.renderProducts();
        this.updateCartSummary();
      } else {
        // Fast DOM text update for timers without full redraw
        this.updateTimerBadgesOnly();
      }
    }, 1000);
  }

  updateTimerBadgesOnly() {
    document.querySelectorAll('.countdown-timer-span').forEach(span => {
      const prodId = span.dataset.id;
      const prod = this.products.find(p => p.id === prodId);
      if (prod) {
        span.textContent = DynamicPricingEngine.formatCountdown(prod.expirySecondsLeft);
      }
    });
  }

  // --- Search Autocomplete ---
  updateAutocomplete() {
    if (!this.searchQuery) {
      this.autocompleteEl.classList.remove('active');
      this.autocompleteEl.innerHTML = '';
      return;
    }

    const matches = this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchQuery) ||
      p.category.toLowerCase().includes(this.searchQuery)
    ).slice(0, 5);

    if (matches.length === 0) {
      this.autocompleteEl.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No matching products found. Try "Organic", "Salmon", or "Sourdough".
        </div>
      `;
      this.autocompleteEl.classList.add('active');
      return;
    }

    this.autocompleteEl.innerHTML = matches.map(p => `
      <div class="autocomplete-item" data-id="${p.id}">
        <img src="${p.image}" class="autocomplete-thumb" alt="${p.name}">
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 0.88rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${p.name}
          </div>
          <div style="font-size: 0.75rem; color: #9ca3af;">
            ${p.category} &bull; <span style="color: #34d399; font-weight: 700;">₹${p.currentPrice.toFixed(2)}</span>
            <span style="text-decoration: line-through; margin-left: 4px;">₹${p.originalPrice.toFixed(2)}</span>
          </div>
        </div>
        <span class="discount-badge" style="font-size: 0.7rem; padding: 2px 7px;">-${p.discountPercent}%</span>
      </div>
    `).join('');

    this.autocompleteEl.classList.add('active');

    // Click handler on autocomplete items
    this.autocompleteEl.querySelectorAll('.autocomplete-item').forEach(el => {
      el.addEventListener('click', () => {
        const prodId = el.dataset.id;
        const prod = this.products.find(p => p.id === prodId);
        if (prod) {
          this.openQuickView(prod);
          this.autocompleteEl.classList.remove('active');
        }
      });
    });
  }

  // --- Product Filtering & Rendering ---
  getFilteredProducts() {
    return this.products.filter(p => {
      // Category filter
      if (this.selectedCategory !== 'All' && p.category !== this.selectedCategory) {
        return false;
      }

      // Search filter
      if (this.searchQuery && !p.name.toLowerCase().includes(this.searchQuery) && !p.category.toLowerCase().includes(this.searchQuery)) {
        return false;
      }

      // Quick tags filter
      if (this.activeQuickTag === 'flash') {
        return p.expirySecondsLeft <= 6 * 3600; // < 6 hours
      } else if (this.activeQuickTag === 'under250' || this.activeQuickTag === 'under100' || this.activeQuickTag === 'under3') {
        return p.currentPrice <= 250.00;
      } else if (this.activeQuickTag === 'huge') {
        return p.discountPercent >= 50;
      } else if (this.activeQuickTag === 'organic') {
        return p.organic === true;
      }

      return true;
    }).sort((a, b) => {
      if (this.sortBy === 'discount-desc') {
        return b.discountPercent - a.discountPercent;
      } else if (this.sortBy === 'expiry-asc') {
        return a.expirySecondsLeft - b.expirySecondsLeft;
      } else if (this.sortBy === 'price-asc') {
        return a.currentPrice - b.currentPrice;
      } else if (this.sortBy === 'price-desc') {
        return b.currentPrice - a.currentPrice;
      } else if (this.sortBy === 'popular') {
        return b.reviews - a.reviews;
      } else if (this.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }

  renderProducts() {
    const list = this.getFilteredProducts();
    this.productCountEl.textContent = `${list.length} Deals`;

    if (list.length === 0) {
      this.gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 4rem 1.5rem; text-align: center; background: rgba(31, 41, 55, 0.4); border-radius: 16px; border: 1px dashed rgba(255, 255, 255, 0.1);">
          <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: #4b5563; margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">No Zero-Waste Deals Match Your Filters</h3>
          <p style="font-size: 0.9rem; color: #9ca3af; max-width: 420px; margin: 0 auto 1.5rem;">
            Try clearing your search query or selecting a different category to see other near-expiry discounted groceries.
          </p>
          <button id="reset-filters-btn" class="btn-primary" style="margin: 0 auto;">
            <i class="fa-solid fa-rotate-left"></i> Reset All Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.selectedCategory = 'All';
          this.activeQuickTag = 'all';
          this.searchQuery = '';
          this.searchInput.value = '';
          this.categoryChips.forEach(c => c.classList.toggle('active', c.dataset.category === 'All'));
          this.quickTags.forEach(t => t.classList.toggle('active', t.dataset.tag === 'all'));
          this.renderProducts();
        });
      }
      return;
    }

    this.gridEl.innerHTML = list.map(p => this.createProductCardHtml(p)).join('');

    // Attach button events on newly rendered cards
    this.gridEl.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.addToCart(id, e.currentTarget);
      });
    });

    this.gridEl.querySelectorAll('.product-clickable').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const prod = this.products.find(p => p.id === id);
        if (prod) this.openQuickView(prod);
      });
    });
  }

  createProductCardHtml(p) {
    const isUrgent = p.expirySecondsLeft <= 6 * 3600;
    const isAmber = !isUrgent && p.expirySecondsLeft <= 24 * 3600;

    const urgencyClass = isUrgent ? 'urgent' : (isAmber ? 'amber' : '');
    const clockClass = isUrgent ? 'urgent-clock' : (isAmber ? 'amber-clock' : '');
    const fillClass = isUrgent ? 'urgent' : (isAmber ? 'amber' : 'emerald');

    // Freshness percentage (100% fresh = 72h, 0% = 0h)
    const freshPercent = Math.min(100, Math.max(5, Math.round((p.expirySecondsLeft / (72 * 3600)) * 100)));

    return `
      <div class="product-card glass-card ${urgencyClass}" data-id="${p.id}">
        <!-- Image Area -->
        <div class="card-media product-clickable" data-id="${p.id}" style="cursor: pointer;">
          <img src="${p.image}" class="product-img" alt="${p.name}" loading="lazy">
          
          <div class="card-badges-overlay">
            <span class="discount-badge ${p.discountPercent >= 60 ? 'huge-deal' : ''}">
              <i class="fa-solid fa-bolt" style="font-size: 0.7rem; margin-right: 2px;"></i> -${p.discountPercent}% OFF
            </span>
            <span class="category-tag">${p.category}</span>
          </div>

          <!-- Countdown Pill -->
          <div class="countdown-pill ${clockClass}">
            <div class="timer-label">
              <span class="${isUrgent ? 'pulse-dot-crimson' : 'pulse-dot-emerald'}"></span>
              <span>${isUrgent ? 'Urgent Clearance' : 'Expires in'}</span>
            </div>
            <div class="timer-text font-mono font-bold">
              <span class="countdown-timer-span" data-id="${p.id}">
                ${DynamicPricingEngine.formatCountdown(p.expirySecondsLeft)}
              </span>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="card-content">
          <h3 class="product-title product-clickable" data-id="${p.id}">${p.name}</h3>
          <div class="product-unit">
            <span>${p.unit}</span> &bull; 
            <span style="color: #6ee7b7;"><i class="fa-solid fa-leaf" style="font-size: 0.7rem;"></i> Rescues ${(p.weightKg * 2.5).toFixed(1)}kg CO₂</span>
          </div>

          <!-- Freshness Bar -->
          <div class="freshness-meter">
            <div class="freshness-labels">
              <span>Freshness Window</span>
              <span style="font-weight: 700;">${freshPercent}% Remaining</span>
            </div>
            <div class="freshness-track">
              <div class="freshness-fill ${fillClass}" style="width: ${freshPercent}%;"></div>
            </div>
          </div>

          <!-- Price & CTA -->
          <div class="card-bottom-row">
            <div class="price-stack">
              <div class="current-price">
                ₹${p.currentPrice.toFixed(2)}
              </div>
              <div class="original-price-wrap">
                <span class="original-price">₹${p.originalPrice.toFixed(2)}</span>
                <span class="you-save-text">Save ₹${p.savings.toFixed(2)}</span>
              </div>
            </div>

            <button class="btn-add-cart" data-id="${p.id}" title="Add to Cart">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- Cart Management & Anti-Waste Calculations ---
  addToCart(productId, btnElement = null) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      if (existing.quantity >= product.stock) {
        this.showToast(`Only ${product.stock} units available in stock!`, 'amber');
        return;
      }
      existing.quantity += 1;
    } else {
      this.cart.push({
        id: productId,
        quantity: 1,
        addedPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        name: product.name,
        image: product.image,
        unit: product.unit,
        weightKg: product.weightKg
      });
    }

    sounds.playChime();
    this.showToast(`Added ${product.name} to cart!`, 'emerald');

    // Visual button feedback
    if (btnElement) {
      const origContent = btnElement.innerHTML;
      btnElement.classList.add('added-success');
      btnElement.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
      setTimeout(() => {
        btnElement.classList.remove('added-success');
        btnElement.innerHTML = origContent;
      }, 900);
    }

    this.updateCartSummary();
  }

  updateCartItemQty(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    const prod = this.products.find(p => p.id === productId);
    if (!item) return;

    if (delta > 0) {
      if (prod && item.quantity >= prod.stock) {
        this.showToast(`Max stock reached for ${item.name}`, 'amber');
        return;
      }
      item.quantity += 1;
      sounds.playPop();
    } else {
      item.quantity -= 1;
      sounds.playPop();
      if (item.quantity <= 0) {
        this.cart = this.cart.filter(i => i.id !== productId);
        this.showToast(`Removed from cart`, 'amber');
      }
    }

    this.updateCartSummary();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.id !== productId);
    sounds.playPop();
    this.showToast('Item removed', 'amber');
    this.updateCartSummary();
  }

  toggleCart(open) {
    if (open) {
      this.cartDrawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      sounds.playPop();
    } else {
      this.cartDrawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
      sounds.playPop();
    }
  }

  updateCartSummary() {
    // Re-sync current prices from live product state
    this.cart.forEach(item => {
      const prod = this.products.find(p => p.id === item.id);
      if (prod) {
        item.currentPrice = prod.currentPrice;
        item.originalPrice = prod.originalPrice;
        item.expirySecondsLeft = prod.expirySecondsLeft;
      }
    });

    const totalQty = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountBadge.textContent = totalQty;

    // Financial totals
    let originalSubtotal = 0;
    let dynamicSubtotal = 0;
    let totalWeightKg = 0;

    this.cart.forEach(item => {
      originalSubtotal += item.originalPrice * item.quantity;
      dynamicSubtotal += item.currentPrice * item.quantity;
      totalWeightKg += item.weightKg * item.quantity;
    });

    let totalSaved = originalSubtotal - dynamicSubtotal;

    // Delivery calculation ($3.99 * 83 ≈ ₹331.00, or FREE if over $25 * 83 = ₹2,075 or promo applied)
    let deliveryFee = dynamicSubtotal > 2075 || dynamicSubtotal === 0 ? 0 : 331.00;
    if (this.appliedPromo && this.appliedPromo.freeShipping) {
      deliveryFee = 0;
    }

    // Promo code deduction
    let promoDeduction = 0;
    if (this.appliedPromo && this.appliedPromo.discount) {
      promoDeduction = Math.min(dynamicSubtotal, this.appliedPromo.discount);
    }

    const finalTotal = Math.max(0, dynamicSubtotal - promoDeduction + deliveryFee);
    const co2PreventedKg = +(totalWeightKg * 2.5).toFixed(1);

    // Update Header Pill
    this.headerSavingsCounter.textContent = `₹${totalSaved.toFixed(2)}`;

    // Update Drawer Elements
    this.cartSubtotalEl.textContent = `₹${dynamicSubtotal.toFixed(2)}`;
    this.cartSavingsEl.textContent = `-₹${totalSaved.toFixed(2)}`;
    this.cartDeliveryEl.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`;
    this.cartTotalEl.textContent = `₹${finalTotal.toFixed(2)}`;

    this.cartEcoKgEl.textContent = `${totalWeightKg.toFixed(1)} kg`;
    this.cartEcoCo2El.textContent = `${co2PreventedKg} kg`;

    // Render cart items list
    if (this.cart.length === 0) {
      this.cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-basket-shopping empty-icon"></i>
          <h4 style="font-size: 1.1rem; color: #fff; font-weight: 700;">Your Cart is Empty</h4>
          <p style="font-size: 0.85rem; color: #9ca3af;">
            Explore today's near-expiry flash deals to save money and prevent food waste!
          </p>
        </div>
      `;
    } else {
      this.cartItemsList.innerHTML = this.cart.map(item => `
        <div class="cart-item-card" data-id="${item.id}">
          <img src="${item.image}" class="cart-item-thumb" alt="${item.name}">
          
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price-row">
              <span class="cart-item-cur-price">₹${(item.currentPrice * item.quantity).toFixed(2)}</span>
              <span class="cart-item-orig-price">₹${(item.originalPrice * item.quantity).toFixed(2)}</span>
            </div>
            <div class="cart-item-expiry-tag">
              <i class="fa-solid fa-clock" style="font-size: 0.65rem;"></i>
              <span>${DynamicPricingEngine.formatCountdown(item.expirySecondsLeft)}</span>
            </div>
          </div>

          <div class="cart-item-qty-controls">
            <button class="qty-btn" onclick="window.app.updateCartItemQty('${item.id}', -1)">-</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" onclick="window.app.updateCartItemQty('${item.id}', 1)">+</button>
          </div>

          <button class="cart-item-remove-btn" onclick="window.app.removeFromCart('${item.id}')" title="Remove">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `).join('');
    }
  }

  // --- Quick View Modal ---
  openQuickView(product) {
    const isUrgent = product.expirySecondsLeft <= 6 * 3600;
    const isAmber = !isUrgent && product.expirySecondsLeft <= 24 * 3600;

    const modalContent = document.getElementById('quickview-content-target');
    modalContent.innerHTML = `
      <div class="quickview-layout">
        <div>
          <img src="${product.image}" class="quickview-img" alt="${product.name}">
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="discount-badge" style="font-size: 0.85rem; padding: 4px 10px;">
              -${product.discountPercent}% OFF Dynamic Price
            </span>
            <span class="category-tag" style="font-size: 0.85rem; padding: 4px 10px;">
              ${product.category}
            </span>
            ${product.organic ? '<span class="category-tag" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.4);"><i class="fa-solid fa-leaf"></i> Certified Organic</span>' : ''}
          </div>
        </div>

        <div style="display: flex; flex-direction: column;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">
            ${product.name}
          </h2>
          <div style="font-size: 0.88rem; color: #9ca3af; margin-bottom: 1rem;">
            ${product.unit} &bull; Rating: <span style="color: #fbbf24; font-weight: 700;">★ ${product.rating}</span> (${product.reviews} reviews)
          </div>

          <p style="font-size: 0.92rem; color: #d1d5db; line-height: 1.6; margin-bottom: 1.25rem;">
            ${product.description}
          </p>

          <!-- Expiry Alert Box -->
          <div style="background: rgba(17, 24, 39, 0.85); border: 1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.3)'}; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.8rem; color: #9ca3af; text-transform: uppercase; font-weight: 600;">Time Remaining to Rescue:</span>
              <span style="font-size: 0.95rem; font-weight: 800; color: ${isUrgent ? '#ef4444' : '#34d399'}; font-family: monospace;">
                ${DynamicPricingEngine.formatCountdown(product.expirySecondsLeft)}
              </span>
            </div>
            <div style="font-size: 0.78rem; color: #9ca3af;">
              <i class="fa-solid fa-circle-info" style="color: #06b6d4;"></i> This item automatically drops in price as the shelf date approaches to ensure zero food waste.
            </div>
          </div>

          <!-- Price & Action -->
          <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
            <div>
              <div style="font-size: 2rem; font-weight: 800; color: #34d399; letter-spacing: -0.02em;">
                ₹${product.currentPrice.toFixed(2)}
              </div>
              <div style="font-size: 0.85rem; color: #6b7280;">
                Original: <span style="text-decoration: line-through;">₹${product.originalPrice.toFixed(2)}</span>
                (Save ₹${product.savings.toFixed(2)})
              </div>
            </div>

            <button class="btn-primary" id="quickview-add-btn" style="padding: 0.85rem 1.6rem;">
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('quickview-add-btn').addEventListener('click', () => {
      this.addToCart(product.id);
      this.closeModal(this.quickViewModal);
    });

    this.openModal(this.quickViewModal);
    sounds.playPop();
  }

  // --- Interactive Dynamic Pricing Simulator ---
  renderSimulator() {
    this.updateSimulatorState();
  }

  updateSimulatorState() {
    if (!this.simSlider || !this.simProductSelect || !this.simCanvas) return;

    const hours = parseFloat(this.simSlider.value);
    const prodId = this.simProductSelect.value;
    const prod = this.products.find(p => p.id === prodId) || this.products[0];

    document.getElementById('sim-slider-val').textContent = `${hours} Hours`;

    // Calculate simulated price
    const seconds = hours * 3600;
    const calc = DynamicPricingEngine.calculate(prod.originalPrice, seconds);

    document.getElementById('sim-calc-price').textContent = `₹${calc.currentPrice.toFixed(2)}`;
    document.getElementById('sim-calc-discount').textContent = `-${calc.discountPercent}% OFF`;
    document.getElementById('sim-calc-savings').textContent = `Save ₹${calc.savings.toFixed(2)}`;

    // Draw Dynamic Price Decay Curve on Canvas
    this.drawPricingCurveCanvas(this.simCanvas, hours, prod.originalPrice);
  }

  drawPricingCurveCanvas(canvas, currentHours, originalPrice) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth || 380;
    const height = canvas.height = 100;

    ctx.clearRect(0, 0, width, height);

    // Padding
    const pX = 20;
    const pY = 15;
    const graphW = width - pX * 2;
    const graphH = height - pY * 2;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = pY + (graphH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(pX, y);
      ctx.lineTo(pX + graphW, y);
      ctx.stroke();
    }

    // Generate Points from 72h down to 0h
    const points = [];
    for (let h = 72; h >= 0; h -= 2) {
      const calc = DynamicPricingEngine.calculate(originalPrice, h * 3600);
      const x = pX + graphW * (1 - (h / 72)); // 72h on left (0%), 0h on right (100%)
      const yRatio = calc.currentPrice / originalPrice; // 1.0 (top) down to 0.15 (bottom)
      const y = pY + graphH * (1 - (1 - yRatio));
      points.push({ x, y, h, price: calc.currentPrice });
    }

    // Draw curve gradient fill
    const grad = ctx.createLinearGradient(pX, 0, pX + graphW, 0);
    grad.addColorStop(0, '#10b981');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, '#ef4444');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(pX + graphW, pY + graphH);
    ctx.lineTo(pX, pY + graphH);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, pY, 0, pY + graphH);
    fillGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    fillGrad.addColorStop(1, 'rgba(239, 68, 68, 0.02)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Mark current slider position point
    const currX = pX + graphW * (1 - (currentHours / 72));
    const currCalc = DynamicPricingEngine.calculate(originalPrice, currentHours * 3600);
    const currY = pY + graphH * (1 - (1 - (currCalc.currentPrice / originalPrice)));

    // Outer glow
    ctx.beginPath();
    ctx.arc(currX, currY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(currX, currY, 4, 0, Math.PI * 2);
    ctx.fillStyle = currentHours <= 6 ? '#ef4444' : (currentHours <= 24 ? '#f59e0b' : '#10b981');
    ctx.fill();
  }

  renderPricingInfoCurve() {
    const canvas = document.getElementById('info-modal-canvas');
    if (!canvas) return;
    this.drawPricingCurveCanvas(canvas, 8, 830.00);
  }

  // --- Checkout Simulation & Confetti ---
  handleCheckout() {
    if (this.cart.length === 0) {
      this.showToast('Your cart is empty! Add items first.', 'amber');
      return;
    }

    this.toggleCart(false);
    sounds.playSuccess();

    // Calculate rescued stats for this order
    const totalWeight = this.cart.reduce((sum, item) => sum + (item.weightKg * item.quantity), 0);
    const totalSavings = this.cart.reduce((sum, item) => sum + ((item.originalPrice - item.currentPrice) * item.quantity), 0);

    // Update community stats
    this.communityStats.mealsSaved += Math.max(1, Math.round(totalWeight / 0.45));
    this.communityStats.kgRescued += Math.round(totalWeight);
    this.communityStats.co2DivertedKg += Math.round(totalWeight * 2.5);
    this.communityStats.totalSavedRupees += Math.round(totalSavings);

    document.getElementById('stat-meals').textContent = this.communityStats.mealsSaved.toLocaleString();
    document.getElementById('stat-kg').textContent = `${this.communityStats.kgRescued.toLocaleString()} kg`;
    document.getElementById('stat-co2').textContent = `${this.communityStats.co2DivertedKg.toLocaleString()} kg`;
    document.getElementById('stat-saved').textContent = `₹${this.communityStats.totalSavedRupees.toLocaleString('en-IN')}`;

    // Fill success modal
    document.getElementById('checkout-items-count').textContent = this.cart.reduce((sum, i) => sum + i.quantity, 0);
    document.getElementById('checkout-food-rescued').textContent = `${totalWeight.toFixed(1)} kg`;
    document.getElementById('checkout-savings-amount').textContent = `₹${totalSavings.toFixed(2)}`;
    document.getElementById('checkout-destination').textContent = this.currentDeliveryLocation;

    this.cart = [];
    this.updateCartSummary();
    this.openModal(this.checkoutSuccessModal);

    // Launch celebratory confetti!
    this.fireConfetti();
  }

  fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ef4444', '#06b6d4', '#ffffff'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.rotSpeed;
        p.alpha -= 0.009;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 120) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animate();
  }

  // --- Modal Helpers ---
  openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- Toast System ---
  showToast(message, type = 'emerald') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'emerald' ? 'fa-circle-check text-emerald-400' : 'fa-triangle-exclamation text-amber-400';
    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.app = new FreshPulseApp();
});
