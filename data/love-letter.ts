// ---------------------------------------------------------------------------
// Love Letter — data source for the "For My Eternity Love" page
// All content extracted from the original HTML; do NOT edit prose here
// without updating the canonical copy.
// ---------------------------------------------------------------------------

export interface PhotoData {
  src: string
  alt: string
  caption: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  rotation: number
}

export interface StickerData {
  type: 'heart' | 'star' | 'flower' | 'sparkle' | 'ribbon' | 'butterfly' | 'moon' | 'confetti'
  top?: string
  bottom?: string
  left?: string
  right?: string
  rotation: number
  size: string
  color: string
  opacity: number
}

export interface PageTheme {
  bodyFont: string
  titleFont: string
  paperColor: string
  lineColor: string
  inkColor: string
  accentColor: string
  roseColor: string
  goldColor: string
  mutedColor: string
  stickers: StickerData[]
}

export interface PageData {
  id: string
  type: 'cover' | 'content' | 'closing'
  pageNumber?: string
  title?: string
  subtitle?: string
  textBlocks: string[] // HTML strings for v-html
  photos: PhotoData[]
  theme: PageTheme
}

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------

export const letterTitle = "For My Eternity Love \u{1F496}\u{1F49D} My Dearest, My Dian, My Only One"

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export const pages: PageData[] = [
  // -----------------------------------------------------------------------
  // PAGE 0 — COVER
  // -----------------------------------------------------------------------
  {
    id: 'cover',
    type: 'cover',
    textBlocks: [],
    photos: [],
    theme: {
      bodyFont: 'font-quicksand',
      titleFont: 'font-playfair',
      paperColor: '#faf7f2',
      lineColor: 'transparent',
      inkColor: '#2c2420',
      accentColor: '#b08a2e',
      roseColor: '#c06868',
      goldColor: '#96751a',
      mutedColor: '#8a7e72',
      stickers: [],
    },
  },

  // -----------------------------------------------------------------------
  // PAGE 1 — GRATITUDE
  // -----------------------------------------------------------------------
  {
    id: 'gratitude',
    type: 'content',
    pageNumber: 'Page One',
    title: 'Gratitude',
    subtitle: 'The day everything changed',
    textBlocks: [
      // Block 1 — before photos
      '<p>This all started on 28 December, when Fatih met Dian for the first time. I\u2019m glad to have met you \u2014 more than you will ever know.</p><p>I wasn\u2019t looking. I wasn\u2019t ready. I had walls up that I thought no one could climb. But then you showed up \u2014 not with force, not with pressure \u2014 just with <span class="highlight">you being you.</span> And that was enough to change everything.</p>',
      // Block 2 — after photos
      '<p><span class="accent">You are the best thing I never planned.</span></p><p>Before you, I didn\u2019t know what it felt like to be truly seen. I walked through life carrying things alone, convincing myself that\u2019s just how it was supposed to be. But then you looked at me \u2014 really looked at me \u2014 and suddenly I didn\u2019t want to carry it alone anymore.</p><p>I thank God every single day for putting you in my path. Not because my life was empty before you \u2014 but because you made me realize how much fuller it could be. You opened my eyes to a kind of love I didn\u2019t think I deserved. You showed me that being vulnerable isn\u2019t weakness \u2014 it\u2019s the bravest thing a man can do.</p><p>And now that I\u2019ve found you, the desire to have you \u2014 to keep you, to protect what we have \u2014 <span class="highlight">it burns in me louder than anything I\u2019ve ever felt.</span></p><p>You are my unexpected surprise.<br>You are my answered prayer.<br>And I will spend every day proving that I\u2019m grateful you chose me too.</p>',
    ],
    photos: [
      {
        src: '/love-letter/photo-01-the-day-we-met.jpg',
        alt: 'First meeting',
        caption: '28 Dec \u2014 The day we met',
        position: 'top-right',
        rotation: 4,
      },
      {
        src: '/love-letter/photo-02-first-flowers.jpg',
        alt: 'First flowers',
        caption: '2 Jan \u2014 Your first flowers',
        position: 'bottom-left',
        rotation: -3,
      },
    ],
    theme: {
      bodyFont: 'font-cormorant',
      titleFont: 'font-juliett',
      paperColor: '#fdf6ec',
      lineColor: 'rgba(180,160,120,0.08)',
      inkColor: '#3a332d',
      accentColor: '#b08a2e',
      roseColor: '#c06868',
      goldColor: '#8b6914',
      mutedColor: '#8a7e72',
      stickers: [
        { type: 'star', top: '15px', right: '20px', rotation: 15, size: '18px', color: '#d4a843', opacity: 0.5 },
        { type: 'star', top: '80px', left: '12px', rotation: -20, size: '12px', color: '#d4a843', opacity: 0.35 },
        { type: 'star', bottom: '120px', right: '35px', rotation: 30, size: '14px', color: '#c9a03d', opacity: 0.4 },
        { type: 'flower', top: '40px', right: '10px', rotation: 0, size: '22px', color: '#e8b84d', opacity: 0.3 },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // PAGE 2 — LOVE
  // -----------------------------------------------------------------------
  {
    id: 'love',
    type: 'content',
    pageNumber: 'Page Two',
    title: 'Love',
    subtitle: 'The things I can never let go',
    textBlocks: [
      // Block 1 — before photos
      '<p>Three months. That\u2019s all it took for you to become the person I think about first when I wake up and last before I fall asleep.</p><p>I love the way you care \u2014 how you ask me what I\u2019m eating, tell me to be careful, call me back even when you\u2019re exhausted from work. The way you redirect your own stress just to make sure I\u2019m okay. You carry so much, Dian, and yet you still find room to carry me too. <span class="highlight">I see that. I will never take that for granted.</span></p>',
      // Block 2 — after photos
      '<p>I love the way you fight \u2014 not against me, but <span class="accent">for us.</span> When you got angry at me for not focusing on the road, it wasn\u2019t cruelty. It was fear. Fear of losing me. And knowing that your anger comes from love? That changed how I see everything.</p><p>I miss you in ways I can\u2019t explain. The distance between us feels like an ocean some nights. I miss hearing your voice crack when you laugh too hard. I miss how you light up over the smallest things \u2014 a sticker, a flower, a silly meme. I miss the nights where our 2 AM calls stretch into 3 AM because neither of us wants to hang up first.</p><p>What I can never let go about you: the way you fold origami hearts with words that hit harder than any poem. The way you write letters by hand in an age where no one writes anymore. The way you said <span class="highlight">\u201Cyou understand me like no one else ever has\u201D</span> \u2014 and how that sentence made me want to understand you even deeper, every single day.</p><p>We built compromises that most people don\u2019t build in years. We set boundaries. We had hard conversations about expectations, dealbreakers, and futures. And we did it not because we had to \u2014 but because we both wanted this to last.</p><p>You are not just someone I love.<br><span class="accent">You are someone I chose to build with.</span></p>',
    ],
    photos: [
      {
        src: '/love-letter/photo-03-that-look.jpg',
        alt: 'Her flirting',
        caption: '26 Jan \u2014 That look',
        position: 'top-left',
        rotation: -4,
      },
      {
        src: '/love-letter/photo-04-cosplay-day.jpg',
        alt: 'Cosplay Kobo',
        caption: '1 Feb \u2014 Cosplay day',
        position: 'top-right',
        rotation: 3,
      },
      {
        src: '/love-letter/photo-05-from-dubai.jpg',
        alt: 'Cosplay pro',
        caption: 'Always present, even from Dubai',
        position: 'bottom-right',
        rotation: -5,
      },
    ],
    theme: {
      bodyFont: 'font-satoshi',
      titleFont: 'font-playfair',
      paperColor: '#f8f0f0',
      lineColor: 'rgba(180,140,140,0.08)',
      inkColor: '#3a2828',
      accentColor: '#c08060',
      roseColor: '#c05070',
      goldColor: '#a0784a',
      mutedColor: '#9a7e7e',
      stickers: [
        { type: 'heart', top: '20px', left: '15px', rotation: -15, size: '16px', color: '#e07090', opacity: 0.45 },
        { type: 'heart', top: '60px', right: '25px', rotation: 10, size: '12px', color: '#d06080', opacity: 0.35 },
        { type: 'heart', bottom: '80px', left: '30px', rotation: 20, size: '14px', color: '#e08098', opacity: 0.4 },
        { type: 'heart', bottom: '150px', right: '15px', rotation: -10, size: '10px', color: '#d07088', opacity: 0.3 },
        { type: 'sparkle', top: '100px', left: '8px', rotation: 0, size: '8px', color: '#e8a0b0', opacity: 0.5 },
        { type: 'ribbon', top: '5px', left: '40%', rotation: 0, size: '40px', color: '#d08090', opacity: 0.25 },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // PAGE 3 — COMMITMENT
  // -----------------------------------------------------------------------
  {
    id: 'commitment',
    type: 'content',
    pageNumber: 'Page Three',
    title: 'Commitment',
    subtitle: 'My oath to you',
    textBlocks: [
      // Block 1 — before photos
      '<p>Dian, I want you to hear this \u2014 not as sweet words, but as an oath.</p><p>I will be <span class="accent">steady, consistent, and intentional</span> \u2014 because you taught me that a man sets the tone of a relationship, and a woman reflects what he gives. I heard you. I will never make you beg for reassurance. You will feel it in how I show up. Daily. Without exception.</p><p>I will never stop trying. Not a perfect man \u2014 but <span class="highlight">a man who tries.</span> A man who is hardworking, who will go above and beyond, who is imperfect but working towards being better. For you. Because of you.</p>',
      // Block 2 — after photos
      '<p>When you\u2019re difficult, I stay. When you push me away because you\u2019re scared, I stay. When the world is getting mean to you \u2014 <span class="accent">run to me.</span> I will be there.</p><p>I will speak up about what hurts me, and I will listen when you speak up about what hurts you \u2014 because that\u2019s what real communication is. I will not cross the lines you\u2019ve drawn. I will not make you question whether I was ever planning to stay.</p><p><span class="highlight">I\u2019ll take care of me for you, if you\u2019ll take care of you for me. That\u2019s all I ask.</span></p><p>You once wrote that I was the first person who made you feel both wildly unsure and unwaveringly certain. I want you to know \u2014 I felt the exact same way. I had no idea what I was doing. But I knew exactly why I had to.</p><p>Deep soul connections never go away.<br>If it\u2019s real, it will never be over.<br>And this \u2014 us \u2014 <span class="accent">is the most real thing I\u2019ve ever known.</span></p>',
    ],
    photos: [
      {
        src: '/love-letter/photo-06-you-came.jpg',
        alt: 'Train reunion',
        caption: '15 Feb \u2014 You came to find me',
        position: 'top-right',
        rotation: 5,
      },
      {
        src: '/love-letter/photo-07-valentines-day.jpg',
        alt: 'Valentine bouquet',
        caption: "14 Feb \u2014 Valentine's Day",
        position: 'bottom-left',
        rotation: -4,
      },
      {
        src: '/love-letter/photo-08-first-dinner.jpg',
        alt: 'Fine dinner',
        caption: '22 Mar \u2014 Our first dinner',
        position: 'bottom-right',
        rotation: 3,
      },
    ],
    theme: {
      bodyFont: 'font-neue-montreal',
      titleFont: 'font-mondapick',
      paperColor: '#f0f2f8',
      lineColor: 'rgba(140,150,180,0.08)',
      inkColor: '#2a2a3a',
      accentColor: '#7a80a0',
      roseColor: '#9050a0',
      goldColor: '#7a6830',
      mutedColor: '#8a8a9e',
      stickers: [
        { type: 'butterfly', top: '25px', left: '10px', rotation: 15, size: '22px', color: '#9070b0', opacity: 0.35 },
        { type: 'butterfly', bottom: '60px', right: '20px', rotation: -20, size: '18px', color: '#8060a0', opacity: 0.3 },
        { type: 'moon', top: '15px', right: '15px', rotation: 0, size: '20px', color: '#a090c0', opacity: 0.3 },
        { type: 'sparkle', top: '35px', right: '40px', rotation: 0, size: '6px', color: '#b0a0d0', opacity: 0.5 },
        { type: 'sparkle', top: '50px', right: '25px', rotation: 0, size: '5px', color: '#c0b0e0', opacity: 0.4 },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // PAGE 4 — CLOSING
  // -----------------------------------------------------------------------
  {
    id: 'closing',
    type: 'closing',
    textBlocks: [],
    photos: [],
    theme: {
      bodyFont: 'font-quicksand',
      titleFont: 'font-mangiola',
      paperColor: '#f5f2e8',
      lineColor: 'transparent',
      inkColor: '#2c2420',
      accentColor: '#b08a2e',
      roseColor: '#c06868',
      goldColor: '#96751a',
      mutedColor: '#8a7e72',
      stickers: [
        { type: 'confetti', top: '10px', left: '10%', rotation: 25, size: '6px', color: '#e07090', opacity: 0.5 },
        { type: 'confetti', top: '15px', right: '15%', rotation: -15, size: '5px', color: '#70b0e0', opacity: 0.5 },
        { type: 'confetti', bottom: '30px', left: '20%', rotation: 40, size: '7px', color: '#90d070', opacity: 0.45 },
        { type: 'confetti', bottom: '25px', right: '25%', rotation: -30, size: '5px', color: '#d0a040', opacity: 0.5 },
        { type: 'confetti', top: '50%', left: '5%', rotation: 10, size: '4px', color: '#c080d0', opacity: 0.4 },
        { type: 'confetti', top: '40%', right: '8%', rotation: -20, size: '6px', color: '#e0a050', opacity: 0.45 },
        { type: 'sparkle', top: '85%', left: '50%', rotation: 0, size: '10px', color: '#d4a843', opacity: 0.5 },
      ],
    },
  },
]
