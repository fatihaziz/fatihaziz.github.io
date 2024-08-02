<template>
  <article>
      <h1>I will coming soon! 🎉</h1>
      <div>
          <p>Sorry for the inconvenience but I&rsquo;m still developing this website 🎉
          </p>
          <p>&mdash;</p>
      </div>
      <span>Be ready in:</span>
      <div style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      ">
          <p class="day">{{ textDay }} days</p>
          <p class="hour">{{ textHour }} hours</p>
          <p class="minute">{{ textMinute }} minutes</p>
          <p class="second">{{ textSecond }} seconds</p>
      </div>
  </article>
  <footer>
      <p>© 2024 https://github.com/fatihaziz</p>
  </footer>
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
        const countDay = new Date('September 1, 2024 21:30:00');
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

<style>
  body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80vh;
    margin: 0;
    text-align: center;
    padding: 20px;
    font: 20px Helvetica, sans-serif;
    /* color: #efe8e8; */
    color: #333;
  }

  body {
    background: hsla(24, 100%, 83%, 1);

    background: linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%);

    background: -moz-linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%);

    background: -webkit-linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%);

    filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#FFCAA6", endColorstr="#F86594", GradientType=1 );
  }

  #__nuxt {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  @media (min-width: 768px){
    body {
      padding-top: 150px;
    }
  }

  h1 {
    font-size: 50px;
  }

  article {
    display: block;
    text-align: left;
    max-width: 650px;
    margin: 0 auto;
    flex-grow: 1; /* Allow article to take up remaining space */
  }

  a {
    color: #dc8100;
    text-decoration: none;
  }

  a:hover {
    color: #efe8e8;
    text-decoration: none;
  }

</style>
