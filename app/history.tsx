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

export default function HistoryScreen() {
  const router = useRouter();
  const user = getCurrentUser();
  const firstName = user?.firstName || 'Maëlle';

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.smallText}>12 novembre 2025</Text>
          <Text style={styles.smallText}>Aujourd’hui</Text>
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

      {/* CONTENU PRINCIPAL */}
      <View style={styles.content}>
        <Text style={styles.title}>Historique</Text>
        <Text style={styles.subtitle}>Pas d’activité pour l’instant.</Text>
      </View>

      {/* TABS BAS */}
      <View style={styles.tabsContainer}>
        {/* Accueil */}
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

        {/* Historique (ACTIF) */}
        <View style={[styles.tabItem, styles.tabItemActive]}>
          <Image
            source={require('../IMAGE/HISTORIQUE.png')}
            style={[styles.tabIconImage, { tintColor: ACTIVE_BLUE }]}
          />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Historique</Text>
        </View>

        {/* T-shirt */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_BLUE,
  },

  /* HEADER */
  topBar: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallText: {
    color: 'white',
    fontSize: 12,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  batteryCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00FF7F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryText: {
    color: '#00FF7F',
    fontSize: 10,
  },
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
  avatarWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* CONTENU */
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
  },

  /* TABS */
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
  tabItemActive: {
    backgroundColor: '#02004F',
  },
  tabIconImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  tabLabel: {
    color: 'white',
    fontSize: 11,
  },
  tabLabelActive: {
    color: ACTIVE_BLUE,
    fontWeight: '600',
  },
});
