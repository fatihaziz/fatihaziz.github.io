
<template>
  <div class='w-screen font-sans'>
    <div class='hero-1 font-juliett bg-slate-600'>
      <div class='title-1'>
        Welcome adventurers!
      </div>
      <div class='big-title-1'>
        <!-- will add typing effect here later -->
        My name is Fatih.
      </div>
      <div class='sub-title-1'>
        I am a backend-developer. Jack-of-all-trades starting from fullstack to devops and system security.
      </div>
      <div class='button-1'>
        <button>Contact me</button>
      </div>
    </div>
  </div>
  <NuxtPage />
</template>

<script lang="ts">
  import { defineComponent } from "@vue/runtime-core";

  export default defineComponent({
    name: "App",
    data() {
      return {
        textDay: 0,
        textHour: 0,
        textMinute: 0,
        textSecond: 0,
      };
    },
    methods: {
      countDown() {
        const countDay = new Date('October 1, 2024 21:30:00');
        const now = new Date();
        const counter = countDay.getTime() - now.getTime();
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        this.textDay = Math.floor(counter / day);
        this.textHour = Math.floor((counter % day) / hour);
        this.textMinute = Math.floor((counter % hour) / minute);
        this.textSecond = Math.floor((counter % minute) / second);
      }
    },
    mounted() {
      this.countDown();
      setInterval(this.countDown, 1000);
    }
  });
</script>

<style scoped>
  #__nuxt {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .hero-1 {
  }
</style>
