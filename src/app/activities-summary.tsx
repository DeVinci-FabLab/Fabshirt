// @ts-nocheck
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AppHeaderSimple from '../components/AppHeaderSimple';

const BACKGROUND_BLUE = '#020045';
const CARD_PINK = '#C3295A';
const { width } = Dimensions.get('window');

const EXEMPLE_BPM          = { labels: ['0','5','10','15','20','25','30'], datasets: [{ data: [72, 85, 110, 145, 160, 138, 95] }] };
const EXEMPLE_IMU          = { labels: ['0','5','10','15','20','25','30'], datasets: [{ data: [0.2, 0.5, 1.1, 0.9, 1.3, 0.7, 0.3] }] };
const EXEMPLE_TRANSPIRATION = { labels: ['0','5','10','15','20','25','30'], datasets: [{ data: [10, 20, 35, 50, 65, 70, 68] }] };
const EXEMPLE_RESPIRATION  = { labels: ['0','5','10','15','20','25','30'], datasets: [{ data: [14, 16, 22, 28, 30, 25, 18] }] };

const miniConfig = {
  backgroundGradientFrom: '#1E1B4B',
  backgroundGradientTo: '#3E2B78',
  color: (opacity = 1) => `rgba(255, 100, 180, ${opacity})`,
  labelColor: () => 'transparent',
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForDots: { r: '0' },
};

function MiniWidget({ titre, emoji, unite, moyenne, data, onPress }) {
  return (
    <TouchableOpacity style={styles.widget} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.widgetHeader}>
        <Text style={styles.widgetEmoji}>{emoji}</Text>
        <Text style={styles.widgetTitre}>{titre}</Text>
        <Text style={styles.widgetMoyenne}>{moyenne} {unite}</Text>
      </View>
      <LineChart
        data={data}
        width={width / 2 - 36}
        height={80}
        chartConfig={miniConfig}
        bezier
        withHorizontalLabels={false}
        withVerticalLabels={false}
        withInnerLines={false}
        withOuterLines={false}
        withDots={false}
        style={{ borderRadius: 8, marginLeft: -18, marginTop: 4 }}
      />
    </TouchableOpacity>
  );
}

export default function ActivitySummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const bpmData     = params.bpm     ? JSON.parse(params.bpm)     : EXEMPLE_BPM;
  const imuData     = params.imu     ? JSON.parse(params.imu)     : EXEMPLE_IMU;
  const transpiData = params.transpi ? JSON.parse(params.transpi) : EXEMPLE_TRANSPIRATION;
  const respData    = params.resp    ? JSON.parse(params.resp)    : EXEMPLE_RESPIRATION;

  const moyenne = (data) => {
    const vals = data.datasets[0].data;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const navDetail = (page) => {
    router.push({
      pathname: page,
      params: {
        bpm:     JSON.stringify(bpmData),
        imu:     JSON.stringify(imuData),
        transpi: JSON.stringify(transpiData),
        resp:    JSON.stringify(respData),
      }
    });
  };

  return (
    <View style={styles.container}>
      <AppHeaderSimple />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titre}>Résumé de l'activité</Text>

        {!params.bpm && (
          <View style={styles.bandeau}>
            <Text style={styles.bandeauTexte}>
               Données d'exemple - Lance une activité pour voir tes vraies données
            </Text>
          </View>
        )}

        <View style={styles.grid}>
          <MiniWidget
            titre="Fréquence cardiaque" 
            unite="bpm" moyenne={moyenne(bpmData)} data={bpmData}
            onPress={() => navDetail('/detail-bpm')}
          />
          <MiniWidget
            titre="IMU / Mouvement" 
            unite="g" moyenne={moyenne(imuData)} data={imuData}
            onPress={() => navDetail('/detail-imu')}
          />
          <MiniWidget
            titre="Transpiration"
            unite="%" moyenne={moyenne(transpiData)} data={transpiData}
            onPress={() => navDetail('/detail-transpiration')}
          />
          <MiniWidget
            titre="Respiration" 
            unite="rpm" moyenne={moyenne(respData)} data={respData}
            onPress={() => navDetail('/detail-respiration')}
          />
        </View>

        <TouchableOpacity style={styles.bouton} onPress={() => router.push('/history')}>
          <Text style={styles.boutonTexte}>Voir l'historique</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_BLUE },
  scroll: { padding: 20, paddingBottom: 40 },
  titre: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  bandeau: { backgroundColor: '#3E2B78', borderRadius: 12, padding: 12, marginBottom: 16 },
  bandeauTexte: { color: 'rgba(255,255,255,0.8)', fontSize: 13, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  widget: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 14,
    width: width / 2 - 26,
    overflow: 'hidden',
  },
  widgetHeader: { marginBottom: 2 },
  widgetEmoji: { fontSize: 20, marginBottom: 4 },
  widgetTitre: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 2 },
  widgetMoyenne: { color: 'white', fontSize: 20, fontWeight: '800' },
  bouton: { backgroundColor: CARD_PINK, borderRadius: 18, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  boutonTexte: { color: 'white', fontWeight: '700', fontSize: 16 },
});