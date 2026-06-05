// @ts-nocheck
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { localStorage } from '../services/localStorage';
import { sessionFlags } from '../services/Sessionflags';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROTECTED_PAGES = ['/dashboard', '/activities', '/history', '/tshirt', '/activity-live', '/activities-summary', '/profile', '/detail-bpm', '/detail-imu', '/detail-transpiration', '/detail-temperature'];

const ESP32_IP = '192.168.4.1';
const ESP32_WS_PORT = 81;
const ESP32_HTTP_PORT = 80;

export interface SensorFrame {
  timestamp: number;
  bpm: number;
  imu: { x: number; y: number; z: number };
  transpiration: number;
  respiration: number;
  gps: { lat: number; lng: number; alt: number };
  steps: number;
  temperature: number;
}

export interface SavedSession {
  id: string;
  date: string;
  duration: number;
  frames: SensorFrame[];
  mode: 'simulation' | 'wifi';
  sport: string;
}

const SESSIONS_KEY = 'fabshirt_sport_sessions';

export async function loadSavedSessions(): Promise<SavedSession[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveSavedSession(session: SavedSession) {
  const all = await loadSavedSessions();
  all.unshift(session);
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(all));
}

let _simT = 0;
function resetSim() { _simT = 0; }
function genFrame(): SensorFrame {
  _simT += 1;
  const t = _simT;
  const effort = Math.min(1, t / 60);
  return {
    timestamp: Date.now(),
    bpm: Math.round(65 + effort * 85 + (Math.random() * 6 - 3)),
    imu: {
      x: parseFloat((Math.sin(t * 0.3) * (0.5 + effort * 1.5) + (Math.random() * 0.2 - 0.1)).toFixed(3)),
      y: parseFloat((Math.cos(t * 0.5) * (0.3 + effort) + (Math.random() * 0.2 - 0.1)).toFixed(3)),
      z: parseFloat((9.81 + Math.sin(t * 0.7) * 0.3 + (Math.random() * 0.1 - 0.05)).toFixed(3)),
    },
    transpiration: parseFloat((10 + effort * 85 + (Math.random() * 6 - 3)).toFixed(1)),
    respiration: parseFloat((12 + effort * 18 + (Math.random() * 2 - 1)).toFixed(1)),
    gps: {
      lat: parseFloat((48.8566 + t * 0.00005 * Math.cos(t * 0.1)).toFixed(6)),
      lng: parseFloat((2.3522 + t * 0.00005 * Math.sin(t * 0.1)).toFixed(6)),
      alt: parseFloat((35 + Math.sin(t * 0.05) * 10).toFixed(1)),
    },
    steps: Math.max(0, Math.round(t * 1.5 + (Math.random() * 2 - 1))),
    temperature: parseFloat((18 + Math.sin(t * 0.02) * 3 + (Math.random() * 0.6 - 0.3)).toFixed(1)),
  };
}

function parseESP32(raw: string): SensorFrame | null {
  try {
    const d = JSON.parse(raw);
    return {
      timestamp: Date.now(),
      bpm: Number(d.bpm),
      imu: { x: Number(d.imu?.x ?? d.imu_x ?? 0), y: Number(d.imu?.y ?? d.imu_y ?? 0), z: Number(d.imu?.z ?? d.imu_z ?? 0) },
      transpiration: Number(d.transpiration ?? d.transpi ?? 0),
      respiration: Number(d.respiration ?? d.resp ?? 0),
      gps: { lat: Number(d.gps?.lat ?? 0), lng: Number(d.gps?.lng ?? 0), alt: Number(d.gps?.alt ?? 0) },
      steps: Number(d.steps ?? 0),
      temperature: Number(d.temperature ?? d.temp ?? 0),
    };
  } catch { return null; }
}

interface SessionCtx {
  logout?: () => Promise<void>;
  sensorFrames: SensorFrame[];
  lastFrame: SensorFrame | null;
  sessionMode: 'idle' | 'simulation' | 'wifi';
  sessionStartTime: number | null;
  startSimulation: (sport?: string) => void;
  startWifi: (protocol: 'ws' | 'http', sport?: string) => void;
  stopSensorSession: () => Promise<void>;
  pauseSensorSession: () => void;
  resumeSensorSession: () => void;
  isSensorPaused: boolean;
}

const SessionContext = createContext<SessionCtx>({
  sensorFrames: [],
  lastFrame: null,
  sessionMode: 'idle',
  sessionStartTime: null,
  startSimulation: () => {},
  startWifi: () => {},
  stopSensorSession: async () => {},
  pauseSensorSession: () => {},
  resumeSensorSession: () => {},
  isSensorPaused: false,
});

