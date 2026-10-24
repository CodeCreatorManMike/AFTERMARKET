export type AuthMethod = 'Apple' | 'Google' | 'Email' | 'Phone';
export type Member = { name: string; bio: string; accent: 'coral' | 'lime'; method: AuthMethod; joined: string };
export type ListingEvent = { id: string; title: string; venue: string; startAt: string; description?: string; image?: string; custom?: boolean; sourceUrl?: string; dateOnly?: boolean };
export type Listing = { id: string; event: ListingEvent; provider: 'FIXR' | 'Fatsoma'; ticketType: string; price: number; currency?: 'ZAR' | 'GBP'; status: 'draft_review'; createdAt: string };
export function validContact(method: AuthMethod, value: string) {
  return method === 'Email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) : method === 'Phone' ? /^\+[1-9]\d{7,14}$/.test(value.replace(/[\s()-]/g, '')) : true;
}
export function priceInCents(value: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 10000000 ? cents : null;
}
// Cape Town event input; explicit offset avoids the device timezone changing the event.
export function eventStart(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const parsed = new Date(`${date}T${time}:00+02:00`);
  if (!Number.isFinite(parsed.getTime())) return null;
  const local = new Date(parsed.getTime() + 7200000).toISOString().slice(0, 10);
  return local === date ? parsed.toISOString() : null;
}

export type MarketplaceState = { member: Member | null; listings: Listing[] };
/** Treat device storage as untrusted; a corrupt preview must not crash navigation. */
export function decodeState(raw: string): MarketplaceState {
  const value = JSON.parse(raw);
  const text = (v: unknown): v is string => typeof v === 'string';
  const date = (v: unknown) => text(v) && Number.isFinite(Date.parse(v));
  if (!value || !Array.isArray(value.listings)) throw new Error('Invalid saved preview');
  const member = value.member;
  if (member !== null && (!member || !text(member.name) || member.name.trim().length < 2 || !text(member.bio) || !['coral', 'lime'].includes(member.accent) || !['Apple', 'Google', 'Email', 'Phone'].includes(member.method) || !date(member.joined))) throw new Error('Invalid saved member');
  for (const item of value.listings) {
    if (!item || !text(item.id) || !item.event || !text(item.event.id) || !text(item.event.title) || !text(item.event.venue) || !date(item.event.startAt) || (item.event.description !== undefined && !text(item.event.description)) || (item.event.sourceUrl !== undefined && (!text(item.event.sourceUrl) || !/^https:\/\/fixr\.co\/event\//.test(item.event.sourceUrl))) || (item.event.dateOnly !== undefined && typeof item.event.dateOnly !== 'boolean') || !['FIXR', 'Fatsoma'].includes(item.provider) || !text(item.ticketType) || (item.currency !== undefined && !['ZAR', 'GBP'].includes(item.currency)) || typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price <= 0 || item.price > 100000 || item.status !== 'draft_review' || !date(item.createdAt)) throw new Error('Invalid saved listing');
  }
  return { member, listings: value.listings };
}
