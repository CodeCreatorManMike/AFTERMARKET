import { TextStyle } from 'react-native';

export const fonts = {
  displayBlack: 'Archivo_900Black',
  displayExtraBold: 'Archivo_800ExtraBold',
  displayBold: 'Archivo_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
};

export const type: Record<string, TextStyle> = {
  hero: {
    fontFamily: fonts.displayBlack,
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -1.2,
  },
  pageTitle: {
    fontFamily: fonts.displayBlack,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.9,
  },
  sectionTitle: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 21,
    lineHeight: 26,
  },
  cardTitle: {
    fontFamily: fonts.displayExtraBold,
    fontSize: 19,
    lineHeight: 23,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 17,
  },
  monoSmall: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 15,
  },
};
