# FabShirt — Application mobile React Native / Expo

Application de suivi sportif connectée au t-shirt FabShirt équipé de capteurs ESP32.

---

## Stack technique

- **React Native** via **Expo Router** (file-based routing)
- **TypeScript**
- **AsyncStorage** pour la persistance locale des séances
- **react-native-chart-kit** pour les graphes

---

## Structure du projet

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Navigation par onglets
│   │   ├── index.tsx            # Page d'accueil (login / signup)
│   │   ├── dashboard.tsx        # Tableau de bord
│   │   ├── activities.tsx       # Lancement d'une activité
│   │   ├── history.tsx          # Historique des séances
│   │   └── tshirt.tsx           # Visualisation des capteurs sur le t-shirt
│   ├── _layout.tsx              # Layout racine (SessionProvider)
│   ├── activity-live.tsx        # Écran temps réel pendant l'activité
│   ├── activities-summary.tsx   # Résumé après une séance
│   ├── detail-bpm.tsx           # Graphe détaillé BPM
│   ├── detail-imu.tsx           # Graphe détaillé IMU
│   ├── detail-transpiration.tsx # Graphe détaillé transpiration
│   ├── detail-temperature.tsx   # Graphe détaillé température extérieure
│   ├── login.tsx                # Connexion
│   ├── signup.tsx               # Inscription
│   ├── verify-code.tsx          # Vérification code
│   ├── set-password.tsx         # Définir mot de passe
│   ├── complete-profile.tsx     # Compléter le profil
│   └── profile.tsx              # Page profil utilisateur
├── components/
│   ├── SessionContext.tsx        # Contexte global : auth, capteurs, simulation, WiFi
│   ├── AppHeader.tsx             # Header avec navigation tabs
│   ├── AppHeaderSimple.tsx       # Header simple (pages hors tabs)
│   ├── SensorChart.tsx           # Composant graphe générique
│   └── IMUChart.tsx              # Composant graphe IMU (3 axes)
└── services/
    ├── localStorage.ts           # Gestion auth locale (AsyncStorage)
    └── Sessionflags.ts           # Flags globaux de session (logout, expiry)
```

---

## Données capteurs

Toute la logique capteurs est centralisée dans `SessionContext.tsx` :

- **Simulation** — `startSimulation(sport?)` génère des frames fictives toutes les 500ms
- **WiFi ESP32** — `startWifi('ws' | 'http', sport?)` se connecte à `192.168.4.1`
  - WebSocket : `ws://192.168.4.1:81`
  - HTTP polling : `http://192.168.4.1:80/data` (toutes les 500ms)

### Trame JSON attendue de l'ESP32

```json
{
  "bpm": 72,
  "imu": { "x": 0.1, "y": -0.3, "z": 9.81 },
  "transpiration": 45,
  "temperature": 18.5,
  "gps": { "lat": 48.856, "lng": 2.352, "alt": 35 },
  "steps": 142
}
```

`bpm`: int, Fréquence cardiaque (bpm) 
`imu.x/y/z` : float,  Accélération en g 
`transpiration` : int,  Niveau de transpiration (0–100 %) 
`temperature` : float, Température extérieure (°C) 
`gps.lat/lng/alt` : float, Position GPS 
`steps` : int, Nombre de pas cumulés depuis le démarrage 

---

## Capteurs sur le t-shirt

**Face**
- Épaule gauche : GPS
- Poitrine : ECG (BPM)

**Dos**
- Épaule droite : GPS
- Bas du dos (gauche) : IMU (BMA400)
- Bas du dos (centre) : Température extérieure (BME680)
- Bas du dos (droite) : Module ESP32 + batterie

---

## Installation

```bash
npm install
npx expo start --lan
```

> Utiliser `--lan` plutôt que `--tunnel` pour éviter les problèmes de connexion ngrok.

---

## WiFi AP ESP32

Le t-shirt crée son propre réseau :


SSID : `ESP32-Capteurs` 
Mot de passe : `12345678` 
IP : `192.168.4.1` 
HTTP : port `80` -- `/data` 
WebSocket : port `81` 