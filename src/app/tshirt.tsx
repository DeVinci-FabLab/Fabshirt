// @ts-nocheck
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
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

export default function TshirtScreen() {
  const router = useRouter();
  const user = getCurrentUser();

  const [side, setSide] = useState<'front' | 'back'>('front');

  const openInfo = (title: string, body: string) => {
    Alert.alert(title, body, [{ text: 'OK' }]);
  };

  // 👉 capteurs côté face
  const frontSensors = [
    {
      id: '1',
      title: 'ECG',
      desc:
        "Capteur ECG placé au niveau du thorax. Il mesure l’activité électrique du cœur et permet de calculer la fréquence cardiaque (BPM) et la variabilité.",
      style: { top: '30%', left: '50%' },
    },
    {
      id: '2',
      title: 'Respiration (face)',
      desc:
        "Bande de respiration à l’avant, autour du thorax. Elle suit les mouvements respiratoires pour estimer la fréquence et l’amplitude.",
      style: { top: '36%', left: '50%' },
    },
    {
      id: '3',
      title: 'IMU avant',
      desc:
        'Capteur inertiel (accéléromètre / gyroscope) sur le buste avant, pour suivre la posture et la dynamique de course.',
      style: { top: '52%', left: '45%' },
    },
  ];

  // 👉 capteurs côté dos
  const backSensors = [
    {
      id: '2',
      title: 'Respiration (dos)',
      desc:
        'Bande élastique dans le haut du dos. Elle permet une mesure stable des mouvements respiratoires.',
      style: { top: '28%', left: '50%' },
    },
    {
      id: '4',
      title: 'IMU dos',
      desc:
        'IMU positionné au milieu du dos pour analyser la rotation du tronc, les impacts et la stabilité.',
      style: { top: '48%', left: '50%' },
    },
    {
      id: '5',
      title: 'GSR',
      desc:
        'Capteur GSR (réponse électrodermale) au niveau de la bande élastique du bas du dos. Il mesure les variations de conductance liées à la sudation.',
      style: { top: '62%', left: '55%' },
    },
    {
      id: '6',
      title: 'Module électronique',
      desc:
        'Boîtier amovible contenant l’ESP32, la batterie, la mémoire et la communication BLE vers l’application.',
      style: { top: '75%', left: '50%' },
    },
  ];

  const sensorsToDisplay = side === 'front' ? frontSensors : backSensors;

  return (
    <View style={styles.container}>
      {/* Bande du haut */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.smallText}>12 novembre 2025</Text>
          <Text style={styles.bigText}>Aujourd’hui</Text>
        </View>

        <View style={styles.topRight}>
          {/* Batterie fabshirt */}
          <View style={styles.batteryWrapper}>
            <View className="batteryCircle" style={styles.batteryCircle}>
              <Text style={styles.batteryText}>75%</Text>
            </View>
          </View>

          {/* Picto T-shirt */}
          <View style={styles.circleIcon}>
            <Image
              source={require('../IMAGE/TSHIRT.png')}
              style={{ width: 18, height: 18, tintColor: '#ffffff' }}
            />
          </View>

          {/* Avatar profil */}
          <View style={styles.avatarWrapper}>
            {user?.profilePhoto ? (
              <Image source={{ uri: user.profilePhoto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={{ color: 'white' }}>
                  {user?.firstName?.[0]?.toUpperCase() ?? 'M'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Titre */}
      <View style={styles.headerTextBlock}>
        <Text style={styles.title}>T-shirt & capteurs</Text>
        <Text style={styles.subtitle}>
          Appuie sur un capteur pour voir à quoi il sert. Utilise le bouton Face / Dos
          pour changer de vue.
        </Text>
      </View>

      {/* Zone T-shirt + capteurs */}
      <View style={styles.tshirtContainer}>
        {/* 🖼️ Image : une icône t-shirt avec emplacements.
            Prévois par exemple :
            - IMAGE/TSHIRT_FACE.png pour la face
            - IMAGE/TSHIRT_DOS.png pour le dos
        */}
        {side === 'front' ? (
          <Image
            source={require('../IMAGE/TSHIRT.png')}
            style={styles.tshirtImage}
          />
        ) : (
          <Image
            source={require('../IMAGE/TSHIRT.png')}
            style={styles.tshirtImage}
          />
        )}

        {/* Points capteurs */}
        {sensorsToDisplay.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.sensorDot, s.style]}
            onPress={() => openInfo(s.title, s.desc)}
            activeOpacity={0.8}
          >
            <Text style={styles.sensorLabel}>{s.id}</Text>
          </TouchableOpacity>
        ))}

        {/* Bouton Face / Dos en bas à droite */}
        <View style={styles.sideSwitcherWrapper}>
          <TouchableOpacity
            style={[
              styles.sideButton,
              side === 'front' && styles.sideButtonActive,
            ]}
            onPress={() => setSide('front')}
          >
            <Text
              style={[
                styles.sideButtonText,
                side === 'front' && styles.sideButtonTextActive,
              ]}
            >
              Face
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sideButton,
              side === 'back' && styles.sideButtonActive,
            ]}
            onPress={() => setSide('back')}
          >
            <Text
              style={[
                styles.sideButtonText,
                side === 'back' && styles.sideButtonTextActive,
              ]}
            >
              Dos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre d’onglets bas */}
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

        {/* T-shirt (actif) */}
        <View style={[styles.tabItem, styles.tabItemActive]}>
          <Image
            source={require('../IMAGE/TSHIRT.png')}
            style={[styles.tabIconImage, { tintColor: ACTIVE_BLUE }]}
          />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>T-shirt</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_BLUE,
  },

  /* Top bar */
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
  bigText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  batteryWrapper: {},
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

  headerTextBlock: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },

  tshirtContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  tshirtImage: {
    width: '80%',
    height: '70%',
    resizeMode: 'contain',
  },

  sensorDot: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(8,150,181,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    // pour centrer un peu mieux quand on donne left: '50%'
    marginLeft: -15,
  },
  sensorLabel: {
    color: 'white',
    fontWeight: '700',
  },

  sideSwitcherWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  sideButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  sideButtonActive: {
    backgroundColor: '#ffffff',
  },
  sideButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  sideButtonTextActive: {
    color: ACTIVE_BLUE,
    fontWeight: '700',
  },

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
  },
  tabLabel: {
    color: 'white',
    fontSize: 11,
  },
  tabLabelActive: {
    fontWeight: '600',
    color: ACTIVE_BLUE,
  },
});
