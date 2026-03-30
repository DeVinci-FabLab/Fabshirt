// @ts-nocheck
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
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

export default function SignupScreen() {
  const router = useRouter();

  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Données physiques OPTIONNELLES
  const [sexe, setSexe] = useState<'F' | 'H' | 'A' | ''>('');
  const [age, setAge] = useState('');
  const [taille, setTaille] = useState('');
  const [poids, setPoids] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal pour le menu déroulant Sexe
  const [showSexeModal, setShowSexeModal] = useState(false);
  
  // Modal de succès
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const canSubmit = pseudo.length >= 3 && password.length >= 6 && password === confirmPassword;

  const handleRegister = async () => {
    if (!canSubmit) {
      setError('Vérifie les champs requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await localStorage.register(pseudo, password, {
        sexe: sexe || undefined,
        age: age ? parseInt(age) : undefined,
        taille_cm: taille ? parseInt(taille) : undefined,
        poids_kg: poids ? parseInt(poids) : undefined,
      });

      console.log('compte créé:', pseudo);
      
      // Afficher le modal de succès
      setShowSuccessModal(true);

    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue lors de l\'inscription';
      setError(errorMessage);
      console.log('Erreur inscription:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.replace('/login');
  };

  const getSexeLabel = () => {
    switch(sexe) {
      case 'H': return 'Homme';
      case 'F': return 'Femme';
      case 'A': return 'Autre';
      default: return 'Sélectionner';
    }
  };

  const handleSelectSexe = (value: 'F' | 'H' | 'A') => {
    setSexe(value);
    setShowSexeModal(false);
  };

  return (
    <LinearGradient colors={['#02004A', '#C0175A']} style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backArrow}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Inscription</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>REQUIS</Text>

            {/* Pseudo */}
            <Text style={styles.label}>Pseudo (unique)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ton identifiant"
                placeholderTextColor="#8080A0"
                autoCapitalize="none"
                value={pseudo}
                onChangeText={(text) => {
                  setPseudo(text);
                  setError('');
                }}
              />
            </View>

            {/* Mot de passe */}
            <Text style={styles.label}>Mot de passe (min 6 caractères)</Text>
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

            {/* Confirmer mot de passe */}
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirmer"
                placeholderTextColor="#8080A0"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
              />
            </View>

            {password !== confirmPassword && confirmPassword.length > 0 && (
              <Text style={styles.helperText}>
                Les mots de passe ne correspondent pas
              </Text>
            )}

            {/* Section optionnelle */}
            <Text style={styles.sectionTitle}>OPTIONNEL (données physiques)</Text>

            {/* Sexe - Menu déroulant */}
            <Text style={styles.label}>Sexe</Text>
            <TouchableOpacity 
              style={styles.inputWrapper}
              onPress={() => setShowSexeModal(true)}
            >
              <View style={styles.selectInput}>
                <Text style={[
                  styles.selectText,
                  !sexe && styles.selectPlaceholder
                ]}>
                  {getSexeLabel()}
                </Text>
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </TouchableOpacity>

            {/* Âge */}
            <Text style={styles.label}>Âge</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ex: 25"
                placeholderTextColor="#8080A0"
                keyboardType="number-pad"
                value={age}
                onChangeText={(text) => setAge(text.replace(/[^0-9]/g,''))}
              />
            </View>

            {/* Taille */}
            <Text style={styles.label}>Taille (cm)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ex: 175"
                placeholderTextColor="#8080A0"
                keyboardType="number-pad"
                value={taille}
                onChangeText={(text) => setTaille(text.replace(/[^0-9]/g, ''))}
              />
            </View>

            {/* Poids */}
            <Text style={styles.label}>Poids (kg)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ex: 70"
                placeholderTextColor="#8080A0"
                keyboardType="number-pad"
                value={poids}
                onChangeText={(text) => setPoids(text.replace(/[^0-9]/g, ''))}
              />
            </View>

            {/* MESSAGE DE VALIDATION DYNAMIQUE */}
            {!canSubmit && (pseudo.length > 0 || password.length > 0 || confirmPassword.length > 0) && (
              <View style={styles.validationBox}>
                <Text style={styles.validationTitle}>⚠️ ATTENTION ! Pour continuer :</Text>
                {pseudo.length < 3 && (
                  <Text style={styles.validationItem}>• Pseudo : minimum 3 caractères</Text>
                )}
                {password.length < 6 && (
                  <Text style={styles.validationItem}>• Mot de passe : minimum 6 caractères</Text>
                )}
                {password.length >= 6 && confirmPassword.length > 0 && password !== confirmPassword && (
                  <Text style={styles.validationItem}>• Les mots de passe doivent correspondre</Text>
                )}
                {confirmPassword.length === 0 && password.length >= 6 && (
                  <Text style={styles.validationItem}>• Confirmer le mot de passe</Text>
                )}
              </View>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Bouton inscription */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!canSubmit || loading) && styles.submitButtonDisabled,
              ]}
              disabled={!canSubmit || loading}
              onPress={handleRegister}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Créer mon compte</Text>
              )}
            </TouchableOpacity>

            {/* Lien connexion */}
            <TouchableOpacity
              style={{ marginTop: 20, alignItems: 'center', marginBottom: 40 }}
              onPress={() => router.navigate('/login')}
            >
              <Text style={{ color: 'white', fontSize: 14 }}>
                Déjà un compte ?{' '}
                <Text style={{ fontWeight: '700' }}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL MENU DÉROULANT SEXE */}
      <Modal
        visible={showSexeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSexeModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSexeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner le sexe</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSelectSexe('H')}
            >
              <Text style={styles.modalOptionText}>Homme</Text>
              {sexe === 'H' && <Text style={styles.modalCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSelectSexe('F')}
            >
              <Text style={styles.modalOptionText}>Femme</Text>
              {sexe === 'F' && <Text style={styles.modalCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSelectSexe('A')}
            >
              <Text style={styles.modalOptionText}>Autre</Text>
              {sexe === 'A' && <Text style={styles.modalCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowSexeModal(false)}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL DE SUCCÈS */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <Text style={styles.successTitle}>Compte créé !</Text>
            <Text style={styles.successText}>
              Bienvenue {pseudo} !{'\n'}
              Vous pouvez maintenant vous connecter.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.successButtonText}>Se connecter</Text>
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
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    gap: 24,
    marginBottom: 30,
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
    gap: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginBottom: 5,
    marginTop: 8,
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
  // Menu déroulant personnalisé
  selectInput: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: 'white',
    fontSize: 16,
  },
  selectPlaceholder: {
    color: '#8080A0',
  },
  selectArrow: {
    color: 'white',
    fontSize: 12,
  },
  helperText: {
    color: '#FF6B81',
    fontSize: 13,
    marginTop: 5,
  },
  errorText: {
    color: '#FF6B81',
    fontSize: 13,
    marginTop: 10,
  },
  // Validation box
  validationBox: {
    backgroundColor: 'rgba(255, 107, 129, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B81',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  validationTitle: {
    color: '#FF6B81',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  validationItem: {
    color: '#FF6B81',
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 5,
  },
  submitButton: {
    marginTop: 30,
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#02004A',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalCheck: {
    fontSize: 20,
    color: '#C3295A',
    fontWeight: '700',
  },
  modalCancel: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#999',
  },
  // Modal de succès
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    width: '85%',
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#02004A',
    marginBottom: 15,
  },
  successText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  successButton: {
    backgroundColor: '#C3295A',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 999,
    width: '100%',
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});