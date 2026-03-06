// @ts-nocheck
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function VerifyCodeScreen() {
  const router = useRouter();

  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const handleChange = (value, index) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1); // 1 chiffre max
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');
  };

  const fullCode = code.join('');
  const canValidate = fullCode.length === 4;

  const handleValidate = () => {
    if (!canValidate) {
      setError('Merci de saisir les 4 chiffres du code.');
      return;
    }

    console.log('Code saisi :', fullCode);
    // 👉 écran suivant : définir le mot de passe
    router.push('/set-password');
  };

  return (
    <LinearGradient
      colors={['#02004A', '#C0175A']}
      style={styles.container}
    >
      {/* Haut de page */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Saisir le code</Text>
        <Text style={styles.subtitle}>
          Le code de vérification a été envoyé sur ton adresse e-mail,
          valable pendant 10 minutes.
        </Text>
      </View>

      {/* Inputs code */}
      <View style={styles.codeRow}>
        {code.map((value, index) => (
          <TextInput
            key={index}
            style={styles.codeInput}
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Bouton Valider */}
      <TouchableOpacity
        style={[
          styles.validateButton,
          !canValidate && styles.validateButtonDisabled,
        ]}
        disabled={!canValidate}
        onPress={handleValidate}
      >
        <Text style={styles.validateButtonText}>Valider</Text>
      </TouchableOpacity>

      {/* Logo en bas */}
      <View style={styles.bottomLogoContainer}>
        <Image
          source={require('../IMAGE/LOGO.png')}
          style={styles.bottomLogo}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    gap: 16,
  },
  backArrow: {
    color: 'white',
    fontSize: 26,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  codeRow: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  codeInput: {
    flex: 1,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    color: '#FF6B81',
    fontSize: 13,
  },
  validateButton: {
    marginTop: 32,
    backgroundColor: '#C3295A',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  validateButtonDisabled: {
    opacity: 0.5,
  },
  validateButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomLogoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
