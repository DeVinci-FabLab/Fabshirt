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

export default function SetPasswordScreen() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const isLongEnough = password.length >= 8;
  const isMatching = password === confirm && confirm.length > 0;
  const canSubmit = isLongEnough && isMatching;

  const handleSubmit = () => {
    if (!canSubmit) {
      setError('Mot de passe trop court ou non identique.');
      return;
    }

    console.log('Mot de passe défini :', password);
    // écran suivant : compléter les informations
    router.push('/complete-profile');
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
        <Text style={styles.title}>Définis un mot de passe</Text>
      </View>

      {/* Champs mot de passe */}
      <View style={styles.content}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#8080A0"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#8080A0"
            secureTextEntry
            value={confirm}
            onChangeText={(text) => {
              setConfirm(text);
              setError('');
            }}
          />
        </View>

        {!isLongEnough && password.length > 0 && (
          <Text style={styles.helperText}>
            Le mot de passe doit contenir au moins 8 caractères.
          </Text>
        )}

        {!isMatching && confirm.length > 0 && (
          <Text style={styles.helperText}>
            Les mots de passe ne correspondent pas.
          </Text>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Bouton S'inscrire */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>

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
    gap: 24,
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
  content: {
    marginTop: 40,
    gap: 16,
  },
  inputWrapper: {
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  input: {
    height: 44,
    color: 'white',
    fontSize: 16,
  },
  helperText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  errorText: {
    color: '#FF6B81',
    fontSize: 13,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#C3295A',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
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
