export type QrCheck = { ok: true; codes: number } | { ok: false; reason: string };

/** Pure decision so it can be tested without a device. */
export function assessQrScan(results: { type?: string; data?: string }[]): QrCheck {
  const codes = results.filter(result => (!result.type || /qr/i.test(result.type)) && typeof result.data === 'string' && result.data.trim().length >= 4);
  if (!codes.length) return { ok: false, reason: 'We could not find a readable QR code. Use a full, uncropped screenshot of the ticket with the QR code visible.' };
  if (new Set(codes.map(code => code.data)).size > 1) return { ok: false, reason: 'This screenshot shows more than one QR code. List one ticket at a time.' };
  return { ok: true, codes: 1 };
}

/** Reads the QR code on-device (iOS, Android and web). The image never leaves the phone. */
export async function checkTicketQr(uri: string): Promise<QrCheck> {
  try {
    const { scanFromURLAsync } = await import('expo-camera');
    return assessQrScan(await scanFromURLAsync(uri, ['qr']));
  } catch {
    return { ok: false, reason: 'This device could not read the screenshot. Try another image or update the app.' };
  }
}
