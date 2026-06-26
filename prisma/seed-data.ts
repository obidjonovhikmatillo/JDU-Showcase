export type CategorySeed = {
  slug: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  nameJa: string;
};

export type ProjectSeed = {
  slug: string;
  title: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionJa: string;
  authorName: string;
  department: string;
  techStack?: string;
  demoUrl?: string;
  githubUrl?: string;
  mainImageUrl: string;
  galleryImageUrls: string[];
  categorySlug: string;
  difficulty?: string;
  isPublished: boolean;
};

export type CommentSeed = {
  userEmail: string;
  projectSlug: string;
  rating: number;
  title: string;
  content: string;
  imageUrls?: string[];
};

export type UserSeed = {
  email: string;
  fullName: string;
  password: string;
  role: "USER" | "ADMIN";
  preferredLanguage: "UZ" | "EN" | "RU" | "JA";
};

import {
  getProjectMainImage,
  getProjectGallery,
  getCommentImage,
} from "../lib/project-images";

export const users: UserSeed[] = [
  {
    email: "admin@example.com",
    fullName: "Sardor Alimov",
    password: "Admin123!",
    role: "ADMIN",
    preferredLanguage: "UZ",
  },
  {
    email: "user@example.com",
    fullName: "Dilnoza Karimova",
    password: "User123!",
    role: "USER",
    preferredLanguage: "UZ",
  },
  {
    email: "aziza@example.com",
    fullName: "Aziza Rakhimova",
    password: "User123!",
    role: "USER",
    preferredLanguage: "RU",
  },
  {
    email: "kenji@example.com",
    fullName: "Kenji Tanaka",
    password: "User123!",
    role: "USER",
    preferredLanguage: "JA",
  },
];

export const categories: CategorySeed[] = [
  {
    slug: "web-development",
    nameUz: "Veb dasturlash",
    nameEn: "Web Development",
    nameRu: "Веб-разработка",
    nameJa: "ウェブ開発",
  },
  {
    slug: "mobile-app",
    nameUz: "Mobil ilova",
    nameEn: "Mobile App",
    nameRu: "Мобильное приложение",
    nameJa: "モバイルアプリ",
  },
  {
    slug: "ui-ux-design",
    nameUz: "UI/UX dizayn",
    nameEn: "UI/UX Design",
    nameRu: "UI/UX дизайн",
    nameJa: "UI/UXデザイン",
  },
  {
    slug: "ai-ml",
    nameUz: "Sun'iy intellekt",
    nameEn: "AI/ML",
    nameRu: "ИИ/МО",
    nameJa: "AI/ML",
  },
  {
    slug: "game-development",
    nameUz: "O'yin yaratish",
    nameEn: "Game Development",
    nameRu: "Разработка игр",
    nameJa: "ゲーム開発",
  },
];

