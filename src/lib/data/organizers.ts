export interface Organizer {
  id: string;
  name: string;
  type: string;
  location: string;
  image: string;
  description: string;
  events: number;
}

export const organizers: Organizer[] = [
  {
    id: "1",
    name: "Breathing Studio",
    type: "Yoga Studio",
    location: "Kemang, Jakarta Selatan",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    description: "Studio yoga dengan fokus pada pernapasan dan mindfulness.",
    events: 12,
  },
  {
    id: "2",
    name: "Jiwa Yoga",
    type: "Event Organizer",
    location: "Menteng, Jakarta Pusat",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    description: "Specialis workshop yoga dan spiritual retreat.",
    events: 8,
  },
  {
    id: "3",
    name: "Zen Space",
    type: "Wellness Center",
    location: "Senopati, Jakarta Selatan",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80",
    description: "Pusat kesejahteraan dengan berbagai kelas yoga dan meditasi.",
    events: 15,
  },
  {
    id: "4",
    name: "Prana Studio",
    type: "Yoga Studio",
    location: "Sudirman, Jakarta Selatan",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80",
    description: "Studio premium dengan instruktur berpengalaman.",
    events: 10,
  },
  {
    id: "5",
    name: "Harmony EO",
    type: "Event Organizer",
    location: "Puncak, Jawa Barat",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80",
    description: "Penyelenggara retreat yoga di alam terbuka.",
    events: 6,
  },
  {
    id: "6",
    name: "Calm Studio",
    type: "Yoga Studio",
    location: "Kelapa Gading, Jakarta Utara",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    description: "Studio dengan fokus pada restorative dan yin yoga.",
    events: 9,
  },
];
