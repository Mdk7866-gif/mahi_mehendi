import { localFont } from 'next/font/local';

// Great Vibes – cursive (only Regular weight exists)
const greatVibes = localFont({
  src: [
    {
      path: './fonts/GreatVibes-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-great-vibes', // CSS variable for easy use
  display: 'swap',
});

// Playfair Display – elegant serif
const playfairDisplay = localFont({
  src: [
    {
      path: './fonts/PlayfairDisplay-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/PlayfairDisplay-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-playfair-display',
  display: 'swap',
});

export { greatVibes, playfairDisplay };