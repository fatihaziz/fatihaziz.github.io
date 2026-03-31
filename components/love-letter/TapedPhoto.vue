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
  width: 130px;
  background: #fffdf5;
  padding: 5px 5px 24px;
  border-radius: 1px;
  box-shadow:
    0 3px 10px rgba(40, 30, 10, 0.13),
    0 1px 3px rgba(40, 30, 10, 0.08);
  margin: 0;
}

/* Photos pushed mostly OUTSIDE the paper -- large negative offsets */
.pos-top-left {
  top: -60px;
  left: -45px;
}

.pos-top-right {
  top: -60px;
  right: -45px;
}

.pos-bottom-left {
  bottom: -60px;
  left: -45px;
}

.pos-bottom-right {
  bottom: -60px;
  right: -45px;
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
  font-size: 7px;
  color: #7a6e60;
  text-align: center;
  margin-top: 4px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  line-height: 1.3;
}

/* -- Tape strips -- */
.taped-photo::before {
  content: '';
  position: absolute;
  width: 48px;
  height: 15px;
  background: linear-gradient(
    155deg,
    rgba(215, 198, 162, 0.8),
    rgba(200, 183, 147, 0.5)
  );
  z-index: 10;
  border-radius: 1px;
  top: -6px;
  left: 50%;
  margin-left: -18px;
  transform: rotate(5deg);
}

.taped-photo::after {
  content: '';
  position: absolute;
  width: 42px;
  height: 13px;
  background: linear-gradient(
    155deg,
    rgba(215, 198, 162, 0.72),
    rgba(200, 183, 147, 0.45)
  );
  z-index: 10;
  border-radius: 1px;
  bottom: 8px;
  right: -7px;
  transform: rotate(-40deg);
}

/* -- Responsive: mobile -- */
@media (max-width: 520px) {
  .taped-photo {
    width: 100px;
  }

  .pos-top-left {
    top: -45px;
    left: -30px;
  }

  .pos-top-right {
    top: -45px;
    right: -30px;
  }

  .pos-bottom-left {
    bottom: -45px;
    left: -30px;
  }

  .pos-bottom-right {
    bottom: -45px;
    right: -30px;
  }

  .taped-photo::before {
    width: 38px;
    height: 12px;
    margin-left: -15px;
  }

  .taped-photo::after {
    width: 34px;
    height: 10px;
    bottom: 7px;
    right: -5px;
  }
}

/* -- Responsive: very small phones -- */
@media (max-width: 380px) {
  .taped-photo {
    width: 80px;
    padding: 4px 4px 20px;
  }

  .pos-top-left {
    top: -35px;
    left: -20px;
  }

  .pos-top-right {
    top: -35px;
    right: -20px;
  }

  .pos-bottom-left {
    bottom: -35px;
    left: -20px;
  }

  .pos-bottom-right {
    bottom: -35px;
    right: -20px;
  }

  .caption {
    font-size: 6px;
    letter-spacing: 1px;
  }

  .taped-photo::before {
    width: 30px;
    height: 10px;
    margin-left: -12px;
  }

  .taped-photo::after {
    width: 26px;
    height: 9px;
    bottom: 5px;
    right: -4px;
  }
}
</style>
