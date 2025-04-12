<template>
  <div class='w-screen font-mangiola' v-cloak>
    <section class='flex flex-col min-h-screen py-12 text-center text-white hero-1 bg-slate-600' v-transition>
      <nav class="relative z-10 mx-10 flex justify-between items-center">
        <a href='/' class="">
          <img src="~/assets/img/logo_1.jpeg" class="w-16 h-16 rounded-full logo-1">
        </a>
        <ul class="flex space-x-4 text-lg">
          <li><a href="#workshop" class="hover:underline">Workshop</a></li>
          <li><a href="#swordmaster" class="hover:underline">Swordmaster</a></li>
          <li><a href="#portfolio" class="hover:underline">Portfolio</a></li>
        </ul>
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
          Hi, I'm Fatih Al-Aziz
        </div>
        <div class='big-title-1 font-mondapick'>
          <!-- will add typing effect here later -->
          Welcome to my digital space!
        </div>
        <div class='my-10 sub-title-1'>
          <p>
            Code about AI, API, trade-bots, libs in Go, Rust, Python, and TS. <br>
            Having (too much) fun with them; so I don't have a girlfriend. <span class="font-sans">(¬‿¬ )</span>
          </p>
          <p class="mt-4">
            Based in Indonesia / Dubai, UAE. Currently working with <a href="https://github.com/turnkey-devs" target="_blank" class="underline hover:text-blue-300">@turnkey-devs</a>.
          </p>
        </div>
        <!-- Countdown removed -->
        <div class='relative flex justify-center m-auto my-8 text-center button-1'>
          <button class="mx-auto text-center drop-shadow-lg cta-btn-1 btn-progressive" @click="redirectToContact()">
            <span class="old">Contact Me!</span>
            <span class="new">Contact Me!</span>
          </button>
        </div>
      </div>
      <footer class='relative z-10 mt-auto mb-4 text-sm'> <!-- Added mb-4 for spacing -->
        <div class="mb-2"> <!-- Links container -->
          <a href="https://github.com/fatihaziz" target="_blank" class="underline hover:text-blue-300 mx-2">GitHub</a> |
          <a href="https://linkedin.com/in/fatih-aziz" target="_blank" class="underline hover:text-blue-300 mx-2">LinkedIn</a> |
          <a href="https://medium.com/@m.fatihalaziz" target="_blank" class="underline hover:text-blue-300 mx-2">Medium</a> |
          <a href="http://fatihaziz.com" target="_blank" class="underline hover:text-blue-300 mx-2">Website</a> |
          <a href="mailto:m.fatihalaziz@gmail.com" class="underline hover:text-blue-300 mx-2">Email</a>
        </div>
        <span>©2024 Fatih Al-Aziz</span>
        <br>
        <span class='text-xs opacity-75'> <!-- Made image credit smaller -->
          Hero Image by <a class="underline" target="_blank" href='https://www.deviantart.com/arsenixc/art/Sky-city-838770346'>Arsenicx</a>
        </span>
      </footer>
    </section>

    <!-- Cloud Transition Layer Placeholder -->
    <div class="relative h-40 -mt-20 overflow-hidden cloud-transition">
      <!-- Placeholder for Ghibli-style cloud layers -->
      <!-- We'll use pseudo-elements for a basic effect for now -->
    </div>

    <RpgPortfolioSection />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import RpgPortfolioSection from '~/components/rpg_portfolio_section.vue';

// Countdown refs removed

function redirectToContact() {
  window.open("https://github.com/fatihaziz", "_blank");
}

// countDown function removed

onMounted(() => {
  // Countdown interval removed
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

<style scoped>
  /* Cloud Transition Styling */
  .cloud-transition {
    /* background: linear-gradient(to bottom, transparent, #FFF 50%); /* Optional: Fades hero to white */
    background-color: #FFF; /* Base white background */
    z-index: 5; /* Ensure it's above hero if needed, adjust as necessary */
  }

  .cloud-transition::before,
  .cloud-transition::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 100px; /* Adjust height of cloud layers */
    background: white; /* Cloud color */
    border-radius: 50%; /* Makes the cloud shapes */
    opacity: 0.9; /* Soft look */
  }

  .cloud-transition::before {
    top: -50px; /* Position the first layer overlapping the top edge */
    transform: scaleX(1.5); /* Wider shape */
    z-index: 10;
  }

  .cloud-transition::after {
    top: -20px; /* Position the second layer slightly lower */
    transform: scaleX(1.2); /* Slightly narrower */
    opacity: 0.7; /* More translucent */
    z-index: 9;
  }
  /* NOTE: True Ghibli clouds + parallax would likely need SVGs/images and possibly JS */
</style>
