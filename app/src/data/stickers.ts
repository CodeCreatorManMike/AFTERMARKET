export const stickers: number[] = [
  require('../../assets/stickers/sticker-1.png'),
  require('../../assets/stickers/sticker-2.png'),
  require('../../assets/stickers/sticker-3.png'),
  require('../../assets/stickers/sticker-4.png'),
  require('../../assets/stickers/sticker-5.png'),
  require('../../assets/stickers/sticker-6.png'),
  require('../../assets/stickers/sticker-7.png'),
  require('../../assets/stickers/sticker-8.png'),
  require('../../assets/stickers/sticker-9.png'),
  require('../../assets/stickers/sticker-10.png'),
  require('../../assets/stickers/sticker-11.png'),
  require('../../assets/stickers/sticker-12.png'),
  require('../../assets/stickers/sticker-13.png'),
  require('../../assets/stickers/sticker-14.png'),
  require('../../assets/stickers/sticker-15.png'),
  require('../../assets/stickers/sticker-16.png'),
  require('../../assets/stickers/sticker-17.png'),
  require('../../assets/stickers/sticker-18.png'),
  require('../../assets/stickers/sticker-19.png'),
  require('../../assets/stickers/sticker-20.png'),
  require('../../assets/stickers/sticker-21.png'),
  require('../../assets/stickers/sticker-22.png'),
  require('../../assets/stickers/sticker-23.png'),
  require('../../assets/stickers/sticker-24.png'),
  require('../../assets/stickers/sticker-25.png'),
  require('../../assets/stickers/sticker-26.png'),
  require('../../assets/stickers/sticker-27.png'),
  require('../../assets/stickers/sticker-28.png'),
  require('../../assets/stickers/sticker-29.png'),
  require('../../assets/stickers/sticker-30.png'),
  require('../../assets/stickers/sticker-31.png'),
  require('../../assets/stickers/sticker-32.png'),
  require('../../assets/stickers/sticker-33.png'),
  require('../../assets/stickers/sticker-34.png'),
  require('../../assets/stickers/sticker-35.png'),
  require('../../assets/stickers/sticker-36.png'),
  require('../../assets/stickers/sticker-37.png'),
  require('../../assets/stickers/sticker-38.png'),
];

// Simple deterministic string hash -> stable "random" seed.
export function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
