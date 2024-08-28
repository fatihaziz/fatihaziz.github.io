<template>
  <div class='w-screen font-mangiola'>
    <section class='flex flex-col min-h-screen py-12 text-center text-white hero-1 bg-slate-600'>
      <nav class="relative z-10 mx-10">
        <a href='/' class="">
          <img src="~/assets/img/logo_1.jpeg" class="w-16 h-16 rounded-full logo-1">
        </a>
      </nav>
       <!-- Dark Transparent Layer -->
      <div class="absolute inset-0 bg-black opacity-55"></div>

      <!-- Content -->
      <div class='relative z-10 px-4'>
        <!-- <div class="relative flex justify-center mt-24 w-max-16 h-max-16 logo-1">
          <a href='/' class="">
            <img src="~/assets/img/logo_1.jpeg" class="w-16 h-16 rounded-full">
          </a>
        </div> -->
        <div class='title-1 font-mondapick'>
          Welcome home adventurers!
        </div>
        <div class='big-title-1 font-mondapick'>
          <!-- will add typing effect here later -->
          Let's go explore my city!
        </div>
        <div class='my-10 sub-title-1'>
          <p>
            Oh, you need an armor? sorry i don't sell that <span class="font-sans">(ㅅ´ ˘ `)</span>
            <br>
            <b>Hmm, You asking me what i have then?</b>
            <br>
            I have Programming skill <span class="font-sans">(duh.. 𖦹_𖦹)</span>, project management skill, <br> <b>and An Epic Legendary Yggdrasil Sword!</b> <span class="font-sans">✮✮✮✮✮ ৻(  •̀ ᗜ •́  ৻)</span>
          </p>
          <p>
            ... ... ...
          </p>
          <p>
            Well just kidding, enough jokes. It's just a simple web page. and its still on progress!
          </p>
        </div>
        <div class="my-12">
          <span>
            Maybe it will be ready in:
          </span>
          <div class="countdown font-mangiola">
            <div class="time-unit">{{ textDay }}<span>Days</span></div>
            <div class="time-unit">{{ textHour }}<span>Hours</span></div>
            <div class="time-unit">{{ textMinute }}<span>Minutes</span></div>
            <div class="time-unit">{{ textSecond }}<span>Seconds</span></div>
          </div>
          <span>
            ...just maybe
          </span>
        </div>
        <div class='relative flex justify-center m-auto my-8 text-center button-1'>
          <button class="mx-auto text-center drop-shadow-lg cta-btn-1 btn-progressive" @click="redirectToContact()">
            <span class="old">Contact Me!</span>
            <span class="new">Contact Me!</span>
          </button>
        </div>
      </div>
      <footer class='relative z-10 mt-auto mb-0'>
        <span>©2024 <a class="underline" target="_blank" href='https://github.com/fatihaziz'>Fatih Aziz</a></span>
        <br>
        <span class='text-sm'>
          Image by <a class="underline" target="_blank" href='https://www.deviantart.com/arsenixc/art/Sky-city-838770346'>Arsenicx</a>
        </span>
      </footer>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const textDay = ref(0);
const textHour = ref(0);
const textMinute = ref(0);
const textSecond = ref(0);

function redirectToContact() {
  window.open("https://github.com/fatihaziz", "_blank");
}

function countDown() {
  const countDay = new Date('October 1, 2024 21:30:00');
  const now = new Date();
  const counter = countDay.getTime() - now.getTime();
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  textDay.value = Math.floor(counter / day);
  textHour.value = Math.floor((counter % day) / hour);
  textMinute.value = Math.floor((counter % hour) / minute);
  textSecond.value = Math.floor((counter % minute) / second);
}

onMounted(() => {
  countDown();
  setInterval(countDown, 1000);
});
</script>

<style scoped>
  #__nuxt {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .countdown {
    display: flex;
    justify-content: center;
    gap: 17px;
    font-size: 2.17em;
  }

  .time-unit {
    position: relative;
    display: inline-block;
    padding: 0 5px;
    color: #fff;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  }

  .time-unit span {
    display: block;
    font-size: 0.5em;
    color: #ffffff;
  }

  .title-1 {
    font-size: 3rem;
  }

  .big-title-1 {
    font-size: 5rem;
  }

  .sub-title-1 {
    font-size: 1.1rem;
  }

  .hero-1 {
    background-image: url("~/assets/img/wallpaper_4.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed; /* Parallax Effect */
    background-position: center center;
    position: relative; /* Ensure positioning context for absolute child elements */
  }

  .absolute {
    position: absolute;
  }

  .relative {
    position: relative;
  }

  .dummy-section {
    height: 100vh; /* Full viewport height */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
  }

  .dummy-section p {
    font-size: 2rem;
  }

  .cta-btn-1 {
    font-size: 1.7rem;
    padding: 2rem 7rem;
    border: 0.2rem solid;
    border-radius: 3rem;
    border-color: #fff;
    background-color: transparent;
    text-align: center;
  }

  /* Hover effect for CTA button */
  .cta-btn-1:hover {
    background-color: #28253b;
    border-color: #28253b;
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .logo-1 {
      width: 1.7rem;
      height: 1.7rem;
      margin: auto;
    }
    .title-1 {
      margin: 1.314rem auto;
      font-size: 1.314rem;
    }

    .big-title-1 {
      margin: 1.314rem auto;
      font-size: 3rem;
      line-height: 100%;
    }

    .dummy-section p {
      font-size: 1.5rem;
      padding: 0 1rem;
    }

    .cta-btn-1 {
      font-size: 1.2rem;
      padding: 1.5rem 7rem;
    }
  }
</style>
