// src/data/mockData.js

// Mock trainers data
export const trainers = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Johnson",
    profilePicture: "/assets/images/trainers/alex.jpg",
    specialties: ["HIIT", "Strength Training", "Cardio"],
    rating: 4.8,
    bio: "Former Olympic athlete specializing in high-intensity workouts that deliver results. 10+ years of professional training experience."
  },
  {
    id: 2,
    firstName: "Maya",
    lastName: "Patel",
    profilePicture: "/assets/images/trainers/maya.jpg",
    specialties: ["Yoga", "Mindfulness", "Flexibility"],
    rating: 4.9,
    bio: "Certified yoga instructor with specialization in restorative practices. Teaching mindful movement for over 8 years."
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Torres",
    profilePicture: "/assets/images/trainers/mike.jpg",
    specialties: ["Strength Training", "Functional Fitness", "Nutrition"],
    rating: 4.7,
    bio: "Strength coach and nutritionist focused on building sustainable fitness habits. Helped hundreds of clients achieve their strength goals."
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Williams",
    profilePicture: "/assets/images/trainers/sarah.jpg",
    specialties: ["Pilates", "Core Conditioning", "Posture Correction"],
    rating: 4.8,
    bio: "Specialized in rehabilitation and core strength. Passionate about helping clients improve their posture and mobility."
  },
  {
    id: 5,
    firstName: "Daniel",
    lastName: "Chen",
    profilePicture: "/assets/images/trainers/daniel.jpg",
    specialties: ["Pilates", "Barre", "Flexibility"],
    rating: 4.6,
    bio: "Former professional dancer turned fitness instructor. Focuses on precise movements and proper form for maximum benefit."
  }
];

// Mock categories
export const categories = [
  "Strength Training",
  "Cardio",
  "Yoga",
  "Pilates",
  "HIIT",
  "Meditation",
  "Core",
  "Flexibility",
  "Dance",
  "Boxing"
];

// Mock difficulty levels
export const difficultyLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels"
];

// Mock upcoming sessions
export const upcomingSessions = [
  {
    id: 1,
    title: "HIIT Cardio Blast",
    trainer: trainers[0],
    scheduledAt: new Date(new Date().getTime() + 3600000), // 1 hour from now
    duration: 45,
    category: "HIIT",
    difficulty: "Intermediate",
    tokenCost: 1,
    participants: 248,
    maxParticipants: 500,
    description: "High-intensity interval training designed to boost your cardio fitness and burn calories efficiently. This session alternates between intense bursts of activity and fixed periods of less-intense activity or rest.",
    equipmentRequired: ["Mat", "Water bottle"],
    thumbnail: "/assets/images/sessions/hiit.jpg",
    tags: ["Cardio", "Weight Loss", "Endurance"]
  },
  {
    id: 2,
    title: "Yoga for Flexibility",
    trainer: trainers[1],
    scheduledAt: new Date(new Date().getTime() + 86400000), // 1 day from now
    duration: 60,
    category: "Yoga",
    difficulty: "All Levels",
    tokenCost: 1,
    participants: 126,
    maxParticipants: 300,
    description: "A gentle yoga session focused on improving your flexibility and range of motion. Perfect for all fitness levels, with modifications offered throughout the class.",
    equipmentRequired: ["Yoga mat", "Comfortable clothing"],
    thumbnail: "/assets/images/sessions/yoga.jpg",
    tags: ["Relaxation", "Flexibility", "Mindfulness"]
  },
  {
    id: 3,
    title: "Strength Training 101",
    trainer: trainers[2],
    scheduledAt: new Date(new Date().getTime() + 172800000), // 2 days from now
    duration: 50,
    category: "Strength Training",
    difficulty: "Beginner",
    tokenCost: 2,
    participants: 189,
    maxParticipants: 0, // Unlimited
    description: "Introduction to fundamental strength training principles and exercises. Learn proper form and technique for basic movements that will help you build strength safely and effectively.",
    equipmentRequired: ["Dumbbells (optional)", "Mat"],
    thumbnail: "/assets/images/sessions/strength.jpg",
    tags: ["Strength", "Beginners", "Form"]
  },
  {
    id: 4,
    title: "Core Conditioning",
    trainer: trainers[3],
    scheduledAt: new Date(new Date().getTime() + 259200000), // 3 days from now
    duration: 30,
    category: "Core",
    difficulty: "Intermediate",
    tokenCost: 1,
    participants: 156,
    maxParticipants: 250,
    description: "Focus on strengthening your core with this targeted workout. Improve your stability, posture, and overall strength with exercises that engage your abdominals, lower back, and obliques.",
    equipmentRequired: ["Mat"],
    thumbnail: "/assets/images/sessions/core.jpg",
    tags: ["Abs", "Posture", "Strength"]
  },
  {
    id: 5,
    title: "Advanced Pilates",
    trainer: trainers[4],
    scheduledAt: new Date(new Date().getTime() + 345600000), // 4 days from now
    duration: 60,
    category: "Pilates",
    difficulty: "Advanced",
    tokenCost: 2,
    participants: 92,
    maxParticipants: 150,
    description: "Challenge yourself with advanced Pilates movements designed to further strengthen your core and improve your body awareness. This class is recommended for those with prior Pilates experience.",
    equipmentRequired: ["Mat", "Resistance band (optional)"],
    thumbnail: "/assets/images/sessions/pilates.jpg",
    tags: ["Core", "Balance", "Control"]
  },
  {
    id: 6,
    title: "Morning Energizer",
    trainer: trainers[0],
    scheduledAt: new Date(new Date().getTime() + 432000000), // 5 days from now
    duration: 30,
    category: "Cardio",
    difficulty: "All Levels",
    tokenCost: 1,
    participants: 175,
    maxParticipants: 300,
    description: "Start your day with an energizing cardio session designed to boost your metabolism and set a positive tone for the day. No equipment needed, just your energy and enthusiasm!",
    equipmentRequired: ["Water bottle"],
    thumbnail: "/assets/images/sessions/morning.jpg",
    tags: ["Morning", "Energy", "Cardio"]
  },
  {
    id: 7,
    title: "Meditation for Stress Relief",
    trainer: trainers[1],
    scheduledAt: new Date(new Date().getTime() + 518400000), // 6 days from now
    duration: 20,
    category: "Meditation",
    difficulty: "All Levels",
    tokenCost: 1,
    participants: 210,
    maxParticipants: 500,
    description: "Take a break from your day with this guided meditation session focused on relaxation and stress relief. Learn techniques you can incorporate into your daily routine for better mental wellbeing.",
    equipmentRequired: ["Comfortable seating"],
    thumbnail: "/assets/images/sessions/meditation.jpg",
    tags: ["Relaxation", "Stress Relief", "Mindfulness"]
  },
  {
    id: 8,
    title: "Boxing Fundamentals",
    trainer: trainers[2],
    scheduledAt: new Date(new Date().getTime() + 604800000), // 7 days from now
    duration: 45,
    category: "Boxing",
    difficulty: "Beginner",
    tokenCost: 2,
    participants: 145,
    maxParticipants: 200,
    description: "Learn the basics of boxing in this beginner-friendly session. Focus on proper stance, basic punches, and simple combinations while getting a full-body workout.",
    equipmentRequired: ["Hand wraps (optional)", "Water bottle"],
    thumbnail: "/assets/images/sessions/boxing.jpg",
    tags: ["Boxing", "Coordination", "Power"]
  }
];

