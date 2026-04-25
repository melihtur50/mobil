import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as Localization from 'expo-localization';

const GEOFENCE_TASK_NAME = 'GEOFENCE_WELCOME_TRIGGER';

// IST, SAW, ASR, NAV Airport Coordinates (5km radius)
const TRIGGER_ZONES = [
  {
    identifier: 'IST_Airport',
    latitude: 41.2751,
    longitude: 28.7519,
    radius: 5000, // 5km
    notifyOnEnter: true,
    notifyOnExit: false,
  },
  {
    identifier: 'SAW_Airport',
    latitude: 40.8986,
    longitude: 29.3092,
    radius: 5000, // 5km
    notifyOnEnter: true,
    notifyOnExit: false,
  },
  {
    identifier: 'ASR_Airport',
    latitude: 38.7704,
    longitude: 35.4947,
    radius: 5000, // 5km
    notifyOnEnter: true,
    notifyOnExit: false,
  },
  {
    identifier: 'NAV_Airport',
    latitude: 38.7711,
    longitude: 34.5264,
    radius: 5000, // 5km
    notifyOnEnter: true,
    notifyOnExit: false,
  },
];

/**
 * Background Task Definition
 */
TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data: { eventType, region }, error }: any) => {
  if (error) {
    console.error(`[LocationGeofence] Task Error: ${error.message}`);
    return;
  }

  if (eventType === Location.GeofencingEventType.Enter) {
    console.log(`[LocationGeofence] Turist_Geldi Sinyali: ${region.identifier} bölgesine giriş yapıldı.`);
    
    // Send "Turist_Geldi" signal to the system
    try {
      await sendTouristArrivedSignal(region.identifier);
      
      // Determine message based on device language
      const { title, body } = getLocalizedWelcomeContent();
      
      // Show localized welcome notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { 
            type: 'WELCOME_TRIGGER', 
            region: region.identifier,
            url: 'tourkia://explore?type=combo' // Redirect to Combo view
          },
          sound: true,
        },
        trigger: null,
      });
    } catch (e) {
      console.error('[LocationGeofence] Sinyal gönderme hatası:', e);
    }
  }
});

/**
 * Helper to get localized content for the welcome notification
 */
function getLocalizedWelcomeContent() {
  const locales = Localization.getLocales();
  const languageCode = locales[0]?.languageCode || 'en';

  if (languageCode === 'zh') {
    return {
      title: '浪漫土耳其欢迎你！',
      body: 'VIP transferin ve akşam yemeğin Tourkia\'da hazır.',
    };
  } else if (languageCode === 'ru') {
    return {
      title: 'Добро пожаловать в Каппадокию!',
      body: 'Hemen %10 indirimli balon turunu ayırt.',
    };
  } else {
    return {
      title: 'Welcome to Turkey!',
      body: 'Your VIP Cappadocia experience starts now.',
    };
  }
}

/**
 * Sends the 'Turist_Geldi' signal to the backend/system
 */
async function sendTouristArrivedSignal(regionIdentifier: string) {
  // Logic to inform the system that a tourist has arrived in a specific zone
  // Example: fetch('https://api.melihtours.com/v1/signals/tourist-arrived', { method: 'POST', ... })
  console.log(`>>> SIGNAL SENT: Turist_Geldi (Zone: ${regionIdentifier})`);
}

/**
 * Initialize and start the geofencing service
 */
export async function initLocationGeofence() {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      console.warn('[LocationGeofence] Foreground location permission denied.');
      return;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      console.warn('[LocationGeofence] Background location permission denied.');
      return;
    }

    // Check Notification Permissions
    const { status: notificationStatus } = await Notifications.getPermissionsAsync();
    if (notificationStatus !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }

    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
    
    if (isTaskRegistered) {
      console.log(`[LocationGeofence] Task ${GEOFENCE_TASK_NAME} already registered. Refreshing regions.`);
    }

    // Start geofencing (updates if already running)
    await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, TRIGGER_ZONES);
    console.log(`[LocationGeofence] Border Spy active. Monitoring ${TRIGGER_ZONES.length} zones.`);
  } catch (error) {
    console.error('[LocationGeofence] Initialization failed:', error);
  }
}

/**
 * Stop the geofencing service
 */
export async function stopLocationGeofence() {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
    if (isRegistered) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
      console.log('[LocationGeofence] Monitoring stopped.');
    }
  } catch (error) {
    console.error('[LocationGeofence] Stop failed:', error);
  }
}
