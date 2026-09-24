// Your life story, childhood to now — the "diary" in the Me window. One entry per chapter,
// oldest first. Add, remove or reorder freely; nothing else depends on how many there are.
//
// photos: optional. Each needs { id, name, src, description }; `src` is a file in /public.
// The placeholders below reuse your gallery photos (image1.jpg...) — replace with real ones.
export const timeline = [
  {
    id: "childhood",
    title: "Childhood",
    period: "20XX - 20XX",
    description:
      "Placeholder: a story or memory from your childhood — where you grew up, something that shaped you.",
    photos: [
      {
        id: "childhood-1",
        name: "childhood-1.jpg",
        src: "image1.jpg",
        description: "Placeholder photo",
      },
      {
        id: "childhood-2",
        name: "childhood-2.jpg",
        src: "image2.jpg",
        description: "Placeholder photo",
      },
    ],
  },
  {
    id: "school",
    title: "School",
    period: "20XX - 20XX",
    description: "Placeholder: your school years — a favorite subject, a teacher, a turning point.",
    photos: [
      { id: "school-1", name: "school-1.jpg", src: "image3.jpg", description: "Placeholder photo" },
      { id: "school-2", name: "school-2.jpg", src: "image4.jpg", description: "Placeholder photo" },
    ],
  },
  {
    id: "college",
    title: "College",
    period: "20XX - 20XX",
    description:
      "Placeholder: college and how you found your way into development — a project, a class, a first line of code.",
    photos: [
      {
        id: "college-1",
        name: "college-1.jpg",
        src: "image5.jpg",
        description: "Placeholder photo",
      },
      {
        id: "college-2",
        name: "college-2.jpg",
        src: "image6.jpg",
        description: "Placeholder photo",
      },
    ],
  },
  {
    id: "special-memory",
    title: "A Special Memory",
    period: "20XX",
    description:
      "Placeholder: a specific day, trip or occasion that mattered to you. Duplicate this entry for more.",
    photos: [
      {
        id: "special-memory-1",
        name: "special-memory-1.jpg",
        src: "image7.jpg",
        description: "Placeholder photo",
      },
    ],
  },
  {
    id: "today",
    title: "Today",
    period: "Now",
    description:
      "Placeholder: where you are now, what you're building, what you're looking for next.",
    photos: [
      { id: "today-1", name: "today-1.jpg", src: "image9.jpg", description: "Placeholder photo" },
    ],
  },
];
