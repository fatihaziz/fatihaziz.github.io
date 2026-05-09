// ---------------------------------------------------------------------------
// Novel data -- "Laut Tahu Lebih Dulu" (Sebuah novel pendek)
// Source: docs/novel/laut.md
// Each chapter renders as a single book spread (left = generated art, right = text).
// ---------------------------------------------------------------------------

export interface ChapterTheme {
  // Paper background (right page)
  paperColor: string
  // Faint horizontal rule color on paper
  lineColor: string
  // Body text color
  inkColor: string
  // Drop-cap + accents
  accentColor: string
  // Faint highlight on title
  goldColor: string
  // Left-page art background (gradient from -> to)
  artBgFrom: string
  artBgTo: string
  // Primary art shape color
  artInk: string
  // Secondary art shape color
  artGlow: string
  // Mood label shown on cover (one word english)
  mood: string
}

export interface Chapter {
  id: string
  numeral: string         // I, II, III ...
  title: string
  subtitle?: string       // optional pre-title hint, e.g. "Interlude:"
  reader_hint?: string    // small italic note above title (e.g. "Lompat kalau butuh.")
  paragraphs: string[]    // pre-formatted HTML strings (already escaped)
  art: 'wind' | 'mask' | 'cup' | 'gift' | 'hourglass' | 'keys' | 'dawn' | 'sea'
  theme: ChapterTheme
}

// ---------- THEMES ----------

const T = {
  warmDust: {
    paperColor: '#f4ebd9',
    lineColor: 'rgba(120, 90, 50, 0.05)',
    inkColor: '#2d231a',
    accentColor: '#a87234',
    goldColor: '#9a6b2c',
    artBgFrom: '#d6b787',
    artBgTo: '#a8794a',
    artInk: '#5b3a1d',
    artGlow: '#f0d9a8',
    mood: 'inheritance',
  },
  hiddenDeep: {
    paperColor: '#e8e6df',
    lineColor: 'rgba(60, 70, 90, 0.05)',
    inkColor: '#23262d',
    accentColor: '#5d6680',
    goldColor: '#7c6a4a',
    artBgFrom: '#3a4258',
    artBgTo: '#1c2030',
    artInk: '#0e1018',
    artGlow: '#7c8aae',
    mood: 'silence',
  },
  calmSage: {
    paperColor: '#eef0e6',
    lineColor: 'rgba(80, 100, 70, 0.05)',
    inkColor: '#26302a',
    accentColor: '#5e7a5a',
    goldColor: '#7d8a48',
    artBgFrom: '#aabba0',
    artBgTo: '#6a8472',
    artInk: '#2c3e34',
    artGlow: '#dde6c8',
    mood: 'stillness',
  },
  warmHope: {
    paperColor: '#f6ead9',
    lineColor: 'rgba(150, 100, 60, 0.05)',
    inkColor: '#3a261a',
    accentColor: '#c47a48',
    goldColor: '#a86230',
    artBgFrom: '#e8b690',
    artBgTo: '#b8704a',
    artInk: '#5a2e1c',
    artGlow: '#fbe0c6',
    mood: 'fragility',
  },
  coldGray: {
    paperColor: '#e9eaec',
    lineColor: 'rgba(80, 95, 110, 0.05)',
    inkColor: '#1f242c',
    accentColor: '#5b6a7a',
    goldColor: '#6a7888',
    artBgFrom: '#a4adb8',
    artBgTo: '#5d6776',
    artInk: '#1f2a36',
    artGlow: '#cdd5dd',
    mood: 'patience',
  },
  fadingGold: {
    paperColor: '#f0e6d2',
    lineColor: 'rgba(140, 110, 60, 0.05)',
    inkColor: '#2e2517',
    accentColor: '#a08040',
    goldColor: '#8e6e2f',
    artBgFrom: '#cdaf72',
    artBgTo: '#8a6a32',
    artInk: '#3e2e10',
    artGlow: '#f5e3b8',
    mood: 'release',
  },
  rosyDawn: {
    paperColor: '#f6e6e0',
    lineColor: 'rgba(170, 110, 100, 0.05)',
    inkColor: '#3a2024',
    accentColor: '#c46a78',
    goldColor: '#b65566',
    artBgFrom: '#f0bfc4',
    artBgTo: '#c47488',
    artInk: '#5a2436',
    artGlow: '#fde0d8',
    mood: 'sunrise',
  },
  oceanDeep: {
    paperColor: '#e6ecee',
    lineColor: 'rgba(40, 80, 100, 0.06)',
    inkColor: '#1c2630',
    accentColor: '#347a92',
    goldColor: '#5a8a9a',
    artBgFrom: '#3e6e80',
    artBgTo: '#13283a',
    artInk: '#0c1820',
    artGlow: '#a8d4d8',
    mood: 'eternity',
  },
}

