// src/app/(tabs)/tshirt.tsx
// T-SHIRT & CAPTEURS - VERSION AVEC TABS ET HEADER UNIFIÉ

// @ts-nocheck
import React, { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AppHeader from '../../components/AppHeader';

const BACKGROUND_BLUE = '#020045';
const ACTIVE_BLUE = '#0896B5';

export default function TshirtScreen() {
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
        "Capteur ECG placé au niveau du thorax. Il mesure l'activité électrique du cœur et permet de calculer la fréquence cardiaque (BPM) et la variabilité.",
      style: { top: '30%', left: '50%' },
    },
    {
      id: '2',
      title: 'Respiration (face)',
      desc:
        "Bande de respiration à l'avant, autour du thorax. Elle suit les mouvements respiratoires pour estimer la fréquence et l'amplitude.",
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
        'Boîtier amovible contenant ESP32, la batterie, la mémoire et la communication BLE vers application.',
      style: { top: '75%', left: '50%' },
    },
  ];

  const sensorsToDisplay = side === 'front' ? frontSensors : backSensors;

  return (
    <View style={styles.container}>
      {/* HEADER UNIFIÉ */}
      <AppHeader />

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
            source={require('../../../IMAGE/TSHIRT.png')}
            style={styles.tshirtImage}
          />
        ) : (
          <Image
            source={require('../../../IMAGE/TSHIRT.png')}
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
    </View>
  );
}

/* STYLES - HEADER SUPPRIMÉ (maintenant dans AppHeader) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_BLUE,
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
    paddingBottom: 20,
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
});