# Aftermarket app

Expo SDK 57 / React Native 0.86. Run `npm ci` in this folder, copy `.env.example` to `.env.local`, and use `npm run web` for the browser preview or `npm run ios` for an iPhone simulator. The pilot inbox is a public receiving address; passwords belong in an operator-managed secret store, never in an Expo public variable.

The iOS directory is generated and ignored by Git. After adding or upgrading a native Expo package, run `npx expo prebuild --platform ios --clean` before building. A stale generated project can compile yet fail at launch with errors such as `Cannot find native module 'ExpoImage'` or `AsyncStorage is null`. `expo-build-properties` in `app.json` builds React Native from source on iOS because the precompiled React Native core failed to link with this project's SVG version in the current local toolchain. The first native build will take longer.

`npm run typecheck`, `npm test`, and `npx expo export --platform web` check TypeScript, catalogue/filter/flow logic, and the web bundle. iOS requires Xcode and CocoaPods. The live catalogue URL is optional for local previews; it must point to a deployed, authorised FIXR/organiser feed for current Oxford and Cape Town events. Without that URL, Oxford uses a dated 24 October snapshot and Cape Town has an empty state.

## iOS build troubleshooting

- `pod install` fails with `Unicode Normalization not appropriate for ASCII-8BIT`: run `export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` first, then `npx expo run:ios`.
- A red "No script URL provided" screen means the app opened before Metro was ready. Start `npx expo start`, then quit and reopen the app.
