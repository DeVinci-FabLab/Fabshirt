// src/app/(tabs)/history.tsx
// HISTORIQUE - VERSION AVEC TABS ET HEADER UNIFIÉ

// @ts-nocheck
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import AppHeader from '../../components/AppHeader';

const BACKGROUND_BLUE = '#020045';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      {/* HEADER UNIFIÉ */}
      <AppHeader />

      {/* CONTENU PRINCIPAL */}
      <View style={styles.content}>
        <Text style={styles.title}>Historique</Text>
        <Text style={styles.subtitle}>Pas d'activité pour l'instant.</Text>
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
});