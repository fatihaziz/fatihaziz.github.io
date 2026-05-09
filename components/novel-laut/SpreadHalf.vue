<template>
  <!-- ====== CHAPTER ====== -->
  <template v-if="spread.type === 'chapter'">
    <NovelLautChapterArt
      v-if="side === 'left'"
      :art="spread.chapter.art"
      :theme="spread.chapter.theme"
      :numeral="spread.chapter.numeral"
    />
    <NovelLautChapterText
      v-else
      :chapter="spread.chapter"
      :theme="spread.chapter.theme"
    />
  </template>

  <!-- ====== COVER ====== -->
  <template v-else-if="spread.type === 'cover'">
    <!-- LEFT (inside front cover, decorative) -->
    <div v-if="side === 'left'" class="cover-inside">
      <div class="cover-art">
        <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="cv-bg" cx="0.5" cy="0.5" r="0.7">
              <stop offset="0%" stop-color="#234058" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#0a1218" stop-opacity="1" />
            </radialGradient>
            <radialGradient id="cv-moon" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stop-color="#e8d4a8" stop-opacity="1" />
              <stop offset="100%" stop-color="#e8d4a8" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="600" fill="url(#cv-bg)" />
          <!-- big moon -->
          <circle cx="200" cy="240" r="180" fill="url(#cv-moon)" />
          <circle cx="200" cy="240" r="80" fill="#f0dcb0" opacity="0.95" />
          <!-- waves -->
          <g fill="#0e1820">
            <path d="M 0 380 Q 80 365 160 380 T 320 380 T 480 380 L 400 600 L 0 600 Z"
              opacity="0.4" class="cv-w cv-w1" />
            <path d="M 0 440 Q 80 425 160 440 T 320 440 T 480 440 L 400 600 L 0 600 Z"
              opacity="0.65" class="cv-w cv-w2" />
            <path d="M 0 500 Q 80 485 160 500 T 320 500 T 480 500 L 400 600 L 0 600 Z"
              opacity="0.9" />
          </g>
          <!-- moon reflection -->
          <g fill="#e8d4a8" opacity="0.4">
            <ellipse cx="200" cy="395" rx="50" ry="2" />
            <ellipse cx="200" cy="420" rx="60" ry="2" />
            <ellipse cx="200" cy="455" rx="40" ry="1.5" />
            <ellipse cx="200" cy="490" rx="48" ry="1.5" />
          </g>
        </svg>
      </div>
      <div class="cover-grain" aria-hidden="true"></div>
    </div>

    <!-- RIGHT (title page) -->
    <div v-else class="cover-title-page">
      <div class="cover-grain" aria-hidden="true"></div>
      <div class="cover-paper-lines" aria-hidden="true"></div>
      <div class="cover-content">
        <p class="cv-tag">Sebuah novel pendek</p>
        <div class="cv-divider"></div>
        <h1 class="cv-title">
          <span class="cv-t1">Laut</span>
          <span class="cv-t2">Tahu</span>
          <span class="cv-t3">Lebih Dulu</span>
        </h1>
        <div class="cv-divider"></div>
        <p class="cv-author">oleh<br><strong>Fatih Aziz</strong></p>
        <div class="cv-ornament">&hearts;</div>
        <p class="cv-cta">Buka halaman berikutnya untuk mulai membaca</p>
      </div>
    </div>
  </template>

  <!-- ====== BACK COVER ====== -->
  <template v-else>
    <!-- LEFT (closing line, fin) -->
    <div v-if="side === 'left'" class="back-closing">
      <div class="cover-paper-lines" aria-hidden="true"></div>
      <div class="back-content">
        <p class="back-line">Laut tidak pernah terburu-buru.</p>
        <p class="back-line">Laut menunggu.</p>
        <p class="back-line">Laut menunggu sampai kamu siap.</p>
        <div class="back-fin">~ fin ~</div>
        <p class="back-credit">
          Ditulis untuk siapa saja<br>
          yang sedang belajar<br>
          bahwa diri sendiri sudah cukup.
        </p>
      </div>
    </div>

    <!-- RIGHT (back cover, dark) -->
    <div v-else class="back-cover">
      <div class="back-cover-art">
        <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="bk-bg" cx="0.5" cy="0.5" r="0.8">
              <stop offset="0%" stop-color="#1a2a36" stop-opacity="1" />
              <stop offset="100%" stop-color="#070b10" stop-opacity="1" />
            </radialGradient>
          </defs>
          <rect width="400" height="600" fill="url(#bk-bg)" />
          <g fill="#e8d4a8">
            <circle cx="80" cy="80" r="1" opacity="0.6" />
            <circle cx="180" cy="50" r="0.8" opacity="0.5" />
            <circle cx="280" cy="100" r="1.2" opacity="0.7" />
            <circle cx="340" cy="140" r="0.9" opacity="0.5" />
            <circle cx="60" cy="180" r="1" opacity="0.6" />
            <circle cx="220" cy="200" r="0.8" opacity="0.55" />
            <circle cx="120" cy="250" r="1.1" opacity="0.65" />
          </g>
        </svg>
      </div>
      <div class="cover-grain" aria-hidden="true"></div>
      <div class="back-cover-content">
        <div class="bc-mark">F.A.</div>
        <div class="bc-line"></div>
        <p class="bc-credit">2026 &mdash; sebuah cerita</p>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Chapter } from '~/data/novel-laut'

