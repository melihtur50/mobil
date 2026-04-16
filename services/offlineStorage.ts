import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Tour } from './tourApi';

export interface RestaurantInfo {
    id: string;
    name: string;
    address: string;
}

export interface OfflineTicket {
    id: string; // Benzersiz bilet kimliği
    tourId: string;
    tour: Tour;
    purchaseDate: string;
    /** @deprecated use tourQrData */
    qrCodeData: string;
    /** QR – Tur Operasyonu */
    tourQrData: string;
    /** QR – Restoran Kullanımı (sadece Tur+Yemek paketlerinde dolu) */
    restaurantQrData?: string;
    /** Paket türü */
    hasMealPackage: boolean;
    restaurantInfo?: RestaurantInfo;
    mealDescription?: string;
    tourEndDate?: string;
    tourStartDate?: string;
    status: 'active' | 'used' | 'cancelled';
    /** Restoran QR'ı okutuldu mu? */
    mealRedeemed: boolean;
    travelerInfo: {
        name: string;
        guests: number;
    };
}

const TICKETS_STORAGE_KEY = '@Tourkia_OfflineTickets_Vault_v2';

export const saveTicketOffline = async (
    tour: Tour,
    travelerName: string,
    guests: number,
    hasMealPackage: boolean = false,
    restaurantInfo?: RestaurantInfo,
    mealDescription?: string,
    tourStartDate?: string,
    tourEndDate?: string,
): Promise<OfflineTicket> => {
    try {
        const existingTicketsStr = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
        const existingTickets: OfflineTicket[] = existingTicketsStr ? JSON.parse(existingTicketsStr) : [];

        const ticketId = uuidv4();
        const purchaseDate = new Date().toISOString();
        const shortId = ticketId.substring(0, 8).toUpperCase();

        // Tur Operasyonu QR verisi
        const tourQrData = JSON.stringify({
            type: 'TOUR_OPERATION',
            ticketId,
            tourId: tour.id,
            tourTitle: tour.title,
            traveler: travelerName,
            guests,
            timestamp: purchaseDate,
            signature: `TKA-TOUR-${shortId}`,
        });

        // Restoran Kullanımı QR verisi (sadece Tur+Yemek paketinde)
        const restaurantQrData = hasMealPackage
            ? JSON.stringify({
                  type: 'MEAL_REDEMPTION',
                  ticketId,
                  tourId: tour.id,
                  restaurantId: restaurantInfo?.id ?? 'ANY',
                  restaurantName: restaurantInfo?.name ?? 'Anlaşmalı Restoran',
                  mealDescription: mealDescription ?? 'Tourkia Özel Menü (Fix Menü)',
                  guests,
                  timestamp: purchaseDate,
                  signature: `TKA-MEAL-${shortId}`,
              })
            : undefined;

        const newTicket: OfflineTicket = {
            id: ticketId,
            tourId: tour.id,
            tour,
            purchaseDate,
            qrCodeData: tourQrData, // geriye dönük uyumluluk
            tourQrData,
            restaurantQrData,
            hasMealPackage,
            restaurantInfo,
            mealDescription: mealDescription ?? (hasMealPackage ? 'Tourkia Özel Menü' : undefined),
            tourStartDate,
            tourEndDate,
            mealRedeemed: false,
            status: 'active',
            travelerInfo: { name: travelerName, guests },
        };

        const updatedTickets = [...existingTickets, newTicket];

        // AsyncStorage_Vault Pseudo-Encryption
        const encryptedVaultData = encodeURIComponent(JSON.stringify(updatedTickets)).replace(/%/g, 'TOURKIA_SECURE_');
        await AsyncStorage.setItem(TICKETS_STORAGE_KEY, encryptedVaultData);

        return newTicket;
    } catch (error) {
        console.error('Error saving ticket offline:', error);
        throw error;
    }
};

/** Restoran QR okutulduğunda meal-redeemed durumunu güncelle */
export const markMealRedeemed = async (ticketId: string): Promise<void> => {
    try {
        const tickets = await getOfflineTickets();
        const updated = tickets.map((t) =>
            t.id === ticketId ? { ...t, mealRedeemed: true } : t
        );
        const encrypted = encodeURIComponent(JSON.stringify(updated)).replace(/%/g, 'TOURKIA_SECURE_');
        await AsyncStorage.setItem(TICKETS_STORAGE_KEY, encrypted);
    } catch (error) {
        console.error('Error marking meal redeemed:', error);
    }
};

export const getOfflineTickets = async (): Promise<OfflineTicket[]> => {
    try {
        const vaultData = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
        if (!vaultData) return [];

        // Try to decrypt vault data
        try {
            const dec = decodeURIComponent(vaultData.replace(/TOURKIA_SECURE_/g, '%'));
            return JSON.parse(dec) as OfflineTicket[];
        } catch {
            return JSON.parse(vaultData) as OfflineTicket[];
        }
    } catch (error) {
        console.error("Error fetching offline tickets:", error);
        return [];
    }
};

export const clearOfflineTickets = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(TICKETS_STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing offline tickets:", error);
    }
};
