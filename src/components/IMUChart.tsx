import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SCREEN_W = Dimensions.get('window').width;

interface IMUChartProps {
  dataX: number[];
  dataY: number[];
  dataZ: number[];
  compact?: boolean;
}

export function IMUChart({ dataX, dataY, dataZ, compact = false }: IMUChartProps) {
  const MAX_POINTS = compact ? 30 : 60;
  const trim = (d: number[]) => {
    const s = d.length > MAX_POINTS ? d.slice(-MAX_POINTS) : d;
    return s.length < 2 ? [...s, ...Array(2 - s.length).fill(0)] : s;
  };

  const lastX = dataX.at(-1) ?? 0;
  const lastY = dataY.at(-1) ?? 0;
  const lastZ = dataZ.at(-1) ?? 0;

  const chartHeight = compact ? 100 : 160;

  return (
    <View style={compact ? styles.compactContainer : styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>IMU</Text>
        <View style={styles.valRow}>
          <Text style={[styles.val, { color: '#ff7b72' }]}>X {lastX.toFixed(2)}</Text>
          <Text style={[styles.val, { color: '#79c0ff' }]}>Y {lastY.toFixed(2)}</Text>
          <Text style={[styles.val, { color: '#56d364' }]}>Z {lastZ.toFixed(2)}</Text>
        </View>
      </View>
      <LineChart
        data={{
          labels: [],
          datasets: [
            { data: trim(dataX), color: () => '#ff7b72', strokeWidth: compact ? 1.5 : 2 },
            { data: trim(dataY), color: () => '#79c0ff', strokeWidth: compact ? 1.5 : 2 },
            { data: trim(dataZ), color: () => '#56d364', strokeWidth: compact ? 1.5 : 2 },
          ],
        }}
        width={SCREEN_W - 32}
        height={chartHeight}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withHorizontalLabels={!compact}
        withVerticalLabels={false}
        withShadow={false}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#161b22',
          backgroundGradientTo: '#161b22',
          decimalPlaces: 2,
          color: () => '#888',
          labelColor: () => '#8b949e',
        }}
        bezier
        style={styles.chart}
      />
      {!compact && (
        <View style={styles.legend}>
          {[['X', '#ff7b72'], ['Y', '#79c0ff'], ['Z', '#56d364']].map(([l, c]) => (
            <View key={l} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: c }]} />
              <Text style={styles.legendText}>{l}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#161b22', borderRadius: 12, padding: 16, marginBottom: 12 },
  compactContainer: { backgroundColor: '#161b22', borderRadius: 10, padding: 10, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  label: { color: '#8b949e', fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.8 },
  valRow: { flexDirection: 'row', gap: 8 },
  val: { fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },
  chart: { marginLeft: -16, borderRadius: 0 },
  legend: { flexDirection: 'row', gap: 16, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#8b949e', fontSize: 11 },
});
