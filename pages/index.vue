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

    <!-- Content Sections -->
    <section id="about" class="py-20 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-pattern"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <h2 class="text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">About Me</h2>

        <!-- Journey Timeline -->
        <div class="max-w-5xl mx-auto">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div class="text-left">
              <h3 class="text-2xl font-bold mb-4 text-gray-800">The Journey</h3>
              <p class="text-lg text-gray-600 leading-relaxed mb-4">
                Started my journey in 2017 with a national web development competition that changed everything.
                What began as curiosity evolved into a passion for building systems that make a difference.
              </p>
              <p class="text-lg text-gray-600 leading-relaxed">
                Today, as CTO at TurnkeyID, I lead a talented team building solutions that serve thousands daily,
                always pushing the boundaries of what's possible with code.
              </p>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-xl">
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">17</div>
                  <div>
                    <div class="font-semibold">Competition Winner</div>
                    <div class="text-sm text-gray-600">National Web Development Competition</div>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">18</div>
                  <div>
                    <div class="font-semibold">First Developer Role</div>
                    <div class="text-sm text-gray-600">Started at Portofolio Indonesia</div>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">20</div>
                  <div>
                    <div class="font-semibold">Backend Lead</div>
                    <div class="text-sm text-gray-600">Leading technical architecture</div>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">22</div>
                  <div>
                    <div class="font-semibold">CTO at TurnkeyID</div>
                    <div class="text-sm text-gray-600">Leading innovation & 50+ developers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills & Interests -->
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div class="text-3xl mb-4">💻</div>
              <h4 class="font-bold text-lg mb-2">Tech Stack</h4>
              <p class="text-gray-600">Mastering Go, Rust, Python, and TypeScript to build scalable, efficient systems</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div class="text-3xl mb-4">🎮</div>
              <h4 class="font-bold text-lg mb-2">Interests</h4>
              <p class="text-gray-600">Anime enthusiast, coffee connoisseur, and eternal learner of new technologies</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div class="text-3xl mb-4">🌏</div>
              <h4 class="font-bold text-lg mb-2">Global Perspective</h4>
              <p class="text-gray-600">Working across Indonesia & Dubai, bringing diverse insights to every project</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="projects" class="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <div class="container mx-auto px-4">
        <h2 class="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Featured Projects</h2>
        <p class="text-center text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
          From AI-powered trading systems to scalable microservices, each project represents a step forward in innovation
        </p>

        <!-- Project categories -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <button class="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition">All Projects</button>
          <button class="px-6 py-2 bg-white text-gray-600 rounded-full font-medium hover:bg-gray-100 transition">AI & ML</button>
          <button class="px-6 py-2 bg-white text-gray-600 rounded-full font-medium hover:bg-gray-100 transition">Trading Bots</button>
          <button class="px-6 py-2 bg-white text-gray-600 rounded-full font-medium hover:bg-gray-100 transition">Open Source</button>
        </div>

      </div>
    </section>

    <section id="contact" class="py-20 relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
      <!-- Decorative circles -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-32 -translate-y-32"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-48 translate-y-48"></div>

      <div class="container mx-auto px-4 text-center relative z-10">
        <h2 class="text-5xl font-bold mb-8 text-white">Let's Build Something Amazing</h2>
        <p class="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Whether you have a groundbreaking idea, need technical leadership, or want to discuss the latest in AI and blockchain,
          I'm always excited to connect with fellow innovators.
        </p>

        <!-- Contact options -->
        <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div class="text-3xl mb-3">📧</div>
            <h3 class="text-white font-semibold mb-2">Email</h3>
            <p class="text-blue-100 text-sm">For detailed discussions</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div class="text-3xl mb-3">💼</div>
            <h3 class="text-white font-semibold mb-2">LinkedIn</h3>
            <p class="text-blue-100 text-sm">Professional networking</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <div class="text-3xl mb-3">🐙</div>
            <h3 class="text-white font-semibold mb-2">GitHub</h3>
            <p class="text-blue-100 text-sm">Check out my code</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:m.fatihalaziz@gmail.com"
            class="contact-btn-white"
          >
            <span class="mr-2">✉️</span> Send Email
          </a>
          <a
            href="https://linkedin.com/in/fatih-aziz"
            target="_blank"
            class="contact-btn-outline"
          >
            <span class="mr-2">💼</span> Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

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
    margin-bottom: 50px;
  }

  /* Background Pattern */
  .bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-repeat: repeat;
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

  /* New Contact Section Buttons */
  .contact-btn-white {
    display: inline-flex;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    color: #3b82f6;
    border-radius: 1.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .contact-btn-white:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .contact-btn-outline {
    display: inline-flex;
    align-items: center;
    padding: 1rem 2rem;
    background: transparent;
    color: white;
    border: 2px solid white;
    border-radius: 1.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .contact-btn-outline:hover {
    background: white;
    color: #3b82f6;
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