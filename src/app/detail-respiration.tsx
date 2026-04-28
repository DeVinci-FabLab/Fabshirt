// @ts-nocheck
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AppHeaderSimple from '../components/AppHeaderSimple';

const BACKGROUND_BLUE = '#020045';
const { width } = Dimensions.get('window');

const chartConfig = {
  backgroundGradientFrom: '#1E1B4B',
  backgroundGradientTo: '#3E2B78',
  color: (opacity = 1) => `rgba(255, 100, 180, ${opacity})`,
  labelColor: () => 'rgba(255,255,255,0.7)',
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForDots: { r: '4', strokeWidth: '1', stroke: '#FF4C8B' },
};

export default function DetailRespirationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const data = params.resp ? JSON.parse(params.resp) : {
    labels: ['0','5','10','15','20','25','30'],
    datasets: [{ data: [14, 16, 22, 28, 30, 25, 18] }]
  };

  const vals = data.datasets[0].data;
  const min  = Math.min(...vals);
  const max  = Math.max(...vals);
  const moy  = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);

  return (
    <View style={styles.container}>
      <AppHeaderSimple />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.retour}>
          <Text style={styles.retourTexte}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.titre}>🌬️ Respiration</Text>

        <LineChart
          data={data}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16, marginBottom: 20 }}
          yAxisSuffix=" rpm"
          withInnerLines={false}
          formatYLabel={(v) => Math.round(Number(v)).toString()}
        />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MIN</Text>
            <Text style={styles.statValue}>{min}</Text>
            <Text style={styles.statUnit}>rpm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MOY</Text>
            <Text style={styles.statValue}>{moy}</Text>
            <Text style={styles.statUnit}>rpm</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MAX</Text>
            <Text style={styles.statValue}>{max}</Text>
            <Text style={styles.statUnit}>rpm</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitre}>À propos</Text>
          <Text style={styles.infoTexte}>
            La fréquence respiratoire mesure le nombre de cycles respiration/expiration par minute.
            Au repos elle est entre 12 et 20 rpm. À l'effort elle peut dépasser 30 rpm.
            Une respiration élevée prolongée peut indiquer de la fatigue ou un manque d'oxygène.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_BLUE },
  scroll: { padding: 20, paddingBottom: 40 },
  retour: { marginBottom: 12 },
  retourTexte: { color: '#FF4C8B', fontSize: 15, fontWeight: '600' },
  titre: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#1E1B4B', borderRadius: 14, padding: 14, alignItems: 'center', marginHorizontal: 4 },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  statValue: { color: 'white', fontSize: 26, fontWeight: '800' },
  statUnit: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  infoCard: { backgroundColor: '#1E1B4B', borderRadius: 14, padding: 16 },
  infoTitre: { color: 'white', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  infoTexte: { color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 20 },
});