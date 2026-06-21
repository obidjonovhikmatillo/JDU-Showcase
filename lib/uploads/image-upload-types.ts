export type UploadedImage = {
  url: string;
  publicId: string;
};

export type ExistingUploadedImage = {
  url: string;
  publicId?: string;
  id?: string;
};
