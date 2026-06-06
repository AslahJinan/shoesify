export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Mens' | 'Womens' | 'Kids';
  image: string;
  badge?: string;
  description: string;
  specs: Record<string, string>;
  reviews: Array<{
    author: string;
    time: string;
    rating: number;
    text: string;
  }>;
}

export const products: Product[] = [
  {
    id: "kinetic-volt-pro",
    name: "Kinetic Volt Pro",
    price: 249,
    category: "Mens",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4rEKngqrJpCD6kNJkiyN_g1hleXU7ehZufN53Heokev6D77xAVVifJkqMDREqCkVN7pJfmlCkSupBwhIPGKpA4hL979HrhEGMhjSNotqB-iOak0k1UCoaFWgq2V2Zg1cBKH_esQ7QLwE9Wx7JW6BlGIxvF5mdx17LVzOXjyfVgD_gvTsOLKF8U1jfNalRT_UUO1bcocqMItBmHFcFl9Y1G3ZC86dIlHlPA-YdljhoRVE-OVU4yNxFCKgHwIXxqpH2TJ5UXkPuoP9M",
    badge: "New Arrival",
    description: "Engineered for elite performance and everyday prestige. The Kinetic Volt Pro merges our proprietary energy-return foam with a breathable, diamond-weave technical mesh. Designed for those who demand uncompromising speed and refined style.",
    specs: {
      "Material": "Engineered Diamond Mesh",
      "Weight": "240g (Size 9)",
      "Arch Support": "Adaptive Neutral",
      "Terrain": "Road / Indoor",
      "Drop": "8mm"
    },
    reviews: [
      {
        author: "Marcus Thorne",
        time: "2 days ago",
        rating: 5,
        text: "Unbelievable comfort. These are the first trainers that don't compromise on style while giving me that bounce I need for my morning runs."
      },
      {
        author: "Elena Rodriguez",
        time: "1 week ago",
        rating: 4,
        text: "Great fit and extremely lightweight. The materials feel premium. My only slight issue is the limited color range, but the Volt looks amazing in person."
      }
    ]
  },
  {
    id: "phantom-pulse",
    name: "Phantom Pulse",
    price: 180,
    category: "Mens",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5z252wKJB5Qmg8ab4TzvUpma3OgkshFygS8i6e8yrqT8XW5fKy2UYr7B5CWg6-QJlaMP7LC0DMrYPylCXmWSqMwu9L6F8XRB3JACoxb5jA0VugSC-nK7j_aKcFh0PiyU_tbyr3GwrWbsFY-7z1uTmYOkv2KrrK-Oix8mt2sKl3xBzxKYGIDR7ctb9Ewp-dzvVCz2AjdCGHLMgSEmaGgnnLo4db-IzB6uCbNW4MwvdThQOADYFAwJ8lYoFp3A0KqYJxQNCO3mN7SX-",
    badge: "New Arrival",
    description: "Lightweight comfort meets reactive energy return for elite performance. The Phantom Pulse features a seamless mesh upper and our shock-absorbent cushioning system.",
    specs: {
      "Material": "Symmetric Knit Mesh",
      "Weight": "260g (Size 9)",
      "Arch Support": "Neutral / Medium",
      "Terrain": "Track / Road",
      "Drop": "6mm"
    },
    reviews: [
      {
        author: "Jason Lee",
        time: "4 days ago",
        rating: 5,
        text: "Incredibly responsive soles. Outstanding support during high intensity interval training."
      }
    ]
  },
  {
    id: "nebula-low",
    name: "Nebula Low",
    price: 145,
    category: "Womens",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCobsgHTfN9yw_a69HM5Zj4DfopGVOBJn8LtQaZYUn1SoPvEv5F2B-wEWTUyJxdb7QTudoBhZkWq1e9MUfZunodKqi6Hs1sLIQEfg01h58Y3RpYKkBSTE988Lq3aGQXOL4m2jj6tPvBnLL3C9l1Z4clziGzWWNiTMWLy16v1KAs0po4XsKEGGzPYwJzW0n3BE9-MNXLESJ4KdzsnT2zF4BVowg7QUSS4o2PgM3x-Aw4W5gVHSd6td_hu98qAHinsOykTzjCFAv0oeFQ",
    description: "Iconic street style blended with modern cushioning technology. Designed for urban exploration and all-day comfort.",
    specs: {
      "Material": "Premium Leather & Suede",
      "Weight": "290g (Size 8)",
      "Arch Support": "Medium Arch",
      "Terrain": "Urban / Lifestyle",
      "Drop": "4mm"
    },
    reviews: [
      {
        author: "Sarah Jenkins",
        time: "3 days ago",
        rating: 5,
        text: "They match with everything! Super comfy and lightweight. Definite recommend."
      }
    ]
  },
  {
    id: "titan-core",
    name: "Titan Core",
    price: 210,
    category: "Mens",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhga27b-3Br3e9wjd544G0JRR5vKUw1ikmowKbuVKwYLTPW_0j4tZuPhJcrrwhe1bmt4DSFNLgXqLbqpapqHG4ao3lvMS28eZEUQfHAR7LEizWHmLy2b9zUDvOzad-WTIXKCxHvA4GV2OOQPiaHWJG3opz_Md4JhDaSPk2V3YfoRzcu-1yHeRBhQfji2XaiLVX6k_fDY2Hr5zDw-C3KMCg3bvAkQeaTB261cG5b_qN7VHGkwiItFR52ueGryHkiA9MkcnWRLiEzH3",
    badge: "Limited Edition",
    description: "The ultimate training companion designed for maximum stability and grip. Built to withstand high-intensity workouts while providing superior ankle support.",
    specs: {
      "Material": "Ballistic Mesh & Rubber Base",
      "Weight": "320g (Size 9)",
      "Arch Support": "Enhanced Firm",
      "Terrain": "Indoor Gym / Cross Training",
      "Drop": "0mm (Zero Drop)"
    },
    reviews: [
      {
        author: "Alex Rivera",
        time: "5 days ago",
        rating: 5,
        text: "Outstanding flat-sole feeling for squats and deadlifts. High durability."
      }
    ]
  },
  {
    id: "elite-velocity-x",
    name: "Elite Velocity X",
    price: 195,
    category: "Mens",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGossOQME9QGUldzPb2YCk90Qi_eo28xeKuHGCmlF1XEcwdEsH5VfgVsXodhdPteVjmZc2G7BnQmiUYs-UjDyLKuETbBsDyPIf9TuEE-qA8_X-1WPzaxbEqkgmLPOcCb7Tri_dOZt02YYBp73Zkiyjr-MRp8R0Hu83jGebwxQtZ8hm6R5jgChVIOJpsh64LuBw54pHjcyx7k7MgnIyEM0BSRV9QsW08Rs_ghLTdhHQkVKN2222NE3WNfPMOmdiiu0_OKV0tys1hKLi",
    badge: "Featured",
    description: "Vibrant high-performance running shoe built for breaking personal records. Outfitted with high-key material design and futuristic sole curves.",
    specs: {
      "Material": "Ultralight Flyknit",
      "Weight": "210g (Size 9)",
      "Arch Support": "Dynamic Support",
      "Terrain": "Road Racing",
      "Drop": "10mm"
    },
    reviews: [
      {
        author: "David Carter",
        time: "6 days ago",
        rating: 5,
        text: "Extremely springy and light! Shaved 20 seconds off my 5k personal best."
      }
    ]
  },
  {
    id: "urban-drift-pro",
    name: "Urban Drift Pro",
    price: 135,
    category: "Womens",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFXmYvlat-4AGJk6SLEZoC6cQWbdWkUwQfYiSjRS0OagwH-VlyI7fh94X7vFqDOeRCcdqcZXXO1mYnJAbozpkBTh1cXk6yrexStC1MVD9PmPuoG9q-C-glHncpyfvP2Zbvg0PIfRG1I9N4WLyI-msKXUWOd0MCQ5vguhYX95tFLHTeJLFJg6jGBqliHawJd6pEFCkVushbMr2JMmr8GnkeHEtz3Px6Df1i_2hrYga0DVJ3fHM-BmAVFv_S3aSbXxjxvP5VGAG-WWZW",
    badge: "30% Off",
    description: "Minimalist white and gray urban sneaker focusing on comfort and style. Utilizing a sophisticated monochromatic palette.",
    specs: {
      "Material": "Premium Leather",
      "Weight": "280g (Size 7)",
      "Arch Support": "Medium Arch",
      "Terrain": "Urban Walk",
      "Drop": "4mm"
    },
    reviews: [
      {
        author: "Samantha Ross",
        time: "1 week ago",
        rating: 5,
        text: "Clean aesthetics and very breathable. Good for running errands all day."
      }
    ]
  },
  {
    id: "aerostride-pro",
    name: "AeroStride Pro",
    price: 185,
    category: "Kids",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWiQk0myFQHTvu3QfEfhcrAmnBL3RWotidSHO-VPyjtmdU4yIZl_NbczouyFyjhGUQHsfp98ot0fpPiQEnn-x_maZHol6tnjs11QulioXErfp1ND5QFmXBuD-3Czfy97LLuXvXSlTq3BfBfDlrKr_uMSsSxLGIpOLZX46YoMrM_jCldKL08nBQSsPoDON2kvp6Db7b5NZxSAathNUqYAT9qC79_z0rC49ItMIa7m041z6ULe0DsFqYbotcz3P8t3DWssz28KLxZUMM",
    description: "Performance running shoes configured in vibrant orange and charcoal gray. Ideal for everyday high-energy training.",
    specs: {
      "Material": "Diamond weave Mesh",
      "Weight": "235g (Size 6)",
      "Arch Support": "Neutral",
      "Terrain": "Outdoor / Active Play",
      "Drop": "6mm"
    },
    reviews: [
      {
        author: "Emma Stone",
        time: "2 weeks ago",
        rating: 4,
        text: "My son loves these. Easy to put on and very durable for playground use."
      }
    ]
  },
  {
    id: "cloudwalker-elite",
    name: "CloudWalker Elite",
    price: 120,
    category: "Kids",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb-IeIcu1mFtN-YamYSnbidDSlS47rLK6ASPABYoZje3OZ4qrswiSw0UOnN-Z6X9VEeIGJyjU_BCY57ft0yvPFk0e6tQTO5RTYt-yIDZH6kmdPsOmTJ8KnWj-6pS8i2TBohZH9Sfw-K5gCSnfVpwfPDWND_DqBep3fuIcgLObT9N4vtPQ7PLRmDzfC1jdgpFlpW8kXRVy5F8qUCE2upY2p-WSCRHgLsQ536NZjD5AP5e5SfAwzkaHF6wOUfmlvS5_AyzenUme3UuX3",
    description: "Minimalist luxury lifestyle sneaker with a pristine white leather upper and subtle silver highlights. Maximum cushion for comfort in every stride.",
    specs: {
      "Material": "Soft grain Leather",
      "Weight": "220g (Size 5)",
      "Arch Support": "Flat Cushioned",
      "Terrain": "Casual Wear",
      "Drop": "5mm"
    },
    reviews: [
      {
        author: "Robert Miller",
        time: "3 weeks ago",
        rating: 5,
        text: "Clean design and very supportive. Great quality shoe."
      }
    ]
  }
];