export const projects: ProjectSeed[] = [
  {
    slug: "spendwise-finance",
    title: "SpendWise Finance Landing",
    descriptionUz:
      "Zamonaviy kredit karta va moliyaviy xizmatlar uchun landing sahifa dizayni. Elegant gradient ranglar va aniq tipografiya bilan foydalanuvchilarga moliyaviy erkinlikni taqdim etadi.",
    descriptionEn:
      "An elegant credit card and finance landing page design featuring smooth gradients, clean typography, and a premium feel. The layout guides users through key financial features with a sophisticated visual hierarchy.",
    descriptionRu:
      "Элегантный дизайн лендинга для кредитных карт и финансовых услуг. Плавные градиенты, чистая типографика и премиальное оформление создают ощущение надёжности и современности.",
    descriptionJa:
      "クレジットカードと金融サービスのためのエレガントなランディングページデザイン。滑らかなグラデーション、クリーンなタイポグラフィ、プレミアムな雰囲気が特徴です。",
    authorName: "Aleksandr Petrov",
    department: "FinTech",
    techStack: "Figma, React, Tailwind CSS, Framer Motion",
    mainImageUrl: getProjectMainImage("spendwise-finance"),
    galleryImageUrls: getProjectGallery("spendwise-finance"),
    categorySlug: "ui-ux-design",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "ora-wellness",
    title: "ORA Wellness Experience",
    descriptionUz:
      "ORA wellness va teri parvarishi brendi uchun landing sahifa. Tabiat rasmlari kolaji va yumshoq ranglar palitrasidan foydalanib, tinchlik va salomatlik hissini uyg'otadi.",
    descriptionEn:
      "A wellness and skincare app landing page for the ORA brand, featuring a beautiful photo collage of natural elements. The design evokes calm and self-care through earthy tones, soft shadows, and flowing layouts.",
    descriptionRu:
      "Лендинг для бренда ORA в сфере wellness и ухода за кожей. Коллаж из фотографий природы, мягкая цветовая палитра и плавная компоновка создают атмосферу спокойствия и заботы о себе.",
    descriptionJa:
      "ORAブランドのウェルネス・スキンケアアプリのランディングページ。自然素材のフォトコラージュとアースカラーで、穏やかなセルフケアの世界観を表現しています。",
    authorName: "Yuliya Sokolova",
    department: "UI/UX Design",
    techStack: "Figma, Next.js, GSAP, Tailwind CSS",
    mainImageUrl: getProjectMainImage("ora-wellness"),
    galleryImageUrls: getProjectGallery("ora-wellness"),
    categorySlug: "ui-ux-design",
    difficulty: "Intermediate",
    isPublished: true,
  },
  {
    slug: "ideahub-platform",
    title: "IdeaHub Creative Platform",
    descriptionUz:
      "\"Buyuk g'oyalar shu yerda yashaydi\" shiori bilan qorong'u temada ishlangan karta asosidagi platforma. Ijodkorlar uchun loyihalarni ulashish va hamkorlik qilish imkonini beradi.",
    descriptionEn:
      "A dark-themed card-based platform built around the motto 'Great ideas live here.' The UI features rich card layouts with hover interactions, enabling creatives to share projects and collaborate seamlessly.",
    descriptionRu:
      "Тёмная карточная платформа с девизом «Великие идеи живут здесь». Богатые карточные макеты с hover-анимациями позволяют креативщикам делиться проектами и сотрудничать.",
    descriptionJa:
      "「素晴らしいアイデアはここに生まれる」をモットーにしたダークテーマのカードベースプラットフォーム。ホバーインタラクション付きのリッチなカードレイアウトが特徴です。",
    authorName: "Dmitriy Volkov",
    department: "Frontend Development",
    techStack: "Next.js, TypeScript, Tailwind CSS, Prisma",
    mainImageUrl: getProjectMainImage("ideahub-platform"),
    galleryImageUrls: getProjectGallery("ideahub-platform"),
    categorySlug: "web-development",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "healthtrack-monitor",
    title: "HealthTrack Vital Monitor",
    descriptionUz:
      "Qon bosimi, yurak urish tezligi va boshqa vital ko'rsatkichlarni real vaqtda ko'rsatuvchi sog'liqni kuzatish dashboardi. Grafiklar va widgetlar orqali aniq ma'lumotlarni taqdim etadi.",
    descriptionEn:
      "A health monitoring dashboard displaying blood pressure, heart rate, and other vital signs in real time. Clean data visualizations with interactive charts and widget cards provide actionable health insights.",
    descriptionRu:
      "Дашборд мониторинга здоровья, отображающий давление, пульс и другие жизненные показатели в реальном времени. Чёткие визуализации данных с интерактивными графиками и виджетами.",
    descriptionJa:
      "血圧、心拍数などのバイタルサインをリアルタイムで表示する健康モニタリングダッシュボード。インタラクティブなチャートとウィジェットで健康データを可視化します。",
    authorName: "Anvar Tursunov",
    department: "UI/UX Design",
    techStack: "React, D3.js, TypeScript, Tailwind CSS",
    mainImageUrl: getProjectMainImage("healthtrack-monitor"),
    galleryImageUrls: getProjectGallery("healthtrack-monitor"),
    categorySlug: "mobile-app",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "abcbank-digital",
    title: "ABCBank Digital Banking",
    descriptionUz:
      "\"Erkinlikni kashf eting\" sarlavhasi bilan zamonaviy raqamli bank landing sahifasi. Ishonchli va professional dizayn orqali bank xizmatlarini foydalanuvchilarga yaqinlashtiradi.",
    descriptionEn:
      "A digital banking landing page with the headline 'Discover freedom,' showcasing modern financial services. The trustworthy design uses bold typography, clean sections, and a professional color palette to convey reliability.",
    descriptionRu:
      "Лендинг цифрового банка с заголовком «Откройте свободу», демонстрирующий современные финансовые услуги. Внушающий доверие дизайн с крупной типографикой и профессиональной цветовой палитрой.",
    descriptionJa:
      "「自由を発見しよう」をヘッドラインとしたデジタルバンキングのランディングページ。モダンな金融サービスを信頼感のあるデザインで表現しています。",
    authorName: "Kamola Rashidova",
    department: "FinTech",
    techStack: "Figma, React, Tailwind CSS, Stripe API",
    mainImageUrl: getProjectMainImage("abcbank-digital"),
    galleryImageUrls: getProjectGallery("abcbank-digital"),
    categorySlug: "web-development",
    difficulty: "Intermediate",
    isPublished: true,
  },
  {
    slug: "urbangreen-tech",
    title: "UrbanGreen Eco-Tech Landing",
    descriptionUz:
      "UrbanGreen ekologik texnologiyalar brendi uchun landing sahifa. Tabiat va mox tasvirlari bilan uyg'unlashgan zamonaviy dizayn barqaror kelajak g'oyasini ifodalaydi.",
    descriptionEn:
      "An eco-tech landing page for the UrbanGreen brand, blending nature imagery with modern web design. Lush moss textures and green tones create a compelling narrative around sustainable technology and environmental responsibility.",
    descriptionRu:
      "Лендинг для эко-бренда UrbanGreen, сочетающий природные образы с современным веб-дизайном. Текстуры мха и зелёные тона создают убедительную историю об устойчивых технологиях.",
    descriptionJa:
      "UrbanGreenエコテックブランドのランディングページ。自然のイメージとモダンなウェブデザインを融合し、苔のテクスチャとグリーントーンでサステナビリティを表現しています。",
    authorName: "Lev Mikhailov",
    department: "Frontend Development",
    techStack: "Next.js, Three.js, Tailwind CSS, GSAP",
    mainImageUrl: getProjectMainImage("urbangreen-tech"),
    galleryImageUrls: getProjectGallery("urbangreen-tech"),
    categorySlug: "web-development",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "niceatnoon-studio",
    title: "NiceAtNoon Design Studio Portfolio",
    descriptionUz:
      "NiceAtNoon dizayn studiyasining portfolio sayti. Brending ishlari, logotip dizayni va vizual identifikatsiya loyihalarini chiroyli grid layoutda namoyish etadi.",
    descriptionEn:
      "A portfolio website for the NiceAtNoon design studio, showcasing branding work, logo design, and visual identity projects. The clean grid layout and bold imagery highlight the studio's creative range and attention to detail.",
    descriptionRu:
      "Портфолио дизайн-студии NiceAtNoon с работами по брендингу, дизайну логотипов и визуальной идентичности. Чистый grid-макет и выразительные изображения подчёркивают творческий диапазон студии.",
    descriptionJa:
      "NiceAtNoonデザインスタジオのポートフォリオサイト。ブランディング、ロゴデザイン、ビジュアルアイデンティティの作品をクリーンなグリッドレイアウトで紹介しています。",
    authorName: "Sabina Nazarova",
    department: "Brand Design",
    techStack: "Figma, Webflow, After Effects",
    mainImageUrl: getProjectMainImage("niceatnoon-studio"),
    galleryImageUrls: getProjectGallery("niceatnoon-studio"),
    categorySlug: "ui-ux-design",
    difficulty: "Intermediate",
    isPublished: true,
  },
  {
    slug: "panora-wellness",
    title: "Panora Stress Tracker",
    descriptionUz:
      "Panora stress darajasini kuzatuvchi ilova. Aylana shaklidagi soat vidjeti va kundalik kayfiyat jurnali orqali foydalanuvchilarga ruhiy salomatliklarini boshqarishda yordam beradi.",
    descriptionEn:
      "A stress tracking wellness app featuring a circular watch widget layout for daily mood journaling. Panora helps users monitor mental well-being through elegant data visualization, calming color schemes, and mindfulness reminders.",
    descriptionRu:
      "Приложение Panora для отслеживания стресса с круглым виджетом-часами и дневником настроения. Элегантная визуализация данных и спокойная цветовая гамма помогают пользователям следить за ментальным здоровьем.",
    descriptionJa:
      "円形ウォッチウィジェットを備えたストレストラッカーアプリ「Panora」。日々の気分ジャーナリングとエレガントなデータ可視化で、メンタルヘルスの管理をサポートします。",
    authorName: "Iroda Karimova",
    department: "UI/UX Design",
    techStack: "Swift, SwiftUI, HealthKit, Core Data",
    mainImageUrl: getProjectMainImage("panora-wellness"),
    galleryImageUrls: getProjectGallery("panora-wellness"),
    categorySlug: "mobile-app",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "fashion-ecommerce",
    title: "Fashion E-Commerce Showcase",
    descriptionUz:
      "Model rasmlar bilan bezatilgan zamonaviy moda e-tijorat mahsulot kartalari. Har bir karta soya effektlari va yumshoq animatsiyalar bilan premium xarid tajribasini taqdim etadi.",
    descriptionEn:
      "A modern fashion e-commerce design featuring product cards with model photography. Each card uses subtle shadow effects and smooth hover animations to deliver a premium shopping experience with visual elegance.",
    descriptionRu:
      "Современный дизайн fashion e-commerce с карточками товаров и фотографиями моделей. Тонкие тени и плавные hover-анимации создают премиальный опыт онлайн-шопинга.",
    descriptionJa:
      "モデル写真を使用したファッションECの商品カードデザイン。繊細なシャドウ効果とスムーズなホバーアニメーションで、プレミアムなショッピング体験を提供します。",
    authorName: "Madina Usmanova",
    department: "Frontend Development",
    techStack: "Next.js, TypeScript, Tailwind CSS, Shopify API",
    mainImageUrl: getProjectMainImage("fashion-ecommerce"),
    galleryImageUrls: getProjectGallery("fashion-ecommerce"),
    categorySlug: "web-development",
    difficulty: "Intermediate",
    isPublished: true,
  },
  {
    slug: "misso-collab",
    title: "Misso Collaboration Tool",
    descriptionUz:
      "\"Rivojlanishni boshlang\" shiori bilan qorong'u temada ishlangan hamkorlik vositasi. Jamoaviy loyihalarni boshqarish, vazifalarni taqsimlash va real vaqtda muloqot qilish imkonini beradi.",
    descriptionEn:
      "A collaboration tool with a 'Start thriving' dark-themed interface designed for team productivity. Misso combines project management, task distribution, and real-time communication in a sleek, focused workspace.",
    descriptionRu:
      "Инструмент для совместной работы Misso с тёмным интерфейсом и девизом «Начните процветать». Сочетает управление проектами, распределение задач и коммуникацию в едином рабочем пространстве.",
    descriptionJa:
      "「Start thriving」をテーマにしたダークUIのコラボレーションツール「Misso」。プロジェクト管理、タスク配分、リアルタイムコミュニケーションを洗練されたワークスペースに統合しています。",
    authorName: "Timur Sadykov",
    department: "Frontend Development",
    techStack: "React, TypeScript, Socket.io, PostgreSQL",
    mainImageUrl: getProjectMainImage("misso-collab"),
    galleryImageUrls: getProjectGallery("misso-collab"),
    categorySlug: "web-development",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "brite-payments",
    title: "Brite Payments Brand Identity",
    descriptionUz:
      "Brite* to'lov tizimi uchun brend identifikatsiya loyihasi. Binafsha va to'q sariq ranglar kombinatsiyasi bilan zamonaviy, xotiraga muhrlanadigan vizual tizim yaratilgan.",
    descriptionEn:
      "A brand identity project for Brite* payments, built around a striking purple and orange color palette. The design system includes logo variations, typography rules, and visual assets that communicate trust and innovation in fintech.",
    descriptionRu:
      "Проект бренд-айдентики для платёжной системы Brite*. Яркое сочетание фиолетового и оранжевого, вариации логотипа, типографические правила и визуальные активы передают доверие и инновации.",
    descriptionJa:
      "Brite*決済システムのブランドアイデンティティプロジェクト。パープルとオレンジの印象的なカラーパレットで、ロゴバリエーション、タイポグラフィルール、ビジュアルアセットを設計しています。",
    authorName: "Viktor Lebedev",
    department: "Brand Design",
    techStack: "Figma, Illustrator, After Effects",
    mainImageUrl: getProjectMainImage("brite-payments"),
    galleryImageUrls: getProjectGallery("brite-payments"),
    categorySlug: "ui-ux-design",
    difficulty: "Intermediate",
    isPublished: true,
  },
  {
    slug: "gradient-icon-pack",
    title: "Gradient 3D Icon Collection",
    descriptionUz:
      "Qorong'u fonda joylashgan rang-barang gradient 3D ikonalar to'plami. Har bir ikona chuqurlik va yorqinlik bilan ishlab chiqilgan bo'lib, zamonaviy UI loyihalar uchun ideal.",
    descriptionEn:
      "A vibrant collection of gradient 3D icons set against a dark background. Each icon is crafted with depth, bold colors, and smooth shading, making them ideal for modern UI projects, presentations, and app interfaces.",
    descriptionRu:
      "Яркая коллекция градиентных 3D-иконок на тёмном фоне. Каждая иконка проработана с глубиной, насыщенными цветами и плавной тенировкой — идеально для современных UI-проектов и презентаций.",
    descriptionJa:
      "ダークバックグラウンドに映えるカラフルなグラデーション3Dアイコンコレクション。深み、鮮やかな色彩、滑らかなシェーディングで、モダンなUIプロジェクトに最適です。",
    authorName: "Oleg Marchenko",
    department: "UI/UX Design",
    techStack: "Blender, Figma, Cinema 4D",
    mainImageUrl: getProjectMainImage("gradient-icon-pack"),
    galleryImageUrls: getProjectGallery("gradient-icon-pack"),
    categorySlug: "ui-ux-design",
    difficulty: "Beginner",
    isPublished: true,
  },
];