export function SessionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const [requiresReauth, setRequiresReauth] = useState(false);
  const requiresReauthRef = useRef(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef([]);

  const setReauth = (val) => { requiresReauthRef.current = val; setRequiresReauth(val); };

  const [sensorFrames, setSensorFrames] = useState<SensorFrame[]>([]);
  const [lastFrame, setLastFrame] = useState<SensorFrame | null>(null);
  const [sessionMode, setSessionMode] = useState<'idle' | 'simulation' | 'wifi'>('idle');
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isSensorPaused, setIsSensorPaused] = useState(false);
  const currentSportRef = useRef('');
  const isSensorPausedRef = useRef(false);
  const framesRef = useRef<SensorFrame[]>([]);
  const simIntervalRef = useRef(null);
  const wsRef = useRef<WebSocket | null>(null);
  const httpIntervalRef = useRef(null);
  const sessionModeRef = useRef<'idle' | 'simulation' | 'wifi'>('idle');
  const sessionStartTimeRef = useRef<number | null>(null);

  const pushFrame = (frame: SensorFrame) => {
    if (isSensorPausedRef.current) return;
    framesRef.current = [...framesRef.current.slice(-1199), frame];
    setSensorFrames([...framesRef.current]);
    setLastFrame(frame);
  };

  const pauseAuthSession = async () => {
    try {
      const sj = await AsyncStorage.getItem('fabshirt_connection_session');
      if (!sj) return;
      const s = JSON.parse(sj);
      s.isSportSessionActive = true;
      await AsyncStorage.setItem('fabshirt_connection_session', JSON.stringify(s));
    } catch {}
  };

  const resumeAuthSession = async () => {
    try {
      const sj = await AsyncStorage.getItem('fabshirt_connection_session');
      if (!sj) return;
      const s = JSON.parse(sj);
      const now = new Date();
      s.isSportSessionActive = false;
      s.lastActivity = now.toISOString();
      s.expiresAt = new Date(now.getTime() + 2 * 60000).toISOString();
      await AsyncStorage.setItem('fabshirt_connection_session', JSON.stringify(s));
    } catch {}
  };

  const startSimulation = (sport = '') => {
    stopSensors();
    framesRef.current = [];
    resetSim();
    currentSportRef.current = sport;
    sessionModeRef.current = 'simulation';
    setSessionMode('simulation');
    const now = Date.now();
    sessionStartTimeRef.current = now;
    setSessionStartTime(now);
    setSensorFrames([]);
    setLastFrame(null);
    isSensorPausedRef.current = false;
    setIsSensorPaused(false);
    pauseAuthSession();
    simIntervalRef.current = setInterval(() => pushFrame(genFrame()), 500);
  };

  const startWifi = (protocol: 'ws' | 'http', sport = '') => {
    stopSensors();
    framesRef.current = [];
    currentSportRef.current = sport;
    sessionModeRef.current = 'wifi';
    setSessionMode('wifi');
    const now = Date.now();
    sessionStartTimeRef.current = now;
    setSessionStartTime(now);
    setSensorFrames([]);
    setLastFrame(null);
    isSensorPausedRef.current = false;
    setIsSensorPaused(false);
    pauseAuthSession();

    if (protocol === 'ws') {
      const ws = new WebSocket(`ws://${ESP32_IP}:${ESP32_WS_PORT}`);
      ws.onmessage = (e) => { const f = parseESP32(e.data); if (f) pushFrame(f); };
      wsRef.current = ws;
    } else {
      const url = `http://${ESP32_IP}:${ESP32_HTTP_PORT}/data`;
      httpIntervalRef.current = setInterval(async () => {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(400) });
          const t = await r.text();
          const f = parseESP32(t);
          if (f) pushFrame(f);
        } catch {}
      }, 500);
    }
  };

  const stopSensors = () => {
    if (simIntervalRef.current) { clearInterval(simIntervalRef.current); simIntervalRef.current = null; }
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    if (httpIntervalRef.current) { clearInterval(httpIntervalRef.current); httpIntervalRef.current = null; }
  };

  const pauseSensorSession = () => { isSensorPausedRef.current = true; setIsSensorPaused(true); };
  const resumeSensorSession = () => { isSensorPausedRef.current = false; setIsSensorPaused(false); };

  const stopSensorSession = async () => {
    // Capturer AVANT de vider
    const framesToSave = [...framesRef.current];
    const startTime = sessionStartTimeRef.current;
    const mode = sessionModeRef.current;
    const sport = currentSportRef.current;

    stopSensors();

    if (framesToSave.length > 0 && startTime) {
      const session: SavedSession = {
        id: 'session_' + Date.now(),
        date: new Date(startTime).toISOString(),
        duration: Math.round((Date.now() - startTime) / 1000),
        frames: framesToSave,
        mode: mode === 'simulation' ? 'simulation' : 'wifi',
        sport: sport,
      };
      await saveSavedSession(session);
    }

    framesRef.current = [];
    setSensorFrames([]);
    setLastFrame(null);
    sessionModeRef.current = 'idle';
    setSessionMode('idle');
    sessionStartTimeRef.current = null;
    setSessionStartTime(null);
    isSensorPausedRef.current = false;
    setIsSensorPaused(false);
    await resumeAuthSession();
  };

  useEffect(() => {
    sessionFlags.hasShownExpiryAlert = false;
    sessionFlags.isLoggingOut = false;
    intervalRef.current = setInterval(checkSession, 5000);
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      subscription.remove();
      stopSensors();
    };
  }, []);

  const logout = async () => {
    sessionFlags.isLoggingOut = true;
    sessionFlags.hasShownExpiryAlert = false;
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setReauth(false);
    stopSensors();
    await localStorage.logout();
    router.replace('/login');
  };

  const handleAppStateChange = async (nextState) => {
    const prev = appStateRef.current;
    appStateRef.current = nextState;
    if (!((prev === 'background' || prev === 'inactive') && nextState === 'active')) return;
    if (sessionFlags.isLoggingOut) return;
    try {
      const sj = await AsyncStorage.getItem('fabshirt_connection_session');
      if (!sj) return;
      const s = JSON.parse(sj);
      if (s.isActive) { setCodeDigits(['','','','','','']); setCodeError(''); setReauth(true); }
    } catch {}
  };

  const handleResumeValidate = async () => {
    const full = codeDigits.join('');
    if (full.length !== 6) return;
    setVerifying(true); setCodeError('');
    const ok = await localStorage.verifyResumeCode(full);
    setVerifying(false);
    if (ok) { setReauth(false); setCodeDigits(['','','','','','']); }
    else setCodeError('Code incorrect. Veuillez réessayer.');
  };

  const handleDigitChange = (value, index) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const n = [...codeDigits]; n[index] = digit; setCodeDigits(n); setCodeError('');
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleDigitKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !codeDigits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const checkSession = async () => {
    if (sessionFlags.isLoggingOut || requiresReauthRef.current) return;
    if (!PROTECTED_PAGES.some(p => pathnameRef.current.includes(p))) return;
    try {
      const { isValid, needsReauth } = await localStorage.isConnectionSessionValid();
      if (needsReauth && !sessionFlags.hasShownExpiryAlert) {
        sessionFlags.hasShownExpiryAlert = true;
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        await localStorage.logout();
        Alert.alert('Session expirée', 'Votre session a expiré. Veuillez vous reconnecter.',
          [{ text: 'OK', onPress: () => router.replace('/login') }], { cancelable: false });
      }
    } catch {}
  };

  const canValidate = codeDigits.join('').length === 6;

  return (
    <SessionContext.Provider value={{
      logout,
      sensorFrames, lastFrame, sessionMode, sessionStartTime, isSensorPaused,
      startSimulation, startWifi, stopSensorSession, pauseSensorSession, resumeSensorSession,
    }}>
      {children}
      <Modal visible={requiresReauth} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Application verrouillée</Text>
            <Text style={styles.subtitle}>Saisissez votre code de session pour continuer.</Text>
            <View style={styles.codeRow}>
              {codeDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(r) => (inputRefs.current[index] = r)}
                  style={[styles.digitInput, codeError ? styles.digitInputError : null]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleDigitChange(text, index)}
                  onKeyPress={(e) => handleDigitKeyPress(e, index)}
                  selectTextOnFocus
                />
              ))}
            </View>
            {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}
            <TouchableOpacity
              style={[styles.button, !canValidate && styles.buttonDisabled]}
              onPress={handleResumeValidate}
              disabled={!canValidate || verifying}
            >
              {verifying ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Valider</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
export const useSessionGuard = useSession;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2,0,69,0.95)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  card: { width: '100%', backgroundColor: '#08072D', borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  title: { color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  codeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  digitInput: { width: 44, height: 54, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.07)', color: 'white', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  digitInputError: { borderColor: '#FF6B81' },
  errorText: { color: '#FF6B81', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  button: { marginTop: 16, backgroundColor: '#C3295A', borderRadius: 999, paddingVertical: 14, paddingHorizontal: 48, alignItems: 'center', minWidth: 160 },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: 'white', fontSize: 15, fontWeight: '600' },
});