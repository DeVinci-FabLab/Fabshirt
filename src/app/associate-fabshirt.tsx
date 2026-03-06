// @ts-nocheck
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AssociateFabshirtScreen() {
  const router = useRouter();
  const [isOpeningCamera, setIsOpeningCamera] = useState(false);

  const handleScan = async () => {
    if (isOpeningCamera) return;
    setIsOpeningCamera(true);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setIsOpeningCamera(false);
      Alert.alert(
        'Caméra refusée',
        "Tu dois autoriser l’accès à la caméra pour scanner le QR code."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    setIsOpeningCamera(false);

    if (result.canceled) {
      return;
    }

    console.log('Photo du QR prise :', result.assets?.[0]?.uri);

    Alert.alert(
      'Fabshirt associé',
      'Ton fabshirt est maintenant associé à ton compte ✅',
      [
        {
          text: 'OK',
          onPress: () => {
            router.push('/dashboard'); // ➜ dashboard après association
          },
        },
      ]
    );
  };

  const handleSkip = () => {
    // ➜ dashboard même si on passe
    router.push('/dashboard');
  };

  return (
    <LinearGradient
      colors={['#02004A', '#02004A']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Associe ton fabshirt</Text>
          <Text style={styles.subtitle}>
            Scanne le QR code de l’appareil
          </Text>
        </View>

        <View style={styles.bottomBlock}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleScan}
            disabled={isOpeningCamera}
          >
            <Text style={styles.primaryButtonText}>
              {isOpeningCamera
                ? 'Ouverture de la caméra...'
                : 'Scanner le QR code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    gap: 12,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
  },
  bottomBlock: {
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#C3295A',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 40,
    minWidth: '80%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
});
