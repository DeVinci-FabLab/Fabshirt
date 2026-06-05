
// @ts-nocheck
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
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
import { sessionFlags } from '../services/Sessionflags';

const BG       = '#020045';
const CARD_BG  = 'rgba(255,255,255,0.05)';
const BORDER   = 'rgba(255,255,255,0.1)';
const PINK     = '#C3295A';
const BLUE     = '#0896B5';
const ORANGE   = '#F18904';

//modals possibles
type ModalType = 'none' | 'verifyPseudo' | 'verifyPassword' | 'editPseudo' | 'editPassword' | 'verifyDelete' | 'confirmDelete';

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const [modal, setModal] = useState<ModalType>('none');

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPseudo, setNewPseudo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [fieldError, setFieldError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const u = await localStorage.getCurrentUser();
      setUser(u);
    } catch (e) {
      console.log('Erreur chargement profil:', e);
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setCurrentPwd('');
    setNewPseudo('');
    setNewPassword('');
    setConfirmNewPassword('');
    setDeletePassword('');
    setFieldError('');
  };

  const closeModal = () => {
    setModal('none');
    resetFields();
  };

  //vérifier le mot de passe actuel, puis ouvrir le bon éditeur
  const handleVerifyPassword = async (nextModal: 'editPseudo' | 'editPassword') => {
    if (!currentPwd) {
      setFieldError('Veuillez saisir votre mot de passe.');
      return;
    }
    setSubmitting(true);
    const ok = await localStorage.verifyCurrentPassword(currentPwd);
    setSubmitting(false);

    if (!ok) {
      setFieldError('Mot de passe incorrect.');
      return;
    }

    setFieldError('');
    setCurrentPwd('');
    setModal(nextModal);
  };


  const handleVerifyDeletePassword = async () => {
    if (!deletePassword) {
      setFieldError('Veuillez saisir votre mot de passe.');
      return;
    }
    setSubmitting(true);
    const ok = await localStorage.verifyCurrentPassword(deletePassword);
    setSubmitting(false);

    if (!ok) {
      setFieldError('Mot de passe incorrect.');
      return;
    }
    setFieldError('');
    setModal('confirmDelete');
  };

  // Suppression du compte
  const handleDeleteAccount = async () => {
    setSubmitting(true);
    try {
      sessionFlags.isLoggingOut = true;
      await localStorage.deleteAccount();
      closeModal();
      router.replace('/login');
    } catch (e) {
      setFieldError(e.message || 'Une erreur est survenue.');
      sessionFlags.isLoggingOut = false;
    } finally {
      setSubmitting(false);
    }
  };

  // modifier le pseudo
  const handleSavePseudo = async () => {
    if (newPseudo.length < 3) {
      setFieldError('Le pseudo doit faire au moins 3 caractères.');
      return;
    }
    setSubmitting(true);
    try {
      await localStorage.updatePseudo(newPseudo);
      await loadUser();
      closeModal();
      Alert.alert('Succès', 'Votre pseudo a bien été modifié.');
    } catch (e) {
      setFieldError(e.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  // ETAPE 2b : modifier le mot de passe
  const handleSavePassword = async () => {
    if (newPassword.length < 6) {
      setFieldError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFieldError('Les mots de passe ne correspondent pas.');
      return;
    }
    setSubmitting(true);
    try {
      await localStorage.updatePassword(newPassword);
      closeModal();
      Alert.alert('Succès', 'Votre mot de passe a bien été modifié.');
    } catch (e) {
      setFieldError(e.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  // DECO termine la session et redirige vers login
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            sessionFlags.isLoggingOut = true;
            await localStorage.logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const avatarLetter = user?.pseudo?.charAt(0).toUpperCase() ?? '?';

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={BLUE} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* SCROLL — tout le contenu */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR + NOM */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarBigText}>{avatarLetter}</Text>
          </View>
          <Text style={styles.pseudoText}>{user?.pseudo ?? 'Utilisateur'}</Text>
          {user?.dateCreation && (
            <Text style={styles.dateCreation}>
              Membre depuis le{' '}
              {new Date(user.dateCreation).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </Text>
          )}
        </View>

        {/* INFORMATIONS DU COMPTE */}
        <Text style={styles.sectionTitle}>Compte</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => { resetFields(); setModal('verifyPseudo'); }}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}></Text>
              <Text style={styles.rowLabel}>Modifier le pseudo</Text>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => { resetFields(); setModal('verifyPassword'); }}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}></Text>
              <Text style={styles.rowLabel}>Modifier le mot de passe</Text>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* DOCUMENTS */}
        <Text style={styles.sectionTitle}>Documents</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Document', 'Le PDF sera disponible prochainement.')}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}></Text>
              <Text style={styles.rowLabel}>Politique de confidentialité</Text>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('Document', 'Le PDF sera disponible prochainement.')}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}></Text>
              <Text style={styles.rowLabel}>Guide d'utilisation</Text>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ZONE DANGER */}
        <Text style={styles.sectionTitle}>Zone de danger</Text>
        <View style={[styles.card, styles.dangerCard]}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => { resetFields(); setModal('verifyDelete'); }}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}></Text>
              <Text style={[styles.rowLabel, styles.dangerLabel]}>Supprimer mon compte</Text>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Espace pour que le bouton fixe */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOUTON DÉCONNEXION*/}
      <View style={styles.logoutBar}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>


      {/* Vérification mot de passe avant modification pseudo */}
      <Modal visible={modal === 'verifyPseudo'} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmation</Text>
            <Text style={styles.modalSubtitle}>
              Saisissez votre mot de passe actuel pour modifier votre pseudo.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe actuel"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={currentPwd}
              onChangeText={t => { setCurrentPwd(t); setFieldError(''); }}
            />
            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, !currentPwd && styles.btnDisabled]}
                onPress={() => handleVerifyPassword('editPseudo')}
                disabled={!currentPwd || submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmText}>Continuer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Vérification mot de passe avant modification mdp */}
      <Modal visible={modal === 'verifyPassword'} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmation</Text>
            <Text style={styles.modalSubtitle}>
              Saisissez votre mot de passe actuel pour en définir un nouveau.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe actuel"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={currentPwd}
              onChangeText={t => { setCurrentPwd(t); setFieldError(''); }}
            />
            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, !currentPwd && styles.btnDisabled]}
                onPress={() => handleVerifyPassword('editPassword')}
                disabled={!currentPwd || submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmText}>Continuer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modifier pseudo */}
      <Modal visible={modal === 'editPseudo'} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nouveau pseudo</Text>
            <TextInput
              style={styles.input}
              placeholder="Nouveau pseudo (min. 3 caractères)"
              placeholderTextColor="rgba(255,255,255,0.4)"
              autoCapitalize="none"
              value={newPseudo}
              onChangeText={t => { setNewPseudo(t); setFieldError(''); }}
            />
            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, newPseudo.length < 3 && styles.btnDisabled]}
                onPress={handleSavePseudo}
                disabled={newPseudo.length < 3 || submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmText}>Enregistrer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modifier mdp  */}
      <Modal visible={modal === 'editPassword'} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nouveau mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe (min. 6 caractères)"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={newPassword}
              onChangeText={t => { setNewPassword(t); setFieldError(''); }}
            />
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={t => { setConfirmNewPassword(t); setFieldError(''); }}
            />
            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, newPassword.length < 6 && styles.btnDisabled]}
                onPress={handleSavePassword}
                disabled={newPassword.length < 6 || submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmText}>Enregistrer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Vérif mot de passe avant suppression */}
      <Modal visible={modal === 'verifyDelete'} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Supprimer le compte</Text>
            <Text style={styles.modalSubtitle}>
              Saisissez votre mot de passe actuel pour continuer. Cette action est irréversible.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe actuel"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={deletePassword}
              onChangeText={t => { setDeletePassword(t); setFieldError(''); }}
            />
            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dangerBtn, !deletePassword && styles.btnDisabled]}
                onPress={handleVerifyDeletePassword}
                disabled={!deletePassword || submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmText}>Continuer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation finale avant suppression */}
      <Modal visible={modal === 'confirmDelete'} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Dernière confirmation</Text>
            <Text style={styles.modalSubtitle}>
              Toutes vos données (pseudo, mot de passe, sessions) seront définitivement supprimées. Cette action est irréversible.
            </Text>
            {fieldError ? <Text style={styles.errorText}>{fieldError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dangerBtn}
                onPress={handleDeleteAccount}
                disabled={submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmText}>Supprimer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // HEADER
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 32,
    alignItems: 'flex-start',
  },
  backArrow: {
    color: 'white',
    fontSize: 30,
    lineHeight: 32,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },

  // SCROLL
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // AVATAR
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: 'rgba(195,41,90,0.4)',
  },
  avatarBigText: {
    color: 'white',
    fontSize: 34,
    fontWeight: '700',
  },
  pseudoText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateCreation: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },

  // SECTIONS
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 20,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    fontSize: 18,
  },
  rowLabel: {
    color: 'white',
    fontSize: 15,
  },
  rowChevron: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 22,
  },
  separator: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 16,
  },

  // BOUTON DÉCONNEXION FIXE
  logoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  logoutButton: {
    backgroundColor: 'rgba(195,41,90,0.15)',
    borderWidth: 1.5,
    borderColor: PINK,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: PINK,
    fontSize: 15,
    fontWeight: '700',
  },

  // MODALS
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2,0,69,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#08072D',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    color: 'white',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    color: '#FF6B81',
    fontSize: 13,
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: PINK,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerCard: {
    borderColor: 'rgba(195,41,90,0.3)',
  },
  dangerLabel: {
    color: PINK,
  },
  dangerBtn: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: PINK,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
});