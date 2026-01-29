// @ts-nocheck
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// PDF locaux dans /assets
const PDF_PRIVACY = require('../assets/POLITIQUE DE CONFIDENTIALITE.pdf');
const PDF_TERMS = require("../assets/CONDITION D'UTILISATION.pdf");

async function openPdf(assetModule) {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  await WebBrowser.openBrowserAsync(asset.uri);
}

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [visibleDoc, setVisibleDoc] = useState(null);

  const trimmedEmail = email.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const canSubmit = accepted && isEmailValid;

  return (
    <LinearGradient
      colors={['#02004A', '#C0175A']}
      style={styles.container}
    >
      {/* Haut */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Inscription avec Email</Text>
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
            onChangeText={setEmail}
          />
        </View>

        {trimmedEmail.length > 0 && !isEmailValid && (
          <Text style={styles.errorText}>
            Merci d’entrer une adresse email valide.
          </Text>
        )}

        {/* Checkbox + liens */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAccepted(!accepted)}
          activeOpacity={0.8}
        >
          <View style={styles.checkboxOuter}>
            {accepted && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.checkboxText}>
            J’ai lu et j’accepte FABSHIRT{' '}
            <Text
              style={styles.link}
              onPress={() => setVisibleDoc('privacy')}
            >
              Politique de confidentialité
            </Text>{' '}
            et{' '}
            <Text
              style={styles.link}
              onPress={() => setVisibleDoc('terms')}
            >
              Conditions d’Utilisation
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Bouton envoyer le code */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          disabled={!canSubmit}
          onPress={() => {
            console.log('Envoi code pour :', trimmedEmail);
            router.push('/verify-code');   // 👈 navigation
          }}
        >
          <Text style={styles.submitButtonText}>
            Envoyer le code de vérification
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logo bas */}
      <View style={styles.bottomLogoContainer}>
        <Image
          source={require('../IMAGE/LOGO.png')}
          style={styles.bottomLogo}
        />
      </View>

      {/* Modal PDF */}
      <Modal
        visible={visibleDoc !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setVisibleDoc(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {visibleDoc === 'privacy'
                ? 'Politique de confidentialité'
                : "Conditions d’utilisation"}
            </Text>

            <Text style={styles.modalBody}>
              Le document va s’ouvrir dans le navigateur ou le lecteur PDF
              de ton appareil. Quand tu as terminé, reviens ici et appuie
              sur OK pour fermer.
            </Text>

            <TouchableOpacity
              style={styles.modalOpenButton}
              onPress={() => {
                if (visibleDoc === 'privacy') {
                  openPdf(PDF_PRIVACY);
                } else if (visibleDoc === 'terms') {
                  openPdf(PDF_TERMS);
                }
              }}
            >
              <Text style={styles.modalOpenButtonText}>
                Ouvrir le document
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setVisibleDoc(null)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  errorText: {
    color: '#FF6B81',
    fontSize: 13,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkboxOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF2E73',
  },
  checkboxText: {
    flex: 1,
    color: 'white',
    fontSize: 13,
  },
  link: {
    color: '#FF2E73',
    textDecorationLine: 'underline',
  },
  submitButton: {
    marginTop: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#05051A',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    color: 'white',
    fontSize: 14,
  },
  modalOpenButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#4444AA',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalOpenButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modalButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#C3295A',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

