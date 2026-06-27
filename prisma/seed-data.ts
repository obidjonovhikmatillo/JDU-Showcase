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
  photos,
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
    fullName: "Aziza Rahimova",
    password: "User123!",
    role: "USER",
    preferredLanguage: "RU",
  },
  {
    email: "kenji@example.com",
    fullName: "Bobur Usmonov",
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
      "SpendWise — zamonaviy kredit karta va moliyaviy xizmatlar uchun mo'ljallangan landing sahifa dizayni. Loyihaning asosiy maqsadi foydalanuvchilarga oddiy va tushunarli interfeys orqali o'z moliyaviy maqsadlariga erishish imkonini berish edi. Dizayn jarayonida biz premium gradient ranglar palitrasidan foydalandik, bu esa sahifaga zamonaviy va ishonchli ko'rinish berdi. Tipografiya tanlovi ham juda muhim bo'ldi — aniq va o'qilishi oson shriftlar orqali foydalanuvchilar asosiy moliyaviy imkoniyatlarni tezda tushunishlari ta'minlandi. Sahifa tuzilishi foydalanuvchini yuqoridan pastga qarab bosqichma-bosqich yo'naltiradi: avval e'tiborni tortuvchi sarlavha, keyin asosiy xususiyatlar, so'ngra narxlar va harakatga chaqirish tugmasi. Responsiv dizayn barcha qurilmalarda mukammal ishlashini ta'minlaydi.",
    descriptionEn:
      "SpendWise is a comprehensive landing page design for a modern credit card and financial services platform. The primary goal was to create a digital experience that communicates trust, sophistication, and financial empowerment. We explored a clean, conversion-focused layout that guides users through the product's key features using a carefully crafted visual hierarchy. The design features smooth gradient transitions across hero sections, giving the page a premium, polished feel that stands out in the competitive fintech space. Typography plays a central role — we selected typefaces that balance professionalism with approachability, ensuring that complex financial information remains accessible and easy to scan. The page structure follows a deliberate narrative flow: an attention-grabbing hero section, followed by feature highlights with micro-interactions, a pricing comparison module, and a compelling call-to-action. Every element was designed to reduce friction and increase conversion rates while maintaining visual elegance across all device sizes.",
    descriptionRu:
      "SpendWise — комплексный дизайн лендинга для современной платформы кредитных карт и финансовых услуг. Главная цель проекта — создать цифровой опыт, который передаёт доверие, изысканность и финансовую свободу. Мы разработали чистый, ориентированный на конверсию макет, который проводит пользователей через ключевые возможности продукта с помощью тщательно выстроенной визуальной иерархии. Плавные градиентные переходы в hero-секциях придают странице премиальный, отточенный вид. Типографика играет центральную роль — выбранные шрифты балансируют между профессионализмом и доступностью, обеспечивая лёгкое восприятие сложной финансовой информации. Структура страницы следует продуманной нарративной логике: привлекающая внимание hero-секция, блоки с функциями и микроанимациями, модуль сравнения тарифов и убедительный call-to-action.",
    descriptionJa:
      "SpendWiseは、モダンなクレジットカード・金融サービスプラットフォームのための包括的なランディングページデザインです。信頼性、洗練さ、そして金融的な自由を伝えるデジタル体験の創造を目指しました。慎重に構築されたビジュアルヒエラルキーを通じて、ユーザーを製品の主要機能へと導くクリーンでコンバージョン重視のレイアウトを採用しています。ヒーローセクション全体に滑らかなグラデーショントランジションを施し、競争の激しいフィンテック市場で際立つプレミアムな仕上がりを実現しました。タイポグラフィは中心的な役割を担い、プロフェッショナリズムと親しみやすさのバランスを取り、複雑な金融情報をアクセシブルに保っています。",
    authorName: "Jasurbek Toshmatov",
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
      "ORA — wellness va teri parvarishi brendi uchun yaratilgan landing sahifa dizayni. Loyihada tabiat rasmlari kolajidan foydalanib, foydalanuvchilarda tinchlik va o'ziga g'amxo'rlik hissini uyg'otish maqsad qilingan. Dizayn jarayonida biz tabiatning yumshoq ranglar palitrasini — tuproq, yashil va och pushti tonlarni tanladik. Har bir bo'lim oqimli tartibda joylashtirilgan bo'lib, foydalanuvchi sahifani pastga aylantirgan sari brendning tabiiy mahsulotlari va falsafasi bilan tanishadi. Soyalar va bo'sh joylar (whitespace) atroflicha o'ylangan — ular sahifaga nafislik va yengillik bag'ishlaydi. Responsiv dizayn mobil qurilmalarda ham mukammal ko'rinishni ta'minlaydi, bu esa teri parvarishi mahsulotlari auditoriyasi uchun juda muhim.",
    descriptionEn:
      "ORA is a wellness and skincare brand landing page designed to evoke a deep sense of calm, nature, and self-care. The creative direction centers around a photo collage approach using natural elements — botanical imagery, earthy textures, and organic forms that feel authentic to the brand's philosophy. We chose an earthy color palette of muted greens, warm beiges, and soft pinks to create a visual environment that feels soothing and trustworthy. Each section flows seamlessly into the next, guiding visitors through the brand story, product highlights, and customer testimonials in a narrative that mirrors a wellness journey. Soft shadows and generous whitespace give the layout a premium, editorial quality. The typography pairs a refined serif for headlines with a clean sans-serif for body text, reinforcing the balance between luxury and accessibility. Mobile responsiveness was a priority throughout — the skincare audience heavily skews mobile, so every interaction was designed touch-first.",
    descriptionRu:
      "ORA — лендинг для бренда wellness и ухода за кожей, созданный для пробуждения глубокого чувства спокойствия и заботы о себе. Креативная концепция строится вокруг фотоколлажа из природных элементов — ботанических изображений, земляных текстур и органических форм, которые передают философию бренда. Мы выбрали приглушённую палитру зелёных, тёплых бежевых и мягких розовых оттенков для создания визуальной среды, вызывающей доверие и умиротворение. Каждая секция плавно перетекает в следующую, проводя посетителей через историю бренда, продуктовые акценты и отзывы клиентов. Мягкие тени и щедрое пустое пространство придают макету премиальное, редакционное качество. Адаптивность под мобильные устройства была приоритетом на всём протяжении разработки.",
    descriptionJa:
      "ORAは、深い安らぎ、自然、そしてセルフケアの感覚を呼び起こすウェルネス・スキンケアブランドのランディングページです。クリエイティブの方向性は、植物のイメージ、アースカラーのテクスチャ、オーガニックなフォルムを使ったフォトコラージュアプローチを中心に展開しています。落ち着いたグリーン、温かみのあるベージュ、ソフトなピンクのアースカラーパレットを採用し、癒しと信頼感のあるビジュアル環境を創出しました。各セクションはシームレスに次へと流れ、ブランドストーリー、製品ハイライト、顧客の声をウェルネスジャーニーのように導きます。ソフトなシャドウと十分な余白が、プレミアムでエディトリアルな品質を与えています。",
    authorName: "Nodira Azimova",
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
      "IdeaHub — \"Buyuk g'oyalar shu yerda yashaydi\" shiori bilan yaratilgan ijodkorlar platformasi. Qorong'u temada ishlangan karta asosidagi interfeys dizaynerlar, dasturchillar va ijodkorlar uchun o'z loyihalarini namoyish etish va hamkorlik qilish uchun qulay muhit yaratadi. Har bir karta hover animatsiyalari bilan boyitilgan bo'lib, foydalanuvchilar loyiha ustiga sichqonchani olib borganda qo'shimcha ma'lumotlar paydo bo'ladi. Platformaning asosiy xususiyatlari: loyiha yuklash, jamoaviy izohlar, real vaqtda bildirishnomalar va ijodiy jamoalar yaratish imkoniyati. Qorong'u fon rangi ko'zni charchatmasdan uzoq vaqt ishlash imkonini beradi, shu bilan birga kontentni ajratib ko'rsatadi.",
    descriptionEn:
      "IdeaHub is a creative platform built around the motto 'Great ideas live here,' designed to bring designers, developers, and creatives together in a shared digital workspace. The dark-themed UI creates a focused, distraction-free environment where the work itself takes center stage. Rich card-based layouts serve as the primary content containers, each equipped with carefully crafted hover interactions that reveal additional project details, team members, and engagement metrics. The design system supports multiple content types — from visual design projects and code repositories to written case studies and video presentations. Key platform features include project uploading with drag-and-drop, threaded team comments, real-time notifications, and the ability to form creative collectives. The dark background not only reduces eye strain during extended work sessions but also makes colorful project thumbnails pop with greater visual impact.",
    descriptionRu:
      "IdeaHub — креативная платформа с девизом «Великие идеи живут здесь», созданная для объединения дизайнеров, разработчиков и креативщиков в общем цифровом пространстве. Тёмная тема UI создаёт сфокусированную среду без отвлечений, где на первый план выходят сами работы. Богатые карточные макеты служат основными контейнерами контента, каждый оснащён тщательно проработанными hover-взаимодействиями, раскрывающими дополнительные детали проекта. Дизайн-система поддерживает различные типы контента — от визуальных проектов и репозиториев кода до кейсов и видеопрезентаций. Тёмный фон снижает нагрузку на глаза при длительных сессиях и делает красочные превью проектов более яркими и выразительными.",
    descriptionJa:
      "IdeaHubは「素晴らしいアイデアはここに生まれる」をモットーに、デザイナー、開発者、クリエイターを共有デジタルワークスペースに集めるクリエイティブプラットフォームです。ダークテーマのUIは集中できる環境を作り、作品そのものを主役にします。リッチなカードベースレイアウトがコンテンツコンテナとして機能し、ホバーインタラクションでプロジェクトの詳細やチームメンバー、エンゲージメント指標が表示されます。デザインプロジェクト、コードリポジトリ、ケーススタディ、ビデオプレゼンテーションなど多様なコンテンツタイプをサポートしています。",
    authorName: "Sherzod Rahimov",
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
      "HealthTrack — qon bosimi, yurak urish tezligi, kislorod darajasi va boshqa vital ko'rsatkichlarni real vaqtda kuzatish uchun mo'ljallangan sog'liqni nazorat qilish dashboardi. Loyihaning asosiy maqsadi tibbiy ma'lumotlarni oddiy va tushunarli formatda taqdim etish bo'lib, har qanday foydalanuvchi o'z sog'lig'ini professional darajada kuzatishi mumkin. Dizayn jarayonida biz D3.js kutubxonasidan foydalanib, interaktiv grafiklar va animatsion diagrammalar yaratdik — ular nafaqat chiroyli ko'rinadi, balki ma'lumotlarni tezda tahlil qilish imkonini beradi. Ranglar palitrasi tibbiyot sohasiga mos ravishda ko'k va yashil tonlarda tanlangan bo'lib, ishonch va xavfsizlik hissini uyg'otadi. Vidjit kartalari modulli tuzilishga ega bo'lib, foydalanuvchilar o'zlariga kerakli ko'rsatkichlarni ekranga joylashtirishi va tartibini o'zgartirishi mumkin. Responsiv dizayn tufayli dashbord planshet va telefon ekranlarida ham mukammal ishlaydi.",
    descriptionEn:
      "HealthTrack is a comprehensive health monitoring dashboard designed to display blood pressure, heart rate, oxygen saturation, and other vital signs in real time with clinical-grade clarity. The primary goal was to transform complex medical data into an intuitive, visually engaging interface that empowers everyday users to take charge of their health. We built the data visualization layer using D3.js, creating interactive charts with smooth transitions, zoomable timelines, and color-coded threshold indicators that instantly communicate whether readings fall within healthy ranges. The color palette centers on calming blues and teals, drawing from medical design conventions to reinforce trust and safety while avoiding the sterile feel of traditional clinical software. Each widget card follows a modular architecture, allowing users to customize their dashboard layout by dragging, resizing, and pinning the metrics that matter most to them. The responsive design was carefully optimized for tablet and mobile screens, recognizing that health monitoring often happens on the go.",
    descriptionRu:
      "HealthTrack — комплексный дашборд мониторинга здоровья, отображающий артериальное давление, пульс, уровень кислорода и другие жизненные показатели в реальном времени с клинической точностью. Главная задача проекта — превратить сложные медицинские данные в интуитивно понятный и визуально привлекательный интерфейс, который помогает обычным пользователям контролировать своё здоровье. Слой визуализации данных построен на D3.js с интерактивными графиками, масштабируемыми таймлайнами и цветовыми индикаторами порогов, мгновенно показывающими, находятся ли показатели в пределах нормы. Цветовая палитра выстроена вокруг спокойных голубых и бирюзовых тонов, вызывающих чувство доверия и безопасности, при этом избегая стерильности традиционного медицинского ПО. Каждый виджет следует модульной архитектуре — пользователи могут настраивать расположение панели, перетаскивая и закрепляя нужные метрики. Адаптивный дизайн оптимизирован для планшетов и мобильных устройств, учитывая, что мониторинг здоровья часто происходит в движении.",
    descriptionJa:
      "HealthTrackは、血圧、心拍数、酸素飽和度などのバイタルサインをリアルタイムで臨床レベルの精度で表示する包括的な健康モニタリングダッシュボードです。複雑な医療データを直感的で視覚的に魅力あるインターフェースに変換し、日常のユーザーが自身の健康を管理できるようにすることを目指しました。D3.jsを活用してインタラクティブなチャート、ズーム可能なタイムライン、色分けされた閾値インジケーターを構築し、測定値が正常範囲内かどうかを即座に伝えます。カラーパレットは穏やかなブルーとティールを中心に、信頼感と安全性を強調しながらも従来の臨床ソフトウェアの無機質さを回避しています。各ウィジェットカードはモジュラー設計で、ユーザーはドラッグ＆リサイズで自分に必要な指標をカスタマイズできます。",
    authorName: "Nodira Azimova",
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
      "ABCBank — \"Erkinlikni kashf eting\" shiori bilan yaratilgan zamonaviy raqamli bank platformasi uchun landing sahifa dizayni. Loyiha bank xizmatlarini foydalanuvchilarga iloji boricha yaqinlashtirish va raqamli moliyaviy operatsiyalarni oddiy qilish maqsadida ishlab chiqilgan. Dizayn yondashuvida biz katta va ta'sirli tipografiyadan foydalandik — sarlavhalar darhol e'tiborni tortadi va brendning asosiy xabarini aniq yetkazadi. Professional ranglar palitrasi — chuqur ko'k, oq va oltin tonlar — ishonchlilik va barqarorlikni ifodalaydi, bu esa moliyaviy xizmatlar uchun juda muhim. Sahifa tuzilishi strategik ravishda rejalashtirilgan: asosiy xizmatlar bloki, xavfsizlik kafolatlari, mijozlar sharhlari va mobil ilova yuklab olish bo'limi. Har bir bo'lim orasidagi o'tishlar silliq va mantiqiy bo'lib, foydalanuvchini ishonch bilan harakatga chaqiradi.",
    descriptionEn:
      "ABCBank is a digital banking landing page built around the powerful headline 'Discover freedom,' designed to bring modern financial services closer to everyday users. The project's core mission was to bridge the gap between traditional banking reliability and the convenience of a fully digital experience. We adopted a bold typographic approach where oversized headlines immediately capture attention and communicate the brand's promise of financial empowerment. The professional color palette — deep navy blue, crisp white, and subtle gold accents — was carefully chosen to evoke trustworthiness, stability, and premium quality, all essential attributes in the competitive digital banking space. The page architecture follows a strategic layout: a commanding hero section, a feature showcase with iconographic service cards, security guarantee badges, customer testimonials with real metrics, and a mobile app download module with device mockups. Smooth scroll-triggered animations between sections maintain engagement without sacrificing the authoritative tone that banking customers expect.",
    descriptionRu:
      "ABCBank — лендинг для платформы цифрового банкинга с мощным заголовком «Откройте свободу», созданный для того, чтобы сделать современные финансовые услуги ближе к повседневному пользователю. Основная миссия проекта — объединить надёжность традиционного банкинга с удобством полностью цифрового опыта. Мы применили смелый типографический подход, где крупные заголовки мгновенно захватывают внимание и транслируют обещание бренда о финансовой свободе. Профессиональная цветовая палитра — глубокий тёмно-синий, чистый белый и сдержанные золотые акценты — тщательно подобрана для создания ощущения надёжности, стабильности и премиального качества. Архитектура страницы следует стратегической логике: мощная hero-секция, витрина сервисов с иконографическими карточками, знаки безопасности, отзывы клиентов с реальными метриками и модуль загрузки мобильного приложения. Плавные scroll-анимации поддерживают вовлечённость, не нарушая авторитетного тона, которого ожидают клиенты банка.",
    descriptionJa:
      "ABCBankは「自由を発見しよう」という力強いヘッドラインを掲げたデジタルバンキングのランディングページで、モダンな金融サービスを日常のユーザーに身近にすることを目指しています。伝統的な銀行の信頼性と完全デジタル体験の利便性を橋渡しすることがプロジェクトの核心的なミッションでした。大胆なタイポグラフィアプローチを採用し、大きな見出しが即座に注目を集め、ブランドの約束を伝えます。深いネイビーブルー、クリスプなホワイト、控えめなゴールドアクセントのプロフェッショナルなカラーパレットは、信頼性、安定性、プレミアム品質を表現するために慎重に選ばれました。ページ構成は戦略的に設計され、ヒーローセクション、サービスカード、セキュリティバッジ、顧客の声、モバイルアプリダウンロードモジュールが配置されています。",
    authorName: "Jasurbek Toshmatov",
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
      "UrbanGreen — ekologik texnologiyalar va barqaror rivojlanish sohasida faoliyat yurituvchi brend uchun yaratilgan landing sahifa dizayni. Loyihaning asosiy g'oyasi tabiat va texnologiyaning uyg'unligini ko'rsatish bo'lib, biz buni mox teksturalari, tirik o'simlik tasvirlari va organik shakllarni zamonaviy veb-dizayn elementlari bilan birlashtirish orqali amalga oshirdik. Ranglar palitrasi tabiatdan ilhomlanib, chuqur yashil, o'rmon rangi va tuproq tonlaridan iborat bo'lib, har bir bo'limda ekologik mas'uliyat hissi uyg'otadi. Three.js yordamida yaratilgan 3D elementlar sahifaga chuqurlik va interaktivlik qo'shadi — foydalanuvchilar sichqoncha harakati bilan tabiat elementlarini o'zgartirishi mumkin. GSAP animatsiyalari sahifani pastga aylantirganida har bir bo'limni hayotga keltiradi, bu esa foydalanuvchini brendning barqarorlik missiyasi bilan chuqurroq bog'laydi. Dizayn tuzilishi brendning atrof-muhitga ta'siri, texnologik yechimlari va kelajak rejalari haqida izchil hikoya qiladi.",
    descriptionEn:
      "UrbanGreen is a landing page designed for an eco-technology brand dedicated to sustainable development and environmental innovation. The core creative concept revolves around the harmony between nature and technology, achieved by weaving lush moss textures, living plant photography, and organic forms into a cutting-edge web design framework. The color palette draws directly from the natural world — deep forest greens, earthy browns, and soft sage tones — creating an immersive visual environment that reinforces the brand's commitment to environmental responsibility at every scroll point. Three.js-powered 3D elements add depth and interactivity to the experience, allowing users to subtly manipulate natural elements through mouse movement and scroll position. GSAP scroll-triggered animations bring each section to life as visitors move through the page, creating a cinematic narrative that deepens the emotional connection to the brand's sustainability mission. The page structure tells a cohesive story: the brand's environmental impact metrics, their technology solutions, partnership opportunities, and a forward-looking vision section that invites visitors to join the movement.",
    descriptionRu:
      "UrbanGreen — лендинг для бренда эко-технологий, посвящённого устойчивому развитию и экологическим инновациям. Основная креативная концепция строится вокруг гармонии природы и технологий, достигнутой переплетением пышных текстур мха, фотографий живых растений и органических форм с передовыми элементами веб-дизайна. Цветовая палитра черпает вдохновение из природы — глубокие лесные зелёные, земляные коричневые и мягкие шалфейные тона — создавая иммерсивное визуальное пространство, усиливающее экологическую ответственность бренда. 3D-элементы на Three.js добавляют глубину и интерактивность, позволяя пользователям взаимодействовать с природными формами через движение мыши. Scroll-анимации на GSAP оживляют каждую секцию, создавая кинематографичное повествование, углубляющее эмоциональную связь с миссией бренда. Структура страницы рассказывает цельную историю: экологические метрики, технологические решения, партнёрство и видение будущего.",
    descriptionJa:
      "UrbanGreenは、持続可能な開発と環境イノベーションに取り組むエコテクノロジーブランドのためのランディングページです。自然とテクノロジーの調和をコアコンセプトに、苔のテクスチャ、植物の写真、オーガニックなフォルムを最先端のウェブデザインフレームワークに織り込みました。カラーパレットは自然界から直接インスピレーションを得て、深いフォレストグリーン、アースブラウン、ソフトなセージトーンで構成され、ブランドの環境への責任を視覚的に強化します。Three.jsによる3D要素が体験に奥行きとインタラクティビティを加え、マウスの動きで自然の要素を操作できます。GSAPのスクロールアニメーションが各セクションに命を吹き込み、ブランドのサステナビリティミッションとの感情的なつながりを深めます。",
    authorName: "Sherzod Rahimov",
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
      "NiceAtNoon — brending, logotip dizayni va vizual identifikatsiya sohasida ixtisoslashgan dizayn studiyasining portfolio veb-sayti. Loyihaning maqsadi studiyaning ijodiy kuchini va professional darajasini samarali namoyish etish bo'lib, biz bunga toza va tartibli grid layout orqali erishdik. Har bir loyiha kartasi katta sifatli tasvirlar bilan bezatilgan bo'lib, hover effektlari orqali loyiha haqida qo'shimcha ma'lumot — mijoz nomi, sana va foydalanilgan texnikalar — ko'rsatiladi. Tipografiya tanlovi minimal va zamonaviy bo'lib, sans-serif shriftlar vizual kontentni birinchi o'ringa qo'yadi va diqqatni tarqatmaydi. Sayt navigatsiyasi kategoriyalar bo'yicha filtrlash imkoniyatini taqdim etadi — foydalanuvchilar brending, paket dizayni yoki raqamli loyihalar orasida tezda o'tishi mumkin. Webflow platformasida qurilgan sayt tez yuklanadi va CMS orqali yangi loyihalarni qo'shish oson.",
    descriptionEn:
      "NiceAtNoon is a portfolio website for a design studio specializing in branding, logo design, and visual identity systems. The project's goal was to create a digital showcase that communicates the studio's creative breadth and meticulous attention to craft without competing with the work itself. We achieved this through a clean, structured grid layout where each project card features high-resolution imagery that does the visual storytelling, complemented by hover interactions that reveal project metadata — client name, date, and techniques used. The typographic system is deliberately minimal, employing modern sans-serif typefaces that let the visual content take center stage without distraction. Site navigation offers category-based filtering, allowing visitors to quickly move between branding projects, packaging design, and digital identity work to find exactly what interests them. Built on Webflow for fast performance and easy CMS-driven content updates, the site ensures the studio can add new projects without developer involvement.",
    descriptionRu:
      "NiceAtNoon — портфолио-сайт дизайн-студии, специализирующейся на брендинге, дизайне логотипов и системах визуальной идентичности. Цель проекта — создать цифровую витрину, демонстрирующую творческий диапазон и внимание студии к деталям, не конкурируя при этом с самими работами. Мы добились этого через чистый структурированный grid-макет, где каждая карточка проекта содержит изображения высокого разрешения, дополненные hover-взаимодействиями с метаданными — имя клиента, дата, использованные техники. Типографическая система намеренно минималистична: современные шрифты без засечек позволяют визуальному контенту доминировать. Навигация предлагает фильтрацию по категориям — посетители могут быстро переключаться между брендингом, упаковкой и цифровыми проектами. Сайт построен на Webflow для быстрой загрузки и лёгкого обновления контента через CMS без привлечения разработчиков.",
    descriptionJa:
      "NiceAtNoonは、ブランディング、ロゴデザイン、ビジュアルアイデンティティシステムを専門とするデザインスタジオのポートフォリオウェブサイトです。スタジオのクリエイティブな幅と細部へのこだわりを、作品自体と競合することなく伝えるデジタルショーケースの構築を目指しました。クリーンで構造化されたグリッドレイアウトを採用し、各プロジェクトカードは高解像度の画像でビジュアルストーリーテリングを行い、ホバーインタラクションでクライアント名、日付、使用技法などのメタデータを表示します。タイポグラフィはモダンなサンセリフ書体で意図的にミニマルに抑え、ビジュアルコンテンツを主役にしています。カテゴリベースのフィルタリングにより、ブランディング、パッケージデザイン、デジタルアイデンティティ間を素早く移動できます。",
    authorName: "Gulnora Karimova",
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
      "Panora — stress darajasini kuzatish va ruhiy salomatlikni boshqarish uchun mo'ljallangan wellness ilovasi bo'lib, foydalanuvchilarga kundalik kayfiyatlarini qayd etish va tahlil qilish imkonini beradi. Ilovaning eng o'ziga xos xususiyati — aylana shaklidagi soat vidjeti bo'lib, u stress darajasini vaqt o'tishi bilan vizual ravishda ko'rsatadi va foydalanuvchiga o'z holatini bir qarashda baholash imkonini beradi. Dizayn jarayonida biz tinchlantiruvchi ranglar palitrasini tanladik — yumshoq binafsha, och ko'k va pastel tonlar — bu foydalanuvchida xotirjamlik hissini uyg'otadi va ilovadan foydalanishni yoqimli tajribaga aylantiradi. SwiftUI yordamida yaratilgan interfeys iOS platformasida tabiiy va silliq ishlaydi, animatsiyalar esa foydalanuvchi harakatlariga tezkor javob beradi. Kundalik jurnal bo'limida foydalanuvchilar o'z kayfiyatlarini emoji va qisqa yozuvlar orqali qayd etishi mumkin, ilova esa bu ma'lumotlarni haftalik va oylik grafiklar shaklida taqdim etadi. HealthKit integratsiyasi tufayli ilova uyqu va jismoniy faollik ma'lumotlarini ham hisobga oladi.",
    descriptionEn:
      "Panora is a wellness application designed for stress level monitoring and mental health management, empowering users to log, track, and analyze their daily emotional states over time. The app's signature feature is a circular watch widget that visualizes stress levels as an elegant radial display, giving users an at-a-glance understanding of their current state relative to historical patterns. The design direction embraces a calming aesthetic — soft lavender, pale blue, and pastel gradients create a visual environment that feels therapeutic rather than clinical, making daily check-ins something users actually look forward to. Built natively with SwiftUI, the interface delivers fluid animations and gesture-driven interactions that feel deeply integrated with the iOS platform, from haptic feedback on mood selections to smooth transitions between journal entries. The daily journal section allows users to log moods through expressive emoji selections and brief written reflections, which the app then aggregates into insightful weekly and monthly trend charts with actionable recommendations. HealthKit integration enriches the data picture by incorporating sleep quality and physical activity metrics, providing a holistic view of the factors influencing mental well-being.",
    descriptionRu:
      "Panora — wellness-приложение для мониторинга уровня стресса и управления ментальным здоровьем, позволяющее пользователям фиксировать, отслеживать и анализировать свои эмоциональные состояния. Главная особенность — круглый виджет-часы, визуализирующий уровень стресса в элегантном радиальном формате и позволяющий мгновенно оценить текущее состояние относительно исторических данных. Дизайн-направление построено на успокаивающей эстетике — мягкие лавандовые, бледно-голубые и пастельные градиенты создают терапевтическую атмосферу, делая ежедневные чек-ины приятным ритуалом. Интерфейс на SwiftUI обеспечивает плавные анимации и жестовые взаимодействия, глубоко интегрированные с iOS — от тактильной обратной связи при выборе настроения до плавных переходов между записями. Раздел дневника позволяет фиксировать настроение через emoji и короткие заметки, а приложение агрегирует данные в недельные и месячные графики трендов. Интеграция с HealthKit обогащает картину данными о сне и физической активности для целостного взгляда на факторы ментального здоровья.",
    descriptionJa:
      "Panoraは、ストレスレベルのモニタリングとメンタルヘルス管理のためのウェルネスアプリケーションで、ユーザーが日々の感情状態を記録・追跡・分析できるようにします。最大の特徴は円形ウォッチウィジェットで、ストレスレベルをエレガントな放射状ディスプレイで可視化し、過去のパターンと比較して現在の状態を一目で把握できます。ソフトなラベンダー、ペールブルー、パステルグラデーションによる癒しのデザインが、臨床的ではなくセラピューティックな雰囲気を作り、日々のチェックインを楽しみに変えます。SwiftUIでネイティブに構築されたインターフェースは、ムード選択時の触覚フィードバックからジャーナルエントリ間のスムーズな遷移まで、iOSプラットフォームと深く統合された体験を提供します。HealthKit連携により睡眠の質や身体活動データも取り込み、メンタルウェルビーイングに影響する要因の包括的な把握が可能です。",
    authorName: "Nodira Azimova",
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
      "Fashion E-Commerce — zamonaviy moda brendlari uchun mo'ljallangan e-tijorat platformasining mahsulot ko'rsatish dizayni bo'lib, professional model fotosuratlari va nafis karta layoutdan foydalanadi. Har bir mahsulot kartasi chuqur o'ylangan soya effektlari, yumshoq burchak radiuslari va silliq hover animatsiyalari bilan jihozlangan bo'lib, foydalanuvchiga premium darajadagi xarid tajribasini taqdim etadi. Dizayn yondashuvida biz minimalizm va funksionallikni muvozanatlashga harakat qildik — oq fon va keng bo'sh joylar mahsulot rasmlarini ajratib ko'rsatadi, shu bilan birga narx, o'lcham va rang tanlash elementlari intuitiv joylashtirilgan. Tipografiya tanlovi moda industriyasining estetikasiga mos ravishda ingichka va zamonaviy shriftlardan iborat bo'lib, brendning hashamatli xarakterini ta'kidlaydi. Shopify API integratsiyasi real vaqtda inventar boshqaruvi va xavfsiz to'lov jarayonini ta'minlaydi. Responsiv dizayn mobil qurilmalarda ham mukammal ishlaydi — mahsulot kartalari avtomatik ravishda bir ustunli tartibga o'tadi va swipe navigatsiyasi qo'shiladi.",
    descriptionEn:
      "Fashion E-Commerce is a product showcase design for a modern fashion retail platform, featuring professional model photography paired with refined card-based layouts that elevate the online shopping experience. Each product card is meticulously crafted with layered shadow effects, soft border radii, and smooth hover animations that reveal quick-action buttons for wishlist, size preview, and add-to-cart — all without navigating away from the browse view. The design philosophy balances minimalism with functionality: generous whitespace and a neutral background palette ensure that product imagery remains the undisputed focal point, while price, sizing options, and color swatches are intuitively positioned for effortless scanning. The typographic system draws from high-fashion editorial conventions, employing thin, elegant typefaces that reinforce the brand's luxury positioning without sacrificing readability. Shopify API integration powers real-time inventory management, dynamic filtering, and secure checkout flows behind the scenes. The responsive design gracefully adapts to mobile devices, where product cards shift to a single-column layout with swipe-based navigation and touch-optimized interaction targets.",
    descriptionRu:
      "Fashion E-Commerce — дизайн витрины товаров для современной fashion-платформы с профессиональными фотографиями моделей и утончёнными карточными макетами, поднимающими онлайн-шопинг на новый уровень. Каждая карточка товара тщательно проработана: многослойные тени, мягкие радиусы скруглений и плавные hover-анимации раскрывают кнопки быстрых действий — добавление в избранное, предпросмотр размеров и корзину — без перехода со страницы каталога. Философия дизайна балансирует минимализм и функциональность: щедрое пустое пространство и нейтральный фон выводят изображения товаров на первый план, а цены, размеры и палитра цветов расположены интуитивно. Типографическая система вдохновлена высокой модой — тонкие элегантные шрифты подчёркивают люксовое позиционирование бренда без ущерба читаемости. Интеграция с Shopify API обеспечивает управление складом в реальном времени, динамическую фильтрацию и безопасный чекаут. Адаптивный дизайн элегантно трансформируется для мобильных устройств с одноколоночным макетом и swipe-навигацией.",
    descriptionJa:
      "Fashion E-Commerceは、プロフェッショナルなモデル撮影と洗練されたカードベースレイアウトを組み合わせた、モダンなファッションリテールプラットフォームの商品ショーケースデザインです。各商品カードは多層シャドウ効果、ソフトなボーダーラディウス、スムーズなホバーアニメーションで丁寧に作り込まれ、ウィッシュリスト、サイズプレビュー、カート追加のクイックアクションボタンがブラウズ画面から離れることなく表示されます。デザイン哲学はミニマリズムと機能性のバランスを重視し、十分な余白とニュートラルな背景で商品画像を主役にしながら、価格やサイズオプションを直感的に配置しています。タイポグラフィはハイファッションのエディトリアル慣習に倣い、ブランドのラグジュアリーポジショニングを強化する細身でエレガントな書体を採用しました。Shopify API連携によりリアルタイム在庫管理と安全な決済フローを実現しています。",
    authorName: "Gulnora Karimova",
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
      "Misso — \"Rivojlanishni boshlang\" shiori bilan yaratilgan jamoaviy hamkorlik vositasi bo'lib, qorong'u temadagi interfeysi jamoalar uchun diqqatni jamlagan va samarali ish muhitini taqdim etadi. Loyihaning asosiy maqsadi loyiha boshqaruvi, vazifalarni taqsimlash va real vaqtda muloqotni yagona platformada birlashtirish edi — bu jamoalarga turli vositalar orasida almashish zaruratini yo'q qiladi. Qorong'u tema nafaqat zamonaviy ko'rinish beradi, balki uzoq ish seanslari davomida ko'zni charchatmaydi va diqqatni asosiy kontentga yo'naltiradi. Socket.io texnologiyasi yordamida real vaqtda xabar almashish va vazifa yangilanishlari amalga oshiriladi — jamoa a'zolari o'zgarishlarni sahifani yangilamasdan darhol ko'radi. Vazifalar boshqaruvi Kanban taxtasi formatida tashkil etilgan bo'lib, drag-and-drop funksiyasi orqali vazifalarni bosqichlar orasida ko'chirish mumkin. PostgreSQL ma'lumotlar bazasi barcha loyiha ma'lumotlarini xavfsiz saqlaydi va tez qidirish imkoniyatini ta'minlaydi.",
    descriptionEn:
      "Misso is a team collaboration tool built around the 'Start thriving' philosophy, featuring a dark-themed interface that creates a focused, distraction-free workspace engineered for sustained productivity. The project's central goal was to unify project management, task distribution, and real-time communication into a single cohesive platform, eliminating the friction of switching between disparate tools that fragments team focus. The dark theme serves dual purposes: it delivers a sleek, contemporary aesthetic while significantly reducing eye strain during the extended work sessions that are common in agile development environments. Socket.io powers the real-time layer, enabling instant message delivery, live task status updates, and collaborative cursor presence indicators — team members see changes the moment they happen without refreshing the page. Task management is organized through a Kanban board interface with drag-and-drop functionality, customizable swim lanes, priority tagging, and deadline tracking that adapts to each team's workflow preferences. The PostgreSQL backend ensures reliable data persistence, supports complex querying for project analytics dashboards, and scales gracefully as teams and project volumes grow.",
    descriptionRu:
      "Misso — инструмент командной работы, построенный на философии «Начните процветать», с тёмным интерфейсом, создающим сфокусированное рабочее пространство для продуктивной командной деятельности. Центральная задача проекта — объединить управление проектами, распределение задач и коммуникацию в реальном времени в единой платформе, устраняя необходимость переключаться между разрозненными инструментами. Тёмная тема служит двойной цели: обеспечивает стильный современный вид и существенно снижает нагрузку на глаза при длительных рабочих сессиях, типичных для agile-разработки. Socket.io обеспечивает мгновенную доставку сообщений, обновление статусов задач в реальном времени и индикаторы присутствия — участники видят изменения в момент их появления без перезагрузки страницы. Управление задачами организовано через Kanban-доску с drag-and-drop, настраиваемыми дорожками, приоритетами и дедлайнами. PostgreSQL обеспечивает надёжное хранение данных, поддерживает сложные запросы для аналитических дашбордов и масштабируется по мере роста команд.",
    descriptionJa:
      "Missoは「Start thriving」の哲学に基づいて構築されたチームコラボレーションツールで、ダークテーマのインターフェースが集中力を維持する生産的なワークスペースを提供します。プロジェクト管理、タスク配分、リアルタイムコミュニケーションを単一のプラットフォームに統合し、異なるツール間の切り替えによるフォーカスの分散を解消することが中心的な目標です。ダークテーマはスタイリッシュな美しさと長時間作業での目の疲れ軽減という二重の目的を果たします。Socket.ioがリアルタイムレイヤーを担い、メッセージの即時配信、タスクステータスのライブ更新、コラボレーティブなプレゼンスインジケーターを実現します。タスク管理はドラッグ＆ドロップ機能を備えたカンバンボードで構成され、カスタマイズ可能なスイムレーン、優先度タグ、デッドライン追跡が各チームのワークフローに適応します。PostgreSQLバックエンドが信頼性の高いデータ永続化と分析ダッシュボードのための複雑なクエリをサポートします。",
    authorName: "Sherzod Rahimov",
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
      "Brite* — zamonaviy to'lov tizimi uchun yaratilgan to'liq brend identifikatsiya loyihasi bo'lib, fintech sohasida ishonch va innovatsiyani ifodalovchi vizual tizimni o'z ichiga oladi. Loyihaning eng o'ziga xos xususiyati — binafsha va to'q sariq ranglarning jasoratli kombinatsiyasi bo'lib, bu tanlov to'lov industriyasida odatiy ko'k va kulrang palitalardan keskin farq qiladi va brendni darhol xotirada qoldiradi. Logotip dizayni bir necha variantda ishlab chiqilgan — to'liq rangli, monoxrom, teskari va ixcham versiyalar turli kontekstlarda — ilovalar, veb-saytlar, bosma materiallar va reklama bannerlari — mukammal ko'rinishni ta'minlaydi. Tipografiya qoidalari aniq belgilangan bo'lib, sarlavhalar uchun geometrik sans-serif shrift va asosiy matn uchun o'qilishi oson grotesque shrift tanlangan. Vizual aktivlar to'plami ikonalar, illyustratsiyalar, gradient naqshlar va ijtimoiy tarmoqlar uchun shablonlarni o'z ichiga oladi. Brend qo'llanmasi hujjati barcha qoidalarni batafsil tavsiflaydi va kelajakda brendni izchil rivojlantirishni ta'minlaydi.",
    descriptionEn:
      "Brite* is a comprehensive brand identity project for a modern payments platform, encompassing a complete visual system designed to communicate trust, innovation, and bold differentiation in the competitive fintech landscape. The project's most distinctive element is the striking purple and orange color combination — a deliberately audacious palette choice that breaks away from the conventional blues and grays dominating the payments industry, making the brand instantly memorable. The logo was developed across multiple variations — full-color, monochrome, reversed, and compact versions — ensuring perfect visual performance across every context from mobile app icons and website headers to printed collateral and billboard advertising. Typography rules are precisely defined with a geometric sans-serif for headlines that conveys technical precision, paired with a highly legible grotesque typeface for body text that maintains readability at all sizes. The visual asset library includes a custom icon set, brand illustrations, gradient pattern systems, and social media templates that maintain consistency across all touchpoints. A thorough brand guidelines document ties everything together, providing detailed specifications that ensure consistent brand evolution as the company scales.",
    descriptionRu:
      "Brite* — комплексный проект бренд-айдентики для современной платёжной платформы, охватывающий полную визуальную систему, призванную транслировать доверие, инновации и смелую дифференциацию на конкурентном рынке финтеха. Самый яркий элемент — дерзкое сочетание фиолетового и оранжевого, намеренно отходящее от привычных синих и серых палитр платёжной индустрии, что делает бренд мгновенно запоминающимся. Логотип разработан в нескольких вариациях — полноцветный, монохромный, инвертированный и компактный — обеспечивая идеальное отображение от иконок мобильных приложений до печатных материалов и наружной рекламы. Типографические правила точно определены: геометрический гротеск для заголовков передаёт техническую точность, а высокочитаемый шрифт для основного текста сохраняет удобочитаемость при любых размерах. Библиотека визуальных активов включает набор иконок, бренд-иллюстрации, градиентные паттерны и шаблоны для соцсетей. Подробный документ бренд-гайдлайнов связывает всё воедино, обеспечивая последовательное развитие бренда.",
    descriptionJa:
      "Brite*は、モダンな決済プラットフォームのための包括的なブランドアイデンティティプロジェクトで、競争の激しいフィンテック市場で信頼、革新、大胆な差別化を伝える完全なビジュアルシステムを構築しました。最も特徴的な要素は、パープルとオレンジの大胆なカラーコンビネーションで、決済業界を支配する従来のブルーやグレーから意図的に脱却し、ブランドを即座に記憶に残るものにしています。ロゴはフルカラー、モノクローム、反転、コンパクトの複数バリエーションで開発され、モバイルアプリアイコンからウェブサイト、印刷物、屋外広告まであらゆるコンテキストで完璧に機能します。タイポグラフィルールはジオメトリックサンセリフの見出しと可読性の高いグロテスク書体の本文で精密に定義されています。ビジュアルアセットライブラリにはカスタムアイコンセット、ブランドイラストレーション、グラデーションパターン、SNSテンプレートが含まれています。",
    authorName: "Jasurbek Toshmatov",
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
      "Gradient 3D Icon Collection — qorong'u fonda joylashgan rang-barang gradient 3D ikonalar to'plami bo'lib, zamonaviy UI dizayn loyihalari, taqdimotlar va mobil ilova interfeyslari uchun yaratilgan. Har bir ikona Blender va Cinema 4D dasturlarida ehtiyotkorlik bilan modellashtirilgan bo'lib, volumetrik shakl, yorug'lik va soyaning tabiiy o'zaro ta'siri hamda yorqin gradient ranglar orqali chuqurlik va hayotiylik hissi yaratiladi. To'plam turli kategoriyalarni qamrab oladi — ijtimoiy tarmoqlar, moliya, sog'liqni saqlash, ta'lim va texnologiya ikonalari — bu esa uni universal va ko'p maqsadli qiladi. Qorong'u fon tanlovi strategik bo'lib, u gradient ranglarning yorqinligini kuchaytiradi va har bir ikonani vizual ravishda ajratib ko'rsatadi. Ikonalar turli o'lchamlarda — 64px dan 512px gacha — aniq va sifatli ko'rinishga ega bo'lib, SVG va PNG formatlarida eksport qilinadi. Dizayn tizimi izchil bo'lib, barcha ikonalar yagona yorug'lik manbasi, burchak va stilistik yondashuvga ega.",
    descriptionEn:
      "Gradient 3D Icon Collection is a vibrant set of three-dimensional icons rendered against a dark background, purpose-built for modern UI design projects, keynote presentations, mobile app interfaces, and marketing materials. Each icon was meticulously modeled in Blender and Cinema 4D, combining volumetric forms with natural light-shadow interplay and bold gradient color palettes to achieve a sense of depth and dimensionality that flat icons simply cannot match. The collection spans multiple categories — social media, finance, healthcare, education, and technology — making it a versatile asset library that serves diverse design needs across industries. The dark background choice is strategic: it amplifies the vibrancy of the gradient colors and creates strong figure-ground contrast that makes each icon pop with visual impact. Every icon maintains crisp clarity across multiple sizes from 64px to 512px, exported in both SVG and PNG formats to accommodate different workflow requirements. The design system ensures consistency throughout — all icons share a unified light source, consistent perspective angles, and a cohesive stylistic language that keeps any composition visually harmonious.",
    descriptionRu:
      "Gradient 3D Icon Collection — яркий набор трёхмерных иконок на тёмном фоне, созданный для современных UI-проектов, презентаций, интерфейсов мобильных приложений и маркетинговых материалов. Каждая иконка тщательно моделировалась в Blender и Cinema 4D, сочетая объёмные формы с естественным взаимодействием света и тени и смелыми градиентными палитрами для достижения глубины и объёмности, недоступной плоским иконкам. Коллекция охватывает множество категорий — социальные сети, финансы, здравоохранение, образование и технологии — что делает её универсальной библиотекой активов для различных индустрий. Выбор тёмного фона стратегичен: он усиливает яркость градиентов и создаёт сильный контраст фигуры и фона, выделяя каждую иконку. Все иконки сохраняют чёткость в размерах от 64px до 512px, экспортируются в SVG и PNG форматах для разных рабочих процессов. Дизайн-система обеспечивает единообразие — общий источник света, согласованные углы перспективы и целостный стилистический язык.",
    descriptionJa:
      "Gradient 3D Icon Collectionは、ダークバックグラウンドに映える鮮やかな3Dアイコンセットで、モダンなUIデザインプロジェクト、プレゼンテーション、モバイルアプリインターフェース、マーケティング素材のために制作されました。各アイコンはBlenderとCinema 4Dで丁寧にモデリングされ、ボリューメトリックなフォルムと自然な光と影の相互作用、大胆なグラデーションカラーパレットを組み合わせ、フラットアイコンでは実現できない奥行きと立体感を生み出しています。コレクションはSNS、金融、ヘルスケア、教育、テクノロジーなど複数のカテゴリをカバーし、多様な業界のデザインニーズに対応する汎用的なアセットライブラリです。ダークバックグラウンドの選択は戦略的で、グラデーションカラーの鮮やかさを増幅し、各アイコンを際立たせる強い図と地のコントラストを生み出します。64pxから512pxまでの複数サイズでクリスプな鮮明さを維持し、SVGとPNGの両フォーマットでエクスポートされます。",
    authorName: "Gulnora Karimova",
    department: "UI/UX Design",
    techStack: "Blender, Figma, Cinema 4D",
    mainImageUrl: getProjectMainImage("gradient-icon-pack"),
    galleryImageUrls: getProjectGallery("gradient-icon-pack"),
    categorySlug: "ui-ux-design",
    difficulty: "Beginner",
    isPublished: true,
  },
  {
    slug: "taskflow-dashboard",
    title: "TaskFlow Project Dashboard",
    descriptionUz:
      "TaskFlow — loyihalarni boshqarish uchun mo'ljallangan zamonaviy dashboard bo'lib, jamoalarga vazifalar, muddatlar va progress ko'rsatkichlarini real vaqtda kuzatish imkonini beradi. Interaktiv diagrammalar va grafiklar yordamida loyiha holati bir qarashda baholanadi. Drag-and-drop interfeysi orqali vazifalarni turli bosqichlar orasida oson ko'chirish mumkin. Tailwind CSS yordamida yaratilgan responsiv dizayn barcha qurilmalarda mukammal ishlashni ta'minlaydi.",
    descriptionEn:
      "TaskFlow is a modern project management dashboard that empowers teams to track tasks, deadlines, and progress metrics in real time. Interactive charts built with Chart.js provide instant visibility into project health, team velocity, and milestone completion rates. The drag-and-drop interface allows seamless task movement across workflow stages, while customizable widgets let each team member tailor their view. Built with React and TypeScript for type-safe reliability, the responsive Tailwind CSS layout ensures a polished experience on every screen size.",
    descriptionRu:
      "TaskFlow — современный дашборд управления проектами, позволяющий командам отслеживать задачи, дедлайны и метрики прогресса в реальном времени. Интерактивные диаграммы на Chart.js обеспечивают мгновенную видимость состояния проекта, скорости команды и выполнения этапов. Drag-and-drop интерфейс позволяет легко перемещать задачи между стадиями рабочего процесса. Адаптивный дизайн на Tailwind CSS гарантирует безупречную работу на всех устройствах.",
    descriptionJa:
      "TaskFlowは、タスク、締め切り、進捗指標をリアルタイムで追跡できるモダンなプロジェクト管理ダッシュボードです。Chart.jsで構築されたインタラクティブなチャートにより、プロジェクトの状態やチームの速度を一目で把握できます。ドラッグ＆ドロップインターフェースでワークフローステージ間のタスク移動がシームレスに行えます。Tailwind CSSによるレスポンシブデザインがあらゆる画面サイズで洗練された体験を提供します。",
    authorName: "Jasurbek Toshmatov",
    department: "Frontend Development",
    techStack: "React, TypeScript, Chart.js, Tailwind CSS",
    mainImageUrl: photos.growthAnalytics,
    galleryImageUrls: [photos.growthAnalytics, photos.focusWork, photos.missoApp],
    categorySlug: "web-development",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "mediconnect-health",
    title: "MediConnect Health Portal",
    descriptionUz:
      "MediConnect — bemorlar va shifokorlarni yagona platformada bog'lovchi zamonaviy sog'liqni saqlash portali. Tizim orqali bemorlar qabulga yozilish, tibbiy tarixni ko'rish va onlayn maslahat olish imkoniyatiga ega. Stripe integratsiyasi orqali xavfsiz onlayn to'lov tizimi joriy etilgan. PostgreSQL ma'lumotlar bazasi barcha tibbiy yozuvlarni ishonchli va xavfsiz saqlashni ta'minlaydi.",
    descriptionEn:
      "MediConnect is a comprehensive health portal that bridges the gap between patients and healthcare providers through a unified digital platform. Patients can schedule appointments, access their complete medical history, and receive virtual consultations from the comfort of their homes. Secure payment processing powered by Stripe ensures seamless billing for telehealth services and prescription management. Built on Next.js with PostgreSQL for robust data handling, the portal delivers a fast, accessible experience with full HIPAA-compliant security measures.",
    descriptionRu:
      "MediConnect — комплексный портал здравоохранения, объединяющий пациентов и медицинских специалистов на единой цифровой платформе. Пациенты могут записываться на приём, просматривать полную медицинскую историю и получать виртуальные консультации. Безопасная обработка платежей через Stripe обеспечивает удобный биллинг для телемедицинских услуг. Построенный на Next.js с PostgreSQL, портал обеспечивает быстрый и безопасный доступ с соблюдением стандартов защиты медицинских данных.",
    descriptionJa:
      "MediConnectは、患者と医療提供者を統合デジタルプラットフォームで結ぶ包括的なヘルスポータルです。患者は予約の管理、完全な医療履歴へのアクセス、自宅からのバーチャル相談が可能です。Stripeによる安全な決済処理がテレヘルスサービスのスムーズな課金を実現します。Next.jsとPostgreSQLで構築され、高速でアクセシブルな体験をセキュリティ基準に準拠して提供します。",
    authorName: "Jasurbek Toshmatov",
    department: "FinTech",
    techStack: "Next.js, PostgreSQL, Stripe, Tailwind CSS",
    mainImageUrl: photos.bookingSummary,
    galleryImageUrls: [photos.bookingSummary, photos.healthTrack, photos.sleepQuality],
    categorySlug: "web-development",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "zenflow-meditation",
    title: "ZenFlow Meditation App",
    descriptionUz:
      "ZenFlow — meditatsiya va hushyorlik amaliyotlarini kundalik hayotga oson kiritish uchun yaratilgan mobil ilova. Foydalanuvchilar turli meditatsiya dasturlaridan foydalanishi, nafas olish mashqlarini bajarishi va o'z ruhiy salomatligini kuzatishi mumkin. Core Animation yordamida yaratilgan silliq animatsiyalar ilovadan foydalanishni tinchlantiruvchi tajribaga aylantiradi. HealthKit integratsiyasi uyqu sifati va stress darajasi ma'lumotlarini avtomatik ravishda to'playdi.",
    descriptionEn:
      "ZenFlow is a meditation and mindfulness application designed to seamlessly integrate calming practices into daily routines. Users can explore guided meditation programs ranging from beginner breathing exercises to advanced visualization techniques, each accompanied by immersive soundscapes. Smooth animations powered by Core Animation create fluid transitions between sessions, enhancing the sense of tranquility throughout the experience. HealthKit integration automatically tracks sleep quality and stress indicators, providing users with holistic insights into their mental wellness journey.",
    descriptionRu:
      "ZenFlow — приложение для медитации и осознанности, созданное для органичного включения практик спокойствия в повседневную жизнь. Пользователи могут выбирать программы медитации от начальных дыхательных упражнений до продвинутых техник визуализации с иммерсивными звуковыми ландшафтами. Плавные анимации на Core Animation создают текучие переходы между сессиями, усиливая ощущение спокойствия. Интеграция с HealthKit автоматически отслеживает качество сна и показатели стресса, предоставляя целостную картину ментального благополучия.",
    descriptionJa:
      "ZenFlowは、瞑想とマインドフルネスの実践を日常生活にシームレスに取り入れるためのモバイルアプリケーションです。初心者向けの呼吸エクササイズから上級者向けのビジュアライゼーション技法まで、没入感のあるサウンドスケープと共にガイド付き瞑想プログラムを提供します。Core Animationによる滑らかなアニメーションがセッション間の流れるような遷移を実現し、体験全体の静穏感を高めます。HealthKit連携により睡眠の質とストレス指標を自動追跡し、メンタルウェルネスの包括的な洞察を提供します。",
    authorName: "Nodira Azimova",
    department: "UI/UX Design",
    techStack: "SwiftUI, Core Animation, HealthKit",
    mainImageUrl: photos.sleepQuality,
    galleryImageUrls: [photos.sleepQuality, photos.panoraStress, photos.oraWellness],
    categorySlug: "mobile-app",
    difficulty: "Intermediate",
    isPublished: true,
  },
  {
    slug: "sportify-fitness",
    title: "Sportify Fitness Tracker",
    descriptionUz:
      "Sportify — jismoniy mashqlar, ovqatlanish rejasi va sog'liq ko'rsatkichlarini kuzatish uchun yaratilgan fitness ilovasi. Flutter frameworki yordamida iOS va Android platformalarida bir xil mukammal tajriba taqdim etiladi. Google Fit API integratsiyasi orqali foydalanuvchining kundalik faolligi, qadam soni va yoqilgan kaloriyalar avtomatik ravishda hisoblanadi. Firebase backend real vaqtda ma'lumotlar sinxronizatsiyasi va foydalanuvchilar o'rtasida raqobat tizimini ta'minlaydi.",
    descriptionEn:
      "Sportify is a comprehensive fitness tracking application that monitors workouts, nutrition plans, and health metrics to help users achieve their wellness goals. Built with Flutter for seamless cross-platform performance on both iOS and Android, the app delivers a native-quality experience with a single codebase. Google Fit API integration automatically captures daily activity data including step counts, calories burned, and active minutes without manual input. Firebase powers the real-time backend, enabling instant data synchronization across devices and a social competition system that motivates users through challenges and leaderboards.",
    descriptionRu:
      "Sportify — комплексное фитнес-приложение для отслеживания тренировок, планов питания и показателей здоровья, помогающее пользователям достигать целей в области wellness. Построенное на Flutter для безупречной кроссплатформенной работы на iOS и Android, приложение обеспечивает качество нативного опыта. Интеграция с Google Fit API автоматически фиксирует данные дневной активности — шаги, калории и активные минуты. Firebase обеспечивает синхронизацию данных в реальном времени и социальную систему соревнований, мотивирующую пользователей через челленджи и рейтинги.",
    descriptionJa:
      "Sportifyは、ワークアウト、栄養プラン、健康指標を包括的に追跡し、ユーザーのウェルネス目標達成を支援するフィットネスアプリケーションです。FlutterによるiOSとAndroidのシームレスなクロスプラットフォーム対応で、ネイティブ品質の体験を提供します。Google Fit API連携により、歩数、消費カロリー、アクティブ時間などの日々の活動データを自動的に取得します。Firebaseがリアルタイムバックエンドを担い、デバイス間の即座のデータ同期とチャレンジ・リーダーボードによるソーシャル競争システムを実現します。",
    authorName: "Nodira Azimova",
    department: "UI/UX Design",
    techStack: "Flutter, Firebase, Google Fit API",
    mainImageUrl: photos.mobileApps,
    galleryImageUrls: [photos.mobileApps, photos.healthTrack, photos.profileCard],
    categorySlug: "mobile-app",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "devhub-community",
    title: "DevHub Developer Community",
    descriptionUz:
      "DevHub — dasturchilar uchun yaratilgan onlayn hamjamiyat platformasi bo'lib, bilim almashish, texnik muhokamalar va hamkorlik loyihalar uchun qulay muhit taqdim etadi. WebSocket texnologiyasi orqali real vaqtda xabar almashish va jonli muhokamalar amalga oshiriladi. Prisma ORM yordamida ma'lumotlar bazasi bilan ishlash soddlashtirilgan va xavfsiz qilingan. Platforma foydalanuvchilarga o'z portfellarini yaratish, texnik maqolalar yozish va ochiq kodli loyihalarda hamkorlik qilish imkonini beradi.",
    descriptionEn:
      "DevHub is an online community platform for developers that fosters knowledge sharing, technical discussions, and collaborative projects in a welcoming digital environment. Real-time messaging and live discussion threads powered by WebSocket technology keep conversations flowing without page refreshes. Prisma ORM streamlines database operations with type-safe queries, ensuring data integrity and developer productivity on the backend. The platform enables users to build professional portfolios, publish technical articles with syntax-highlighted code blocks, and contribute to open-source projects through integrated collaboration tools.",
    descriptionRu:
      "DevHub — онлайн-платформа сообщества разработчиков, способствующая обмену знаниями, техническим дискуссиям и совместным проектам в дружественной цифровой среде. Обмен сообщениями и живые дискуссии в реальном времени на WebSocket обеспечивают непрерывный поток общения без перезагрузки страниц. Prisma ORM упрощает работу с базой данных через типобезопасные запросы, гарантируя целостность данных. Платформа позволяет создавать профессиональные портфолио, публиковать технические статьи и участвовать в open-source проектах через встроенные инструменты совместной работы.",
    descriptionJa:
      "DevHubは、知識共有、技術的な議論、コラボレーティブなプロジェクトを促進する開発者向けオンラインコミュニティプラットフォームです。WebSocket技術によるリアルタイムメッセージングとライブディスカッションスレッドが、ページリフレッシュなしで会話の流れを維持します。Prisma ORMが型安全なクエリでデータベース操作を効率化し、データの整合性を保証します。ユーザーはプロフェッショナルなポートフォリオの構築、技術記事の公開、オープンソースプロジェクトへの貢献が可能です。",
    authorName: "Sherzod Rahimov",
    department: "Frontend Development",
    techStack: "Next.js, Prisma, WebSocket, Tailwind CSS",
    mainImageUrl: photos.focusWork,
    galleryImageUrls: [photos.focusWork, photos.ideaHub, photos.missoApp],
    categorySlug: "web-development",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "smartfarm-iot",
    title: "SmartFarm IoT Dashboard",
    descriptionUz:
      "SmartFarm — qishloq xo'jaligi uchun IoT sensorlar ma'lumotlarini real vaqtda kuzatish va tahlil qilish dashboardi. Tuproq namligi, harorat, yorug'lik darajasi va boshqa muhim ko'rsatkichlar MQTT protokoli orqali sensorlardan to'planadi va D3.js yordamida interaktiv grafiklarda vizualizatsiya qilinadi. Foydalanuvchilar sug'orish tizimlarini masofadan boshqarishi va ogohlantirish bildirishnomalarini sozlashi mumkin. Dashboard fermerlar uchun ma'lumotlarga asoslangan qarorlar qabul qilish imkoniyatini yaratadi.",
    descriptionEn:
      "SmartFarm is an IoT dashboard for real-time monitoring and analysis of agricultural sensor data, helping farmers make data-driven decisions to optimize crop yields. Soil moisture, temperature, light levels, and other critical environmental metrics are collected from field sensors via the MQTT protocol and visualized through interactive D3.js charts with customizable alert thresholds. Users can remotely control irrigation systems, adjust greenhouse parameters, and configure notification rules based on sensor readings. The dashboard transforms raw agricultural data into actionable insights, enabling precision farming practices that reduce resource waste and improve harvest quality.",
    descriptionRu:
      "SmartFarm — IoT-дашборд для мониторинга и анализа данных сельскохозяйственных сенсоров в реальном времени, помогающий фермерам принимать решения на основе данных для оптимизации урожайности. Влажность почвы, температура, уровень освещённости и другие критические показатели собираются с полевых датчиков по протоколу MQTT и визуализируются через интерактивные графики D3.js. Пользователи могут удалённо управлять системами орошения и настраивать правила уведомлений на основе показаний датчиков. Дашборд превращает сырые данные в практические инсайты для точного земледелия.",
    descriptionJa:
      "SmartFarmは、農業センサーデータのリアルタイム監視と分析のためのIoTダッシュボードで、農家がデータに基づいた意思決定で収穫量を最適化することを支援します。土壌水分、温度、光量などの重要な環境指標がMQTTプロトコルを通じてフィールドセンサーから収集され、D3.jsのインタラクティブなチャートで可視化されます。ユーザーは灌漑システムの遠隔制御やセンサー読み取り値に基づく通知ルールの設定が可能です。ダッシュボードは生の農業データを実用的なインサイトに変換し、精密農業を実現します。",
    authorName: "Sherzod Rahimov",
    department: "Frontend Development",
    techStack: "React, Node.js, MQTT, D3.js",
    mainImageUrl: photos.yandexFuel,
    galleryImageUrls: [photos.yandexFuel, photos.growthAnalytics, photos.urbanGreen],
    categorySlug: "web-development",
    difficulty: "Advanced",
    isPublished: true,
  },
  {
    slug: "artfolio-gallery",
    title: "ArtFolio Digital Gallery",
    descriptionUz:
      "ArtFolio — raqamli san'at asarlarini namoyish etish uchun yaratilgan onlayn galeriya platformasi bo'lib, rassomlar va dizaynerlarga o'z ijodiy ishlarini professional darajada taqdim etish imkonini beradi. Webflow yordamida qurilgan platforma tez yuklanadi va CMS orqali yangi asarlarni qo'shish oson. Lottie va GSAP animatsiyalari sahifaga hayot bag'ishlab, har bir san'at asarini ko'rish jarayonini yodda qolarli tajribaga aylantiradi. Galeriya kategoriyalar bo'yicha filtrlash va qidiruv funksiyalarini taqdim etadi.",
    descriptionEn:
      "ArtFolio is a digital gallery platform designed for artists and designers to showcase their creative work with professional-grade presentation and immersive viewing experiences. Built on Webflow for rapid deployment and CMS-driven content management, the platform allows creators to curate exhibitions, organize works by collection, and tell the story behind each piece. Lottie and GSAP animations bring the gallery to life with elegant page transitions, parallax scrolling effects, and interactive hover states that make browsing art an engaging experience. The platform features category-based filtering, a powerful search system, and responsive layouts that adapt beautifully from large desktop monitors to mobile screens.",
    descriptionRu:
      "ArtFolio — платформа цифровой галереи для художников и дизайнеров, позволяющая демонстрировать творческие работы с профессиональным уровнем презентации и иммерсивным просмотром. Построенная на Webflow для быстрого развёртывания и управления контентом через CMS, платформа позволяет создавать выставки и организовывать работы по коллекциям. Анимации на Lottie и GSAP оживляют галерею элегантными переходами, параллакс-эффектами и интерактивными hover-состояниями. Платформа предлагает фильтрацию по категориям, мощную систему поиска и адаптивные макеты для всех устройств.",
    descriptionJa:
      "ArtFolioは、アーティストやデザイナーがプロフェッショナルなプレゼンテーションと没入感のある閲覧体験でクリエイティブ作品を展示するためのデジタルギャラリープラットフォームです。Webflowで構築され、CMSによるコンテンツ管理で展覧会のキュレーションやコレクション別の作品整理が可能です。LottieとGSAPのアニメーションがエレガントなページ遷移とパララックス効果でギャラリーに命を吹き込みます。カテゴリフィルタリング、検索システム、あらゆるデバイスに美しく適応するレスポンシブレイアウトを備えています。",
    authorName: "Gulnora Karimova",
    department: "Brand Design",
    techStack: "Figma, Webflow, Lottie, GSAP",
    mainImageUrl: photos.evernote,
    galleryImageUrls: [photos.evernote, photos.niceAtNoon, photos.qicInsurance],
    categorySlug: "ui-ux-design",
    difficulty: "Intermediate",
    isPublished: true,
  },
  {
    slug: "cryptovault-wallet",
    title: "CryptoVault Wallet Design",
    descriptionUz:
      "CryptoVault — kriptovalyuta aktivlarini xavfsiz saqlash va boshqarish uchun mo'ljallangan hamyon ilovasining dizayni. Figma'da ishlab chiqilgan UI dizayn Web3.js texnologiyasi bilan integratsiya qilinadigan React Native ilovasi uchun tayyor. Foydalanuvchilar o'z kriptovalyuta balanslarini kuzatishi, tranzaksiyalar tarixini ko'rishi va turli tokenlar o'rtasida almashinuv operatsiyalarini amalga oshirishi mumkin. Xavfsizlik birinchi o'rinda bo'lib, ko'p bosqichli autentifikatsiya va biometrik tasdiqlash tizimlari joriy etilgan.",
    descriptionEn:
      "CryptoVault is a wallet application design focused on secure storage and management of cryptocurrency assets, combining intuitive usability with enterprise-grade security features. The UI, crafted in Figma, provides a comprehensive dashboard for tracking portfolio balances across multiple blockchains, viewing detailed transaction histories, and executing token swaps with real-time price feeds. Web3.js integration enables direct blockchain interactions, including wallet connectivity, smart contract calls, and decentralized exchange routing. Security is paramount throughout the design, featuring multi-factor authentication flows, biometric verification screens, and clear visual indicators for transaction confirmation states.",
    descriptionRu:
      "CryptoVault — дизайн кошелька для безопасного хранения и управления криптовалютными активами, сочетающий интуитивное удобство с безопасностью корпоративного уровня. UI, разработанный в Figma, предоставляет комплексный дашборд для отслеживания портфеля на различных блокчейнах, просмотра детальной истории транзакций и выполнения обмена токенов. Интеграция с Web3.js обеспечивает прямое взаимодействие с блокчейном, включая подключение кошельков и вызовы смарт-контрактов. Безопасность стоит на первом месте — многофакторная аутентификация, биометрическая верификация и чёткие визуальные индикаторы состояния транзакций.",
    descriptionJa:
      "CryptoVaultは、暗号資産の安全な保管と管理に焦点を当てたウォレットアプリケーションデザインで、直感的な使いやすさとエンタープライズグレードのセキュリティを両立しています。Figmaで制作されたUIは、複数のブロックチェーンにまたがるポートフォリオ残高の追跡、詳細な取引履歴の閲覧、リアルタイム価格フィードによるトークンスワップの実行を可能にします。Web3.js連携によりウォレット接続やスマートコントラクト呼び出しなどのブロックチェーン直接操作を実現します。多要素認証、生体認証、トランザクション確認状態の明確な視覚インジケーターなど、セキュリティを最優先に設計されています。",
    authorName: "Gulnora Karimova",
    department: "UI/UX Design",
    techStack: "Figma, React Native, Web3.js",
    mainImageUrl: photos.payWallet,
    galleryImageUrls: [photos.payWallet, photos.taxFile3D, photos.briteBrand],
    categorySlug: "ui-ux-design",
    difficulty: "Advanced",
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
  {
    userEmail: "user@example.com",
    projectSlug: "taskflow-dashboard",
    rating: 5,
    title: "Powerful project management tool",
    content:
      "The real-time charts and drag-and-drop task management make this dashboard incredibly useful. Chart.js visualizations are smooth and the responsive layout works perfectly on all devices.",
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "mediconnect-health",
    rating: 4,
    title: "Well-designed health portal",
    content:
      "The appointment scheduling flow is intuitive and the medical history view is clean and organized. Stripe integration for payments feels secure and seamless.",
  },
  {
    userEmail: "kenji@example.com",
    projectSlug: "zenflow-meditation",
    rating: 5,
    title: "Truly calming experience",
    content:
      "The animations are incredibly smooth and the overall design genuinely promotes relaxation. HealthKit integration adds real value by connecting meditation practice with sleep quality data.",
  },
  {
    userEmail: "user@example.com",
    projectSlug: "sportify-fitness",
    rating: 4,
    title: "Great cross-platform fitness app",
    content:
      "Flutter delivers a consistent experience on both platforms. The Google Fit integration captures activity data automatically and the social competition features keep users motivated.",
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "devhub-community",
    rating: 5,
    title: "Developer community done right",
    content:
      "Real-time discussions via WebSocket work flawlessly and the portfolio builder is a standout feature. This is exactly the kind of platform developers need for knowledge sharing.",
  },
  {
    userEmail: "kenji@example.com",
    projectSlug: "smartfarm-iot",
    rating: 4,
    title: "Impressive agricultural tech",
    content:
      "The MQTT sensor data visualization is excellent and the remote irrigation controls are practical. D3.js charts make complex environmental data easy to understand at a glance.",
  },
  {
    userEmail: "user@example.com",
    projectSlug: "artfolio-gallery",
    rating: 5,
    title: "Beautiful gallery experience",
    content:
      "The GSAP animations and parallax effects make browsing art feel like visiting a real gallery. Webflow CMS integration means artists can easily manage their collections without coding.",
  },
  {
    userEmail: "aziza@example.com",
    projectSlug: "cryptovault-wallet",
    rating: 4,
    title: "Secure and polished wallet design",
    content:
      "The multi-factor authentication flows are well thought out and the portfolio dashboard presents complex blockchain data clearly. Web3.js integration design looks production-ready.",
  },
];
