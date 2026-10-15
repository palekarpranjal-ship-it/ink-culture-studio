export type Course = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "All Levels";
  /** Editable placeholder — do not invent durations or certifications */
  duration: string;
  summary: string;
  outcomes: string[];
  /** 01, 02... for the editorial numbering */
  number: string;
  image?: string;
  images?: string[];
  cover?: string;
  instructor?: string;
};

/**
 * ⚠️ PLACEHOLDER CONTENT — durations, curriculum depth and any certification
 * claims must be replaced with real information before launch.
 */
export const courses: Course[] = [
  {
    id: "master-course",
    number: "01",
    title: "Master Course",
    level: "All Levels",
    duration: "5 months",
    instructor: "Taught by Lucky Solanki · Assisted by Karan Parmar",
    summary: "A complete tattoo education pathway moving from drawing fundamentals to tattooing, colour, designing, and the professional mindset required to build a lasting studio practice.",
    outcomes: [
      "Drawing: form, value, dimension, light, anatomy, perspective",
      "Tattooing: tools, needles, hygiene, lining, colour, realism, shading",
      "Colour: theory, packing, blending, harmony, texture, live demonstration",
      "Designing: Photoshop, Illustrator, iPad sketching, composition and body flow",
      "Management: client care, communication, studio systems, marketing and social media",
    ],
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Drawing%2001-pJ4Y8s3Tta71lHn2rQMI8vrZ7QjHC9.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tattooing%2002-YY5LGkuspresZIjV5p5D4wSZoc5pJt.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Colour%20Tat%2003-TAidZ09pCoatYYTlb4jibhvoP7aVeF.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Designing%2004-dtVezGolcT80At2vVKhjGd7LftjcSX.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mngmant%2005-7qrjYTdmT3IxBwBNi6VuG9TjUkMOnL.jpg",
    ],
  },
  {
    id: "fundamentals",
    number: "01",
    title: "Beginner Tattoo Fundamentals",
    level: "Beginner",
    duration: "[Duration TBC]",
    summary:
      "The foundation every tattoo artist needs: drawing discipline, studio culture, and what professional tattooing actually demands before a machine is ever picked up.",
    outcomes: [
      "Design translation from paper to skin",
      "Studio etiquette & professional mindset",
      "Understanding the tattoo workflow end-to-end",
    ],
  },
  {
    id: "design-drawing",
    number: "02",
    title: "Tattoo Design & Drawing",
    level: "Beginner",
    duration: "[Duration TBC]",
    summary:
      "Train the hand before the machine. Composition, flash studies, custom design thinking and building drawings that belong on a body — not just on paper.",
    outcomes: [
      "Composition & flow for body placement",
      "Original flash design & custom briefs",
      "Building a repeatable drawing practice",
    ],
  },
  {
    id: "machine-needle",
    number: "03",
    title: "Machine & Needle Fundamentals",
    level: "Beginner",
    duration: "[Duration TBC]",
    summary:
      "Coils, rotors, cartridges and voltage — how machines actually work, how needles behave in skin, and how to set up and tear down safely every single time.",
    outcomes: [
      "Machine types, tuning & troubleshooting",
      "Needle groups and their use cases",
      "Setup & breakdown without shortcuts",
    ],
  },
  {
    id: "linework",
    number: "04",
    title: "Linework",
    level: "Intermediate",
    duration: "[Duration TBC]",
    summary:
      "The discipline that separates professionals from hobbyists. Line weight, deliberate trajectories, and confident single-pass lines on practice material.",
    outcomes: [
      "Line weight & consistency control",
      "Hand speed and depth awareness",
      "Repairing and owning mistakes",
    ],
  },
  {
    id: "shading",
    number: "05",
    title: "Shading",
    level: "Intermediate",
    duration: "[Duration TBC]",
    summary:
      "Black & grey gradients, whip shading, packing and texture — building smooth, healed-friendly value transitions that give tattoos depth.",
    outcomes: [
      "Smooth gradient building",
      "Whip shading, packing & texture techniques",
      "Designing for how tattoos age",
    ],
  },
  {
    id: "colour-theory",
    number: "06",
    title: "Colour Theory",
    level: "Intermediate",
    duration: "[Duration TBC]",
    summary:
      "Pigment behaviour in skin, palette building, saturation strategy and colour packing — plus how colour reads across different skin tones over time.",
    outcomes: [
      "Pigment chemistry fundamentals",
      "Colour packing without trauma",
      "Skin-tone-aware palette decisions",
    ],
  },
  {
    id: "hygiene",
    number: "07",
    title: "Hygiene & Studio Practice",
    level: "All Levels",
    duration: "[Duration TBC]",
    summary:
      "Non-negotiable. Cross-contamination control, sterile field setup, surface disinfection, safe waste handling and the routines that keep clients safe.",
    outcomes: [
      "Cross-contamination prevention",
      "Sterile setup & single-use discipline",
      "Aftercare guidance done right",
    ],
  },
  {
    id: "consultation",
    number: "08",
    title: "Client Consultation",
    level: "All Levels",
    duration: "[Duration TBC]",
    summary:
      "Turning ideas into designs and strangers into returning clients. Listening, expectation-setting, pricing conversations and saying no when you should.",
    outcomes: [
      "Consultation structure that converts",
      "Managing expectations honestly",
      "Design briefing for custom work",
    ],
  },
  {
    id: "portfolio",
    number: "09",
    title: "Portfolio Building",
    level: "All Levels",
    duration: "[Duration TBC]",
    summary:
      "Your portfolio is your resume. Shooting work properly, selecting ruthlessly, presenting healed results and building the body of work you want to be booked for.",
    outcomes: [
      "Photographing tattoos correctly",
      "Curation & presentation strategy",
      "Planning the work you want to attract",
    ],
  },
];

