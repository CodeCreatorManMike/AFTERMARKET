import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Asset } from 'expo-asset';
import { MAIN_STAMP } from '../../data/stamps';
import { preloadAssets } from '../../data/preloadAssets';

const SPIN_MS = 1400;
const WORDMARK_FADE_MS = 200;
const WORDMARK_HOLD_MS = 550;

type Phase = 'spinning' | 'wordmark';

// Boot sequence: spin the brand stamp while every image/sticker/badge
// asset preloads, then flash the wordmark centered for a beat, then
// hand off to the app. Fonts are loaded by the caller before this ever
// mounts, so the wordmark can safely use Archivo from frame one.
export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<Phase>('spinning');
  const spin = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: SPIN_MS,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    loop.start();

    let cancelled = false;

    Asset.loadAsync(preloadAssets)
      .catch(() => {
        // Best-effort warmup — a missing/failed asset shouldn't block boot.
      })
      .then(() => {
        if (cancelled) return;
        loop.stop();
        setPhase('wordmark');
        Animated.timing(wordmarkOpacity, {
          toValue: 1,
          duration: WORDMARK_FADE_MS,
          useNativeDriver: false,
        }).start(() => {
          if (cancelled) return;
          setTimeout(() => {
            if (!cancelled) onFinish();
          }, WORDMARK_HOLD_MS);
        });
      });

    return () => {
      cancelled = true;
      loop.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      {phase === 'spinning' ? (
        <Animated.Image
          source={MAIN_STAMP}
          resizeMode="contain"
          style={[styles.stamp, { transform: [{ rotate }] }]}
        />
      ) : (
        <Animated.Text style={[styles.wordmark, { opacity: wordmarkOpacity }]}>AFTERMARKET</Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stamp: {
    width: 200,
    height: 200,
  },
  wordmark: {
    fontFamily: 'Archivo_900Black',
    fontSize: 32,
    letterSpacing: 3,
    color: '#FF5470',
  },
});
