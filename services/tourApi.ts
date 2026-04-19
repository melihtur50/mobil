export interface TourAvailability {
  date: string;
  isClosed: boolean;
  capacity: number;
}

export interface TourImage {
  id: string;
  url: string;
  isStock: boolean;
}

export interface Tour {
  id: string;
  title: string;
  duration: string;
  price: number;
  rating: string;
  image: string;
  badge?: string;
  isPremiumPartner?: boolean;
  stockCount?: number;
  discountPrice?: number;
  currency?: string;
  totalReviews?: number;
  agencyName?: string;
  isVerifiedAgency?: boolean;
  tursabNo?: string;
  availabilities?: TourAvailability[];
  included?: string[];
  excluded?: string[];
  isRefundable?: boolean;
  cancellationPolicy?: string;
  gallery?: TourImage[];
  hasHotelPickup?: boolean;
  meetingPoint?: { lat: number; lng: number; address: string };
  vipPerks?: string[];
  lastBookedAt?: number;
  fomo?: string;
  loyaltyPoints?: number;
  slug?: string;
}

export interface Destination {
  id: string;
  name: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  example: string;
  price: number;
  image: string;
  badge?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  distance: number;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  priceLevel: string;
  openNow: boolean;
  image: string;
  specialDish: string;
  tourkiaDiscount: number;
}

