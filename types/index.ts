export type LocaleCode = "en" | "uz" | "ru" | "ja";

export type NavItem = {
  href: string;
  labelKey: "home" | "restaurants" | "login" | "register" | "profile" | "admin";
};

export * from "./database";