type Spread =
  | { type: 'cover' }
  | { type: 'chapter'; chapter: Chapter }
  | { type: 'back' }

defineProps<{
  spread: Spread
  side: 'left' | 'right'
}>()
</script>

<style scoped>
/* Default: each component fills its container */
:deep(*) { box-sizing: border-box; }

/* ====== COVER LEFT (atmospheric art) ====== */
.cover-inside {
  position: relative;
  width: 100%;
  height: 100%;
  background: #0a1218;
  overflow: hidden;
}
.cover-art {
  position: absolute;
  inset: 0;
}
.cover-art svg {
  width: 100%;
  height: 100%;
  display: block;
}

@keyframes cv-wave-drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-15px); }
}
.cv-w { animation: cv-wave-drift 10s ease-in-out infinite; }
.cv-w2 { animation-duration: 13s; animation-delay: -2s; }

/* ====== COVER RIGHT (title page) ====== */
.cover-title-page {
  position: relative;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at center, #f4ebd9 0%, #e6d8b8 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-paper-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg, transparent, transparent 30px,
      rgba(120,90,50,0.04) 30px, rgba(120,90,50,0.04) 31px
    );
}

.cover-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,0,0,0.018) 2px, rgba(0,0,0,0.018) 3px
    );
  mix-blend-mode: multiply;
  opacity: 0.5;
}

.cover-content {
  position: relative;
  text-align: center;
  padding: 50px 40px;
  color: #2d231a;
  z-index: 2;
}

.cv-tag {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #a87234;
  font-style: italic;
  margin-bottom: 22px;
}

.cv-divider {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #a87234, transparent);
  margin: 22px auto;
}

.cv-title {
  font-family: 'Cormorant Garamond', 'Juliett', serif;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  font-weight: 400;
  line-height: 1;
}

.cv-t1 {
  font-size: 86px;
  font-weight: 600;
  font-style: italic;
  color: #2d231a;
  letter-spacing: 1px;
}
.cv-t2 {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 8px;
  text-transform: uppercase;
  color: #5a3a1a;
}
.cv-t3 {
  font-size: 30px;
  font-weight: 400;
  font-style: italic;
  color: #a87234;
  letter-spacing: 2px;
}

.cv-author {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-style: italic;
  margin-top: 14px;
  margin-bottom: 22px;
  color: #5a3a1a;
  line-height: 1.7;
}
.cv-author strong {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 2px;
  color: #2d231a;
}

.cv-ornament {
  font-size: 18px;
  color: #a87234;
  margin-bottom: 18px;
}

.cv-cta {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  font-style: italic;
  color: #8a7a5e;
  letter-spacing: 1px;
  margin: 0;
}

/* ====== BACK CLOSING (fin) ====== */
.back-closing {
  position: relative;
  width: 100%;
  height: 100%;
  background: #e8e0c8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.back-content {
  position: relative;
  text-align: center;
  z-index: 2;
  font-family: 'Cormorant Garamond', serif;
  color: #2d231a;
  max-width: 320px;
}

.back-line {
  font-size: 17px;
  font-style: italic;
  line-height: 1.6;
  margin: 0 0 14px;
  opacity: 0.85;
}

.back-fin {
  font-size: 18px;
  font-style: italic;
  margin: 28px 0;
  color: #a87234;
  letter-spacing: 4px;
}

.back-credit {
  font-size: 12px;
  letter-spacing: 2px;
  color: #6a5a3a;
  line-height: 1.8;
  font-style: italic;
  margin: 24px 0 0;
}

/* ====== BACK COVER (right) ====== */
.back-cover {
  position: relative;
  width: 100%;
  height: 100%;
  background: #07090e;
  overflow: hidden;
  color: #c0b8a0;
}

.back-cover-art {
  position: absolute;
  inset: 0;
}
.back-cover-art svg {
  width: 100%;
  height: 100%;
  display: block;
}

.back-cover-content {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 2;
}

.bc-mark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 8px;
  font-style: italic;
  color: #e8d4a8;
  margin-bottom: 16px;
}

.bc-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c0b8a0, transparent);
  margin: 0 auto 16px;
  opacity: 0.5;
}

.bc-credit {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-style: italic;
  opacity: 0.65;
  margin: 0;
}

/* ====== RESPONSIVE ====== */
@media (max-width: 1024px) {
  .cv-t1 { font-size: 70px; }
  .cv-t2 { font-size: 28px; letter-spacing: 6px; }
  .cv-t3 { font-size: 24px; }
}

@media (max-width: 768px) {
  .cv-t1 { font-size: 52px; }
  .cv-t2 { font-size: 22px; letter-spacing: 5px; }
  .cv-t3 { font-size: 19px; }
  .cv-tag { font-size: 10px; letter-spacing: 4px; }
  .cv-author { font-size: 13px; }
  .cv-author strong { font-size: 14px; }
  .back-line { font-size: 15px; }
  .back-fin { font-size: 16px; }
  .back-credit { font-size: 11px; }
  .bc-mark { font-size: 20px; letter-spacing: 6px; }
}
</style>
