import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";

type LocalizedProject = {
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionJa: string;
};

const descriptionKey: Record<
  Locale,
  keyof Pick<
    LocalizedProject,
    "descriptionEn" | "descriptionUz" | "descriptionRu" | "descriptionJa"
  >
> = {
  en: "descriptionEn",
  uz: "descriptionUz",
  ru: "descriptionRu",
  ja: "descriptionJa",
};

export function getProjectDescription(
  project: LocalizedProject,
  locale: string,
): string {
  if (!isLocale(locale)) {
    return project.descriptionEn;
  }

  return project[descriptionKey[locale]];
}
