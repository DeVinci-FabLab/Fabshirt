// hooks/useSessionCheck.ts
/**
 * 🔐 HOOK DE VÉRIFICATION DE SESSION
 * 
 * Vérifie automatiquement si la session de connexion est encore valide.
 * Si elle expire → Demande à l'utilisateur de re-saisir le code.
 * 
 * ⚠️ Si une session sportive est en cours → Le code ne peut PAS expirer
 * 
 * À utiliser dans le Dashboard ou tout écran principal
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { localStorage } from '../services/localStorage';

export function useSessionCheck() {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    // Vérifier la session toutes les 30 secondes
    const interval = setInterval(async () => {
      const { isValid, needsReauth, currentCode } = await localStorage.isConnectionSessionValid();

      if (needsReauth) {
        // Session expirée → Demander de re-saisir le code
        setSessionCode(currentCode || '');
        setShowCodeInput(true);
      }
    }, 30000); // Toutes les 30 secondes

    // Vérification initiale
    checkSession();

    return () => clearInterval(interval);
  }, []);

  const checkSession = async () => {
    const { isValid, needsReauth, currentCode } = await localStorage.isConnectionSessionValid();

    if (needsReauth) {
      setSessionCode(currentCode || '');
      setShowCodeInput(true);
    }
  };

  const handleCodeVerify = async (enteredCode: string) => {
    if (enteredCode !== sessionCode) {
      Alert.alert('❌ Code incorrect', 'Veuillez réessayer');
      return false;
    }

    // Réactiver la session
    const user = await localStorage.getCurrentUser();
    if (user) {
      const isValid = await localStorage.verifyConnectionCode(enteredCode, user);
      if (isValid) {
        setShowCodeInput(false);
        Alert.alert('✅ Session réactivée');
        return true;
      }
    }

    return false;
  };

  const handleLogout = async () => {
    await localStorage.logout();
    router.replace('/login');
  };

  return {
    showCodeInput,
    sessionCode,
    handleCodeVerify,
    handleLogout,
  };
}
