
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { localStorage } from '../services/localStorage';

export default function AppHeader() {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    loadUser();
    updateDate();
    
    // Mettre à jour la date toutes les minutes
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await localStorage.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('Erreur chargement utilisateur:', error);
    }
  };

  const updateDate = () => {
    const date = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    setCurrentDate(date);
  };

  // Pseudo ou "Utilisateur" par défaut
  const pseudo = user?.pseudo || 'Utilisateur';
  
  // Première lettre du pseudo en majuscule pour l'avatar
  const avatarLetter = pseudo.charAt(0).toUpperCase();

  return (
    <View style={styles.topBar}>
      {/* DATE */}
      <View>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      {/* ICONES DROITE */}
      <View style={styles.topRight}>
        {/* Batterie */}
        <View style={styles.batteryCircle}>
          <Text style={styles.batteryText}>75%</Text>
        </View>

        {/* Icône T-shirt */}
        <View style={styles.circleIcon}>
          <Image
            source={require('../../IMAGE/TSHIRT.png')}
            style={styles.smallTopIcon}
          />
        </View>

        {/* Avatar avec première lettre du pseudo */}
        <View style={styles.avatarWrapper}>
          {user?.profilePhoto ? (
            <Image 
              source={{ uri: user.profilePhoto }} 
              style={styles.avatarImage} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: { 
    color: 'white', 
    fontSize: 14,
    fontWeight: '500',
  },
  topRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10 
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
    fontWeight: '600',
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
    overflow: 'hidden' 
  },
  avatarImage: { 
    width: '100%', 
    height: '100%' 
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
