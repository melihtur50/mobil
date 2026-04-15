export interface Tour {
  id: string;
  title: string;
  duration: string;
  price: number;
  rating: string;
  image: string;
  badge?: string;
  fomo?: string;
  loyaltyPoints?: number;
  slug: string;
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

// Simulated API Data
const MOCK_TOURS: Tour[] = [
  { id: '1', title: "Kapadokya Balon & Peri Bacaları", duration: "3 Gün, 2 Gece", price: 2400, rating: "4.9", image: "https://images.unsplash.com/photo-1596395819057-afbf19aff3fb?fit=crop&w=600&q=80", badge: "TÜKENİYOR", fomo: "Şu an 14 kişi inceliyor", loyaltyPoints: 240, slug: 'kapadokya' },
  { id: '2', title: "Büyük İtalya Turu", duration: "7 Gün, 6 Gece", price: 18150, rating: "4.8", image: "https://images.unsplash.com/photo-1541432901042-2b8cbc77d2a8?fit=crop&w=600&q=80", badge: "SON 3 KOLTUK", fomo: "Son 2 saatte 5 kişi aldı", loyaltyPoints: 1815, slug: 'buyuk-italya' },
  { id: '3', title: "İskandinav Fiyortları", duration: "5 Gün, 4 Gece", price: 22800, rating: "4.7", image: "https://images.unsplash.com/photo-1528255915607-9012fda0f838?fit=crop&w=600&q=80", badge: "YENİ", fomo: "Bu hafta çok popüler", loyaltyPoints: 2280, slug: 'iskandinav-fiyort' }
];

const MOCK_DESTINATIONS: Destination[] = [
  { id: '1', name: "Türkiye", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?fit=crop&w=300&q=80" },
  { id: '2', name: "İtalya", image: "https://images.unsplash.com/photo-1516483638261-f40af5bea098?fit=crop&w=300&q=80" },
  { id: '3', name: "Japonya", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?fit=crop&w=300&q=80" },
  { id: '4', name: "Maldivler", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?fit=crop&w=300&q=80" },
];

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: "Kültür Avcısı", example: "Büyük İtalya Turu", price: 18150, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop", badge: "ÇOK SATAN" },
  { id: '2', name: "Balayı Turları", example: "Maldivler Rüyası", price: 39500, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600&auto=format&fit=crop", badge: "ROMANTİK" },
];

// Simulated API Calls
export const fetchTours = async (): Promise<Tour[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TOURS);
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
