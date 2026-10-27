# FreshPulse — Online Grocery Platform with Dynamic Pricing & Expiry-Based Discounts

> **Zero-Waste Dynamic Market**: An interactive, responsive, single-page web application featuring an AI-driven dynamic pricing engine that slashes grocery prices as shelf expiration approaches to eliminate food waste while maximizing consumer savings.

---

## 🌟 Key Features

### 1. ⚡ Dynamic Expiry-Based Discount Engine
- **Stepped & Exponential Decay Algorithm**: Automatically clears stock before expiration.
  - `< 6 Hours`: **70% – 85% Flash Clearance** (Urgent status with pulsating neon red badges).
  - `6 – 12 Hours`: **50% – 65% High Urgency**.
  - `12 – 24 Hours`: **35% – 50% Approaching Shelf Date**.
  - `24 – 48 Hours`: **20% – 35% Smart Saver**.
  - `> 48 Hours`: **10% – 20% Fresh Arrival**.
- **Real-Time Ticking Countdown Clocks**: Synchronized second-by-second countdown on all product cards (`hh:mm:ss`), triggering price drops when hour thresholds cross.
- **Dynamic Price Display**: Original price strikethrough (₹1,327.17) vs. live dynamic price (₹331.79) with instant savings readout ("Save ₹995.38").
- **Visual Freshness Gauge**: Multi-color progress bar showing remaining percentage of shelf-life window.

### 2. 🛒 Interactive Cart & Anti-Waste Eco-Tracker
- **Slide-In Drawer with Glassmorphism**: Translucent backdrop with live item counter.
- **Live Eco-Savings & Carbon Offset Meter**:
  - Calculates kilograms of food waste diverted.
  - Computes `CO₂e` emissions prevented (based on standard EPA multiplier of 2.5 kg CO₂e per kg of rescued food).
  - Tracks community meals rescued.
- **Dynamic Delivery Fee Calculator**: Free express delivery for orders over ₹2,075 (or with coupon `EARTH`).
- **Interactive Promo Codes**:
  - `ZEROWASTE`: Deducts ₹830.00 ($10 converted at ₹83/$1) from dynamic subtotal.
  - `EARTH`: Unlocks 100% free climate-neutral express delivery.
- **Celebration Checkout**: Triggers celebratory canvas confetti animation with itemized impact confirmation modal.

### 3. 🔍 Real-Time Search, Filter & Smart Sorting
- **Instant Search with Auto-Suggestions**: Type-ahead search filtering by product name and category with instant thumbnail suggestions.
- **Category Filter Tabs**: *All Groceries*, *Produce*, *Bakery*, *Dairy & Eggs*, *Meat & Seafood*, *Pantry*.
- **Quick Tag Filters**:
  - `🔥 Flash Deals (<6h)`
  - `⚡ 50%+ OFF`
  - `🏷️ Under ₹250`
  - `🌿 Organic Only`
- **Smart Sorting**: Highest Discount %, Nearest Expiry Date (Urgent First), Lowest Price, Highest Price, Most Popular.

### 4. 📊 Interactive Visual Analytics & Pricing Simulator
- **Interactive Time Slider**: Drag slider from 0.5h to 72h to see how prices drop on any selected grocery product.
- **HTML5 Canvas Pricing Curve**: Real-time visualization of the price decay curve with live tracking point showing current discount tier.
- **"How Dynamic Pricing Works" Modal**: Complete mathematical breakdown and retail sustainability data.

### 5. 🎨 Design & Aesthetic System
- **Theme**: Premium Dark Mode with sleek obsidian palette (`#0B0F17`, `#111827`, `#1A2234`).
- **Glassmorphism**: Semi-transparent slate glass panels (`backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08)`).
- **Color Accents**:
  - Electric Emerald Green (`#10B981`)
  - Neon Amber (`#F59E0B`)
  - Flash Crimson (`#EF4444`)
  - Crisp White (`#F9FAFB`)
- **Sound Effects (Web Audio API)**: Built-in synthesized micro-sounds for add-to-cart chime, quantity pops, and checkout fanfare (with one-click mute/unmute toggle in header).

---

## 🚀 How to Run Locally

### Option 1: Python HTTP Server (Recommended)
```bash
# In the project directory:
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).

### Option 2: Direct File Open
You can also directly double-click `index.html` to open it in any modern browser.

---

## 📁 Project Structure

```
OOAD CAPSTONE/
├── index.html        # Main single-page application structure & semantic layout
├── styles.css        # Bespoke CSS design tokens, glassmorphism, animations & typography
├── app.js            # Dynamic pricing engine, countdown loop, cart state, canvas curve
└── README.md         # Documentation & user guide
```

---

## 🧪 Dummy Product Catalog

16 curated grocery products are included with realistic images and decay parameters:
1. **Organic Sweet Strawberries** (Produce) — 1 lb clamshell (~4h left, 65% OFF)
2. **Artisanal Sourdough Country Loaf** (Bakery) — 750g crusty boule (~6h left, 60% OFF)
3. **Atlantic Salmon Fillets (2-Pack)** (Meat & Seafood) — 12 oz skin-on (~3h left, 75% OFF)
4. **100% Grass-Fed Whole Milk** (Dairy & Eggs) — Half Gallon (~13h left, 45% OFF)
5. **Ripe Hass Avocados 4-Pack** (Produce) — 4 count bag (~10h left, 55% OFF)
6. **French Butter Croissants (4-Pack)** (Bakery) — Pack of 4 (~2h left, 85% Flash Sale)
7. **Prime Angus Ribeye Steak** (Meat & Seafood) — 14 oz center cut (~8h left, 55% OFF)
8. **Greek Yogurt Honey & Vanilla** (Dairy & Eggs) — 32 oz tub (~21h left, 35% OFF)
9. **Organic Tender Baby Spinach** (Produce) — 10 oz pre-washed (~16h left, 40% OFF)
10. **Cage-Free Pasture Brown Eggs** (Dairy & Eggs) — 1 Dozen Grade A (~34h left, 30% OFF)
11. **Wild Caught Jumbo Gulf Shrimp** (Meat & Seafood) — 1 lb tail-on (~7h left, 60% OFF)
12. **Rosemary & Sea Salt Focaccia** (Bakery) — 14 oz sheet (~5h left, 65% OFF)
13. **San Marzano D.O.P. Whole Tomatoes** (Pantry) — 28 oz can dent clearance (~52h left, 35% OFF)
14. **Extra Virgin Cold-Pressed Olive Oil** (Pantry) — 500ml estate bottle (~68h left, 40% OFF)
15. **Aged White Cheddar Block** (Dairy & Eggs) — 8 oz block aged 18 mo (~27h left, 35% OFF)
16. **Crisp Honeycrisp Apples** (Produce) — 3 lb bag (~18h left, 45% OFF)