// Mock packages for token purchase
export const tokenPackages = [
  {
    id: 1,
    name: "Starter Pack",
    tokenAmount: 5,
    price: 19.99,
    description: "Perfect for trying out a few classes",
    isPromotion: false
  },
  {
    id: 2,
    name: "Regular Pack",
    tokenAmount: 10,
    price: 34.99,
    description: "Our most popular option",
    isPromotion: false
  },
  {
    id: 3,
    name: "Premium Pack",
    tokenAmount: 25,
    price: 74.99,
    description: "Best value for active members",
    isPromotion: false
  },
  {
    id: 4,
    name: "Spring Special",
    tokenAmount: 15,
    price: 39.99,
    description: "Limited time offer - 25% savings!",
    isPromotion: true,
    discountPercentage: 25,
    validUntil: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
];

// Mock user data
export const currentUser = {
  id: 101,
  firstName: "Jamie",
  lastName: "Smith",
  email: "jamie.smith@example.com",
  profilePicture: "/assets/images/users/jamie.jpg",
  tokens: 8,
  preferences: {
    categories: ["Yoga", "HIIT", "Meditation"],
    difficulty: "Intermediate",
    preferredTrainers: [2, 1] // Maya and Alex
  },
  bookedSessions: [6, 7], // Session IDs
  completedSessions: [
    {
      sessionId: 101,
      title: "Full Body HIIT",
      trainer: "Alex Johnson",
      completedAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      rating: 5
    },
    {
      sessionId: 102,
      title: "Mindful Meditation",
      trainer: "Maya Patel",
      completedAt: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      rating: 4
    }
  ]
};

// Recommended sessions based on user preferences
export const recommendedSessions = [
  {
    id: 9,
    title: "Power Yoga Flow",
    trainer: trainers[1],
    scheduledAt: new Date(new Date().getTime() + 259200000), // 3 days from now
    duration: 60,
    category: "Yoga",
    difficulty: "Intermediate",
    tokenCost: 1,
    participants: 118,
    maxParticipants: 200,
    description: "Build strength and flexibility with this dynamic yoga flow. Connect breath to movement as you flow through postures designed to challenge and energize.",
    equipmentRequired: ["Yoga mat"],
    thumbnail: "/assets/images/sessions/power-yoga.jpg",
    tags: ["Yoga", "Strength", "Flow"]
  },
  {
    id: 10,
    title: "HIIT & Core Combo",
    trainer: trainers[0],
    scheduledAt: new Date(new Date().getTime() + 345600000), // 4 days from now
    duration: 45,
    category: "HIIT",
    difficulty: "Intermediate",
    tokenCost: 1,
    participants: 165,
    maxParticipants: 300,
    description: "Combine the calorie-burning benefits of HIIT with focused core work in this efficient, challenging workout.",
    equipmentRequired: ["Mat", "Water bottle"],
    thumbnail: "/assets/images/sessions/hiit-core.jpg",
    tags: ["HIIT", "Core", "Conditioning"]
  },
  {
    id: 11,
    title: "Evening Meditation",
    trainer: trainers[1],
    scheduledAt: new Date(new Date().getTime() + 432000000), // 5 days from now
    duration: 30,
    category: "Meditation",
    difficulty: "All Levels",
    tokenCost: 1,
    participants: 137,
    maxParticipants: 400,
    description: "Wind down your day with this calming meditation session. Perfect for relaxing your mind and preparing for restful sleep.",
    equipmentRequired: ["Comfortable seating or lying position"],
    thumbnail: "/assets/images/sessions/evening-meditation.jpg",
    tags: ["Relaxation", "Sleep", "Mindfulness"]
  }
];
