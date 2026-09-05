import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { ChevronDownIcon } from '../common/Icons';

export function HomeTopBar({ city = 'CAPE TOWN' }: { city?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <Text style={styles.brandA}>A</Text>
        <Text style={styles.brandM}>M</Text>
        <Text style={styles.brandArrow}>→</Text>
      </View>
      <Pressable style={styles.locationTrigger} hitSlop={8}>
        <Text style={styles.locationText}>{city}</Text>
        <ChevronDownIcon size={13} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandA: {
    fontFamily: fonts.displayBlack,
    fontSize: 24,
    color: colors.coral,
  },
  brandM: {
    fontFamily: fonts.displayBlack,
    fontSize: 24,
    color: colors.ink,
  },
  brandArrow: {
    fontFamily: fonts.displayBlack,
    fontSize: 18,
    color: colors.lime,
    marginLeft: 2,
  },
  locationTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: fonts.displayBold,
    fontSize: 12,
    letterSpacing: 0.4,
    color: colors.ink,
  },
});
