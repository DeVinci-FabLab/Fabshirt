// @ts-nocheck
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentUser } from '../store/userStore';

const BACKGROUND_BLUE = '#020045';
const TABS_BG = '#08072D';
const ACTIVE_BLUE = '#0896B5';
const ORANGE = '#F18904';
const PINK = '#C3295A';

const ACTIVITY_TYPES = ['Course à pied', 'Cyclisme', 'Tir à l’arc'];

export default function ActivitiesScreen() {
  const router = useRouter();
  const user = getCurrentUser();

  const [location, setLocation] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const [activityType, setActivityType] = useState('Activités');
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const askPermissionAndGetLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setHasPermission(false);
          setLoading(false);
          return;
        }

        setHasPermission(true);
        const current = await Location.getCurrentPositionAsync({});
        setLocation(current);
      } catch (e) {
        console.log('Erreur localisation :', e);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    askPermissionAndGetLocation();
  }, []);

  const region = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 48.895,
        longitude: 2.245,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.smallText}>12 novembre 2025</Text>
          <Text style={styles.smallText}>Aujourd’hui</Text>
        </View>

        <View style={styles.topRight}>
          {/* batterie */}
          <View style={styles.batteryCircle}>
            <Text style={styles.batteryText}>75%</Text>
          </View>

          {/* icône T-shirt */}
          <View style={styles.circleIcon}>
            <Image
              source={require('../IMAGE/TSHIRT.png')}
              style={styles.smallTopIcon}
            />
          </View>

          {/* avatar */}
          <View style={styles.avatarWrapper}>
            {user?.profilePhoto ? (
              <Image source={{ uri: user.profilePhoto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={{ color: 'white' }}>M</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* SELECTEUR ACTIVITE */}
      <View style={styles.activitySelectorWrapper}>
        <TouchableOpacity
          style={styles.activitySelector}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.activitySelectorText}>{activityType}</Text>
          <Text style={styles.activitySelectorArrow}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* CARTE */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Récupération de ta position…</Text>
          </View>
        ) : !hasPermission ? (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>
              Active la localisation pour afficher la carte autour de toi.
            </Text>
          </View>
        ) : (
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={region}
            region={region}
            mapType="hybrid"
            showsUserLocation
            showsMyLocationButton={false}
          >
            <Marker coordinate={region} />
          </MapView>
        )}
      </View>

      {/* BOUTON DEMARRER */}
      <View style={styles.bigPlayWrapper}>
        <TouchableOpacity
          style={styles.bigPlayButton}
          onPress={() => router.push('/activity-live')}
        >
          <Text style={styles.playTriangle}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* TABS BAS */}
      <View style={styles.tabsContainer}>
        {/* Accueil */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/dashboard')}
        >
          <Image
            source={require('../IMAGE/ACCUEIL.png')}
            style={styles.tabIconImage}
          />
          <Text style={styles.tabLabel}>Accueil</Text>
        </TouchableOpacity>

        {/* Activités (actif) */}
        <View style={styles.tabItem}>
          <Image
            source={require('../IMAGE/ACTIVITES.png')}
            style={[styles.tabIconImage, { tintColor: ACTIVE_BLUE }]}
          />
          <Text style={[styles.tabLabel, { color: ACTIVE_BLUE }]}>Activités</Text>
        </View>

        {/* Historique  👉 /history */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/history')}
        >
          <Image
            source={require('../IMAGE/HISTORIQUE.png')}
            style={styles.tabIconImage}
          />
          <Text style={styles.tabLabel}>Historique</Text>
        </TouchableOpacity>

        {/* T-shirt */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => console.log('T-shirt')}
        >
          <Image
            source={require('../IMAGE/TSHIRT.png')}
            style={styles.tabIconImage}
          />
          <Text style={styles.tabLabel}>T-shirt</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL LISTE TYPE D’ACTIVITE */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {ACTIVITY_TYPES.map((label) => (
              <TouchableOpacity
                key={label}
                style={styles.modalItem}
                onPress={() => {
                  setActivityType(label);
                  setPickerVisible(false);
                }}
              >
                <Text style={styles.modalText}>{label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.modalItem, { marginTop: 8 }]}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={[styles.modalText, { color: '#ccc' }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_BLUE,
  },
  topBar: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallText: {
    color: 'white',
    fontSize: 12,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  batteryCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00FF7F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryText: {
    color: '#00FF7F',
    fontSize: 10,
  },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallTopIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
    resizeMode: 'contain',
  },
  avatarWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activitySelectorWrapper: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  activitySelector: {
    backgroundColor: PINK,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activitySelectorText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  activitySelectorArrow: {
    color: 'white',
    fontSize: 16,
  },

  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
  },

  bigPlayWrapper: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bigPlayButton: {
    width: 140,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5B3A23',
    borderWidth: 3,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTriangle: {
    color: ORANGE,
    fontSize: 28,
    marginLeft: 4,
  },

  tabsContainer: {
    height: 80,
    backgroundColor: TABS_BG,
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIconImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  tabLabel: {
    color: 'white',
    fontSize: 11,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: BACKGROUND_BLUE,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: '80%',
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
