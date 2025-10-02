// app/lib/sound.ts
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

let startPlayer: AudioPlayer | null = null;
let clickPlayer: AudioPlayer | null = null;
let ready = false;

export async function initAudio() {
  if (ready) return; // éviter double init
  try {
    console.log('[AUDIO] setAudioModeAsync...');
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'doNotMix',
      interruptionModeAndroid: 'doNotMix',
    });

    console.log('[AUDIO] create players...');
    startPlayer = createAudioPlayer(require('../../assets/sounds/start.mp3'));
    clickPlayer = createAudioPlayer(require('../../assets/sounds/drop.mp3'));

    ready = true;
    console.log('[AUDIO] ready = true');
  } catch (e) {
    console.log('[AUDIO] init failed:', e);
  }
}

export async function playStart() {
  try {
    if (!ready) {
      console.log('[AUDIO] playStart() called before ready — init now');
      await initAudio();
    }
    if (startPlayer) {
      startPlayer.seekTo(0);
      await startPlayer.play();
      console.log('[AUDIO] start played');
    } else {
      console.log('[AUDIO] startPlayer is null');
    }
  } catch (e) {
    console.log('[AUDIO] playStart error:', e);
  }
}

export async function playClick() {
  try {
    if (!ready) {
      console.log('[AUDIO] playClick() called before ready — init now');
      await initAudio();
    }
    if (clickPlayer) {
      clickPlayer.seekTo(0);
      await clickPlayer.play();
      console.log('[AUDIO] click played');
    } else {
      console.log('[AUDIO] clickPlayer is null');
    }
  } catch (e) {
    console.log('[AUDIO] playClick error:', e);
  }
}

export async function unloadAudio() {
  try { await startPlayer?.release(); } catch {}
  try { await clickPlayer?.release(); } catch {}
  startPlayer = null;
  clickPlayer = null;
  ready = false;
  console.log('[AUDIO] released');
}
