import AsyncStorage from '@react-native-async-storage/async-storage';

const COFFEE_REWARD_KEY = '@Tourkia_Coffee_Reward_Claimed';
const COFFEE_QR_DATA = '@Tourkia_Coffee_QR_Data';

/**
 * Komut 26: Review-for-Coffee-Trigger (Kahveye Karşılık Yorum)
 */
export const CoffeeService = {
    
    /**
     * Kullanıcının kahve ödülünü alıp almadığını kontrol et
     */
    isClaimed: async (): Promise<boolean> => {
        const val = await AsyncStorage.getItem(COFFEE_REWARD_KEY);
        return val === 'true';
    },

    /**
     * Ödülü tanımla (Ekran görüntüsü onaylandığında)
     */
    claimReward: async () => {
        const qrData = `COFFEE-FREE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        await AsyncStorage.setItem(COFFEE_REWARD_KEY, 'true');
        await AsyncStorage.setItem(COFFEE_QR_DATA, qrData);
        return qrData;
    },

    /**
     * Mevcut QR kodunu getir
     */
    getQrCode: async (): Promise<string | null> => {
        return await AsyncStorage.getItem(COFFEE_QR_DATA);
    },

    /**
     * Havalimanı Kafeleri Listesi
     */
    getPartnerCafes: () => [
        { id: 'cafe-1', name: 'Airport Sky Coffee', location: 'Kayseri Erkilet Airport (ASR)' },
        { id: 'cafe-2', name: 'Valley Brew', location: 'Nevşehir Kapadokya Airport (NAV)' },
        { id: 'cafe-3', name: 'Gate Lounge', location: 'Istanbul Airport (IST) - International' }
    ]
};
