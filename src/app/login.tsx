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

function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.toLowerCase());
}

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailOk = isValidEmail(email);
  const passwordOk = password.length >= 8;
  const canSubmit = emailOk && passwordOk;

  const handleLogin = () => {
    if (!canSubmit) {
      setError(
        'Vérifie ton email et que le mot de passe fait au moins 8 caractères.'
      );
      return;
    }

    console.log('Connexion');

    // ➜ dashboard après connexion
    router.push('/dashboard');
  };

  return (
    <LinearGradient
      colors={['#02004A', '#C0175A']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Connexion</Text>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* Email */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8080A0"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
          />
        </View>

        {/* Mot de passe */}
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

        {!emailOk && email.length > 0 && (
          <Text style={styles.helperText}>
            L’email ne semble pas valide.
          </Text>
        )}

        {!passwordOk && password.length > 0 && (
          <Text style={styles.helperText}>
            Le mot de passe doit contenir au moins 8 caractères.
          </Text>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Bouton Connexion */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          disabled={!canSubmit}
          onPress={handleLogin}
        >
          <Text style={styles.submitButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>

      {/* Logo bas */}
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
