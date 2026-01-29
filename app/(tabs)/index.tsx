// @ts-nocheck
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../IMAGE/FOND ACCUEIL.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* FABSHIRT en haut */}
        <View style={styles.header}>
          <Image
            source={require('../../IMAGE/FABSHIRT.png')}
            style={styles.fabshirtTitle}
          />
        </View>

        {/* Logo au milieu */}
        <View style={styles.center}>
          <Image
            source={require('../../IMAGE/LOGO.png')}
            style={styles.logo}
          />
        </View>

        {/* Boutons en bas */}
        <View style={styles.buttonsContainer}>
          {/* S'inscrire */}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.primaryButtonText}>S'inscrire</Text>
          </TouchableOpacity>

          {/* Connexion */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryButtonText}>Connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  fabshirtTitle: {
    width: 220,
    height: 70,
    resizeMode: 'contain',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 260,
    resizeMode: 'contain',
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0896B5',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'rgba(8, 150, 181, 0.5)',
    borderWidth: 1,
    borderColor: '#0896B5',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