export const comments: CommentSeed[] = [
  {
    userEmail: "user@example.com",
    projectSlug: "spendwise-finance",
    rating: 5,
    title: "Stunning finance design",
    content:
      "The gradient work on the credit card visuals is top-notch. Layout feels premium and the typography choices are spot on. Very polished landing page.",
    imageUrls: [getCommentImage("comment-spendwise-1")],
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "spendwise-finance",
    rating: 4,
    title: "Clean and professional",
    content:
      "Love the visual hierarchy and how smoothly sections flow into each other. Would be great to see a dark mode variant as well.",
  },
  {
    userEmail: "user@example.com",
    projectSlug: "ora-wellness",
    rating: 5,
    title: "Beautiful wellness aesthetic",
    content:
      "The photo collage layout is gorgeous and the earthy color palette perfectly captures the wellness vibe. One of the best skincare brand designs I have seen.",
    imageUrls: [getCommentImage("comment-ora-1")],
  },
  {
    userEmail: "kenji@example.com",
    projectSlug: "ora-wellness",
    rating: 4,
    title: "Calming and elegant",
    content:
      "The design evokes a genuine sense of tranquility. Soft shadows and flowing layouts work beautifully together. Typography could be slightly bolder for accessibility.",
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "ideahub-platform",
    rating: 5,
    title: "Love the dark theme",
    content:
      "Card-based layout is intuitive and the dark theme gives it a modern, professional feel. Hover interactions add a nice layer of polish to the whole experience.",
  },
  {
    userEmail: "kenji@example.com",
    projectSlug: "healthtrack-monitor",
    rating: 5,
    title: "Excellent data visualization",
    content:
      "The blood pressure and heart rate widgets are beautifully designed. Charts are easy to read and the color coding for vital ranges is very intuitive.",
    imageUrls: [getCommentImage("comment-healthtrack-1")],
  },
  {
    userEmail: "user@example.com",
    projectSlug: "healthtrack-monitor",
    rating: 4,
    title: "Very practical health dashboard",
    content:
      "Clean layout and the real-time data display feels responsive. Would love to see integration with wearable devices in a future iteration.",
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "abcbank-digital",
    rating: 4,
    title: "Trustworthy banking design",
    content:
      "Bold headline draws you in and the section layout builds confidence. Professional color palette communicates reliability. A solid fintech landing page.",
  },
  {
    userEmail: "user@example.com",
    projectSlug: "urbangreen-tech",
    rating: 5,
    title: "Nature meets technology",
    content:
      "The moss textures and green tones are incredibly immersive. This is how eco-tech branding should look. Three.js integration adds a wow factor.",
    imageUrls: [getCommentImage("comment-urbangreen-1")],
  },
  {
    userEmail: "kenji@example.com",
    projectSlug: "urbangreen-tech",
    rating: 4,
    title: "Impressive eco-design",
    content:
      "Great blend of sustainability messaging and modern web aesthetics. GSAP animations are smooth and the overall experience feels premium.",
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "niceatnoon-studio",
    rating: 5,
    title: "Portfolio done right",
    content:
      "The grid layout showcases branding work beautifully. Each project card tells a visual story. Clean, minimal, and highly effective as a studio portfolio.",
  },
  {
    userEmail: "kenji@example.com",
    projectSlug: "panora-wellness",
    rating: 4,
    title: "Clever stress tracking UI",
    content:
      "The circular watch widget is a creative way to display mood data. Calming color scheme and smooth transitions make daily journaling feel effortless.",
    imageUrls: [getCommentImage("comment-panora-1")],
  },
  {
    userEmail: "user@example.com",
    projectSlug: "panora-wellness",
    rating: 5,
    title: "Mindfulness in an app",
    content:
      "The design really encourages daily use. Data visualization is elegant and never overwhelming. SwiftUI implementation feels native and polished.",
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "fashion-ecommerce",
    rating: 4,
    title: "Stylish product cards",
    content:
      "Model photography combined with subtle shadow effects creates a premium feel. Hover animations on the cards are smooth and the layout is very shoppable.",
  },
  {
    userEmail: "user@example.com",
    projectSlug: "misso-collab",
    rating: 4,
    title: "Great collaboration interface",
    content:
      "Dark theme is easy on the eyes for long work sessions. Task management layout is intuitive and the real-time features feel responsive.",
  },
  {
    userEmail: "kenji@example.com",
    projectSlug: "misso-collab",
    rating: 5,
    title: "Perfect team workspace",
    content:
      "The dark UI is sleek and the 'Start thriving' messaging sets the right tone. Socket.io integration makes real-time collaboration seamless.",
    imageUrls: [getCommentImage("comment-misso-1")],
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "brite-payments",
    rating: 4,
    title: "Bold brand identity",
    content:
      "Purple and orange is a daring palette choice that really works. Logo variations are well thought out and the typography rules are comprehensive.",
  },
  {
    userEmail: "user@example.com",
    projectSlug: "brite-payments",
    rating: 5,
    title: "Memorable fintech branding",
    content:
      "The color system is striking and instantly memorable. Visual assets are versatile and the brand guidelines document is thorough. Excellent identity work.",
  },
  {
    userEmail: "kenji@example.com",
    projectSlug: "gradient-icon-pack",
    rating: 5,
    title: "Gorgeous icon collection",
    content:
      "Each icon has incredible depth and the gradient work is masterful. Dark background really makes the colors pop. Perfect for modern app interfaces.",
    imageUrls: [getCommentImage("comment-gradient-1")],
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "gradient-icon-pack",
    rating: 4,
    title: "Versatile and vibrant",
    content:
      "3D rendering quality is impressive and the icons look great at various sizes. Would love to see an expanded set with more categories.",
  },
];
