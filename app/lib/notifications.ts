import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { format, setHours, setMinutes, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSettingsStore } from '../store/settings.store';
import { useHydrationStore } from '../store/hydration.store';
import { calculateDailyGoal } from './hydrationUtils';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token); // For debugging, can be removed

  return token;
}

export async function scheduleHydrationReminder(profileId: string) {
  await Notifications.cancelAllScheduledNotificationsAsync(); // Clear existing reminders

  const settings = useSettingsStore.getState();
  const hydration = useHydrationStore.getState();
  const profile = settings.profiles[profileId];

  if (!profile || !profile.notificationEnabled) {
    console.log('Notifications not enabled for this profile.');
    return;
  }

  const dailyGoal = calculateDailyGoal(profile);
  const todayLog = hydration.logs[profileId]?.[format(new Date(), 'yyyy-MM-dd')];
  const currentHydration = todayLog?.totalMl || 0;

  if (currentHydration >= dailyGoal) {
    console.log('Daily goal already met. No reminder needed.');
    return;
  }

  const reminderTime = profile.notificationTime; // e.g., "14:30"
  const [hours, minutes] = reminderTime.split(':').map(Number);

  let notificationDate = setHours(setMinutes(new Date(), minutes), hours);

  // If the reminder time is in the past for today, schedule for tomorrow
  if (isPast(notificationDate)) {
    notificationDate = setHours(setMinutes(new Date(), minutes), hours); // Reset to today
    notificationDate.setDate(notificationDate.getDate() + 1); // Add one day
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "N'oubliez pas de boire de l'eau !",
      body: `Vous avez bu ${currentHydration}ml sur votre objectif de ${dailyGoal}ml. Continuez !`,
      data: { profileId, type: 'hydration_reminder' },
    },
    trigger: {
      channelId: 'default', // For Android
      hour: notificationDate.getHours(),
      minute: notificationDate.getMinutes(),
      repeats: true, // Repeat daily
    },
  });

  console.log(`Hydration reminder scheduled for ${format(notificationDate, 'HH:mm', { locale: fr })} daily.`);
}

export async function cancelHydrationReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('All hydration reminders cancelled.');
}
