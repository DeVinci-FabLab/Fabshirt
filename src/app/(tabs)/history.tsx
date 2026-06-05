// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import { loadSavedSessions, SavedSession } from '../../components/SessionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const BACKGROUND_BLUE = '#020045';
const CARD_PINK = '#C3295A';
const ACTIVE_BLUE = '#0896B5';
const ORANGE = '#F18904';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtDur(s) {
  return Math.floor(s / 60) + 'min ' + (s % 60) + 's';
}

export default function HistoryScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    setSessions(await loadSavedSessions());
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleDeleteAll = () => {
    Alert.alert('Tout supprimer', 'Supprimer toutes les séances ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Tout supprimer', style: 'destructive', onPress: async () => {
        await AsyncStorage.setItem('fabshirt_sport_sessions', JSON.stringify([]));
        refresh();
      }},
    ]);
  };

  const handleDelete = (id) => {
    Alert.alert('Supprimer', 'Supprimer cette séance ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        const all = await loadSavedSessions();
        const filtered = all.filter(s => s.id !== id);
        await AsyncStorage.setItem('fabshirt_sport_sessions', JSON.stringify(filtered));
        refresh();
      }},
    ]);
  };

  const openSession = (session) => {
    const frames = session.frames;
    if (!frames || frames.length === 0) { router.push('/activities-summary'); return; }
    const sample = (arr, n = 30) => {
      const step = Math.max(1, Math.floor(arr.length / n));
      return arr.filter((_, i) => i % step === 0).slice(0, n);
    };
    const lbls = sample(frames).map((_, i) => String(i));
    const stepsTotal = frames[frames.length - 1]?.steps ?? 0;
    router.push({
      pathname: '/activities-summary',
      params: {
        bpm:    JSON.stringify({ labels: lbls, datasets: [{ data: sample(frames.map(f => f.bpm)) }] }),
        imu:    JSON.stringify({ labels: lbls, datasets: [{ data: sample(frames.map(f => Math.abs(f.imu.z))) }] }),
        transpi: JSON.stringify({ labels: lbls, datasets: [{ data: sample(frames.map(f => f.transpiration)) }] }),
        steps:  String(stepsTotal),
        temp:   JSON.stringify({ labels: lbls, datasets: [{ data: sample(frames.map(f => f.temperature ?? 36.5)) }] }),
      },
    });
  };

  const renderItem = ({ item }) => {
    const avgBpm = item.frames.length > 0 ? Math.round(item.frames.reduce((a, f) => a + f.bpm, 0) / item.frames.length) : 0;
    const stepsTotal = item.frames[item.frames.length - 1]?.steps ?? 0;
    const modeColor = item.mode === 'simulation' ? '#e3b341' : ACTIVE_BLUE;
    return (
      <TouchableOpacity style={styles.card} onPress={() => openSession(item)} onLongPress={() => handleDelete(item.id)} activeOpacity={0.7}>
        <View style={styles.cardTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={styles.cardDate}>{item.sport || 'Activité'}</Text>
          </View>
          <Text style={styles.cardDateSub}>{fmtDate(item.date)}</Text>
          <View style={[styles.modeTag, { borderColor: modeColor }]}>
            <Text style={[styles.modeText, { color: modeColor }]}>{item.mode === 'simulation' ? 'SIM' : 'WiFi'}</Text>
          </View>
        </View>
        <View style={styles.cardStats}>
          <View style={styles.cstat}><Text style={styles.cstatVal}>{fmtDur(item.duration)}</Text><Text style={styles.cstatLabel}>Durée</Text></View>
          <View style={styles.cstat}><Text style={[styles.cstatVal, { color: '#FF4C8B' }]}>{avgBpm}</Text><Text style={styles.cstatLabel}>BPM moy.</Text></View>
          <View style={styles.cstat}><Text style={[styles.cstatVal, { color: ORANGE }]}>{stepsTotal}</Text><Text style={styles.cstatLabel}>Pas</Text></View>
        </View>
        <Text style={styles.hint}>Appuyer pour résumé · Maintenir pour supprimer</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Historique</Text>
        <View style={styles.headerActions}>
          {sessions.length > 0 && (
            <TouchableOpacity onPress={handleDeleteAll}>
              <Text style={styles.deleteAll}>Tout supprimer</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={refresh}><Text style={styles.refresh}>↺</Text></TouchableOpacity>
        </View>
      </View>

      {sessions.length === 0 && !loading ? (
        <View style={styles.content}>
          <Text style={styles.emptyTitle}>Pas d'activité pour l'instant.</Text>
          <Text style={styles.emptyText}>Lance une activité depuis l'onglet Activités pour voir tes séances ici.</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={s => s.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={refresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_BLUE },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  title: { color: 'white', fontSize: 26, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  deleteAll: { color: CARD_PINK, fontSize: 13, fontWeight: '600' },
  refresh: { color: ACTIVE_BLUE, fontSize: 24 },
  list: { padding: 16, gap: 10 },
  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardDate: { color: 'white', fontSize: 15, fontWeight: '700' },
  cardDateSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4 },
  modeTag: { borderWidth: 0.5, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  modeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  cstat: { alignItems: 'center' },
  cstatVal: { color: 'white', fontSize: 18, fontWeight: '700' },
  cstatLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
  hint: { color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', lineHeight: 20 },
});