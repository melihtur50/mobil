import { saveTicketOffline, RestaurantInfo } from './offlineStorage';
import { processCommissionSplit } from './financeService';
import { fetchTours, Tour } from './tourApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIMULATION_MODE_KEY = '@Tourkia_SimulationMode_Active';
const SIMULATION_INTERVAL_MS = 5 * 60 * 1000; // 5 Dakika

const CHINESE_NAMES = [
    'Wei Chen', 'Li Wang', 'Zhi Zhang', 'Xiao Liu', 'Yong Yang', 
    'Meiling Huang', 'Jianguo Zhao', 'Xiu Zhou', 'Fen Sun', 'Qiang Ma'
];

const MOCK_RESTAURANT: RestaurantInfo = {
    id: 'rest-1',
    name: 'Kapadokya Sultan Sofrası',
    address: 'Göreme, Kapadokya'
};

/**
 * Komut 22: Financial-Simulation-Environment (Test ve Simülasyon Zırhı)
 */
export const SimulationService = {
    
    isActive: async (): Promise<boolean> => {
        const val = await AsyncStorage.getItem(SIMULATION_MODE_KEY);
        return val === 'true';
    },

    toggleMode: async (active: boolean) => {
        await AsyncStorage.setItem(SIMULATION_MODE_KEY, active ? 'true' : 'false');
        console.log(`[Simulation] Mode toggled: ${active ? 'ACTIVE' : 'OFF'}`);
    },

    /**
     * Sanal Çinli Turist ve Kombo Paket Satın Alma Simülasyonu
     */
    generateMockPurchase: async () => {
        try {
            const tours = await fetchTours();
            // Rastgele bir tur seç (özellikle yüksek fiyatlı olanları tercih et ki komisyon hissedilsin)
            const randomTour = tours[Math.floor(Math.random() * tours.length)];
            const randomName = CHINESE_NAMES[Math.floor(Math.random() * CHINESE_NAMES.length)];
            const guests = Math.floor(Math.random() * 4) + 1; // 1-4 kişi

            console.log(`[Simulation] Generating mock purchase for ${randomName} (${guests} guests)...`);

            // 1. Çevrimdışı Bilet Oluştur (QR Üretimi Testi)
            const ticket = await saveTicketOffline(
                randomTour,
                randomName,
                guests,
                true, // Her zaman Kombo (Yemekli) Paket
                MOCK_RESTAURANT,
                'Şefin Özel Testi Kebabı Menüsü',
                new Date().toISOString(),
                new Date(Date.now() + 86400000).toISOString()
            );

            // 2. Finansal Komisyon Bölüştürme (Matematik Testi)
            const totalPaid = randomTour.price * guests;
            await processCommissionSplit(
                totalPaid,
                MOCK_RESTAURANT.id,
                randomTour.id,
                0.15 // %15 Tourkia Payı
            );

            console.log(`[Simulation] Mock Purchase Success: Ticket ${ticket.id.substring(0,8)}, Total: ₺${totalPaid}`);
            return ticket;
        } catch (error) {
            console.error('[Simulation] Error generating mock purchase:', error);
        }
    },

    /**
     * Otomatik Simülasyon Döngüsü
     */
    startAutoSimulation: (intervalMs: number = SIMULATION_INTERVAL_MS) => {
        console.log(`[Simulation] Auto-Sim started. Every ${intervalMs/1000/60} mins.`);
        const intervalId = setInterval(async () => {
            const active = await SimulationService.isActive();
            if (active) {
                await SimulationService.generateMockPurchase();
            }
        }, intervalMs);

        return () => clearInterval(intervalId);
    }
};
