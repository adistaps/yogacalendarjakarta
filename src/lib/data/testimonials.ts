export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Tina Williams",
    role: "Personal Client",
    quote:
      "The attention to detail, alignment, and breath made me feel safe and confident on the mat.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Yoga Enthusiast",
    quote:
      "Yoga Calendar Jakarta membuat sangat mudah menemukan event yoga yang sesuai dengan jadwal dan level saya. Platform yang sangat bermanfaat!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
  {
    id: "3",
    name: "Budi Santoso",
    role: "Studio Owner",
    quote:
      "Sebagai pemilik studio, platform ini sangat membantu kami menjangkau lebih banyak praktisi yoga. Proses publikasi event sangat mudah.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id: "4",
    name: "Maya Anggraini",
    role: "Regular Practitioner",
    quote:
      "Saya sudah menggunakan Yoga Calendar Jakarta selama 6 bulan dan sudah menemukan banyak event yoga berkualitas. Sangat direkomendasikan!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
  },
];
