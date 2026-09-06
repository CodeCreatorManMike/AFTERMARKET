import React, { useState } from 'react';
import { Image, ImageBackground, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../../theme/typography';
import { QRCodeGraphic } from './QRCodeGraphic';

const WIDGET = require('../../../assets/widgets/qr-scan-card.png');
const LOGO = require('../../../assets/logo/aftermarket-mark.png');

// Aspect ratio of the source widget artwork (1916x821) — the QR "slot"
// is a pre-baked blank square in that image, measured (via pixel-mask
// analysis of the largest connected cream blob) at these percentages,
// so the code overlay lands in exactly the same spot regardless of how
// wide the card renders.
const WIDGET_RATIO = 1916 / 821;
const SLOT = { left: '56.5%', top: '16.2%', width: '25.6%', height: '58%' } as const;

export function ProfileQRCard({ username }: { username: string }) {
  const [widgetWidth, setWidgetWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidgetWidth(e.nativeEvent.layout.width);
  const qrSize = widgetWidth * 0.256 * 0.86;

  return (
    <View style={styles.wrap}>
      <View style={styles.widget} onLayout={onLayout}>
        <ImageBackground source={WIDGET} style={styles.fill} resizeMode="contain">
          <View style={[styles.slot, SLOT]}>
            {qrSize > 0 && <QRCodeGraphic seed={username} size={qrSize} />}
            <View style={styles.logoBadge}>
              <Image source={LOGO} style={styles.logoBadgeImg} resizeMode="contain" />
            </View>
          </View>
        </ImageBackground>
      </View>

      <Text style={styles.username}>{username.toUpperCase()}</Text>
      <Text style={styles.url}>AFTERMARKET.COM/U/{username.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  widget: {
    width: '100%',
    aspectRatio: WIDGET_RATIO,
    position: 'relative',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  slot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    position: 'absolute',
    width: '26%',
    height: '26%',
    borderRadius: 999,
    backgroundColor: '#F5F0E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeImg: {
    width: '70%',
    height: '70%',
  },
  username: {
    fontFamily: fonts.mono,
    fontSize: 12.5,
    letterSpacing: 0.6,
    color: '#F5F0E6',
    marginTop: 10,
  },
  url: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.4,
    color: 'rgba(245,240,230,0.6)',
    marginTop: 2,
  },
});
