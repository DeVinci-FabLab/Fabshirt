// src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { SessionProvider } from '../../components/SessionContext';

const TABS_BG = '#08072D';
const ACTIVE_BLUE = '#0896B5';

export default function TabLayout() {
  return (
    <SessionProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 80,
            backgroundColor: TABS_BG,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: ACTIVE_BLUE,
          tabBarInactiveTintColor: '#ffffff',
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: -4,
          },
          tabBarIconStyle: {
            marginTop: 8,
          },
        }}
      >
        {/* TAB 1 : ACCUEIL (Dashboard) */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('../../../IMAGE/ACCUEIL.png')}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                  resizeMode: 'contain',
                }}
              />
            ),
          }}
        />

        {/* TAB 2 : ACTIVITÉS */}
        <Tabs.Screen
          name="activities"
          options={{
            title: 'Activités',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('../../../IMAGE/ACTIVITES.png')}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                  resizeMode: 'contain',
                }}
              />
            ),
          }}
        />

        {/* TAB 3 : HISTORIQUE */}
        <Tabs.Screen
          name="history"
          options={{
            title: 'Historique',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('../../../IMAGE/HISTORIQUE.png')}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                  resizeMode: 'contain',
                }}
              />
            ),
          }}
        />

        {/* TAB 4 : T-SHIRT */}
        <Tabs.Screen
          name="tshirt"
          options={{
            title: 'T-shirt',
            tabBarIcon: ({ color }) => (
              <Image
                source={require('../../../IMAGE/TSHIRT.png')}
                style={{
                  width: 26,
                  height: 26,
                  tintColor: color,
                  resizeMode: 'contain',
                }}
              />
            ),
          }}
        />

        {/* INDEX - PAS DE BARRE */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarStyle: { display: 'none' },
            href: null,
          }}
        />
        
        {/* EXPLORE - PAS DE BARRE */}
        <Tabs.Screen
          name="explore"
          options={{
            tabBarStyle: { display: 'none' },
            href: null,
          }}
        />
      </Tabs>
    </SessionProvider>
  );
}