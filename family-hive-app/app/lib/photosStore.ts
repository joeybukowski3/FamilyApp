export type PhotoComment = {
  id: string;
  text: string;
  createdAt: string;
  createdByMemberId: string;
};

export type PhotoPost = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  createdByMemberId: string;
  comments: PhotoComment[];
};

const STORAGE_KEY = "family_photos_v1";

const seedPosts: PhotoPost[] = [
  {
    id: "photo-1",
    imageUrl: "https://picsum.photos/id/1062/900/600",
    caption: "Saturday hike views.",
    createdAt: "2026-02-21T16:20:00.000Z",
    createdByMemberId: "joey",
    comments: [
      {
        id: "photo-1-comment-1",
        text: "That sky is unreal.",
        createdAt: "2026-02-21T17:05:00.000Z",
        createdByMemberId: "alejandra",
      },
    ],
  },
  {
    id: "photo-2",
    imageUrl: "https://picsum.photos/id/1027/900/600",
    caption: "Camila's art corner.",
    createdAt: "2026-02-20T20:10:00.000Z",
    createdByMemberId: "camila",
    comments: [
      {
        id: "photo-2-comment-1",
        text: "So cozy.",
        createdAt: "2026-02-20T20:25:00.000Z",
        createdByMemberId: "joey",
      },
    ],
  },
  {
    id: "photo-3",
    imageUrl: "https://picsum.photos/id/1040/900/600",
    caption: "Joseph's new Lego build.",
    createdAt: "2026-02-19T18:45:00.000Z",
    createdByMemberId: "joseph",
    comments: [],
  },
];

export const getSeedPhotos = () => seedPosts;

const isValidPosts = (data: unknown): data is PhotoPost[] => {
  return Array.isArray(data);
};

export const hydratePhotos = (): PhotoPost[] => {
  if (typeof window === "undefined") {
    return getSeedPhotos();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seed = getSeedPhotos();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(stored);
    if (isValidPosts(parsed)) {
      return parsed;
    }
  } catch {
    // fallthrough to reseed
  }

  window.localStorage.removeItem(STORAGE_KEY);
  const seed = getSeedPhotos();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
};

export const savePhotos = (posts: PhotoPost[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};
