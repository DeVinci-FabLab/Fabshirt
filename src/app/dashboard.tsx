// @ts-nocheck
import { useRouter } from 'expo-router';
import React from 'react';
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
const ACTIVE_BLUE = '#0896B5';
const CARD_PINK = '#C3295A';
const ORANGE = '#F18904';

export default function DashboardScreen() {
  const router = useRouter();
  const user = getCurrentUser();
  const firstName = user?.firstName || 'Maëlle';

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.dateText}>12 novembre 2025</Text>
          <Text style={styles.todayText}>Aujourd’hui</Text>
        </View>

        <View style={styles.topRight}>
          {/* batterie */}
          <View style={styles.batteryCircle}>
            <Text style={styles.batteryText}>75%</Text>
          </View>

          {/* icône T-shirt */}
          <View style={styles.circleIcon}>
            <Image
              source={require('../IMAGE/TSHIRT.png')}
              style={styles.smallTopIcon}
            />
          </View>

          {/* avatar */}
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

      {/* BONJOUR */}
      <View style={styles.helloBlock}>
        <Text style={styles.helloText}>Bonjour, {firstName} !</Text>
      </View>

      {/* CARTE DERNIERE SESSION (données vides) */}
      <View style={styles.lastSessionCard}>
        <Text style={styles.lastSessionTitle}>Dernière session</Text>
        <Text style={styles.lastSessionSub}>30 août 2025, 8:45</Text>

        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>DISTANCE</Text>
            <Text style={styles.gridValue}>--</Text>
            <Text style={styles.gridUnit}>KM</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>TEMPS</Text>
            <Text style={styles.gridValue}>--:--:--</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>ALLURE</Text>
            <Text style={styles.gridValue}>--’--’’</Text>
            <Text style={styles.gridUnit}>KM/H</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>FC MOY</Text>
            <Text style={styles.gridValue}>--</Text>
            <Text style={styles.gridUnit}>BPM</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>RESPIRATION</Text>
            <Text style={styles.gridValue}>--</Text>
            <Text style={styles.gridUnit}>RPM</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>TRANSPIRATION</Text>
            <Text style={styles.gridValue}>--</Text>
            <Text style={styles.gridUnit}>%</Text>
          </View>
        </View>

        <Text style={styles.moreDetails}>PLUS DE DÉTAILS</Text>
      </View>

      {/* BOUTON DEMARRER UNE ACTIVITE */}
      <View style={styles.startWrapper}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/activity-live')}
        >
          <View style={styles.startPlayCircle}>
            <Text style={styles.playTriangle}>▶</Text>
          </View>
          <Text style={styles.startText}>Démarrer une activité</Text>
        </TouchableOpacity>
      </View>

      {/* TABS BAS – Accueil actif */}
      <View style={styles.tabsContainer}>
        {/* Accueil (ACTIF) */}
        <View style={styles.tabItem}>
          <Image
            source={require('../IMAGE/ACCUEIL.png')}
            style={[styles.tabIconImage, { tintColor: ACTIVE_BLUE }]}
          />
          <Text style={[styles.tabLabel, { color: ACTIVE_BLUE }]}>Accueil</Text>
        </View>

        {/* Activités */}
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

        {/* Historique */}
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

        {/* T-shirt → /tshirt */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/tshirt')}
        >
          <Image
            source={require('../IMAGE/TSHIRT.png')}
            style={styles.tabIconImage}
          />
          <Text style={styles.tabLabel}>T-shirt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* STYLES (identiques) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_BLUE,
  },
  topBar: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: { color: 'white', fontSize: 12 },
  todayText: { color: 'white', fontSize: 14 },
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
  helloBlock: { paddingHorizontal: 20, marginBottom: 12 },
  helloText: { color: 'white', fontSize: 26, fontWeight: '700' },
  lastSessionCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: CARD_PINK,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  lastSessionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  lastSessionSub: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  gridLabel: { color: 'white', fontSize: 11, marginBottom: 4 },
  gridValue: { color: 'white', fontSize: 20, fontWeight: '700' },
  gridUnit: { color: 'white', fontSize: 11 },
  moreDetails: {
    marginTop: 8,
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  startWrapper: { marginTop: 24, paddingHorizontal: 26, flex: 1 },
  startButton: {
    height: 90,
    borderRadius: 40,
    backgroundColor: '#5B3A23',
    borderWidth: 3,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  playTriangle: { color: ORANGE, fontSize: 30, marginLeft: 4 },
  startText: { color: 'white', fontWeight: '600', fontSize: 15 },
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
});
