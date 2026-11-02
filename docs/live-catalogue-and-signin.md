# Live catalogue and sign-in setup

## Current state

The app shows only events returned by its catalogue API for the member's selected city. It refreshes on launch, when returning to the foreground, on screen focus, and every 15 minutes while active. Feeds older than 36 hours are hidden. The bundled October 2026 events are no longer used. A public-page prototype feed is visibly labelled **PROTOTYPE**.

The backend importer in `backend/aftermarket/catalogue_server.py` runs on startup and at 06:00 UTC daily. It needs a continuously running host, persistent SQLite storage, and a rights-confirmed feed covering the selected city. Set `AFTERMARKET_LICENSED_FIXR_FEED_URL`, `AFTERMARKET_LICENSED_FIXR_FEED_TOKEN`, and `AFTERMARKET_DB_PATH` on that host, then set `EXPO_PUBLIC_CATALOGUE_URL` in the app build to the HTTPS `/v1/catalogue` base URL. See `backend/README.md` for the required feed format and one-off import.

FIXR's public organiser API is scoped to events owned by one organiser account. A customer account cannot use it to list every event in Oxford or Cape Town. To display all FIXR events with their exact media and descriptions, obtain a provider or organiser agreement granting the data and display rights and a complete licensed feed. Do not use a customer account to scrape FIXR pages.

For this local proof of value, `backend/aftermarket/public_fixr_probe.py` is an experimental collector of public city and event pages. It uses a normal browser and does not log in, store cookies, or solve challenges. It currently reads the first Oxford page but has not completed a full pagination run; therefore no current Oxford snapshot was imported. The `AFTERMARKET_PUBLIC_FIXR_PROTOTYPE=1` worker switch is off by default. Do not rely on it for daily coverage until a full run completes and the results are checked. Prototype imports require `allow_prototype=True` explicitly; the normal importer still requires confirmed rights.

## Apple and Google prompts

Apple Sign In uses the iOS system prompt. The native build needs the Sign in with Apple capability for `com.codecreatormanmike.aftermarket`; `app.json` now includes the Expo config plugin and `usesAppleSignIn` setting. Test on a real iPhone with the correctly provisioned bundle ID.

Google uses the native Google Sign-In SDK on iOS and Android, and Expo AuthSession on web. In Google Cloud Console, create an iOS OAuth client for bundle ID `com.codecreatormanmike.aftermarket`, an Android OAuth client for the app package and signing certificate, and a Web OAuth client for your backend ID-token audience and web origin. Set `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, and `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` (the reversed iOS client ID shown in Google Cloud Console); Android also needs its correctly registered package and signing fingerprints. The iOS config plugin is added by `app.config.js` when its URL scheme is set. Rebuild the native app after adding these values. The app keeps Google unavailable while required configuration is missing.

These prompts currently prove only that the user completed a provider flow during onboarding. The app still stores a local preview profile. Before using identities to secure listings, purchases, or payments, add a server endpoint that verifies Apple or Google ID tokens against the provider's keys and audience, creates a member account, and issues a persistent app session. Email and phone options remain local previews and send no verification message.
