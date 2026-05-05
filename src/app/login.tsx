/** 
 * 1. Utilisateur entre pseudo et mdp
 * 2. Code à 6 chiffres généré
 * 3. Utilisateur DOIT saisir ce code
 * 4. Code valable 30 minutes (sauf si session sportive en cours)
 */

// @ts-nocheck
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { localStorage } from '../services/localStorage';
import { setCurrentUser } from '../../store/userStore';

export default function LoginScreen() {
  const router = useRouter();

  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Afficher le code généré
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [connectionCode, setConnectionCode] = useState('');
  const [currentUser, setCurrentUserState] = useState(null);
  
  //saisie du code
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const canSubmit = pseudo.length >= 3 && password.length >= 6;

  /**
   * 1 : Connexion, Génération du code
   */
  const handleLogin = async () => {
    if (!canSubmit) {
      setError('Pseudo (min 3 caractères) et mot de passe (min 6 caractères) requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
    
      const { user, connectionCode } = await localStorage.login(pseudo, password);
      
      setCurrentUserState(user);
      setConnectionCode(connectionCode);
      setShowCodeModal(true);

      console.log('Identifiants corrects');
      console.log('Code généré:', connectionCode);
      console.log('Valable 2 minutes (test) / 30 minutes (prod)');
      
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      console.log('Erreur connexion:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * L'utilisateur a noté le code donc on Passer à la saisie
   */
  const handleCodeNoted = () => {
    setShowCodeModal(false);
    setShowCodeInput(true);
  };

  /// Verifier le code de saisie
  const handleVerifyCode = async () => {
    if (enteredCode.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const isValid = await localStorage.verifyConnectionCode(enteredCode, currentUser);

      if (isValid) {
        // Code correct Session activée
        setCurrentUser(currentUser);
        setShowCodeInput(false); 
        
        console.log('Code validé - Redirection vers dashboard');
        router.replace('/dashboard');
      } else {
        // Code incorrect
        setError('Code incorrect. Veuillez réessayer.');
        setEnteredCode('');
        console.log('Code incorrect');
      }
    } catch (error: any) {
      // Erreur lors de la vérification
      const errorMessage = error.message || 'Erreur lors de la vérification';
      setError(errorMessage);
      setEnteredCode('');
      console.log('Erreur vérification:', errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <LinearGradient colors={['#02004A', '#C0175A']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Connexion</Text>
      </View>

      {/* Formulaire */}
      <View style={styles.content}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Pseudo"
            placeholderTextColor="#8080A0"
            autoCapitalize="none"
            value={pseudo}
            onChangeText={(text) => {
              setPseudo(text);
              setError('');
            }}
          />
        </View>

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

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!canSubmit || loading) && styles.submitButtonDisabled,
          ]}
          disabled={!canSubmit || loading}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 20, alignItems: 'center' }}
          onPress={() => router.push('/signup')}
        >
          <Text style={{ color: 'white', fontSize: 14 }}>
            Pas encore de compte ?{' '}
            <Text style={{ fontWeight: '700' }}>S'inscrire</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.bottomLogoContainer}>
        <Image
          source={require('../../IMAGE/LOGO.png')}
          style={styles.bottomLogo}
        />
      </View>

      {/*AFFICHER LE CODE */}
      <Modal visible={showCodeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>CODE DE CONNEXION</Text>
            <Text style={styles.modalText}>
              Notez ce code. Vous devez le saisir pour accéder à l'application :
            </Text>
            
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{connectionCode}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Valable <Text style={styles.infoBold}>2 minutes</Text>
              </Text>
              <Text style={styles.infoText}>
                Ne change pas pendant une session sportive
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCodeNoted}
            >
              <Text style={styles.modalButtonText}>J'AI NOTÉ LE CODE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*SAISIR LE CODE */}
      <Modal visible={showCodeInput} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>ENTRER LE CODE</Text>
              <Text style={styles.modalText}>
                Saisissez le code de connexion à 6 chiffres :
              </Text>
              
              {error ? <Text style={styles.modalErrorText}>{error}</Text> : null}
              
              <TextInput
                style={styles.codeInput}
                placeholder="000000"
                placeholderTextColor="#CCC"
                keyboardType="number-pad"
                maxLength={6}
                value={enteredCode}
                onChangeText={(text) => {
                  setEnteredCode(text);
                  setError('');
                }}
                autoFocus
              />

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  (enteredCode.length !== 6 || verifying) && styles.submitButtonDisabled
                ]}
                disabled={enteredCode.length !== 6 || verifying}
                onPress={handleVerifyCode}
              >
                {verifying ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>VALIDER</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 15 }}
                onPress={() => {
                  setShowCodeInput(false);
                  setEnteredCode('');
                  setError('');
                  setShowCodeModal(true);
                }}
              >
                <Text style={{ color: '#C3295A', fontSize: 14 }}>
                  Revoir le code
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    marginTop: -8,
  },
  modalErrorText: {
    color: '#FF6B81',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#02004A',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
    lineHeight: 22,
  },
  codeBox: {
    backgroundColor: '#02004A',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#C3295A',
  },
  codeText: {
    fontSize: 42,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 10,
  },
  codeInput: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#C3295A',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 8,
    width: '100%',
  },
  infoBox: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  infoBold: {
    fontWeight: '700',
    color: '#C3295A',
  },
  modalButton: {
    backgroundColor: '#C3295A',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});