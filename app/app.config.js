const config = require('./app.json').expo;
const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

module.exports = {
  expo: {
    ...config,
    plugins: [
      ...config.plugins,
      ...(iosUrlScheme ? [['@react-native-google-signin/google-signin', { iosUrlScheme }]] : []),
    ],
  },
};
