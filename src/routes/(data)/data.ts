export interface Data {
  channels: Channel[]
}

export interface Channel {
  name: string
  videos: Video[]
}

export interface Video {
  id: string
  start: number
  end: number
}

export const userData: Data = {
  channels: [
    {
      name: 'Anything',
      videos: [
      ],
    },
    {
      name: 'Nature',
      // Wildlife and natural landscapes
      // e.g.: "Secrets of the Amazon Rainforest", "Polar Bears: Life on the Ice", "Volcanic Wonders of Iceland"
      videos: [
      ],
    },
    {
      name: 'Kitchen',
      // Cooking and food preparation
      // e.g.: "Perfect Homemade Pizza", "30-Minute Weeknight Meals", "Baking Bread From Scratch"
      videos: [
      ],
    },
    {
      name: 'Fitness',
      // Exercise and physical health
      // e.g.: "Full Body HIIT Workout", "Yoga for Beginners", "5 Essential Strength Training Moves"
      videos: [
        { id: 'eayerRxYUJc', start: 0, end: 300 }, // https://youtu.be/eayerRxYUJc
        { id: '3vmgLUnNRUY', start: 0, end: 300 }, // https://youtu.be/3vmgLUnNRUY
        { id: '8k9frewgz4k', start: 0, end: 300 }, // https://youtu.be/8k9frewgz4k
      ],
    },
    {
      name: 'History',
      // Historical events and figures
      // e.g.: "Ancient Egypt: Building the Pyramids", "World War II in Color", "The Rise and Fall of Rome"
      videos: [
        { id: '7mR5nNUQxYw', start: 0, end: 300 },
        { id: 'a-fZFR7fvsE', start: 0, end: 300 },
        { id: 'Fivsh4eVfBc', start: 0, end: 300 },
        { id: 'VsPVm-C1ygo', start: 0, end: 300 },
        { id: '8OxBxgmIh6o', start: 0, end: 300 }, // https://youtu.be/8OxBxgmIh6o
        { id: 'UeoBikpUIwg', start: 0, end: 300 }, // https://youtu.be/UeoBikpUIwg
        { id: 'xdCM2rMKylI', start: 0, end: 300 }, // https://youtu.be/xdCM2rMKylI
        { id: '1E4UOuSDcrg', start: 0, end: 300 }, // https://youtu.be/1E4UOuSDcrg
        { id: 'Wt5PXm-GJhY', start: 0, end: 300 }, // https://youtu.be/Wt5PXm-GJhY
        { id: '8NE7un_R5og', start: 0, end: 300 }, // https://youtu.be/8NE7un_R5og
        { id: 'ZUt_OO_C4Eo', start: 0, end: 300 }, // https://youtu.be/ZUt_OO_C4Eo
        { id: 'Gzyu94VR9lQ', start: 0, end: 300 }, // https://youtu.be/Gzyu94VR9lQ
        { id: 'YMb3Cug-aZk', start: 0, end: 300 }, // https://youtu.be/YMb3Cug-aZk
        { id: 'lZ1gT5H84cE', start: 0, end: 300 }, // https://youtu.be/lZ1gT5H84cE
        { id: 'AkHkKI17Y80', start: 0, end: 300 }, // https://youtu.be/AkHkKI17Y80
        { id: 'JvKyjPDASx0', start: 0, end: 300 }, // https://youtu.be/JvKyjPDASx0
        { id: 'PBv2Y-FiOoM', start: 0, end: 300 }, // https://youtu.be/PBv2Y-FiOoM
      ],
    },
    {
      name: 'Society',
      // Social issues, culture, and human behavior
      // e.g.: "Cultural Traditions Around the World", "Understanding Social Movements", "Modern Family Structures", "Urban vs Rural Life"
      videos: [
        { id: 'jZAY1ltqi4A', start: 0, end: 300 }, // https://youtu.be/jZAY1ltqi4A
      ],
    },
    {
      name: 'Science',
      // Scientific discoveries and concepts
      // e.g.: "How Black Holes Work", "The Human Brain Explained", "Quantum Physics for Everyone"
      videos: [
        { id: 'LzzmJaaPt2U', start: 0, end: 300 }, // https://youtu.be/LzzmJaaPt2U
        { id: 'arJVNwjhmRY', start: 0, end: 300 }, // https://youtu.be/arJVNwjhmRY
      ],
    },
    {
      name: 'Travel',
      // Destinations and travel guides
      // e.g.: "Hidden Gems of Japan", "Budget European Backpacking", "World's Most Beautiful Beaches"
      videos: [
        { id: 'ssfzkkhiK7o', start: 0, end: 300 }, // https://youtu.be/ssfzkkhiK7o
        { id: 'JMOvj_WV-Gk', start: 0, end: 300 }, // https://youtu.be/JMOvj_WV-Gk
        { id: 'GuKDigZpPGQ', start: 0, end: 300 }, // https://youtu.be/GuKDigZpPGQ
      ],
    },
    {
      name: 'Tech',
      // Technology and gadget reviews
      // e.g.: "New Smartphone Features Explained", "Building Your First PC", "Smart Home Setup Guide"
      videos: [
        { id: 'iEAxmALisxI', start: 0, end: 300 },
        { id: 'psVTWi3C02I', start: 0, end: 300 },
        { id: 'gCDas5SfPn0', start: 0, end: 300 }, // https://youtu.be/gCDas5SfPn0
      ],
    },
    {
      name: 'Music',
      // Music performances and education
      // e.g.: "Guitar Lessons for Beginners", "Symphony Orchestra Live", "History of Jazz"
      videos: [
        { id: 'hae9W2kc3PE', start: 0, end: 300 }, // https://youtu.be/hae9W2kc3PE
      ],
    },
    {
      name: 'Craft',
      // DIY projects and crafting
      // e.g.: "Knitting Basics", "Woodworking for Beginners", "Upcycling Furniture Projects"
      videos: [
      ],
    },
    {
      name: 'Garden',
      // Gardening and plant care
      // e.g.: "Growing Vegetables in Small Spaces", "Houseplant Care Guide", "Backyard Landscaping Ideas"
      videos: [
      ],
    },
    {
      name: 'Learn',
      // Educational content and tutorials
      // e.g.: "Spanish for Beginners", "Understanding Economics", "Math Made Easy"
      videos: [
        { id: '4q7GzWidfEg', start: 0, end: 300 },
        { id: 'wWDZZH4JHlI', start: 0, end: 300 }, // https://youtu.be/wWDZZH4JHlI
      ],
    },
    {
      name: 'Pets',
      // Animal care and pet videos
      // e.g.: "Dog Training Essentials", "Cat Behavior Explained", "Exotic Pet Care Guide"
      videos: [
      ],
    },
    {
      name: 'Auto',
      // Cars and vehicle maintenance
      // e.g.: "Basic Car Maintenance Tips", "Classic Car Restorations", "Electric Vehicles Explained"
      videos: [
      ],
    },
    {
      name: 'Home',
      // Home improvement and decoration
      // e.g.: "Budget Kitchen Renovation", "Interior Design Basics", "DIY Home Repairs"
      videos: [
      ],
    },
    {
      name: 'Mind',
      // Psychology and mental wellness
      // e.g.: "Meditation for Beginners", "Understanding Anxiety", "Improving Your Memory"
      videos: [
        { id: 'WIj_3AIKcE8', start: 0, end: 300 },
        { id: 'O_v-tIndr1M', start: 0, end: 300 }, // https://youtu.be/O_v-tIndr1M
        { id: 'oqhLG8JnRf0', start: 0, end: 300 }, // https://youtu.be/oqhLG8JnRf0
        { id: 'JHwKaiF6XYA', start: 0, end: 300 }, // https://youtu.be/JHwKaiF6XYA
        { id: 'mmJpaPYFamA', start: 0, end: 300 }, // https://youtu.be/mmJpaPYFamA
        { id: '7WGaMAb-ivs', start: 0, end: 300 }, // https://youtu.be/7WGaMAb-ivs
        { id: 'DWVhSWKuCvI', start: 0, end: 300 }, // https://youtu.be/DWVhSWKuCvI
      ],
    },
    {
      name: 'Gaming',
      // Game reviews and gameplay videos
      // e.g.: "Red Dead Redemption 2 Review", "Minecraft Building Tutorial", "Top 10 Strategy Games of 2024"
      videos: [
        { id: 'ttIc1pAUK5M', start: 0, end: 300 },
        { id: 'VngtOicBjeY', start: 0, end: 300 }, // https://youtu.be/VngtOicBjeY
        { id: '4ExGn23u6CE', start: 0, end: 300 }, // https://youtu.be/4ExGn23u6CE
        { id: 'JToQLyuRUGM', start: 0, end: 300 }, // https://youtu.be/JToQLyuRUGM
        { id: 'S0Wse2hlgpQ', start: 0, end: 300 }, // https://youtu.be/S0Wse2hlgpQ
        { id: '-n_ehb924do', start: 0, end: 300 }, // https://youtu.be/-n_ehb924do
        { id: 'M-bh5JKnpoQ', start: 0, end: 300 }, // https://youtu.be/M-bh5JKnpoQ
      ],
    },
    {
      name: 'Code',
      // Software development and computer science
      // e.g.: "Python for Beginners", "Web Development Crash Course", "Data Structures Explained", "Machine Learning Fundamentals"
      videos: [
      ],
    },
    {
      name: 'Comedy',
      // Stand-up, sketches, and humorous content
      // e.g.: "Stand-up Comedy Specials", "Funny Sketch Series", "Comedy Movie Reviews", "Prank Videos"
      videos: [
        { id: 'MuG2xUJhQwg', start: 0, end: 300 }, // https://youtu.be/MuG2xUJhQwg
      ],
    },
    {
      name: 'Business',
      // Entrepreneurship, economics, and finance
      // e.g.: "Venture Capital Explained", "Portfolio Management Strategies", "Macroeconomics Basics", "MBA Career Paths"
      videos: [
        { id: 'HsE0gUm-qUQ', start: 0, end: 300 },
        { id: 'rJASjEsgyzc', start: 0, end: 300 },
        { id: 'HDGGwKu7Ndg', start: 0, end: 300 }, // https://youtu.be/HDGGwKu7Ndg
        { id: 'WtoYPvY7h40', start: 0, end: 300 }, // https://youtu.be/WtoYPvY7h40
      ],
    },
    {
      name: 'Spirit',
      // Religion, spirituality, and philosophy
      // e.g.: "Introduction to Buddhism", "Philosophy of Consciousness", "World Religions Explained", "Meditation Practices Across Cultures"
      videos: [
        { id: 'OZebYks7Y6I', start: 0, end: 300 },
        { id: 'Tl9uyOqRdJ8', start: 0, end: 300 }, // https://youtu.be/Tl9uyOqRdJ8
      ],
    },
    {
      name: 'Cinema',
      // Movies, cinema, and TV shows
      // e.g.: "Film Analysis: The Godfather", "Behind the Scenes of Popular TV Shows", "Top 10 Movies of 2024", "Understanding Film Techniques"
      videos: [
        { id: '9J7AHlipJE4', start: 0, end: 300 },
        { id: 'YGzAFLJZRT8', start: 0, end: 300 },
        { id: 'YVZFDeU_iZg', start: 0, end: 300 },
        { id: 'K0Tu059Wbg0', start: 0, end: 300 },
        { id: 'Iy4dM_rxmtU', start: 0, end: 300 }, // https://youtu.be/Iy4dM_rxmtU
        { id: 'mBVJelzNVE0', start: 0, end: 300 }, // https://youtu.be/mBVJelzNVE0
      ],
    },
    {
      name: 'Documentaries',
      // In-depth factual films on various subjects
      // e.g.: "The Social Dilemma", "Planet Earth", "Making a Murderer"
      videos: [
        { id: 'mUafP3KHnZY', start: 0, end: 300 }, // https://youtu.be/mUafP3KHnZY
      ],
    },
    {
      name: 'Canvas',
      // Arts, creativity, and graphic design
      // e.g.: "Digital Illustration Techniques", "Art History: Impressionism", "Logo Design Fundamentals", "Creative Photography Tips"
      videos: [
        { id: 'a6obyqtpeqw', start: 0, end: 300 }, // https://youtu.be/a6obyqtpeqw
        { id: 'nCvGm8_-1OI', start: 0, end: 300 }, // https://youtu.be/nCvGm8_-1OI
        { id: 'Tp9cH5TYmQY', start: 0, end: 300 }, // https://youtu.be/Tp9cH5TYmQY
      ],
    },
  ],
}
