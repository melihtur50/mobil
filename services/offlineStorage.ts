import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Tour } from './tourApi';

export interface OfflineTicket {
    id: string; // Benzersiz bilet kimliği
    tourId: string;
    tour: Tour;
    purchaseDate: string;
    qrCodeData: string; // QR kodda gizlenecek kriptolu veya baz veri
    status: 'active' | 'used' | 'cancelled';
    travelerInfo: {
        name: string;
        guests: number;
    };
}

const TICKETS_STORAGE_KEY = '@Tourkia_OfflineTickets';

export const saveTicketOffline = async (tour: Tour, travelerName: string, guests: number): Promise<OfflineTicket> => {
    try {
        const existingTicketsStr = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
        const existingTickets: OfflineTicket[] = existingTicketsStr ? JSON.parse(existingTicketsStr) : [];

        const ticketId = uuidv4();
        const purchaseDate = new Date().toISOString();

        // Gerçek bir senaryoda bu veri şifrelenmiş bir JWT ya da hash olabilir.
        // Şimdilik QR kodun okutulacağını varsayarak JSON string veriyoruz.
        const qrCodeData = JSON.stringify({
            ticketId,
            tourId: tour.id,
            timestamp: purchaseDate,
            signature: `TOURKIA-VALID-${ticketId.substring(0, 8)}`
        });

        const newTicket: OfflineTicket = {
            id: ticketId,
            tourId: tour.id,
            tour,
            purchaseDate,
            qrCodeData,
            status: 'active',
            travelerInfo: {
                name: travelerName,
                guests
            }
        };

        const updatedTickets = [...existingTickets, newTicket];
        await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets));

        return newTicket;
    } catch (error) {
        console.error("Error saving ticket offline:", error);
        throw error;
    }
};

export const getOfflineTickets = async (): Promise<OfflineTicket[]> => {
    try {
        const ticketsStr = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
        if (!ticketsStr) return [];

        return JSON.parse(ticketsStr) as OfflineTicket[];
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
