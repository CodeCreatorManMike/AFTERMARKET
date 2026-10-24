export type AuthMethod = 'Apple' | 'Google' | 'Email' | 'Phone';
export type Member = { name: string; bio: string; accent: 'coral' | 'lime'; method: AuthMethod; joined: string; city?: 'oxford' | 'cape_town'; citySource?: 'location' | 'manual'; guides?: Guide[] };
export type Guide = 'buy' | 'sell';
export type ListingEvent = { id: string; title: string; venue: string; startAt: string; description?: string; image?: string; custom?: boolean; sourceUrl?: string; dateOnly?: boolean; timezone?: 'Europe/London' | 'Africa/Johannesburg' };
export type Listing = { id: string; event: ListingEvent; provider: 'FIXR' | 'Fatsoma'; ticketType: string; price: number; currency?: 'ZAR' | 'GBP'; status: ListingStatus; qrChecked?: boolean; createdAt: string };
/** awaiting_transfer: seller must send via FIXR. transfer_sent: seller says sent; we confirm receipt in the FIXR account. */
export type ListingStatus = 'draft_review' | 'awaiting_transfer' | 'transfer_sent';
export const LISTING_STATUSES: ListingStatus[] = ['draft_review', 'awaiting_transfer', 'transfer_sent'];
export function validContact(method: AuthMethod, value: string) {
  return method === 'Email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) : method === 'Phone' ? /^\+[1-9]\d{7,14}$/.test(value.replace(/[\s()-]/g, '')) : true;
}
export function priceInCents(value: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 10000000 ? cents : null;
}
/** Local wall-clock date and time in an IANA timezone to an ISO instant (handles BST/GMT). */
export function eventStart(date: string, time: string, timezone = 'Africa/Johannesburg'): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const wall = Date.parse(`${date}T${time}:00Z`);
  if (!Number.isFinite(wall)) return null;
  const offsetAt = (instant: number) => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(instant));
    const f = (t: string) => parts.find(p => p.type === t)?.value ?? '00';
    return Date.parse(`${f('year')}-${f('month')}-${f('day')}T${f('hour')}:${f('minute')}:00Z`) - instant;
  };
  let instant = wall - offsetAt(wall);
  instant = wall - offsetAt(instant);
  const check = new Date(instant + offsetAt(instant)).toISOString();
  return check.slice(0, 10) === date && check.slice(11, 16) === time ? new Date(instant).toISOString() : null;
}

export type MarketplaceState = { member: Member | null; listings: Listing[] };
/** Treat device storage as untrusted; a corrupt preview must not crash navigation. */
export function decodeState(raw: string): MarketplaceState {
  const value = JSON.parse(raw);
  const text = (v: unknown): v is string => typeof v === 'string';
  const date = (v: unknown) => text(v) && Number.isFinite(Date.parse(v));
  if (!value || !Array.isArray(value.listings)) throw new Error('Invalid saved preview');
  const member = value.member;
  if (member !== null && (!member || !text(member.name) || member.name.trim().length < 2 || !text(member.bio) || !['coral', 'lime'].includes(member.accent) || !['Apple', 'Google', 'Email', 'Phone'].includes(member.method) || !date(member.joined) || (member.city !== undefined && !['oxford', 'cape_town'].includes(member.city)) || (member.citySource !== undefined && !['location', 'manual'].includes(member.citySource)) || (member.guides !== undefined && (!Array.isArray(member.guides) || !member.guides.every((g: unknown) => g === 'buy' || g === 'sell'))))) throw new Error('Invalid saved member');
  for (const item of value.listings) {
    if (!item || !text(item.id) || !item.event || !text(item.event.id) || !text(item.event.title) || !text(item.event.venue) || !date(item.event.startAt) || (item.event.description !== undefined && !text(item.event.description)) || (item.event.sourceUrl !== undefined && (!text(item.event.sourceUrl) || !/^https:\/\/fixr\.co\/event\//.test(item.event.sourceUrl))) || (item.event.dateOnly !== undefined && typeof item.event.dateOnly !== 'boolean') || (item.event.timezone !== undefined && !['Europe/London', 'Africa/Johannesburg'].includes(item.event.timezone)) || !['FIXR', 'Fatsoma'].includes(item.provider) || !text(item.ticketType) || (item.currency !== undefined && !['ZAR', 'GBP'].includes(item.currency)) || typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price <= 0 || item.price > 100000 || !LISTING_STATUSES.includes(item.status) || (item.qrChecked !== undefined && typeof item.qrChecked !== 'boolean') || !date(item.createdAt)) throw new Error('Invalid saved listing');
  }
  return { member, listings: value.listings };
}
