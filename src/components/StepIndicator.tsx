import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/theme';

type Props = {
  current: number; // 1-based
  total: number;
  labels?: string[];
};

export function StepIndicator({ current, total, labels }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {Array.from({ length: total }).map((_, idx) => {
          const step = idx + 1;
          const done = step < current;
          const active = step === current;
          return (
            <React.Fragment key={step}>
              <View
                style={[
                  styles.circle,
                  done && styles.circleDone,
                  active && styles.circleActive,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    (done || active) && styles.circleTextActive,
                  ]}
                >
                  {step}
                </Text>
              </View>
              {step < total && (
                <View
                  style={[styles.bar, step < current && styles.barDone]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
      {labels && (
        <Text style={styles.label}>
          Paso {current} de {total}: {labels[current - 1]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  circleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  circleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  circleTextActive: {
    color: '#fff',
  },
  bar: {
    flex: 1,
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  barDone: {
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
