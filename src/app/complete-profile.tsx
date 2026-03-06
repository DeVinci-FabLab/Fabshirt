// @ts-nocheck
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { setCurrentUser } from '../store/userStore';

export default function CompleteProfileScreen() {
  const router = useRouter();

  // champs texte
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [phone, setPhone] = useState('');

  // date de naissance
  const [birthDate, setBirthDate] = useState(new Date(1998, 2, 28));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // taille / poids / genre
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const [gender, setGender] = useState<'Femme' | 'Homme' | 'Non renseigné'>(
    'Non renseigné'
  );

  // pickers modaux
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  // photo de profil
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission refusée pour la galerie');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ API stable
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.log('Erreur sélection image :', e);
    }
  };

  const formattedBirthDate = birthDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleSubmit = () => {
    const profile = {
      firstName,
      lastName,
      pseudo,
      birthDate: `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`,
      height,
      weight,
      phone,
      gender,
      profilePhoto,
    };

    console.log('Profil complété :', profile);

    // on garde ce profil en mémoire pour le dashboard
    setCurrentUser(profile);

    // puis on passe à l’écran d’association du T-shirt
    router.push('/associate-fabshirt');
  };

  return (
    <LinearGradient
      colors={['#02004A', '#C0175A']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Titre */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backArrow}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Compléter les informations</Text>
          <Text style={styles.subtitle}>
            Ces infos nous aident à bien calibrer tes données
          </Text>
        </View>

        {/* Photo */}
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={handlePickImage} style={styles.photoButton}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.photoImage} />
            ) : (
              <Image
                source={require('../IMAGE/APPAREIL.png')}
                style={styles.photoIcon}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Champs */}
        <View style={styles.form}>
          {/* Prénom */}
          <View style={styles.row}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre prénom ✎"
              placeholderTextColor="#8080A0"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Nom */}
          <View style={styles.row}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre nom ✎"
              placeholderTextColor="#8080A0"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Pseudo */}
          <View style={styles.row}>
            <Text style={styles.label}>Pseudo</Text>
            <TextInput
              style={styles.input}
              placeholder="Choisir un pseudo ✎"
              placeholderTextColor="#8080A0"
              value={pseudo}
              onChangeText={setPseudo}
            />
          </View>

          {/* Date de naissance */}
          <View style={styles.row}>
            <Text style={styles.label}>Date de naissance</Text>
            <TouchableOpacity
              style={styles.valueButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.valueText}>{formattedBirthDate}</Text>
            </TouchableOpacity>
          </View>

          {/* Taille */}
          <View style={styles.row}>
            <Text style={styles.label}>Taille</Text>
            <TouchableOpacity
              style={styles.valueButton}
              onPress={() => setShowHeightPicker(true)}
            >
              <Text style={styles.valueText}>{height} cm ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Poids */}
          <View style={styles.row}>
            <Text style={styles.label}>Poids</Text>
            <TouchableOpacity
              style={styles.valueButton}
              onPress={() => setShowWeightPicker(true)}
            >
              <Text style={styles.valueText}>{weight} kg ▾</Text>
            </TouchableOpacity>
          </View>

          {/* Téléphone */}
          <View style={styles.row}>
            <Text style={styles.label}>Numéro de téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="Saisis ton numéro ✎"
              placeholderTextColor="#8080A0"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Sexe */}
          <View style={styles.row}>
            <Text style={styles.label}>Sexe</Text>
            <TouchableOpacity
              style={styles.valueButton}
              onPress={() => setShowGenderPicker(true)}
            >
              <Text style={styles.valueText}>{gender} ▾</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton suivant */}
        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>Suivant</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date picker natif */}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={birthDate}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setBirthDate(date);
          }}
        />
      )}

      {/* Picker Taille */}
      <Modal visible={showHeightPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowHeightPicker(false)}>
                <Text style={styles.modalCancel}>Annuler</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Taille</Text>
              <TouchableOpacity onPress={() => setShowHeightPicker(false)}>
                <Text style={styles.modalConfirm}>Confirmer</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={height}
              onValueChange={(v) => setHeight(v)}
            >
              {Array.from({ length: 61 }).map((_, i) => {
                const h = 140 + i; // 140–200
                return (
                  <Picker.Item
                    key={h}
                    label={`${h} cm`}
                    value={h}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Picker Poids */}
      <Modal visible={showWeightPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowWeightPicker(false)}>
                <Text style={styles.modalCancel}>Annuler</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Poids du corps</Text>
              <TouchableOpacity onPress={() => setShowWeightPicker(false)}>
                <Text style={styles.modalConfirm}>Confirmer</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={weight}
              onValueChange={(v) => setWeight(v)}
            >
              {Array.from({ length: 71 }).map((_, i) => {
                const w = 40 + i; // 40–110
                return (
                  <Picker.Item
                    key={w}
                    label={`${w} kg`}
                    value={w}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Picker Genre */}
      <Modal visible={showGenderPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                <Text style={styles.modalCancel}>Annuler</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Genre</Text>
              <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                <Text style={styles.modalConfirm}>Confirmer</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={gender}
              onValueChange={(v) => setGender(v)}
            >
              <Picker.Item label="Femme" value="Femme" />
              <Picker.Item label="Homme" value="Homme" />
              <Picker.Item
                label="Non renseigné"
                value="Non renseigné"
              />
            </Picker>
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
    gap: 12,
  },
  backArrow: {
    color: 'white',
    fontSize: 26,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  photoButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#5A1E63',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoIcon: {
    width: 42,
    height: 42,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  form: {
    marginTop: 30,
    gap: 14,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#0896B5',
    paddingVertical: 6,
  },
  label: {
    color: 'white',
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    color: 'white',
    fontSize: 15,
  },
  valueButton: {
    paddingVertical: 4,
  },
  valueText: {
    color: 'white',
    fontSize: 15,
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#C3295A',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#02004A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalCancel: {
    color: 'white',
  },
  modalTitle: {
    color: 'white',
    fontWeight: '600',
  },
  modalConfirm: {
    color: '#FF2E73',
    fontWeight: '600',
  },
});
