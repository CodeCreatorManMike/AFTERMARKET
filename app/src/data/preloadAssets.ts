import { events } from './events';
import { tickets } from './tickets';
import { stickers } from './stickers';
import { RANDOM_STAMPS, MAIN_STAMP, SECONDARY_STAMP } from './stamps';
import { ALL_BADGES, profile } from './profile';

const LOGO = require('../../assets/logo/aftermarket-mark.png');

/** Every image module id the app can show, in one flat list — handed to
 * `expo-asset`'s `Asset.loadAsync` on the loading screen so nothing pops
 * in unstyled/undecoded the first time a screen renders it. */
export const preloadAssets: number[] = [
  LOGO,
  MAIN_STAMP,
  SECONDARY_STAMP,
  ...Array.from(new Set(events.map((e) => e.image))),
  ...tickets.map((t) => t.image),
  ...stickers,
  ...RANDOM_STAMPS,
  ...ALL_BADGES.map((b) => b.icon),
  profile.avatar,
  profile.banner,
];
