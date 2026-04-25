import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';

const POINTS_STORAGE_KEY = '@Tourkia_User_Points';
const PROMO_CODE_KEY = '@Tourkia_User_PromoCode';

/**
 * Komut 25: Referral-Gamification-Loop (Tavsiye Et, Kazan Motoru)
 */
export const ReferralService = {

    /**
     * Kullanıcıya özel promo kod üret (Eğer yoksa)
     */
    getOrCreatePromoCode: async (userName: string = 'TURIST'): Promise<string> => {
        let code = await AsyncStorage.getItem(PROMO_CODE_KEY);
        if (!code) {
            const suffix = Math.floor(10 + Math.random() * 90); // 2 haneli rastgele sayı
            code = `${userName.substring(0, 4).toUpperCase()}${suffix}`;
            await AsyncStorage.setItem(PROMO_CODE_KEY, code);
        }
        return code;
    },

    /**
     * Kullanıcının güncel Tourkia Puanlarını getir
     */
    getPoints: async (): Promise<number> => {
        const points = await AsyncStorage.getItem(POINTS_STORAGE_KEY);
        return points ? parseFloat(points) : 0;
    },

    /**
     * Puan ekle (Başarılı tavsiye sonrası)
     */
    addPoints: async (amount: number): Promise<number> => {
        const current = await ReferralService.getPoints();
        const next = current + amount;
        await AsyncStorage.setItem(POINTS_STORAGE_KEY, next.toString());
        return next;
    },

    /**
     * Sosyal medyada paylaşım başlat
     */
    shareInvite: async (promoCode: string) => {
        const message = `Hey! 👋 I'm using Tourkia to explore Cappadocia. Use my code ${promoCode} to get 5% OFF on your first Combo Package! 🎈🥂\n\nDownload here: https://tourkia.app/invite/${promoCode}`;
        try {
            await Share.share({
                message,
                title: 'Tourkia Invitation'
            });
        } catch (error) {
            console.error('Sharing failed', error);
        }
    }
};
