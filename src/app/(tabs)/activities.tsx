// @ts-nocheck
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AppHeader from '../../components/AppHeader';
import { useSession } from '../../components/SessionContext';

const BACKGROUND_BLUE = '#020045';
const ORANGE = '#F18904';
const PINK = '#C3295A';
const ACTIVE_BLUE = '#0896B5';

const ACTIVITY_TYPES = ['Course à pied', 'Cyclisme', 'Musculation'];

export default function ActivitiesScreen() {
  const router = useRouter();
  const { startSimulation, startWifi, sessionMode } = useSession();

  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState('Activités');
  const [pickerVisible, setPickerVisible] = useState(false);

  const [sportModal, setSportModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState('');
  const [sourceModal, setSourceModal] = useState(false);
  const [wifiModal, setWifiModal] = useState(false);
  const [protocol, setProtocol] = useState('ws');

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { setHasPermission(false); setLoading(false); return; }
        setHasPermission(true);
        const current = await Location.getCurrentPositionAsync({});
        setLocation(current);
      } catch { setHasPermission(false); }
      finally { setLoading(false); }
    })();
  }, []);

  const region = location
    ? { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : { latitude: 48.895, longitude: 2.245, latitudeDelta: 0.05, longitudeDelta: 0.05 };

  const handlePlay = () => {
    if (sessionMode !== 'idle') { router.push('/activity-live'); return; }
    setSportModal(true);
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setSportModal(false);
    setSourceModal(true);
  };

  const handleSimulation = () => {
    setSourceModal(false);
    startSimulation(selectedSport);
    router.push('/activity-live');
  };

  const handleWifiConnect = () => {
    setWifiModal(false);
    startWifi(protocol as 'ws' | 'http', selectedSport);
    router.push('/activity-live');
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <View style={styles.activitySelectorWrapper}>
        <TouchableOpacity style={styles.activitySelector} onPress={() => setPickerVisible(true)}>
          <Text style={styles.activitySelectorText}>{activityType}</Text>
          <Text style={styles.activitySelectorArrow}>▾</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Récupération de ta position…</Text>
          </View>
        ) : !hasPermission ? (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Active la localisation pour afficher la carte autour de toi.</Text>
          </View>
        ) : (
          <MapView style={StyleSheet.absoluteFill} initialRegion={region} region={region} mapType="hybrid" showsUserLocation showsMyLocationButton={false}>
            <Marker coordinate={region} />
          </MapView>
        )}
      </View>

      <View style={styles.bigPlayWrapper}>
        <TouchableOpacity style={styles.bigPlayButton} onPress={handlePlay}>
          <Text style={styles.playTriangle}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL TYPE ACTIVITE */}
      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {ACTIVITY_TYPES.map((label) => (
              <TouchableOpacity key={label} style={styles.modalItem} onPress={() => { setActivityType(label); setPickerVisible(false); }}>
                <Text style={styles.modalText}>{label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.modalItem, { marginTop: 8 }]} onPress={() => setPickerVisible(false)}>
              <Text style={[styles.modalText, { color: '#ccc' }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL CHOIX SPORT */}
      <Modal visible={sportModal} transparent animationType="slide" onRequestClose={() => setSportModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sourceBox}>
            <Text style={styles.sourceTitle}>Type d'activité</Text>
            <Text style={styles.sourceSub}>Quel sport vas-tu pratiquer ?</Text>
            {['Course à pied', 'Cyclisme', 'Musculation'].map((label) => (
              <TouchableOpacity key={label} style={styles.sourceBtn} onPress={() => handleSportSelect(label)}>
                <Text style={styles.sourceBtnTitle}>{label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelItem} onPress={() => setSportModal(false)}>
              <Text style={[styles.modalText, { color: '#ccc' }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL CHOIX SOURCE */}
      <Modal visible={sourceModal} transparent animationType="slide" onRequestClose={() => setSourceModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sourceBox}>
            <Text style={styles.sourceTitle}>Source des données</Text>
            <Text style={styles.sourceSub}>Comment récupérer les données capteurs ?</Text>
            <TouchableOpacity style={styles.sourceBtn} onPress={handleSimulation}>
              <Text style={styles.sourceBtnIcon}>▶</Text>
              <View>
                <Text style={styles.sourceBtnTitle}>Simulation</Text>
                <Text style={styles.sourceBtnDesc}>Données synthétiques, sans ESP32</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sourceBtn, { borderColor: ACTIVE_BLUE + '88' }]}
              onPress={() => { setSourceModal(false); setWifiModal(true); }}>
              <Text style={styles.sourceBtnIcon}>⌁</Text>
              <View>
                <Text style={styles.sourceBtnTitle}>ESP32 via WiFi</Text>
                <Text style={styles.sourceBtnDesc}>Connectez-vous au WiFi "ESP32-Capteurs"</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelItem} onPress={() => setSourceModal(false)}>
              <Text style={[styles.modalText, { color: '#ccc' }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL WiFi — juste le protocole, pas d'IP/port */}
      <Modal visible={wifiModal} transparent animationType="slide" onRequestClose={() => setWifiModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sourceBox}>
            <Text style={styles.sourceTitle}>Connexion ESP32</Text>
            <Text style={styles.sourceSub}>Assurez-vous d'être connecté au WiFi "ESP32-Capteurs" (mdp: 12345678)</Text>

            <Text style={styles.inputLabel}>Protocole</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
              {[['ws', 'WebSocket'], ['http', 'HTTP']].map(([val, label]) => (
                <TouchableOpacity key={val}
                  style={[styles.segBtn, protocol === val && styles.segBtnActive]}
                  onPress={() => setProtocol(val)}>
                  <Text style={[styles.segText, protocol === val && { color: ACTIVE_BLUE, fontWeight: '700' }]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[styles.cancelItem, { flex: 1, borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingVertical: 12 }]} onPress={() => setWifiModal(false)}>
                <Text style={{ color: '#ccc', textAlign: 'center' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelItem, { flex: 1, backgroundColor: ACTIVE_BLUE, borderRadius: 12, paddingVertical: 12 }]} onPress={handleWifiConnect}>
                <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}>Connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_BLUE },
  activitySelectorWrapper: { paddingHorizontal: 24, marginBottom: 8 },
  activitySelector: { backgroundColor: PINK, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activitySelectorText: { color: 'white', fontWeight: '600', fontSize: 15 },
  activitySelectorArrow: { color: 'white', fontSize: 16 },
  mapContainer: { flex: 1, overflow: 'hidden' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  loadingText: { color: 'white', marginTop: 12, textAlign: 'center' },
  bigPlayWrapper: { position: 'absolute', bottom: 90, left: 0, right: 0, alignItems: 'center' },
  bigPlayButton: { width: 140, height: 80, borderRadius: 40, backgroundColor: '#5B3A23', borderWidth: 3, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  playTriangle: { color: ORANGE, fontSize: 28, marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: BACKGROUND_BLUE, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 18, width: '80%' },
  modalItem: { paddingVertical: 10 },
  modalText: { color: 'white', fontSize: 15, textAlign: 'center' },
  sourceBox: { backgroundColor: '#08072D', borderRadius: 20, padding: 22, width: '90%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sourceTitle: { color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sourceSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 20 },
  sourceBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 14, marginBottom: 10 },
  sourceBtnIcon: { fontSize: 22, color: 'white', width: 28, textAlign: 'center' },
  sourceBtnTitle: { color: 'white', fontWeight: '600', fontSize: 14 },
  sourceBtnDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  cancelItem: { paddingVertical: 10, alignItems: 'center', marginTop: 6 },
  inputLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  segBtn: { flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 10, alignItems: 'center' },
  segBtnActive: { borderColor: '#0896B5', backgroundColor: 'rgba(8,150,181,0.15)' },
  segText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
});