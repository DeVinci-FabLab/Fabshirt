import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SCREEN_W = Dimensions.get('window').width;

interface SensorChartProps {
  label: string;
  unit: string;
  data: number[];
  color: string; // hex
  minVal?: number;
  maxVal?: number;
  compact?: boolean;
}

export function SensorChart({ label, unit, data, color, compact = false }: SensorChartProps) {
  const MAX_POINTS = compact ? 30 : 60;
  const displayData = data.length > MAX_POINTS ? data.slice(-MAX_POINTS) : data;
  const padded = displayData.length < 2 ? [...displayData, ...Array(2 - displayData.length).fill(displayData[0] ?? 0)] : displayData;

  const current = displayData.at(-1) ?? 0;
  const min = Math.min(...displayData);
  const max = Math.max(...displayData);

  const chartWidth = compact ? SCREEN_W - 32 : SCREEN_W - 32;
  const chartHeight = compact ? 100 : 160;

  return (
    <View style={compact ? styles.compactContainer : styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.currentVal, { color }]}>
          {typeof current === 'number' ? current.toFixed(1) : '—'} <Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>
      {!compact && (
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Min: {min.toFixed(1)}</Text>
          <Text style={styles.stat}>Max: {max.toFixed(1)}</Text>
          <Text style={styles.stat}>{displayData.length} pts</Text>
        </View>
      )}
      <LineChart
        data={{ labels: [], datasets: [{ data: padded, color: () => color, strokeWidth: compact ? 1.5 : 2 }] }}
        width={chartWidth}
        height={chartHeight}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withHorizontalLabels={!compact}
        withVerticalLabels={false}
        withShadow={false}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#0d1117',
          backgroundGradientTo: '#0d1117',
          decimalPlaces: 1,
          color: () => color,
          labelColor: () => '#8b949e',
          propsForDots: { r: '0' },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  compactContainer: {
    backgroundColor: '#161b22',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: { color: '#8b949e', fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.8 },
  currentVal: { fontSize: 22, fontWeight: '700' },
  unit: { fontSize: 13, fontWeight: '400', color: '#8b949e' },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 4 },
  stat: { color: '#484f58', fontSize: 11 },
  chart: { marginLeft: -16, borderRadius: 0 },
});
