// @ts-nocheck
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AppHeaderSimple from '../components/AppHeaderSimple';

const BACKGROUND_BLUE = '#020045';
const CARD_PINK = '#C3295A';
const { width } = Dimensions.get('window');

const EXEMPLE_BPM = {
  labels: ['0', '5', '10', '15', '20', '25', '30'],
  datasets: [{ data: [72, 85, 110, 145, 160, 138, 95] }],
};
const EXEMPLE_IMU = {
  labels: ['0', '5', '10', '15', '20', '25', '30'],
  datasets: [{ data: [0.2, 0.5, 1.1, 0.9, 1.3, 0.7, 0.3] }],
};
const EXEMPLE_TRANSPIRATION = {
  labels: ['0', '5', '10', '15', '20', '25', '30'],
  datasets: [{ data: [10, 20, 35, 50, 65, 70, 68] }],
};
const EXEMPLE_RESPIRATION = {
  labels: ['0', '5', '10', '15', '20', '25', '30'],
  datasets: [{ data: [14, 16, 22, 28, 30, 25, 18] }],
};

const chartConfigBase = {
  backgroundGradientFrom: '#1E1B4B',
  backgroundGradientTo: '#3E2B78',
  color: (opacity = 1) => `rgba(255, 100, 180, ${opacity})`,
  labelColor: () => 'rgba(255,255,255,0.7)',
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForDots: { r: '3', strokeWidth: '1', stroke: '#FF4C8B' },
};

const chartConfigIMU = {
  ...chartConfigBase,
  decimalPlaces: 1,
};

function GraphCard({ titre, unite, data, config = chartConfigBase }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titre}</Text>
      <LineChart
        data={data}
        width={width - 56}
        height={180}
        chartConfig={config}
        bezier
        style={{ borderRadius: 12, marginLeft: -10 }}
        yAxisSuffix={unite}
        withInnerLines={false}
        withOuterLines={true}
        formatYLabel={(val) =>
          Number(val) < 10
            ? Number(val).toFixed(1)
            : Math.round(Number(val)).toString()
        }
      />
    </View>
  );
}

export default function ActivitySummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const bpmData     = params.bpm     ? JSON.parse(params.bpm as string)     : EXEMPLE_BPM;
  const imuData     = params.imu     ? JSON.parse(params.imu as string)     : EXEMPLE_IMU;
  const transpiData = params.transpi ? JSON.parse(params.transpi as string) : EXEMPLE_TRANSPIRATION;
  const respData    = params.resp    ? JSON.parse(params.resp as string)    : EXEMPLE_RESPIRATION;

  const estExemple = !params.bpm;

  return (
    <View style={styles.container}>
      <AppHeaderSimple />
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.titre}>Résumé de l'activité</Text>

        {estExemple && (
          <View style={styles.bandeauExemple}>
            <Text style={styles.bandeauTexte}>
               Données d'exemple
            </Text>
          </View>
        )}

        <GraphCard
          titre="   Fréquence cardiaque"
          unite=" bpm"
          data={bpmData}
          config={chartConfigBase}
        />

        <GraphCard
          titre="   IMU / Mouvement"
          unite=" g"
          data={imuData}
          config={chartConfigIMU}
        />

        <GraphCard
          titre="   Transpiration"
          unite="%"
          data={transpiData}
          config={chartConfigBase}
        />

        <GraphCard
          titre="   Respiration"
          unite=" rpm"
          data={respData}
          config={chartConfigBase}
        />

        <TouchableOpacity
          style={styles.bouton}
          onPress={() => router.push('/history')}
        >
          <Text style={styles.boutonTexte}>Voir l'historique</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_BLUE,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  titre: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  bandeauExemple: {
    backgroundColor: '#3E2B78',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  bandeauTexte: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  bouton: {
    backgroundColor: CARD_PINK,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  boutonTexte: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});