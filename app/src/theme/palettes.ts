export interface Palette {
  scheme: 'light' | 'dark';
  background: string;
  ink: string;
  coral: string;
  lime: string;
  cream: string;

  surface: string;
  surfaceRaised: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  border: string;
  borderStrong: string;

  coralSoft: string;
  limeSoft: string;

  overlay: string;

  tabInactive: string;
}

export const lightPalette: Palette = {
  // "Day" mode: Verified Lime as the page ground (not white/cream), Ink stays
  // the text/structure color unchanged — same layout as dark mode, just the
  // day-side of the brand's Ink/Lime pairing instead of a plain paper surface.
  scheme: 'light',
  background: '#C6FF3D',
  ink: '#14102B',
  coral: '#FF5470',
  lime: '#C6FF3D',
  cream: '#F5F0E6',

  surface: '#B4EE2E',
  surfaceRaised: '#FFFFFF',

  textPrimary: '#14102B',
  textSecondary: 'rgba(20,16,43,0.62)',
  textMuted: 'rgba(20,16,43,0.4)',

  border: 'rgba(20,16,43,0.16)',
  borderStrong: 'rgba(20,16,43,0.3)',

  coralSoft: 'rgba(255,84,112,0.14)',
  limeSoft: 'rgba(20,16,43,0.08)',

  overlay: 'rgba(20,16,43,0.48)',

  tabInactive: 'rgba(20,16,43,0.65)',
};

export const darkPalette: Palette = {
  scheme: 'dark',
  background: '#14102B',
  ink: '#14102B',
  coral: '#FF5470',
  lime: '#C6FF3D',
  cream: '#F5F0E6',

  surface: '#1D1838',
  surfaceRaised: '#282148',

  textPrimary: '#F5F0E6',
  textSecondary: 'rgba(245,240,230,0.66)',
  textMuted: 'rgba(245,240,230,0.42)',

  border: 'rgba(245,240,230,0.16)',
  borderStrong: 'rgba(245,240,230,0.32)',

  coralSoft: 'rgba(255,84,112,0.18)',
  limeSoft: 'rgba(198,255,61,0.16)',

  overlay: 'rgba(0,0,0,0.55)',

  tabInactive: 'rgba(245,240,230,0.55)',
};

export const palettes = { light: lightPalette, dark: darkPalette };
