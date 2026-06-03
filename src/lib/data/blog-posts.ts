export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  slug: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Simple Yoga Poses to Start Your Morning",
    excerpt:
      "Kickstart your day with these energizing yoga poses that awaken your body and mind.",
    category: "Meditation",
    date: "2026-05-15",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    slug: "morning-yoga-poses",
  },
  {
    id: "2",
    title: "The Power of Breath in Your Yoga Practice",
    excerpt:
      "Discover how pranayama techniques can transform your yoga practice and daily life.",
    category: "Breathwork",
    date: "2026-05-10",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    slug: "power-of-breath",
  },
  {
    id: "3",
    title: "How Yoga Reduces Stress and Anxiety",
    excerpt:
      "Learn the science behind yoga's stress-reducing effects and how to incorporate it into your routine.",
    category: "Health",
    date: "2026-05-05",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80",
    slug: "yoga-stress-anxiety",
  },
];