export const academyCourses: Course[] = [
  {
    id: "master-course",
    number: "01",
    title: "Twin Diploma in Tattooing",
    level: "All Levels",
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Standy%20Diploma-JxNZpIi2ZJs7ABAAZX7CBueoOZ2vo1.jpg",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Drawing%2001-6Sbxe1KMzSRFhywLMI8ifhB5tyNsx6.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tattooing%2002-sypZl7pBaU9VFvROVOfeFCuhd4wiuZ.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Colour%20Tat%2003-D5wb4KSQHWlhQO7GntoAGMPEUN20hS.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Designing%2004-0udHYxs2qhoXrJ7kNRpb0kcpfpdsqN.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mngmant%2005-GojGjLmcYHT62r3aV66f4G0yOeJJbb.jpg",
    ],
    duration: "5 months",
    instructor: "Taught by Lucky Solanki · Assisted by Karan Parmar",
    summary: "A complete Twin Diploma pathway for developing a professional tattoo artist from foundation to studio-ready practice. The program moves through drawing, design, management studies, tattooing and colour tattooing in a connected sequence, combining classroom understanding, digital design, supervised practice and live demonstration. Students build the visual discipline, technical control, hygiene habits, client communication and business mindset needed to create thoughtful work safely and consistently.",
    outcomes: [
      "DRAWING — Fundamentals of drawing; basic shapes and forms; the importance of grey value; 2D and 3D dimension study; lights and shadows; perspective and proportion; human anatomy for capturing figures and expressions.",
      "DESIGNING — Creating quick small designs; basic to advanced Photoshop; basic to advanced Illustrator; digital sketching on iPad; conceptual designing; composition, balance, focal point, flow, contrast and eye movement; understanding the human body.",
      "MANAGEMENT STUDIES — Personality development, personal etiquettes, client management, communication skills, studio management, marketing strategy, social media handling, promotion and marketing skills.",
      "TATTOOING — History and revolution in tattooing; tattoo tools and equipment; needle theory and uses; hygiene; tattooing on artificial skin; lining, colour packing, realism, portrait shading and texturing; styles and fundamentals; stenciling and placement; image study for portrait and realistic work.",
      "COLOUR TATTOOING — Fundamentals and theory of colour; characteristics and symbolic meaning; hue, value and saturation; dimension and colour mixing; harmony and colour schemes; safe colour packing on human skin; colour styles; advanced blending; realistic textures and effects; live demonstration tattoo by Lucky.",
      "Supervised practice, demonstrations and connected projects across the full tattoo workflow.",
    ],
  },
  {
    id: "primary-course",
    number: "02",
    title: "Black and Grey Course",
    level: "All Levels",
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Standy%20B%26G-6hcrHLtnJogUI8STDybuPk26oqdGOA.jpg",
    duration: "3 months",
    summary: "Master the discipline of black and grey tattooing through a structured course that begins with drawing foundations and progresses into value, light, anatomy, composition, tattoo tools, needle control, hygiene, lining, shading, realism, portrait work, texturing, stencil placement and professional studio practice. The course connects the artist’s eye with the hand’s technical control so every decision is intentional, readable and built to heal well.",
    outcomes: [
      "DRAWING — Basic shapes and forms, grey value, dimension, lights and shadows, perspective, proportion, human anatomy and texture.",
      "TATTOOING — History and evolution, equipment, needle theory, hygiene, artificial-skin practice, lining, black and grey shading, realism, portrait shading, texturing, stenciling and placement.",
      "DESIGNING — Quick small designs, Photoshop, Illustrator, iPad sketching, conceptual design, composition, balance, focal point, flow, contrast and eye movement.",
      "MANAGEMENT STUDIES — Right mindset, discipline, consistency, personality development, personal etiquettes, client management, communication, studio management, marketing and social media.",
    ],
  },
  {
    id: "colour-course",
    number: "03",
    title: "Colour Course",
    level: "Intermediate",
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Standy%20Colour-7v2WsR9ik5llY2UhDbzAkmeRrS3xny.jpg",
    duration: "1 month",
    summary: "Intermediate colour tattoo training from colour fundamentals through advanced blending, texture and live demonstration.",
    outcomes: ["Fundamentals of colour", "Colour theory, hue, value and saturation", "Colour harmony and schemes", "Safe colour packing on human skin", "Advanced blending, textures and realistic effects", "Live demonstration tattoo by Lucky"],
  },
  {
    id: "hobby-course",
    number: "04",
    title: "Hobby Course",
    level: "All Levels",
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hobby%20Course-IEUfJVp6dun7EWJxwVlXe108P8Uopm.jpg",
    duration: "45 days",
    summary: "A practical hobby course covering safe, confident tattoo fundamentals and aftercare.",
    outcomes: ["Fundamental drawing skills", "Lining, packing and shading techniques", "Handling tattooing tools correctly", "Using the right needles for the right result", "Ultra-soft shading", "Stencil making and body-part placement", "Texture techniques", "Portfolio building", "Hygiene and aftercare"],
  },
  {
    id: "artist-programme",
    number: "05",
    title: "Artist Programme",
    level: "All Levels",
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artist%20Prog-4OxeQv6b947BwUNFCXZYrtPIfgA2zn.jpg",
    duration: "45 days",
    summary: "A focused 45-day course for artists building safe, confident fundamentals and a first professional portfolio.",
    outcomes: ["Lining, packing and shading techniques", "Correct technique for different needle types", "Ultra-soft shading", "Stencil making and body-part placement", "Portrait and realistic tattoos", "Human anatomy for design", "Texture techniques", "Portfolio building", "Tattoo competition preparation", "Marketing techniques"],
  },
];

