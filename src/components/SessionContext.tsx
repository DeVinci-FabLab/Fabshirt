// src/contexts/SessionContext.tsx
// GESTION GLOBALE DE LA SESSION

// @ts-nocheck
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { localStorage } from '../services/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionContext = createContext({});

export function SessionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const intervalRef = useRef(null);
  const hasShownExpiryAlert = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  // Modal de re-saisie du code lors du retour en foreground
  const [requiresReauth, setRequiresReauth] = useState(false);
  const requiresReauthRef = useRef(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef([]);

  const setReauth = (val) => {
    requiresReauthRef.current = val;
    setRequiresReauth(val);
  };

  useEffect(() => {
    console.log('SessionProvider monté');
    intervalRef.current = setInterval(checkSession, 5000);
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      console.log('SessionProvider démonté');
      if (intervalRef.current) clearInterval(intervalRef.current);
      subscription.remove();
    };
  }, []);

  /**
   * Détecte le retour en foreground.
   * Si une session est active demander le code 
   */
  
  const handleAppStateChange = async (nextState) => {
    const prevState = appStateRef.current;
    appStateRef.current = nextState;

    const comingBackToForeground =
      (prevState === 'background' || prevState === 'inactive') && nextState === 'active';

    if (!comingBackToForeground) return;

    console.log('App revenue en foreground - vérification session');

    try {
      const sessionJson = await AsyncStorage.getItem('fabshirt_connection_session');
      if (!sessionJson) return;

      const session = JSON.parse(sessionJson);

      if (session.isActive) {
        console.log('Session active - demande de re-saisie du code');
        setCodeDigits(['', '', '', '', '', '']);
        setCodeError('');
        setReauth(true);
      }
    } catch (error) {
      console.log('Erreur vérification AppState:', error);
    }
  };

  /**
   * Valide le code de reprise - ne génère PAS de nouvelle session.
   * Réinitialise seulement le timer d'inactivité si le code est correct.
   */
  const handleResumeValidate = async () => {
    const fullCode = codeDigits.join('');
    if (fullCode.length !== 6) return;

    setVerifying(true);
    setCodeError('');

    const ok = await localStorage.verifyResumeCode(fullCode);
    setVerifying(false);

    if (ok) {
      console.log('Code de reprise validé');
      setReauth(false);
      setCodeDigits(['', '', '', '', '', '']);
    } else {
      setCodeError('Code incorrect. Veuillez réessayer.');
    }
  };

  const handleDigitChange = (value, index) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = digit;
    setCodeDigits(newDigits);
    setCodeError('');
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const checkSession = async () => {
    if (requiresReauthRef.current) return;

    const publicPages = ['/', '/explore'];
    if (publicPages.includes(pathname)) return;

    try {
      const { isValid, needsReauth } = await localStorage.isConnectionSessionValid();

      const sessionData = await AsyncStorage.getItem('fabshirt_connection_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        const timeLeft = new Date(session.expiresAt).getTime() - Date.now();
        console.log('Session - expire dans:', Math.floor(timeLeft / 1000), 's');
      } else {
        console.log('Aucune session trouvée');
      }

      if (needsReauth && !hasShownExpiryAlert.current) {
        console.log('SESSION EXPIRÉE');
        hasShownExpiryAlert.current = true;

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        await localStorage.logout();

        Alert.alert(
          'Session expirée',
          'Votre session a expiré. Veuillez vous reconnecter.',
          [{ text: 'OK', onPress: () => router.replace('/login') }],
          { cancelable: false }
        );
      } else if (isValid) {
        await localStorage.updateActivity();
      }
    } catch (error) {
      console.log('Erreur vérification session:', error);
    }
  };

  const canValidate = codeDigits.join('').length === 6;

  return (
    <SessionContext.Provider value={{}}>
      {children}

      {/* Modal de re-saisie — affiché dès que l'app revient en foreground */}
      <Modal visible={requiresReauth} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.card}>

            <Text style={styles.title}>Application verrouillée</Text>
            <Text style={styles.subtitle}>
              Saisissez votre code de session pour continuer.
            </Text>

            <View style={styles.codeRow}>
              {codeDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(r) => (inputRefs.current[index] = r)}
                  style={[styles.digitInput, codeError ? styles.digitInputError : null]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleDigitChange(text, index)}
                  onKeyPress={(e) => handleDigitKeyPress(e, index)}
                  selectTextOnFocus
                />
              ))}
            </View>

            {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}

            <TouchableOpacity
              style={[styles.button, !canValidate && styles.buttonDisabled]}
              onPress={handleResumeValidate}
              disabled={!canValidate || verifying}
            >
              {verifying
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Valider</Text>
              }
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 0, 69, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#08072D',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  digitInput: {
    width: 44,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  digitInputError: {
    borderColor: '#FF6B81',
  },
  errorText: {
    color: '#FF6B81',
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#C3295A',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    minWidth: 160,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});