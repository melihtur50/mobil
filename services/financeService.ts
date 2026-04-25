import AsyncStorage from '@react-native-async-storage/async-storage';

const LEDGER_STORAGE_KEY = '@Tourkia_Finance_Ledger';

export interface FinanceEntry {
    id: string;
    date: string;
    totalAmount: number;
    tourkiaCommission: number;
    merchantAmount: number;
    merchantId: string;
    tourId: string;
    status: 'pending' | 'completed';
}

/**
 * Komut 20: Auto-Commission-Splitter (Akıllı Komisyon Motoru)
 * Ödeme başarılı olduğunda parayı paydaşlar arasında böler ve deftere kaydeder.
 */
export const processCommissionSplit = async (
    totalAmount: number,
    merchantId: string,
    tourId: string,
    commissionRate: number = 0.15 // Varsayılan %15 Tourkia Komisyonu
) => {
    try {
        const tourkiaCommission = totalAmount * commissionRate;
        const merchantAmount = totalAmount - tourkiaCommission;

        const newEntry: FinanceEntry = {
            id: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString(),
            totalAmount,
            tourkiaCommission,
            merchantAmount,
            merchantId,
            tourId,
            status: 'pending' // İşletme bakiyesi 'Bekleyen' olarak başlar
        };

        // Mevcut defteri çek
        const existingLedgerStr = await AsyncStorage.getItem(LEDGER_STORAGE_KEY);
        const ledger: FinanceEntry[] = existingLedgerStr ? JSON.parse(existingLedgerStr) : [];

        // Yeni işlemi ekle
        ledger.push(newEntry);

        // Defteri kaydet (AsyncStorage_Vault)
        await AsyncStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));

        console.log(`[Finance] Commission Split Processed: Tourkia ${tourkiaCommission} TL, Merchant ${merchantAmount} TL`);
        return newEntry;
    } catch (error) {
        console.error('[Finance] Error processing commission split:', error);
        throw error;
    }
};

/**
 * İşletmenin toplam bekleyen bakiyesini getirir
 */
export const getMerchantBalance = async (merchantId: string) => {
    try {
        const ledgerStr = await AsyncStorage.getItem(LEDGER_STORAGE_KEY);
        if (!ledgerStr) return 0;
        const ledger: FinanceEntry[] = JSON.parse(ledgerStr);
        
        return ledger
            .filter(entry => entry.merchantId === merchantId && entry.status === 'pending')
            .reduce((sum, entry) => sum + entry.merchantAmount, 0);
    } catch (error) {
        console.error('[Finance] Error fetching merchant balance:', error);
        return 0;
    }
};

/**
 * Komut 23: God-Mode-Dashboard (Global Analitik Verileri)
 */
export const getGlobalStats = async () => {
    try {
        const ledgerStr = await AsyncStorage.getItem(LEDGER_STORAGE_KEY);
        if (!ledgerStr) return { todayNetProfit: 0, todayComboTotal: 0 };
        const ledger: FinanceEntry[] = JSON.parse(ledgerStr);
        
        const today = new Date().toISOString().split('T')[0];
        
        const todayEntries = ledger.filter(entry => entry.date.startsWith(today));
        
        const todayNetProfit = todayEntries.reduce((sum, entry) => sum + entry.tourkiaCommission, 0);
        const todayComboTotal = todayEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
        
        return { todayNetProfit, todayComboTotal, totalEntries: ledger.length };
    } catch (error) {
        console.error('[Finance] Error fetching global stats:', error);
        return { todayNetProfit: 0, todayComboTotal: 0 };
    }
};

export const getDailyRevenueData = async () => {
    try {
        const ledgerStr = await AsyncStorage.getItem(LEDGER_STORAGE_KEY);
        if (!ledgerStr) return [];
        const ledger: FinanceEntry[] = JSON.parse(ledgerStr);
        
        // Son 7 günün verisini grupla
        const stats: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            stats[dateStr] = 0;
        }

        ledger.forEach(entry => {
            const dateStr = entry.date.split('T')[0];
            if (stats[dateStr] !== undefined) {
                stats[dateStr] += entry.totalAmount;
            }
        });

        return Object.entries(stats).map(([date, amount]) => ({ date, amount }));
    } catch (error) {
        return [];
    }
};
