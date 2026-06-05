// src/app/(tabs)/dashboard.tsx
// @ts-nocheck
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import { loadSavedSessions } from '../../components/SessionContext';

const BACKGROUND_BLUE = '#020045';
const ORANGE = '#F18904';
const ACTIVE_BLUE = '#0896B5';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
function fmtDur(s) {
  return Math.floor(s / 60) + 'min ' + (s % 60) + 's';
}

export default function DashboardScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const load = async () => setSessions(await loadSavedSessions());
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* BONJOUR */}
        <View style={styles.helloBlock}>
          <Text style={styles.helloText}>Bonjour !</Text>
        </View>

        {/* HISTORIQUE */}
        {sessions.length === 0 ? (
          <View style={styles.emptyHistoryCard}>
            <Text style={styles.emptyHistoryTitle}>Historique vide</Text>
            <Text style={styles.emptyHistoryText}>
              Aucune session enregistrée pour le moment.{'\n'}
              Commence ta première activité !
            </Text>
          </View>
        ) : (
          <View style={styles.historySection}>
            <Text style={styles.historyLabel}>Dernières séances</Text>
            {sessions.slice(0, 5).map(session => {
              const avgBpm = session.frames.length > 0
                ? Math.round(session.frames.reduce((a, f) => a + f.bpm, 0) / session.frames.length)
                : 0;
              const modeColor = session.mode === 'simulation' ? '#e3b341' : ACTIVE_BLUE;
              const openSession = () => {
                const frames = session.frames;
                if (!frames || frames.length === 0) { router.push('/activities-summary'); return; }
                const sample = (arr, n = 30) => {
                  const step = Math.max(1, Math.floor(arr.length / n));
                  return arr.filter((_, i) => i % step === 0).slice(0, n);
                };
                const lbls = sample(frames).map((_, i) => String(i));
                router.push({
                  pathname: '/activities-summary',
                  params: {
                    bpm:    JSON.stringify({ labels: lbls, datasets: [{ data: sample(frames.map(f => f.bpm)) }] }),
                    imu:    JSON.stringify({ labels: lbls, datasets: [{ data: sample(frames.map(f => Math.abs(f.imu.z))) }] }),
                    transpi:JSON.stringify({ labels: lbls, datasets: [{ data: sample(frames.map(f => f.transpiration)) }] }),
                    resp:   JSON.stringify({ labels: lbls, datasets: [{ data: sample(frames.map(f => f.respiration)) }] }),
                  },
                });
              };
              return (
                <TouchableOpacity key={session.id} style={styles.historyCard} onPress={openSession} activeOpacity={0.7}>
                  <View style={styles.historyCardLeft}>
                    <Text style={styles.historyDate}>{session.sport || 'Activité'}</Text>
                    <Text style={styles.historyDateSub}>{fmtDate(session.date)}</Text>
                    <View style={styles.historyStats}>
                      <Text style={styles.historyStat}>{fmtDur(session.duration)}</Text>
                      <Text style={styles.historyDot}>·</Text>
                      <Text style={[styles.historyStat, { color: '#FF4C8B' }]}>{avgBpm} BPM moy.</Text>
                    </View>
                  </View>
                  <View style={[styles.modeTag, { borderColor: modeColor }]}>
                    <Text style={[styles.modeText, { color: modeColor }]}>
                      {session.mode === 'simulation' ? 'SIM' : 'WiFi'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {sessions.length > 5 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                <Text style={styles.seeAll}>Voir tout l'historique ({sessions.length}) →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BOUTON DEMARRER → va vers l'onglet Activités */}
      <View style={styles.startWrapper}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/(tabs)/activities')}
        >
          <Text style={styles.playTriangle}>▶</Text>
          <Text style={styles.startText}>Démarrer une activité</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_BLUE },
  scroll: { paddingBottom: 20 },

  helloBlock: { paddingHorizontal: 20, marginBottom: 20, marginTop: 10 },
  helloText: { color: 'white', fontSize: 26, fontWeight: '700' },

  historySection: { paddingHorizontal: 20 },
  historyLabel: {
    color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  historyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16, padding: 14, marginBottom: 8,
  },
  historyCardLeft: { flex: 1 },
  historyDate: { color: 'white', fontSize: 14, fontWeight: '700' },
  historyDateSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4 },
  historyStats: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  historyStat: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  historyDot: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
  modeTag: { borderWidth: 0.5, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 10 },
  modeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  seeAll: { color: ACTIVE_BLUE, fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 4 },

  emptyHistoryCard: {
    marginHorizontal: 20, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed',
    paddingVertical: 40, paddingHorizontal: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyHistoryTitle: { color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  emptyHistoryText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  startWrapper: { position: 'absolute', bottom: 20, left: 26, right: 26 },
  startButton: {
    height: 90, borderRadius: 40,
    backgroundColor: '#5B3A23', borderWidth: 3, borderColor: ORANGE,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  playTriangle: { color: ORANGE, fontSize: 30, marginLeft: 4 },
  startText: { color: 'white', fontWeight: '600', fontSize: 15 },
});