import * as ImagePicker from 'expo-image-picker';
// Keep the whole screenshot: cropping can remove the QR code or ticket details.
export async function pickImage(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset || asset.width < 1 || asset.height < 1) throw new Error('Choose a readable image.');
  if (asset.fileSize && asset.fileSize > 15 * 1024 * 1024) throw new Error('Choose an image smaller than 15 MB.');
  return asset.uri;
}