// Simulated API Data
const MOCK_TOURS: Tour[] = [
  { id: '1', title: "Kapadokya Balon & Peri Bacaları", duration: "3 Gün, 2 Gece", price: 3000, discountPrice: 2400, currency: 'TRY', rating: "4.9", image: "https://images.unsplash.com/photo-1596395819057-afbf19aff3fb?fit=crop&w=600&q=80", badge: "TÜKENİYOR", fomo: "Şu an 14 kişi inceliyor", loyaltyPoints: 240, slug: 'kapadokya', isPremiumPartner: true, stockCount: 3, totalReviews: 128, agencyName: "Melih Tours", isVerifiedAgency: true, tursabNo: "10245",
    availabilities: [
      { date: '2026-04-18', isClosed: false, capacity: 5 },
      { date: '2026-04-19', isClosed: true, capacity: 0 },
      { date: '2026-04-20', isClosed: false, capacity: 2 },
      { date: '2026-04-21', isClosed: false, capacity: 14 }
    ],
    included: ["Otel Transferi", "Sabah Kahvaltısı", "Uçuş Sertifikası", "Şampanya"],
    excluded: ["Prof. Fotoğraf", "Öğle Yemekleri", "Kişisel Harcama"],
    isRefundable: true,
    cancellationPolicy: "24 Saate Kadar Ücretsiz İptal Garantisi",
    hasHotelPickup: true,
    meetingPoint: { lat: 38.6431, lng: 34.8289, address: 'Kapadokya Hava Balonları Kalkış Alanı' },
    gallery: [
      { id: 'img1', url: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800", isStock: false },
      { id: 'img2', url: "https://images.unsplash.com/photo-1596395819057-afbf19aff3fb?w=800", isStock: false },
      { id: 'img3', url: "https://images.unsplash.com/photo-1640191830172-e5f80b1e1026?w=800", isStock: true }
    ],
    vipPerks: ["Ücretsiz Kapadokya Kahve İkramı", "Balon Turunda Ön Sıra Garantisi", "Hızlı Check-in ve Transfer Önceliği"]
  },
  { id: '2', title: "Büyük İtalya Turu", duration: "7 Gün, 6 Gece", price: 550, currency: 'EUR', rating: "4.8", image: "https://images.unsplash.com/photo-1541432901042-2b8cbc77d2a8?fit=crop&w=600&q=80", badge: "SON 3 KOLTUK", fomo: "Son 2 saatte 5 kişi aldı", loyaltyPoints: 1815, slug: 'buyuk-italya', isPremiumPartner: false, stockCount: 15, totalReviews: 45, agencyName: "Roma Gezi", isVerifiedAgency: false,
    availabilities: [
      { date: '2026-05-01', isClosed: false, capacity: 15 },
      { date: '2026-05-08', isClosed: false, capacity: 3 }
    ],
    included: ["Uçak Bileti", "4* Oteller", "Rehberlik", "Kahvaltı"],
    excluded: ["Müze Girişleri", "Akşam Yemeği", "Vize Ücreti"],
    isRefundable: false,
    cancellationPolicy: "Son Dakika Fırsatı - İade Değişim Yapılamaz",
    hasHotelPickup: false,
    meetingPoint: { lat: 41.8902, lng: 12.4922, address: 'Kolezyum Ana Giriş Kapısı, Roma' },
    gallery: [
      { id: 'img1', url: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800", isStock: true },
      { id: 'img2', url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", isStock: false },
      { id: 'img3', url: "https://images.unsplash.com/photo-1516483638261-f40889d0b22a?w=800", isStock: false }
    ]
  },
  { id: '4', title: "Kapadokya Gün Batımı ATV Turu", duration: "2 Saat", price: 1200, discountPrice: 950, currency: 'TRY', rating: "4.8", image: "https://images.unsplash.com/photo-1596423735880-5c6fa8ebc8a5?fit=crop&w=600&q=80", badge: "POPÜLER ALTERNATİF", fomo: "Şu an 5 kişi inceliyor", slug: 'kapadokya-atv', isPremiumPartner: true, stockCount: 20, totalReviews: 89, agencyName: "Melih Tours", isVerifiedAgency: true, tursabNo: "10245",
    availabilities: [{ date: '2026-04-18', isClosed: false, capacity: 10 }, { date: '2026-04-19', isClosed: false, capacity: 5 }],
    included: ["Otel Transferi", "Kask ve Güvenlik Ekipmanı", "Profesyonel Rehber"], excluded: ["Yemek", "Kişisel Harcama"], isRefundable: true, cancellationPolicy: "24 Saate Kadar Ücretsiz İptal", hasHotelPickup: true,
    meetingPoint: { lat: 38.6431, lng: 34.8289, address: 'Göreme ATV Başlangıç Noktası' }
  },
  { id: '3', title: "İskandinav Fiyortları", duration: "5 Gün, 4 Gece", price: 25000, discountPrice: 22800, currency: 'TRY', rating: "4.7", image: "https://images.unsplash.com/photo-1528255915607-9012fda0f838?fit=crop&w=600&q=80", badge: "YENİ", fomo: "Bu hafta çok popüler", loyaltyPoints: 2280, slug: 'iskandinav-fiyort', isPremiumPartner: true, stockCount: 1, totalReviews: 0, agencyName: "Nordic Explorer", isVerifiedAgency: true, tursabNo: "88992",
    availabilities: [
      { date: '2026-06-10', isClosed: true, capacity: 0 },
      { date: '2026-06-15', isClosed: false, capacity: 1 }
    ],
    included: ["Cruise Konaklama", "Açık Büfe Yemek", "Şehir Turları"],
    excluded: ["İçecekler", "Bahşişler", "Kişisel Giderler"],
    isRefundable: true,
    cancellationPolicy: "48 Saate Kadar Ücretsiz İptal",
    hasHotelPickup: true,
    meetingPoint: { lat: 59.9139, lng: 10.7522, address: 'Oslo Merkez Limanı, P2 İskelesi' },
    gallery: [
      { id: 'img1', url: "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800", isStock: false },
      { id: 'img2', url: "https://images.unsplash.com/photo-1498616238101-7fa0f67975d0?w=800", isStock: false }
    ]
  }
];

const MOCK_DESTINATIONS: Destination[] = [
  { id: '1', name: "Türkiye", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?fit=crop&w=300&q=80" },
  { id: '2', name: "İtalya", image: "https://images.unsplash.com/photo-1516483638261-f40af5bea098?fit=crop&w=300&q=80" },
  { id: '3', name: "Japonya", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?fit=crop&w=300&q=80" },
  { id: '4', name: "Maldivler", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?fit=crop&w=300&q=80" },
];

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Cappadocia Sofra', cuisine: 'Türk Mutfağı', distance: 0.3, rating: 4.8, reviewCount: 212, address: 'Nevşehir Sok. No:5, Göreme', phone: '+905551112233', lat: 38.6431, lng: 34.8307, priceLevel: '₺₺', openNow: true, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=220&fit=crop', specialDish: 'Testi Kebabı', tourkiaDiscount: 15 },
  { id: '2', name: 'Lav Steakhouse', cuisine: 'Izgara & Et', distance: 0.7, rating: 4.6, reviewCount: 178, address: 'Merkez Cad. No:12, Ürgüp', phone: '+905554445566', lat: 38.6325, lng: 34.9147, priceLevel: '₺₺₺', openNow: true, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=220&fit=crop', specialDish: 'Kuzu Tandır', tourkiaDiscount: 10 },
  { id: '3', name: 'Panorama Café & Bistro', cuisine: 'Akdeniz & Fusion', distance: 1.2, rating: 4.5, reviewCount: 340, address: 'Balon Sok. No:3, Uçhisar', phone: '+905552223344', lat: 38.6254, lng: 34.8038, priceLevel: '₺₺', openNow: false, image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=220&fit=crop', specialDish: 'Zeytinyağlı Tabak', tourkiaDiscount: 20 },
];

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: "Kültür Avcısı", example: "Büyük İtalya Turu", price: 18150, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop", badge: "ÇOK SATAN" },
  { id: '2', name: "Balayı Turları", example: "Maldivler Rüyası", price: 39500, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600&auto=format&fit=crop", badge: "ROMANTİK" },
];

// TourkiaPuan_Engine
class PointsEngine {
  points: number = 450;
  add(amount: number) { this.points += amount; }
  burn(amount: number) { this.points = Math.max(0, this.points - amount); }
}
export const TourkiaPoints = new PointsEngine();

// Currency_Engine
export const MOCK_EXCHANGE_RATES: Record<string, number> = { 
  TRY: 1, 
  EUR: 35.5, 
  USD: 33.2, 
  GBP: 41.8,
  CNY: 4.5,
  RUB: 0.36
};

export const getDisplayPrice = (basePrice: number, baseCurrency: string, userCurrency: string = 'TRY') => {
  if (baseCurrency === userCurrency) return { amount: basePrice, currency: baseCurrency, isConverted: false };
  const inTry = basePrice * (MOCK_EXCHANGE_RATES[baseCurrency] || 1);
  const converted = inTry / (MOCK_EXCHANGE_RATES[userCurrency] || 1);
  return { amount: converted, currency: userCurrency, isConverted: true };
};

export const formatCurrency = (amount: number, currency: string, locale: string = 'en-US') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
};

export const formatPriceWithContext = (amount: number, currency: string, userLanguage: string) => {
  const mainPrice = formatCurrency(amount, currency, userLanguage === 'tr' ? 'tr-TR' : 'en-US');
  
  // Calculate TRY equivalent if not already in TRY for estimates
  const amountInTry = amount * (MOCK_EXCHANGE_RATES[currency] || 1);

  if (userLanguage === 'zh') {
    const amountInCny = amountInTry / MOCK_EXCHANGE_RATES.CNY;
    return `${mainPrice} / ~¥${Math.round(amountInCny)}`;
  }
  
  if (userLanguage === 'ru') {
    const amountInUsd = amountInTry / MOCK_EXCHANGE_RATES.USD;
    return `${mainPrice} ($${Math.round(amountInUsd)})`;
  }

  return mainPrice;
};

// Minimal Pub/Sub for Live_Pulse_Sync
type Listener = () => void;
const listeners: Set<Listener> = new Set();
export const subscribeTours = (listener: Listener) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export const notifyToursChanged = () => {
  listeners.forEach(l => l());
};

export const submitReview = (tourId: string, rating: number) => {
  const tour = MOCK_TOURS.find(t => t.id === tourId);
  if (tour) {
    const currentTotal = tour.totalReviews || 0;
    const currentRating = parseFloat(tour.rating || "0");
    const newRating = ((currentRating * currentTotal) + rating) / (currentTotal + 1);
    
    tour.totalReviews = currentTotal + 1;
    tour.rating = newRating.toFixed(1);
    notifyToursChanged(); // Triggers real-time Live_Pulse_Sync so Home Page updates social proof instantly
  }
};

export const makeQuickSale = (tourId: string, count: number, date?: string) => {
  const tour = MOCK_TOURS.find(t => t.id === tourId);
  if (tour) {
    tour.lastBookedAt = Date.now();
    if (tour.stockCount !== undefined) {
      tour.stockCount = Math.max(0, tour.stockCount - count);
    }
    if (date && tour.availabilities) {
      const day = tour.availabilities.find(a => a.date === date);
      if (day) day.capacity = Math.max(0, day.capacity - count);
    }
    notifyToursChanged();
  }
};

// Simulated API Calls
export const fetchTours = async (): Promise<Tour[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_TOURS]);
    }, 600); // simulate network delay
  });
};

export const fetchDestinations = async (): Promise<Destination[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DESTINATIONS);
    }, 400);
  });
};

export const fetchCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CATEGORIES);
    }, 500);
  });
};

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RESTAURANTS);
    }, 450);
  });
};
