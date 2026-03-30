// src/app/(tabs)/dashboard.tsx
// DASHBOARD SIMPLIFIÉ - SESSION GÉRÉE PAR APPHEADER

// @ts-nocheck
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AppHeader from '../../components/AppHeader';

const BACKGROUND_BLUE = '#020045';
const ORANGE = '#F18904';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HEADER UNIFIÉ (gère la session) */}
      <AppHeader />

      {/* BONJOUR */}
      <View style={styles.helloBlock}>
        <Text style={styles.helloText}>Bonjour !</Text>
      </View>

      {/* HISTORIQUE VIDE */}
      <View style={styles.emptyHistoryCard}>
        <Text style={styles.emptyHistoryTitle}>Historique vide</Text>
        <Text style={styles.emptyHistoryText}>
          Aucune session enregistrée pour le moment.{'\n'}
          Commence ta première activité !
        </Text>
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
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_BLUE,
  },
  helloBlock: { 
    paddingHorizontal: 20, 
    marginBottom: 20,
    marginTop: 10,
  },
  helloText: { 
    color: 'white', 
    fontSize: 26, 
    fontWeight: '700',
  },
  emptyHistoryCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHistoryTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyHistoryText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  startWrapper: { 
    marginTop: 'auto',
    paddingHorizontal: 26,
    paddingBottom: 20,
  },
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
});