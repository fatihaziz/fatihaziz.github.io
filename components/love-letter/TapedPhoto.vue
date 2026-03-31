<template>
  <figure
    class="taped-photo"
    :class="positionClass"
    :style="{ transform: `rotate(${rotation}deg)` }"
  >
    <div class="photo-window">
      <img :src="src" :alt="alt" loading="lazy" />
    </div>
    <figcaption class="caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src: string
  alt: string
  caption: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  rotation?: number
}

const props = withDefaults(defineProps<Props>(), {
  rotation: 0,
})

const positionClass = computed(() => `pos-${props.position}`)
</script>

<style scoped>
.taped-photo {
  position: absolute;
  z-index: 10;
  width: 150px;
  background: #fffdf5;
  padding: 6px 6px 28px;
  border-radius: 1px;
  box-shadow:
    0 3px 10px rgba(40, 30, 10, 0.13),
    0 1px 3px rgba(40, 30, 10, 0.08);
  margin: 0;
}

/* Photos sit at corners, mostly in the gutter/outside */
.pos-top-left {
  top: -55px;
  left: -55px;
}

.pos-top-right {
  top: -55px;
  right: -55px;
}

.pos-bottom-left {
  bottom: -55px;
  left: -55px;
}

.pos-bottom-right {
  bottom: -55px;
  right: -55px;
}

/* -- Photo area -- */
.photo-window {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  line-height: 0;
}

.photo-window img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* -- Caption -- */
.caption {
  font-family: 'Quicksand', sans-serif;
  font-size: 8px;
  color: #7a6e60;
  text-align: center;
  margin-top: 5px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  line-height: 1.3;
}

/* -- Tape strips -- */
.taped-photo::before {
  content: '';
  position: absolute;
  width: 52px;
  height: 16px;
  background: linear-gradient(
    155deg,
    rgba(215, 198, 162, 0.8),
    rgba(200, 183, 147, 0.5)
  );
  z-index: 10;
  border-radius: 1px;
  top: -7px;
  left: 50%;
  margin-left: -20px;
  transform: rotate(5deg);
}

.taped-photo::after {
  content: '';
  position: absolute;
  width: 46px;
  height: 14px;
  background: linear-gradient(
    155deg,
    rgba(215, 198, 162, 0.72),
    rgba(200, 183, 147, 0.45)
  );
  z-index: 10;
  border-radius: 1px;
  bottom: 10px;
  right: -8px;
  transform: rotate(-40deg);
}

/* -- Responsive: mobile -- */
@media (max-width: 520px) {
  .taped-photo {
    width: 110px;
    padding: 5px 5px 22px;
  }

  .pos-top-left {
    top: -40px;
    left: -30px;
  }

  .pos-top-right {
    top: -40px;
    right: -30px;
  }

  .pos-bottom-left {
    bottom: -40px;
    left: -30px;
  }

  .pos-bottom-right {
    bottom: -40px;
    right: -30px;
  }

  .taped-photo::before {
    width: 40px;
    height: 13px;
    margin-left: -16px;
  }

  .taped-photo::after {
    width: 36px;
    height: 11px;
    bottom: 8px;
    right: -6px;
  }
}

/* -- Responsive: very small phones -- */
@media (max-width: 380px) {
  .taped-photo {
    width: 90px;
    padding: 4px 4px 20px;
  }

  .pos-top-left {
    top: -30px;
    left: -15px;
  }

  .pos-top-right {
    top: -30px;
    right: -15px;
  }

  .pos-bottom-left {
    bottom: -30px;
    left: -15px;
  }

  .pos-bottom-right {
    bottom: -30px;
    right: -15px;
  }

  .caption {
    font-size: 6px;
    letter-spacing: 1px;
  }

  .taped-photo::before {
    width: 34px;
    height: 11px;
    margin-left: -14px;
  }

  .taped-photo::after {
    width: 30px;
    height: 10px;
    bottom: 6px;
    right: -4px;
  }
}
</style>
