import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { OfflineTicket, getOfflineTickets } from './offlineStorage';

const GEOFENCING_TASK_NAME = 'GEO_RESTAURANT_TASK';

// Bildirimlerin nasıl görüneceğini ayarla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Bildirim izinlerini iste ve yapılandır
 */
export async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#008cb3',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Bildirim izni alınamadı!');
    return;
  }

  return finalStatus;
}

/**
 * Tur bitişinden 30 dakika önce restoran hatırlatması planla
 */
export async function scheduleMealReminder(ticket: OfflineTicket) {
  if (!ticket.tourEndDate) return;

  const endTime = new Date(ticket.tourEndDate).getTime();
  const triggerTime = endTime - 30 * 60 * 1000; // 30 dakika önce

  // Eğer zaman geçmişse planlama yapma
  if (triggerTime <= Date.now()) {
    console.log('Bildirim zamanı geçmiş, planlanmadı.');
    return;
  }

  const restaurantLocation = ticket.restaurantInfo?.address || (ticket.tour.meetingPoint ? `${ticket.tour.meetingPoint.lat},${ticket.tour.meetingPoint.lng}` : '');
  
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🍽️ Tourkia Lezzet Hatırlatması',
      body: 'Turun bitmek üzere! Sana en yakın Tourkia Partner restoranında masan hazır, gitmek için dokun.',
      data: { 
        url: `https://maps.google.com/?q=${encodeURIComponent(restaurantLocation)}`,
        ticketId: ticket.id
      },
      sound: true,
    },
    trigger: {
      date: new Date(triggerTime),
    },
  });

  console.log(`Bildirim planlandı: ${identifier} - Zaman: ${new Date(triggerTime).toLocaleString()}`);
  return identifier;
}

/**
 * Tüm planlanmış bildirimleri iptal et
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Geofencing (200m yakınlık bildirimi) kurulumu
 */
export async function setupRestaurantGeofencing(restaurants: any[]) {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Arka plan konum izni yok, Geo-Push aktif edilemedi.');
    return;
  }

  const regions = restaurants.map((r) => ({
    identifier: r.name,
    latitude: r.lat,
    longitude: r.lng,
    radius: 200, // 200 metre
    notifyOnEnter: true,
    notifyOnExit: false,
  }));

  try {
    await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, regions);
    console.log(`Geofencing kuruldu: ${regions.length} bölge takip ediliyor.`);
  } catch (error) {
    console.error('Geofencing başlatılamadı:', error);
  }
}

/**
 * Arka Plan Görevi Tanımlama
 */
TaskManager.defineTask(GEOFENCING_TASK_NAME, async ({ data: { eventType, region }, error }: any) => {
  if (error) {
    console.error(error.message);
    return;
  }
  
  if (eventType === Location.GeofencingEventType.Enter) {
    // Bugün aktif bir yemek rezervasyonu var mı kontrol et
    const tickets = await getOfflineTickets();
    const today = new Date().toDateString();
    const hasTodayMeal = tickets.some(t => 
      t.hasMealPackage && 
      !t.mealRedeemed && 
      new Date(t.tourStartDate || t.purchaseDate).toDateString() === today
    );

    // Eğer bugün için rezervasyon yoksa bildirim gönder
    if (!hasTodayMeal) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🍽️ Acıktın mı?',
          body: `Yanındaki ${region.identifier}'nde Tourkia üyelerine özel %15 indirimli menü seni bekliyor!`,
          data: { url: 'tourkia://lezzet' },
        },
        trigger: null, // Hemen gönder
      });
    }
  }
});

/**
 * Yemek yendikten 2 saat sonra değerlendirme bildirimi gönder
 */
export async function scheduleFeedbackNotification(restaurantName: string) {
  const triggerTime = Date.now() + 2 * 60 * 60 * 1000; // 2 saat sonra

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: '⭐️ Deneyimin nasıldı?',
      body: `${restaurantName} yemeğin nasıldı? Puanla ve 10 TourkiaPuan kazan!`,
      data: { url: 'tourkia://my-reviews' },
      sound: true,
    },
    trigger: {
      date: new Date(triggerTime),
    },
  });

  console.log(`Değerlendirme bildirimi planlandı: ${identifier}`);
  return identifier;
}

/**
 * Bildirim tıklama olaylarını dinle
 */
export function setupNotificationListeners() {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const url = response.notification.request.content.data.url;
    if (url) {
      if (url.startsWith('tourkia://')) {
        // Uygulama içi yönlendirme logic'i buraya eklenebilir
        // Şimdilik default Linking kullanıyoruz
      }
      Linking.openURL(url);
    }
  });

  return () => subscription.remove();
}
