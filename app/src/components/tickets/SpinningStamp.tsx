import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

const SPIN_MS = 9000;

// Spins continuously on its own axis, independent of scroll — this
// lives in the screen header (outside the FlatList), so it's always
// on screen and always turning regardless of where the user has
// scrolled the ticket list.
export function SpinningStamp({ source, size = 68 }: { source: number; size?: number }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: SPIN_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[styles.stamp, { width: size, height: size, transform: [{ rotate }] }]}
    />
  );
}

const styles = StyleSheet.create({
  stamp: {
    marginTop: -6,
  },
});