export const academyWorkshopImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Workshop%202026%20BTS05-E0AFXnjXbzKMEhzmMhGPZKYJiEuVNS.jpg",
    alt: "Tattoo academy workshop with students learning in the studio",
    label: "Inside the studio",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Workshop%202026%20BTS%2004-P3jdOVmha13VO1ZAR7vtiOysu3VboO.jpg",
    alt: "Tattoo students practising together during a workshop",
    label: "Practice in progress",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Workshop%202026%20BTS03-ipVb4aPhKThwDt720bksVbHG6pImaY.jpg",
    alt: "Tattoo workshop audience listening to an artist demonstration",
    label: "Learn from working artists",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Workshop%202026%20BTS02-bg5aNV9bgvTK6AIXWS2NYc6uQbykoQ.jpg",
    alt: "Tattoo artists gathered around a live workshop demonstration",
    label: "Observe the craft",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Benglore%20moments%20End-0I3shgtgQlH71VV0lhy3xAA1bOgj9G.jpg",
    alt: "Tattoo workshop participants celebrating together",
    label: "Leave thinking like an artist",
  },
];

export const academyFaqs = [
  {
    question: "Do I need drawing experience to join?",
    answer:
      "You need willingness, not mastery. The curriculum starts with drawing discipline before any machine work — but students who already draw regularly progress faster.",
  },
  {
    question: "Is there a certification at the end?",
    answer:
      "We're finalising the program structure. Certification details will be announced with real course documentation — we don't hand out paper without proof of skill.",
  },
  {
    question: "Will I tattoo real people during training?",
    answer:
      "Only after passing practical checkpoints on practice material, and always under direct supervision. Client safety is never a training exercise.",
  },
  {
    question: "How do I apply?",
    answer:
      "Send an enquiry through this page or message us on WhatsApp with a bit about you and, if you have one, sketches of your work. We shortlist from there.",
  },
];
