
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

  const frontSensors = [
    {
      id: '1',
      title: 'GPS',
      desc: "Module GPS placé sur l'épaule gauche. Il capte la position, la vitesse et l'altitude via le magnétomètre intégré.",
      style: { top: '32%', left: '38%' },
    },
    {
      id: '2',
      title: 'ECG',
      desc: "Capteur ECG placé sur la poitrine avant. Il mesure l'activité électrique du cœur pour estimer la fréquence cardiaque avec précision.",
      style: { top: '45%', left: '44%' },
    },
  ];

  const backSensors = [
    {
      id: '1',
      title: 'GPS',
      desc: "Module GPS placé sur l'épaule droite. Il capte la position, la vitesse et l'altitude via le magnétomètre intégré.",
      style: { top: '32%', left: '62%' },
    },
    {
      id: '2',
      title: 'IMU',
      desc: 'Capteur inertiel positionné au bas du dos pour analyser la rotation du tronc, les impacts et la stabilité.',
      style: { top: '62%', left: '38%' },
    },
    {
      id: '3',
      title: 'Température',
      desc: "Capteur de température extérieure placé près de l'IMU au bas du dos. Il mesure la température ambiante pour contextualiser l'effort.",
      style: { top: '62%', left: '50%' },
    },
    {
      id: '4',
      title: 'Module ESP32',
      desc: 'Boîtier amovible contenant ESP32, la batterie et la mémoire. Placé au bas du dos pour une discrétion maximale.',
      style: { top: '62%', left: '62%' },
    },
  ];

  const sensorsToDisplay = side === 'front' ? frontSensors : backSensors;

  return (
    <View style={styles.container}>
      <AppHeader />

      <View style={styles.headerTextBlock}>
        <Text style={styles.title}>T-shirt & capteurs</Text>
        <Text style={styles.subtitle}>
          Appuie sur un capteur pour voir à quoi il sert. Utilise le bouton Face / Dos
          pour changer de vue.
        </Text>
      </View>

      <View style={styles.tshirtContainer}>
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

        <View style={styles.sideSwitcherWrapper}>
          <TouchableOpacity
            style={[styles.sideButton, side === 'front' && styles.sideButtonActive]}
            onPress={() => setSide('front')}
          >
            <Text style={[styles.sideButtonText, side === 'front' && styles.sideButtonTextActive]}>
              Face
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sideButton, side === 'back' && styles.sideButtonActive]}
            onPress={() => setSide('back')}
          >
            <Text style={[styles.sideButtonText, side === 'back' && styles.sideButtonTextActive]}>
              Dos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_BLUE },
  headerTextBlock: { paddingHorizontal: 24, marginBottom: 10 },
  title: { color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  tshirtContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingBottom: 20 },
  tshirtImage: { width: '80%', height: '70%', resizeMode: 'contain' },
  sensorDot: { position: 'absolute', width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(8,150,181,0.9)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff', marginLeft: -15, marginTop: -15 },
  sensorLabel: { color: 'white', fontWeight: '700' },
  sideSwitcherWrapper: { position: 'absolute', bottom: 10, right: 20, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 999, overflow: 'hidden' },
  sideButton: { paddingHorizontal: 14, paddingVertical: 6 },
  sideButtonActive: { backgroundColor: '#ffffff' },
  sideButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '500' },
  sideButtonTextActive: { color: ACTIVE_BLUE, fontWeight: '700' },
});