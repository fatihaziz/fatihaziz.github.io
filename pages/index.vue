<template>
  <div class='w-screen font-mangiola' v-cloak>
    <section class='flex flex-col min-h-screen py-12 text-center text-white hero-1 bg-slate-600' v-transition>
      <nav class="relative z-10 mx-10 flex justify-between items-center">
        <a href='/' class="">
          <img src="~/assets/img/logo_1.jpeg" class="w-16 h-16 rounded-full logo-1">
        </a>
        <ul class="flex space-x-4 text-lg">
          <li><a href="#about" class="hover:underline">About</a></li>
          <li><a href="#projects" class="hover:underline">Projects</a></li>
          <li><a href="#contact" class="hover:underline">Contact</a></li>
        </ul>
      </nav>

      <!-- Dark Transparent Layer -->
      <div class="absolute inset-0 bg-black opacity-55"></div>

      <!-- Main Content -->
      <div class='relative z-10 px-4 flex-1 flex flex-col justify-center'>
        <div class='title-1 font-mondapick mb-4'>
          Hi, I'm Fatih Al-Aziz
        </div>
        <div class='big-title-1 font-mondapick mb-6'>
          Welcome to my digital space!
        </div>

        <!-- Enhanced Description -->
        <div class='my-10 sub-title-1 max-w-4xl mx-auto'>
          <p class="mb-6 text-lg leading-relaxed">
            Building the future with AI, APIs, trading bots, and powerful libraries in
            <span class="text-blue-300 font-semibold">Go</span>,
            <span class="text-orange-300 font-semibold">Rust</span>,
            <span class="text-yellow-300 font-semibold">Python</span>, and
            <span class="text-cyan-300 font-semibold">TypeScript</span>.
          </p>
          <p class="mb-6 text-base opacity-90">
            Having (too much) fun with them; so I don't have a girlfriend. <span class="font-sans">(¬‿¬ )</span>
          </p>
          <p class="text-base opacity-80">
            Based in Indonesia / Dubai, UAE. Currently serving as CTO at
            <a href="https://github.com/turnkey-devs" target="_blank" class="underline hover:text-blue-300 font-medium">@turnkey-devs</a>.
          </p>
        </div>

        <!-- Key Highlights -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          <div class="backdrop-blur-sm bg-white/10 rounded-lg p-6 border border-white/20">
            <h3 class="text-xl font-semibold mb-2">🤖 AI & Automation</h3>
            <p class="text-sm opacity-90">Building intelligent systems that solve real-world problems</p>
          </div>
          <div class="backdrop-blur-sm bg-white/10 rounded-lg p-6 border border-white/20">
            <h3 class="text-xl font-semibold mb-2">⚡ Performance</h3>
            <p class="text-sm opacity-90">Optimizing systems for speed, scale, and reliability</p>
          </div>
          <div class="backdrop-blur-sm bg-white/10 rounded-lg p-6 border border-white/20">
            <h3 class="text-xl font-semibold mb-2">🚀 Innovation</h3>
            <p class="text-sm opacity-90">Leading technical teams to build cutting-edge solutions</p>
          </div>
        </div>

        <!-- Call to Action Buttons -->
        <div class='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button
            class="cta-btn-1 btn-primary"
            @click="scrollToProjects()"
          >
            View My Work
          </button>
          <button
            class="cta-btn-2 btn-secondary"
            @click="redirectToContact()"
          >
            Let's Connect
          </button>
        </div>

        <!-- Quick Stats -->
        <div class="flex flex-wrap justify-center gap-8 mt-12 text-center">
          <div class="stat-item">
            <div class="text-2xl font-bold text-blue-300">5+</div>
            <div class="text-sm opacity-80">Years Experience</div>
          </div>
          <div class="stat-item">
            <div class="text-2xl font-bold text-green-300">50+</div>
            <div class="text-sm opacity-80">Projects Delivered</div>
          </div>
          <div class="stat-item">
            <div class="text-2xl font-bold text-yellow-300">15+</div>
            <div class="text-sm opacity-80">Technologies Mastered</div>
          </div>
          <div class="stat-item">
            <div class="text-2xl font-bold text-purple-300">1</div>
            <div class="text-sm opacity-80">Amazing Team at TurnkeyID</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class='relative z-10 mt-auto mb-4 text-sm'>
        <div class="mb-4">
          <a href="https://github.com/fatihaziz" target="_blank" class="social-link">GitHub</a>
          <a href="https://linkedin.com/in/fatih-aziz" target="_blank" class="social-link">LinkedIn</a>
          <a href="https://medium.com/@m.fatihalaziz" target="_blank" class="social-link">Medium</a>
          <a href="mailto:m.fatihalaziz@gmail.com" class="social-link">Email</a>
        </div>
        <span>©2024 Fatih Al-Aziz</span>
        <br>
        <span class='text-xs opacity-75'>
          Hero Image by <a class="underline" target="_blank" href='https://www.deviantart.com/arsenixc/art/Sky-city-838770346'>Arsenicx</a>
        </span>
      </footer>
    </section>

    <!-- Enhanced Cloud Transition -->
    <div class="relative h-40 -mt-20 overflow-hidden cloud-transition">
      <div class="cloud-layer cloud-1"></div>
      <div class="cloud-layer cloud-2"></div>
      <div class="cloud-layer cloud-3"></div>
    </div>

    <!-- Content Sections -->
    <section id="about" class="py-20 bg-gradient-to-b from-white to-gray-50">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-8 text-gray-800">About Me</h2>
        <div class="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          <p class="mb-6">
            Started my journey in 2017 with a national web development competition.
            Fast forward to today, I'm leading technical innovation as CTO at TurnkeyID,
            building systems that serve thousands of users daily.
          </p>
          <p>
            My passion lies in creating elegant solutions to complex problems,
            mentoring incredible developers, and pushing the boundaries of what's possible with code.
          </p>
        </div>
      </div>
    </section>

    <section id="contact" class="py-20 bg-gradient-to-b from-gray-100 to-gray-200">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-8 text-gray-800">Let's Build Something Amazing</h2>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Always excited to collaborate on innovative projects. Whether you have an idea,
          need technical leadership, or just want to chat about technology.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:m.fatihalaziz@gmail.com"
            class="contact-btn-primary"
          >
            Send Email
          </a>
          <a
            href="https://linkedin.com/in/fatih-aziz"
            target="_blank"
            class="contact-btn-secondary"
          >
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import RpgPortfolioSection from '~/components/rpg_portfolio_section.vue';

