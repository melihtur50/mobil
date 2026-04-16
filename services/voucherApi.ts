/**
 * voucherApi.ts
 * Tourkia Voucher & Meal Redemption API Service
 *
 * PRODUCTION NOTU:
 *   BASE_URL'i gerçek backend endpoint'iniz ile değiştirin.
 *   Şu an mock delay ile simüle edilmektedir.
 */

const BASE_URL = 'https://api.tourkia.com/v1'; // TODO: .env'den al

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TourRedeemPayload {
  ticketId: string;
  tourId: string;
  signature: string;
  redeemedAt: string;
}

export interface MealRedeemPayload {
  ticketId: string;
  tourId: string;
  restaurantId: string;
  guests: number;
  signature: string;
  redeemedAt: string;
}

export interface RedeemResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  errorCode?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── API Fonksiyonları ────────────────────────────────────────────────────────

/**
 * POST /vouchers/tour-redeem
 * Tur QR okutulduğunda çağrılır. Tur operasyonu hakediş endpoint'i.
 */
export const redeemTourVoucher = async (payload: TourRedeemPayload): Promise<RedeemResult> => {
  // Production'da:
  // const res = await fetch(`${BASE_URL}/vouchers/tour-redeem`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  //   body: JSON.stringify(payload),
  // });
  // const json = await res.json();
  // return json;

  await mockDelay(800);
  console.log('[TourRedeem] Payload:', payload);

  // Simüle: imza geçerliyse başarılı
  if (payload.signature?.startsWith('TKA-TOUR-')) {
    return {
      success: true,
      message: 'Tur bileti başarıyla doğrulandı. Rehberinize gösterebilirsiniz. ✓',
      data: { endpoint: `${BASE_URL}/vouchers/tour-redeem`, ...payload },
    };
  }
  return {
    success: false,
    message: 'QR kodu geçersiz veya süresi dolmuş.',
    errorCode: 'INVALID_SIGNATURE',
  };
};

/**
 * POST /vouchers/meal-redeem
 * Restoran QR okutulduğunda çağrılır. SADECE yemek hakediş endpoint'i.
 * Tur operasyonunu etkilemez; bağımsız bir kayıt oluşturur.
 */
export const redeemMealVoucher = async (payload: MealRedeemPayload): Promise<RedeemResult> => {
  // Production'da:
  // const res = await fetch(`${BASE_URL}/vouchers/meal-redeem`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  //   body: JSON.stringify(payload),
  // });
  // const json = await res.json();
  // return json;

  await mockDelay(900);
  console.log('[MealRedeem] Payload:', payload);

  // Simüle: imza geçerliyse başarılı
  if (payload.signature?.startsWith('TKA-MEAL-')) {
    return {
      success: true,
      message: `Yemek hakediş kodu aktive edildi! ${payload.guests} kişilik Tourkia Özel Menü onaylandı. Afiyet olsun! 🍽️`,
      data: {
        endpoint: `${BASE_URL}/vouchers/meal-redeem`,
        restaurantId: payload.restaurantId,
        guests: payload.guests,
        ...payload,
      },
    };
  }
  return {
    success: false,
    message: 'Restoran kuponu geçersiz veya daha önce kullanılmış.',
    errorCode: 'MEAL_ALREADY_REDEEMED',
  };
};
