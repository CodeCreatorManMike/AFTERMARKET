import * as Location from 'expo-location';
import { City, cityForCoordinates, cityForCountry } from '../../data/catalogue';

/** One foreground fix at low accuracy; only the resulting city is kept. */
export async function locateCity(): Promise<{ city: City } | { error: string }> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') return { error: 'Location is off. Choose your city below — you can change it any time in Settings.' };
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
    let country: string | null | undefined;
    try { country = (await Location.reverseGeocodeAsync(position.coords))[0]?.isoCountryCode; } catch { /* Fall back to coordinates. */ }
    const city = country ? cityForCountry(country) : cityForCoordinates(position.coords.latitude, position.coords.longitude);
    return city ? { city } : { error: 'We are live in the UK (Oxford) and South Africa (Cape Town). Choose the one you want to browse.' };
  } catch {
    return { error: 'Could not get your location. Choose your city below.' };
  }
}