// ---------- HELPERS ----------

const p = (s: string) => `<p>${s}</p>`
// Wrap entire string in <p> tags + escape em-dashes already in source
const block = (paragraphs: string[]) => paragraphs.map(p)

// ---------- BOOK META ----------

export const novelTitle = 'Laut Tahu Lebih Dulu'
export const novelSubtitle = 'Sebuah novel pendek'
export const novelAuthor = 'Fatih Aziz'

// ---------- CHAPTERS ----------

export const chapters: Chapter[] = [
  {
    id: 'i',
    numeral: 'I',
    title: 'Tahun-Tahun yang Diajari Membaca Arah Angin',
    art: 'wind',
    theme: T.warmDust,
    paragraphs: block([
      'Sebelum dia tahu namanya sendiri, dia sudah tahu cara berlari.',
      'Anak laki-laki itu lahir di kota yang dibangun dari janji-janji yang tidak pernah ditepati. Ayahnya adalah lelaki yang mengajari dia dua hal: bahwa kasih sayang itu transaksi, dan bahwa laki-laki sejati tidak menangis di siang hari. Ibunya mengajari dia satu hal: bahwa cinta adalah sesuatu yang diberikan kepada orang yang tidak pernah benar-benar hadir.',
      'Dia tumbuh dengan mempercayai keduanya.',
      'Umur enam belas, dia jatuh cinta untuk pertama kalinya kepada seorang gadis yang suaranya seperti hujan pertama di bulan Oktober. Dia memberi gadis itu semua yang dia punya &mdash; puisi yang ditulis di belakang buku matematika, tabungan yang dikumpulkan dari uang jajan, sore yang seharusnya dia pakai untuk belajar. Gadis itu mengambil semuanya, lalu suatu hari menghilang seperti uap di atas kaca.',
      'Dia belajar pelajaran pertama: <em>memberi banyak bukan jaminan dicintai.</em>',
      'Umur sembilan belas, dia jatuh cinta untuk kedua kalinya. Perempuan ini lebih tua, lebih tenang, dan &mdash; dia pikir &mdash; lebih bijaksana. Selama dua tahun dia bekerja paruh waktu di warung kopi supaya bisa membawakan bunga setiap Jumat. Dia tidak pernah telat membalas pesan. Dia selalu mengantar pulang. Dia tidak pernah minta lebih dari yang perempuan itu bisa beri.',
      'Suatu malam di bulan Maret, dia menemukan perempuan itu di caf&eacute; yang dia sendiri tidak mampu bayar, dengan laki-laki lain, tertawa dengan tawa yang belum pernah ditujukan kepadanya selama dua tahun.',
      'Dia belajar pelajaran kedua: <em>konsistensi bukan jaminan dilihat.</em>',
      'Umur dua puluh dua, dia jatuh cinta untuk ketiga kalinya. Dia pikir kali ini berbeda karena perempuan itu mengatakan "aku mencintaimu" lebih dulu. Dia pikir kata-kata adalah bukti. Dia pikir kalau seseorang mengatakannya duluan, itu berarti mereka tidak akan pergi duluan.',
      'Perempuan itu pergi duluan. Tanpa kata-kata. Tanpa penjelasan. Hanya pesan di aplikasi kencan yang tidak sengaja dia lihat, yang ditulis dua bulan sebelum mereka putus: <span class="quote">"aku butuh sesuatu yang baru."</span>',
      'Dia belajar pelajaran ketiga &mdash; dan ini yang paling menyakitkan: <em>kata-kata adalah hal termurah yang bisa diberikan manusia.</em>',
    ]),
  },
  {
    id: 'ii',
    numeral: 'II',
    title: 'Yang Tidak Pernah Dia Katakan',
    subtitle: 'Interlude',
    art: 'mask',
    theme: T.hiddenDeep,
    paragraphs: block([
      'Ada sesuatu yang dia tidak pernah ceritakan kepada siapapun, bahkan kepada dirinya sendiri.',
      'Setiap kali dia memberi &mdash; bunga, waktu, uang, perhatian &mdash; dia tidak benar-benar memberi. Dia sedang membeli. Membeli kepastian bahwa dia <em>worth</em> dicintai. Membeli bukti bahwa dia ada gunanya. Membeli jaminan bahwa kali ini mereka akan tinggal.',
      'Setiap pertengkaran, suara ayahnya kembali: <span class="quote">laki-laki sejati tidak menangis di siang hari.</span>',
      'Setiap malam sendirian, suara ibunya kembali: <span class="quote">kasih sayang diberikan kepada orang yang tidak hadir.</span>',
      'Dia membangun seluruh hidupnya di atas satu keyakinan yang dia tidak pernah berani periksa: bahwa dia, sebagai dirinya sendiri, tanpa yang dia berikan, tidak cukup.',
      'Dan karena keyakinan itu tidak pernah diperiksa, dia tidak pernah tahu bahwa itulah akar dari semua yang akan datang.',
    ]),
  },
  {
    id: 'iii',
    numeral: 'III',
    title: 'Perempuan yang Tidak Meminta Apapun',
    art: 'cup',
    theme: T.calmSage,
    paragraphs: block([
      'Dia bertemu perempuan itu di saat dia sudah lelah jatuh cinta.',
      'Umur dua puluh enam. Dia sudah bekerja selama delapan tahun membangun sesuatu untuk orang lain. Tabungan habis. Gaji dipotong separo oleh bos yang dia panggil "pak" sambil menelan lima kalimat yang ingin dia katakan. Tubuhnya lelah. Hatinya &mdash; dia pikir &mdash; sudah ditutup.',
      'Perempuan itu duduk sendirian di pojok kafe, mengetik sesuatu di laptopnya, rambutnya dibiarkan jatuh begitu saja. Dia tidak cantik dengan cara yang biasa orang bilang. Dia cantik dengan cara yang membuatmu mau diam dan tidak mengganggu.',
      'Dia memesan kopi di meja sebelah. Tidak berbicara. Hanya memperhatikan bahwa perempuan itu mengetik dengan satu tangan karena tangan satunya memegang cangkir tapi tidak meminumnya. Cangkirnya sudah dingin. Perempuan itu terlalu fokus untuk menyadari.',
      '<span class="quote">"Kopinya dingin,"</span> dia akhirnya berkata.',
      'Perempuan itu menoleh, bingung sejenak, lalu tersenyum. <span class="quote">"Oh. Iya ya."</span>',
      'Itu percakapan pertama mereka. Empat kata dari laki-laki, tiga kata dari perempuan. Tidak ada puisi. Tidak ada bunga. Tidak ada tawaran yang besar.',
      'Dua minggu kemudian mereka bertemu lagi, tidak sengaja, di toko buku. Satu bulan kemudian mereka bertemu untuk pertama kali atas undangan &mdash; dia mengajak sarapan, perempuan itu bilang ya.',
      'Di sarapan itu, perempuan itu berkata sesuatu yang menghantui dia bertahun-tahun kemudian:',
      '<span class="quote big-quote">"Aku sebenarnya tidak butuh kamu membawakan apa-apa. Aku cuma butuh kamu hadir. Itu saja cukup susah dicari, jadi aku tidak minta lebih."</span>',
      'Dia duduk diam di seberang meja. Kopinya dingin. Dia tidak menyadari. Sama seperti perempuan itu beberapa bulan sebelumnya. Mungkin itulah sebabnya.',
      'Selama ini dia pikir cinta adalah tentang memberi sebanyak mungkin. Perempuan ini memberitahunya &mdash; tanpa tahu bahwa dia sedang memberitahunya &mdash; bahwa cinta sebenarnya adalah tentang hadir. Tidak lebih. Tidak kurang.',
      'Dia tidak mengerti saat itu. Dia butuh sepuluh tahun lagi untuk mulai mengerti.',
      'Tapi dia memutuskan, di sarapan itu, bahwa dia tidak mau yang lain.',
    ]),
  },
  {
    id: 'iv',
    numeral: 'IV',
    title: 'Plot Twist yang Tidak Mengejutkan Siapapun Kecuali Dirinya',
    art: 'gift',
    theme: T.warmHope,
    paragraphs: block([
      'Selama tiga tahun mereka bersama, dia melakukan apa yang dia selalu lakukan.',
      'Dia membelikan kulkas. Perabotan. Jajanan setiap hari. Bunga setiap minggu. Boneka. Makanan. Minuman. Semua yang bisa dia beli untuk membuat perempuan itu merasa dicintai &mdash; karena dia tidak tahu cara lain.',
      'Perempuan itu menerima, kadang menolak, kadang berkata pelan: <span class="quote">"Aku tidak butuh ini. Aku butuh kamu."</span>',
      'Dia dengar. Tapi dia tidak percaya. Karena kalau dia berhenti memberi, dia takut akan kembali ke keyakinan lama itu &mdash; bahwa dia, tanpa yang dia berikan, tidak cukup.',
      'Maka dia terus memberi. Dan setiap kali perempuan itu menerima dengan ragu, dia tafsirkan sebagai bukti bahwa perempuan itu akan meninggalkan dia kalau pemberian berhenti.',
      'Suatu hari tabungan dia tinggal dua puluh juta dari sembilan puluh juta.',
      'Dan di hari yang sama, perempuan itu berkata &mdash; dengan suara yang lembut, dengan mata yang penuh ketakutan sendiri:',
      '<span class="quote big-quote">"Aku harus cerita sesuatu. Aku punya sesuatu di tubuhku. Dokter bilang tumor kecil. Belum parah. Tapi ada."</span>',
      'Dia pikir ini adalah ujian cinta. Dia pikir ini momen untuk membuktikan.',
      'Dia bilang: <span class="quote">"Aku tidak kemana-mana."</span>',
      'Perempuan itu menangis. Bukan karena lega. Tapi karena perempuan itu tahu sesuatu yang dia tidak tahu &mdash; bahwa laki-laki yang mencintai dari ketakutan akan pergi suatu hari, karena ketakutan lebih kuat daripada kata-kata.',
      'Tapi malam itu mereka tidur bersebelahan, ujung ke ujung, seperti yang mereka janjikan. Dan perempuan itu memilih untuk percaya.',
    ]),
  },
  {
    id: 'v',
    numeral: 'V',
    title: 'Bab yang Tidak Ingin Kamu Baca',
    reader_hint: 'Lompat kalau butuh. Kembali kalau siap.',
    art: 'hourglass',
    theme: T.coldGray,
    paragraphs: block([
      'Tumor itu tidak parah selama sepuluh tahun.',
      'Sepuluh tahun mereka bangun. Dia keluar dari bos yang memotong gajinya. Dia mulai freelance. Dia gagal. Dia bangkit. Dia dapat klien pertama. Klien kedua. Dia bangun perusahaan sendiri. Perusahaan itu tumbuh. Lima tahun kemudian perusahaan itu besar.',
      'Di sepuluh tahun itu, lima anak lahir. Yang pertama kepala keras seperti ayahnya. Yang kedua mata tenang seperti ibunya. Yang ketiga tertawa seperti tidak pernah tahu sakit. Yang keempat pendiam, memperhatikan. Yang kelima &mdash; yang paling kecil &mdash; selalu memeluk ibunya lebih lama dari yang lain, seolah-olah dia tahu sesuatu yang orang lain tidak tahu.',
      'Mereka kaya. Bukan kaya yang dipamerkan. Kaya yang tidak perlu mikir dua kali kalau mau sesuatu. Kaya yang bisa beli waktu.',
      'Tapi tumor itu sabar. Tumor tidak terburu-buru.',
      'Di tahun ke sebelas, perempuan itu mulai lebih sering lelah. Di tahun ke dua belas, dokter mengucapkan kata yang berbeda dari sebelumnya. Bukan "kecil" lagi. Bukan "belum parah" lagi. Kata baru. Kata yang membuat laki-laki itu tidak bisa bicara selama dua jam setelah keluar dari ruang dokter.',
      'Dia menangis di siang hari. Untuk pertama kalinya dalam hidupnya. <em>Ayahnya salah.</em>',
    ]),
  },
  {
    id: 'vi',
    numeral: 'VI',
    title: 'Apa yang Dia Jual',
    art: 'keys',
    theme: T.fadingGold,
    paragraphs: block([
      'Aset pertama yang dia jual adalah mobil kedua. Mudah. Tidak ada yang kehilangan apapun.',
      'Aset kedua: saham di perusahaan partner. Masih mudah. Uang masuk, kemoterapi dibayar, perawatan terbaik dibeli.',
      'Aset ketiga: rumah kedua di Bali. Ini sedikit lebih berat &mdash; mereka pernah bulan madu di sana. Tapi perempuan itu berkata: <span class="quote">"rumah bisa dibeli lagi."</span> Dan mereka tertawa bersama. Tertawa yang sudah tidak penuh seperti dulu, tapi masih tertawa.',
      'Aset keempat: perusahaan.',
      'Hari dia menandatangani penjualan perusahaan yang dia bangun dua puluh tahun, dia pulang ke rumah sakit. Dia duduk di samping tempat tidur perempuan itu. Dia menggenggam tangannya &mdash; tangan yang sekarang sekurus ranting.',
      '<span class="quote">"Aku jual perusahaannya,"</span> dia berkata. <span class="quote">"Buat bayar dokter Singapura."</span>',
      'Perempuan itu diam lama. Lalu berkata, dengan suara yang hampir tidak ada:',
      '<span class="quote big-quote">"Kamu tahu aku tidak pernah butuh semua itu, kan?"</span>',
      'Dan untuk pertama kalinya dalam dua puluh tahun, dia benar-benar mendengar.',
      'Dia pikir dia mencintai perempuan itu dengan memberi. Tapi sebenarnya &mdash; dia baru sadar sekarang, dua puluh tahun terlambat &mdash; dia mencintai perempuan itu dengan takut kehilangan. Dan itu bukan cinta yang sama.',
      'Perempuan itu mencintai dia dengan tinggal &mdash; bahkan ketika dia tidak memberi apa-apa, bahkan ketika dia bau keringat, bahkan ketika dia ngomong sendiri di telepon, bahkan ketika dia tidak tahu cara nyisir rambutnya dengan benar.',
      '<em>Perempuan itu mencintai dia sebagai dirinya. Bukan sebagai apa yang dia berikan.</em>',
      'Dan dia &mdash; sepanjang dua puluh tahun &mdash; tidak pernah benar-benar tahu itu. Sampai sekarang. Di ruangan rumah sakit. Dengan tangan sekurus ranting di genggamannya.',
    ]),
  },
  {
    id: 'vii',
    numeral: 'VII',
    title: 'Plot Twist yang Sebenarnya',
    art: 'dawn',
    theme: T.rosyDawn,
    paragraphs: block([
      'Perempuan itu tidak mati malam itu.',
      'Dia tidak mati besok. Tidak minggu itu. Tidak bulan itu.',
      '<em>Perempuan itu sembuh.</em>',
      'Obat yang dibeli dari Singapura bekerja. Perlahan. Tidak dramatis. Tidak ada momen film di mana dokter keluar dan bilang "selamat." Hanya &mdash; suatu pagi, perempuan itu bangun dan minta kopi yang dia buat sendiri. Dan suatu minggu kemudian, dia bisa jalan dari kamar ke dapur tanpa berhenti.',
      'Dan suatu tahun kemudian, dia masih di sini.',
      'Tapi yang dia lakukan untuk menyelamatkan perempuan itu sudah terjadi. Perusahaan terjual. Rumah terjual. Mobil terjual. Mereka kembali ke rumah pertama mereka &mdash; yang kecil &mdash; dengan lima anak yang sudah dewasa dan satu rekening yang hampir kosong.',
      'Kamu mungkin berpikir ini bab di mana mereka menyesal.',
      '<em>Kamu salah.</em>',
      'Ini bab di mana dia, di umur empat puluh enam, duduk di teras rumah kecil itu, dengan istrinya di sampingnya &mdash; istrinya yang sudah menua, yang rambutnya sudah sebagian putih, yang kulitnya sudah tidak sehalus dulu &mdash; dan dia sadar:',
      'Dia tidak perlu perusahaan itu. Dia tidak perlu rumah itu. Dia tidak perlu apapun.',
      'Yang dia butuh selama dua puluh tahun ini &mdash; tanpa dia tahu &mdash; adalah perempuan ini. Bukan karena perempuan itu mengisi lubang di hatinya. Tapi karena perempuan itu melihat dia sebagai cukup, bahkan di saat dia sendiri tidak bisa.',
      'Dan di umur empat puluh enam, dia akhirnya belajar untuk melihat dirinya sebagai cukup juga.',
      '<em>Ayahnya salah.</em> Kasih sayang bukan transaksi.',
      '<em>Ibunya salah.</em> Cinta bukan diberikan kepada orang yang tidak hadir.',
      '<em>Dia salah.</em> Dia bukan apa yang dia berikan.',
      'Dia adalah orang yang tinggal. Yang tidak pergi. Yang menangis di siang hari dan tetap laki-laki.',
    ]),
  },
  {
    id: 'viii',
    numeral: 'VIII',
    title: 'Yang Laut Sudah Tahu',
    subtitle: 'Epilog',
    art: 'sea',
    theme: T.oceanDeep,
    paragraphs: block([
      'Ada percakapan terakhir yang mereka lakukan, sebelum istrinya tidur malam itu &mdash; di tahun ke dua puluh satu pernikahan mereka, bukan tahun ini, bukan tahun depan, tapi suatu tahun di masa depan yang laut sudah tahu.',
      'Istrinya berkata: <span class="quote">"Kamu tahu kenapa aku memilih kamu?"</span>',
      'Suaminya tidak tahu. Dia tidak pernah tanya. Selama dua puluh satu tahun, dia pikir dia tahu &mdash; tapi sekarang, menjelang jawaban, dia sadar dia tidak pernah tahu.',
      '<span class="quote big-quote">"Karena kamu satu-satunya laki-laki yang datang ke hidupku dengan ketakutan yang sama besarnya dengan cintanya. Dan aku tahu &mdash; kalau kamu berhasil memilih cinta meski ketakutanmu besar, itu berarti pilihan itu beneran."</span>',
      'Suaminya diam lama.',
      '<span class="quote">"Aku ga pernah benar-benar memilih cinta,"</span> dia akhirnya bilang. <span class="quote">"Aku cuma takut kehilangan kamu."</span>',
      'Istrinya tertawa kecil. Tawa yang sudah sering terdengar, tapi setiap kali tetap seperti hujan pertama di bulan Oktober.',
      '<span class="quote">"Aku tahu, sayang. Aku tahu dari hari pertama. Aku cuma nunggu kamu sadar."</span>',
      '<span class="quote">"Kapan aku sadar?"</span>',
      '<span class="quote big-quote">"Hari kamu jual perusahaan. Bukan karena kamu jual. Tapi karena di hari itu, pertama kalinya kamu duduk di samping aku tanpa bawa apa-apa. Dan kamu tetap ada. Itu baru cinta, bukan ketakutan."</span>',
      'Suaminya mengangguk pelan.',
      '<span class="quote">"Kenapa kamu nunggu selama itu?"</span>',
      '<span class="quote big-quote">"Karena kalau aku kasih tahu kamu lebih awal, kamu tidak akan percaya. Kamu harus sampai ke titik di mana kamu tidak punya apa-apa lagi buat diberikan &mdash; dan tetap ada di sini &mdash; sebelum kamu bisa percaya bahwa diri kamu cukup."</span>',
      'Malam itu istrinya tidur. Suami terus terjaga, duduk di samping tempat tidur, memandangi perempuan yang sudah mengajari dia satu pelajaran yang orangtuanya tidak pernah ajarkan:',
      '<em>Bahwa cinta bukan sesuatu yang kamu beli dengan pemberian. Cinta adalah sesuatu yang kamu terima ketika kamu berhenti lari dari diri sendiri.</em>',
      'Laut di luar rumah kecil mereka berbisik ke pantai seperti yang selalu dia lakukan selama ribuan tahun. Laut tahu lebih dulu dari mereka. Laut selalu tahu lebih dulu.',
      'Tapi laut juga sabar. Laut tidak pernah terburu-buru memberi tahu siapapun.',
      'Laut menunggu. Sampai orang itu siap dengar.',
    ]),
  },
]

export const totalSpreads = chapters.length + 2 // cover + chapters + back cover
