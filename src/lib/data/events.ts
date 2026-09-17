export interface Event {
  id: string;
  slug: string;
  title: string;
  category: string;
  organizer: string;
  location: string;
  date: string;
  time: string;
  endTime: string;
  price: number;
  quota: number;
  remaining: number;
  image: string;
  tags: string[];
  description: string;
  ticketTypes: { name: string; price: number; description: string }[];
  quote: string;
  benefits: string[];
}

export const events: Event[] = [
  {
    id: "1",
    slug: "vinyasa-flow-morning-kemang",
    title: "Vinyasa Flow Morning",
    category: "Vinyasa",
    organizer: "Breathing Studio",
    location: "Kemang, Jakarta Selatan",
    date: "2026-06-15",
    time: "07:00",
    endTime: "09:00",
    price: 150000,
    quota: 20,
    remaining: 8,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    tags: ["vinyasa", "morning", "all-level"],
    description:
      "Mulai pagi kamu dengan sesi Vinyasa Flow yang energik. Sesi ini dirancang untuk semua level, dari pemula hingga advanced. Instruktur berpengalaman akan memandu melalui rangkaian pose yang dinamis dan menyeluruh.",
    ticketTypes: [
      { name: "Early Bird", price: 120000, description: "Terbatas 5 kursi" },
      { name: "Regular", price: 150000, description: "Kursi standar" },
      { name: "VIP", price: 300000, description: "Mat + refreshment" },
    ],
    quote: "Yoga is not about touching your toes, it’s about what you learn on the way down.",
    benefits: [
      "Meningkatkan fleksibilitas dan kekuatan otot tubuh",
      "Melancarkan aliran darah pagi hari agar lebih bugar",
      "Meningkatkan fokus mental sepanjang hari",
      "Relaksasi pikiran melalui pernapasan teratur"
    ]
  },
  {
    id: "2",
    slug: "kundalini-awakening-workshop",
    title: "Kundalini Awakening Workshop",
    category: "Kundalini",
    organizer: "Jiwa Yoga",
    location: "Menteng, Jakarta Pusat",
    date: "2026-06-20",
    time: "09:00",
    endTime: "12:00",
    price: 250000,
    quota: 15,
    remaining: 5,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    tags: ["kundalini", "workshop", "intermediate"],
    description:
      "Workshop intensif Kundalini untuk membangkitkan energi dalam. Pelajari teknik pernapasan, meditasi, dan gerakan khas Kundalini yang dapat mengubah kesadaran dan meningkatkan vitalitas.",
    ticketTypes: [
      { name: "Early Bird", price: 200000, description: "Terbatas 3 kursi" },
      { name: "Regular", price: 250000, description: "Kursi standar" },
    ],
    quote: "Kundalini yoga is the science to unite the finite with the Infinity.",
    benefits: [
      "Membangkitkan energi spiritual dan kesadaran diri",
      "Mengurangi kecemasan dan stres mental yang menumpuk",
      "Memperkuat sistem saraf dan kelenjar tubuh",
      "Meningkatkan intuisi dan kejernihan berpikir"
    ]
  },
  {
    id: "3",
    slug: "yoga-sound-healing-senopati",
    title: "Yoga & Sound Healing",
    category: "Sound Healing",
    organizer: "Zen Space",
    location: "Senopati, Jakarta Selatan",
    date: "2026-06-22",
    time: "18:00",
    endTime: "20:00",
    price: 200000,
    quota: 25,
    remaining: 12,
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80",
    tags: ["sound-healing", "evening", "relaxation"],
    description:
      "Kombinasi yoga lembut dengan terapi suara singing bowl. Rasakan getaran penyembuh dari frekuensi singing bowl Tibet yang membantu melepas stres dan menyeimbangkan chakra.",
    ticketTypes: [
      { name: "Regular", price: 200000, description: "Kursi standar" },
      {
        name: "VIP",
        price: 350000,
        description: "Kursi premium + aromaterapi",
      },
    ],
    quote: "Sound is the medicine of the future.",
    benefits: [
      "Relaksasi mendalam menggunakan frekuensi getaran singing bowl",
      "Membantu menyeimbangkan dan menyelaraskan chakra tubuh",
      "Meredakan ketegangan fisik, emosional, dan mental",
      "Meningkatkan kualitas tidur malam menjadi lebih nyenyak"
    ]
  },
  {
    id: "4",
    slug: "ashtanga-intensive-sudirman",
    title: "Ashtanga Intensive",
    category: "Ashtanga",
    organizer: "Prana Studio",
    location: "Sudirman, Jakarta Selatan",
    date: "2026-06-25",
    time: "06:30",
    endTime: "08:30",
    price: 300000,
    quota: 12,
    remaining: 3,
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
    tags: ["ashtanga", "intensive", "advanced"],
    description:
      "Sesi Ashtanga intensif untuk praktisi berpengalaman. Pelajari Primary Series dengan pendalaman alignment dan teknik bandha yang benar.",
    ticketTypes: [
      {
        name: "Regular",
        price: 300000,
        description: "Sesi intensif 2 jam",
      },
    ],
    quote: "Practice, practice, practice, and all is coming.",
    benefits: [
      "Pendalaman alignment pose Ashtanga Primary Series",
      "Membangun stamina, kekuatan, dan daya tahan fisik",
      "Detoksifikasi tubuh secara alami melalui keringat",
      "Melatih kedisiplinan mental dan ketahanan fokus"
    ]
  },
  {
    id: "5",
    slug: "prenatal-yoga-simatupang",
    title: "Prenatal Yoga",
    category: "Restorative",
    organizer: "Ibu Sehat Studio",
    location: "TB Simatupang, Jakarta Selatan",
    date: "2026-06-28",
    time: "10:00",
    endTime: "11:30",
    price: 175000,
    quota: 10,
    remaining: 6,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    tags: ["prenatal", "restorative", "beginner"],
    description:
      "Yoga khusus ibu hamil dengan instruktur bersertifikat. Gerakan aman dan nyaman untuk setiap trimester, membantu mengurangi keluhan kehamilan dan mempersiapkan persalinan.",
    ticketTypes: [
      {
        name: "Regular",
        price: 175000,
        description: "Termasuk panduan nutrisi",
      },
    ],
    quote: "A grand adventure is about to begin.",
    benefits: [
      "Mengurangi nyeri punggung dan pegal selama masa kehamilan",
      "Melatih pernapasan khusus untuk persiapan persalinan",
      "Memperkuat otot panggul, pinggul, dan area paha",
      "Membangun ikatan batin yang lebih erat antara ibu dan janin"
    ]
  },
  {
    id: "6",
    slug: "yoga-retreat-3-hari-puncak",
    title: "Yoga Retreat 3 Hari - Puncak",
    category: "Retreat",
    organizer: "Harmony EO",
    location: "Puncak, Jawa Barat",
    date: "2026-07-04",
    time: "08:00",
    endTime: "17:00",
    price: 2500000,
    quota: 20,
    remaining: 7,
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
    tags: ["retreat", "multi-day", "all-level"],
    description:
      "Retreat yoga 3 hari 2 malam di alam terbuka Puncak. Nikmati sesi yoga pagi dan sore, meditasi, makanan organik, dan waktu untuk merefleksikan diri jauh dari hiruk pikuk kota.",
    ticketTypes: [
      {
        name: "Shared Room",
        price: 2500000,
        description: "Kamar berbagi + semua meal",
      },
      {
        name: "Private Room",
        price: 3500000,
        description: "Kamar pribadi + semua meal",
      },
    ],
    quote: "In nature, light creates the color. In the picture, color creates the light.",
    benefits: [
      "Menginap 3 hari 2 malam di alam sejuk Puncak",
      "Sesi yoga dan meditasi intensif dua kali sehari",
      "Konsumsi makanan organik sehat yang lezat",
      "Detox digital dan relaksasi total dari hiruk-pikuk kota"
    ]
  },
  {
    id: "7",
    slug: "restorative-yoga-kelapa-gading",
    title: "Restorative Yoga",
    category: "Restorative",
    organizer: "Calm Studio",
    location: "Kelapa Gading, Jakarta Utara",
    date: "2026-07-10",
    time: "19:00",
    endTime: "20:30",
    price: 125000,
    quota: 15,
    remaining: 9,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    tags: ["restorative", "evening", "beginner"],
    description:
      "Yoga restoratif untuk melepas ketegangan setelah hari panjang. Gunakan props seperti bolster dan selimut untuk mendukung tubuh dalam pose yang menenangkan.",
    ticketTypes: [
      {
        name: "Regular",
        price: 125000,
        description: "Termasuk teh herbal",
      },
    ],
    quote: "Rest and self-care are so important. When you take time to replenish your spirit, it allows you to serve others from the overflow.",
    benefits: [
      "Pelepasan stres total di malam hari sebelum tidur",
      "Penggunaan props yoga lengkap untuk kenyamanan optimal",
      "Menenangkan sistem saraf yang lelah karena bekerja",
      "Aman untuk segala usia dan ramah untuk pemula"
    ]
  },
  {
    id: "8",
    slug: "meditasi-yoga-nidra-pondok-indah",
    title: "Meditasi & Yoga Nidra",
    category: "Sound Healing",
    organizer: "Inner Peace",
    location: "Pondok Indah, Jakarta Selatan",
    date: "2026-07-12",
    time: "15:00",
    endTime: "17:00",
    price: 100000,
    quota: 30,
    remaining: 18,
    image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80",
    tags: ["meditasi", "nidra", "all-level"],
    description:
      "Sesi meditasi mendalam dengan teknik Yoga Nidra. Masuk ke keadaan relaksasi terdalam yang setara dengan 4 jam tidur malam dalam hanya 45 menit.",
    ticketTypes: [
      {
        name: "Regular",
        price: 100000,
        description: "Matras disediakan",
      },
    ],
    quote: "Sleep is the best meditation.",
    benefits: [
      "Mencapai relaksasi terdalam yang setara dengan 4 jam tidur",
      "Mengurangi ketegangan mental dan emosional mendalam",
      "Melatih fokus pikiran dan teknik visualisasi terarah",
      "Meningkatkan kejernihan berpikir dan kreativitas"
    ]
  },
  {
    id: "9",
    slug: "corporate-yoga-kuningan",
    title: "Corporate Yoga",
    category: "Vinyasa",
    organizer: "Flex Studio",
    location: "Kuningan, Jakarta Selatan",
    date: "2026-07-15",
    time: "12:00",
    endTime: "13:00",
    price: 350000,
    quota: 40,
    remaining: 25,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
    tags: ["corporate", "vinyasa", "intermediate"],
    description:
      "Sesi yoga di jam makan siang khusus para profesional. Tingkatkan produktivitas dan kesejahteraan karyawan dengan sesi yoga yang dapat dilakukan di kantor.",
    ticketTypes: [
      { name: "Individual", price: 350000, description: "Per orang" },
      {
        name: "Corporate Package",
        price: 2500000,
        description: "Untuk 10 orang",
      },
    ],
    quote: "A healthy employee is a happy employee.",
    benefits: [
      "Mengurangi kejenuhan di sela-sela jam kerja kantor",
      "Meregangkan tubuh kaku akibat duduk terlalu lama di depan komputer",
      "Meningkatkan fokus dan semangat kerja di sore hari",
      "Melatih postur tubuh yang tegak dan ergonomis"
    ]
  },
];

export const categories = [
  "Semua",
  "Vinyasa",
  "Kundalini",
  "Ashtanga",
  "Restorative",
  "Retreat",
  "Sound Healing",
];
