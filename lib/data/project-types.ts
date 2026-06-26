export type CategoryRecord = {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  nameJa: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryWithCount = CategoryRecord & {
  projectCount: number;
};

export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  mainImageUrl: string | null;
  authorName: string;
  department: string;
  techStack: string | null;
  category: CategoryRecord;
  averageRating: number | null;
  commentCount: number;
  createdAt: Date;
};
