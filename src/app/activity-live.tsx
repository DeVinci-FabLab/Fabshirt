// @ts-nocheck
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getCurrentUser } from '../store/userStore';

const BACKGROUND_BLUE = '#020045';
const TABS_BG = '#08072D';
const CARD_PINK = '#C3295A';

export default function ActivityLiveScreen() {
  const router = useRouter();
  const user = getCurrentUser();
  const firstName = user?.firstName || 'Maëlle';

  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleStop = () => router.push('/history');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.smallText}>12 novembre 2025</Text>
          <Text style={styles.smallText}>Aujourd’hui</Text>
        </View>

        <View style={styles.topRight}>
          <View className="batterie" style={styles.batteryCircle}>
            <Text style={styles.batteryText}>75%</Text>
          </View>

          <View style={styles.circleIcon}>
            <Image
              source={require('../IMAGE/TSHIRT.png')}
              style={styles.smallTopIcon}
            />
          </View>

          <View style={styles.avatarWrapper}>
            {user?.profilePhoto ? (
              <Image source={{ uri: user.profilePhoto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={{ color: 'white' }}>
                  {firstName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* CONTENU */}
      <View style={styles.content}>
        <View style={styles.bpmBlock}>
          <Text style={styles.bpmValue}>---</Text>
          <Text style={styles.bpmLabel}>BPM</Text>
        </View>

        <View style={styles.rowCards}>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardTitle}>DISTANCE</Text>
            <View style={styles.rowCenter}>
              <Text style={styles.smallCardValue}>--</Text>
              <Text style={styles.smallCardUnit}>KM</Text>
            </View>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardTitle}>TEMPS</Text>
            <Text style={styles.smallCardValue}>00:00:00</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallCardTitle}>ALLURE</Text>
            <Text style={styles.smallCardValue}>--’--’’</Text>
            <Text style={styles.smallCardUnit}>MIN/KM</Text>
          </View>
        </View>

        <View style={styles.bigCard}>
          <View style={styles.bigCardHeader}>
            <Image
              source={require('../IMAGE/RESPIRATION.png')}
              style={styles.metricIcon}
            />
            <Text style={styles.bigCardTitle}>RESPIRATION</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text style={styles.bigCardValue}>--</Text>
            <Text style={styles.bigCardUnit}>RPM</Text>
          </View>
          <Text style={styles.bigCardSub}>Respiration stable</Text>
        </View>

        <View style={styles.bigCard}>
          <View style={styles.bigCardHeader}>
            <Image
              source={require('../IMAGE/TRANSPIRATION.png')}
              style={styles.metricIcon}
            />
            <Text style={styles.bigCardTitle}>TRANSPIRATION</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text style={styles.bigCardValue}>--</Text>
            <Text style={styles.bigCardUnit}>%</Text>
          </View>
          <Text style={styles.bigCardSub}>Niveau moyen</Text>
        </View>
      </View>

      {/* CONTROLES */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <View style={styles.pauseBar} />
          <View style={styles.pauseBar} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <Text style={styles.stopText}>STOP</Text>
        </TouchableOpacity>
      </View>

      {/* TABS BAS */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/dashboard')}
        >
          <Image
            source={require('../IMAGE/ACCUEIL.png')}
            style={styles.tabIconImage}
          />
          <Text style={styles.tabLabel}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/activities')}
        >
          <Image
            source={require('../IMAGE/ACTIVITES.png')}
            style={styles.tabIconImage}
          />
          <Text style={styles.tabLabel}>Activités</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/history')}
        >
          <Image
            source={require('../IMAGE/HISTORIQUE.png')}
            style={styles.tabIconImage}
          />
          <Text style={styles.tabLabel}>Historique</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => console.log('T-shirt')}
        >
          <Image
            source={require('../IMAGE/TSHIRT.png')}
            style={styles.tabIconImage}
          />
          <Text style={styles.tabLabel}>T-shirt</Text>
        </TouchableOpacity>
      </View>

      {/* OVERLAY PAUSE */}
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseOverlayContent}>
            <View style={styles.bigPauseIcon}>
              <View style={styles.bigPauseBar} />
              <View style={styles.bigPauseBar} />
            </View>

            <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
              <Text style={styles.resumeText}>REPRENDRE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_BLUE },
  topBar: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallText: { color: 'white', fontSize: 12 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  batteryCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00FF7F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryText: { color: '#00FF7F', fontSize: 10 },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallTopIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
    resizeMode: 'contain',
  },
  avatarWrapper: { width: 34, height: 34, borderRadius: 17, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  bpmBlock: { alignItems: 'center', marginTop: 10, marginBottom: 10 },
  bpmValue: { color: 'white', fontSize: 80, fontWeight: '800' },
  bpmLabel: { color: 'white', fontSize: 18 },

  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#7B2D73',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  smallCardTitle: { color: 'white', fontSize: 12, marginBottom: 6 },
  smallCardValue: { color: 'white', fontSize: 22, fontWeight: '700' },
  smallCardUnit: { color: 'white', fontSize: 11, marginLeft: 4 },

  bigCard: {
    backgroundColor: '#3E2B78',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  bigCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  metricIcon: { width: 26, height: 26, resizeMode: 'contain', marginRight: 8 },
  bigCardTitle: { color: 'white', fontSize: 14, fontWeight: '600' },
  rowCenter: { flexDirection: 'row', alignItems: 'flex-end' },
  bigCardValue: { color: 'white', fontSize: 26, fontWeight: '700' },
  bigCardUnit: { color: 'white', fontSize: 14, marginLeft: 4, marginBottom: 2 },
  bigCardSub: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 4,
    paddingTop: 6,
    backgroundColor: BACKGROUND_BLUE,
  },
  pauseButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: CARD_PINK,
    borderRadius: 18,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pauseBar: {
    width: 8,
    height: 24,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  stopButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: 'white',
    borderRadius: 18,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: CARD_PINK,
  },
  stopText: { color: CARD_PINK, fontWeight: '700', fontSize: 16 },

  tabsContainer: {
    height: 80,
    backgroundColor: TABS_BG,
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIconImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  tabLabel: { color: 'white', fontSize: 11 },

  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(194, 41, 90, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseOverlayContent: { alignItems: 'center', paddingHorizontal: 24 },
  bigPauseIcon: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  bigPauseBar: {
    width: 40,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#FF4C8B',
  },
  resumeButton: {
    backgroundColor: 'white',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderWidth: 3,
    borderColor: '#FF4C8B',
  },
  resumeText: { color: '#FF4C8B', fontSize: 16, fontWeight: '700' },
});