function redirectToContact() {
  window.open("https://linkedin.com/in/fatih-aziz", "_blank");
}

function scrollToProjects() {
  document.getElementById('projects')?.scrollIntoView({
    behavior: 'smooth'
  });
}

onMounted(() => {
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
</script>

<style scoped>
  .title-1 {
    font-size: 3rem;
    font-weight: 600;
  }

  .big-title-1 {
    font-size: 5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sub-title-1 {
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .hero-1 {
    background-image: url("~/assets/img/wallpaper_4.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    background-position: center center;
    position: relative;
  }

  /* Enhanced CTA Buttons */
  .cta-btn-1 {
    font-size: 1.2rem;
    padding: 1rem 2.5rem;
    border: 2px solid #3b82f6;
    border-radius: 2rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  }

  .cta-btn-1:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }

  .cta-btn-2 {
    font-size: 1.2rem;
    padding: 1rem 2.5rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 2rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-weight: 600;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .cta-btn-2:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  /* Social Links */
  .social-link {
    display: inline-block;
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .social-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  /* Stats */
  .stat-item {
    min-width: 120px;
  }

  /* Enhanced Cloud Transition */
  .cloud-transition {
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9), #ffffff);
    position: relative;
  }

  .cloud-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
  }

  .cloud-1 {
    top: -60px;
    transform: scaleX(1.8) scaleY(0.6);
    animation: cloud-float-1 20s infinite ease-in-out;
  }

  .cloud-2 {
    top: -40px;
    transform: scaleX(1.4) scaleY(0.8);
    opacity: 0.6;
    animation: cloud-float-2 25s infinite ease-in-out;
  }

  .cloud-3 {
    top: -20px;
    transform: scaleX(1.1) scaleY(1);
    opacity: 0.4;
    animation: cloud-float-3 30s infinite ease-in-out;
  }

  @keyframes cloud-float-1 {
    0%, 100% { transform: scaleX(1.8) scaleY(0.6) translateX(0); }
    50% { transform: scaleX(1.8) scaleY(0.6) translateX(20px); }
  }

  @keyframes cloud-float-2 {
    0%, 100% { transform: scaleX(1.4) scaleY(0.8) translateX(0); }
    50% { transform: scaleX(1.4) scaleY(0.8) translateX(-15px); }
  }

  @keyframes cloud-float-3 {
    0%, 100% { transform: scaleX(1.1) scaleY(1) translateX(0); }
    50% { transform: scaleX(1.1) scaleY(1) translateX(10px); }
  }

  /* Contact Buttons */
  .contact-btn-primary {
    display: inline-block;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border-radius: 1.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  }

  .contact-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  .contact-btn-secondary {
    display: inline-block;
    padding: 1rem 2rem;
    border: 2px solid #6b7280;
    color: #6b7280;
    border-radius: 1.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .contact-btn-secondary:hover {
    background: #6b7280;
    color: white;
    transform: translateY(-2px);
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .title-1 {
      font-size: 2rem;
    }

    .big-title-1 {
      font-size: 2.5rem;
      line-height: 1.2;
    }

    .cta-btn-1, .cta-btn-2 {
      font-size: 1rem;
      padding: 0.8rem 2rem;
    }

    .social-link {
      margin: 0 0.5rem;
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
  }
</style>