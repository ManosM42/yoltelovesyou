import cover1 from "@/assets/cover-1.jpg";
import cover2 from "@/assets/cover-2.jpg";
import cover3 from "@/assets/cover-3.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import stoMyaloMoy from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import lv from "@/assets/LV.jpeg";
import wooo from "@/assets/wooo.jpeg"
import ftb28 from "@/assets/fatb28.jpeg"
import gileko from "@/assets/gileko.jpeg"
import rockstar from "@/assets/rockstar.jpeg"
import groupie from "@/assets/groupie.jpeg"
import letgo from "@/assets/letgo.jpeg"
import makigiaz from "@/assets/makigiaz.jpeg"
import hotel from "@/assets/hotel.jpeg"
import blick from "@/assets/blick.jpeg"
import blickr from "@/assets/blickr.jpeg"
import asg from "@/assets/asg.jpeg"
import xadia from "@/assets/xadia.jpeg"
import blm from "@/assets/blm.jpeg"
import sym from "@/assets/sym.jpeg"
import god from "@/assets/god.jpeg"
import merokamato from "@/assets/merokamato.jpg"




export type Track = {
  title: string;
  feat?: string[];
};

export type Release = {
  id: string;
  title: string;
  type: "Single" | "EP" | "Album" | "Feature";
  year: number;
  date: string;
  cover: string;
  links: { spotify: string; youtube: string; apple: string };
  tracks?: Track[];
};

export const releases: Release[] = [
  // ==================== 2026 ====================
  {
    id: "fatb-44",
    title: "FOR ALL THE BEACHES 4.4",
    type: "Album",
    year: 2026,
    date: "5 Ιουνίου 2026",
    cover: g7,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [
      { title: "SAFARI" },
      { title: "ANIME" },
      { title: "5 ΜΙΛΙΑ ΜΑΚΡΙΑ (5 MILIA MAKRIA)", feat: ["Bossikan"] },
      { title: "GTAA" },
      { title: "WORLDWIDE", feat: ["Moisex"] },
      { title: "EMMONES", feat: ["Ypo"] },
      { title: "10 TOES" },
      { title: "MONO GIA MENA" },
      { title: "VENTALIA" },
      { title: "MVP VIP" },
    ],
  },
  {
    id: "perception",
    title: "PERCEPTION",
    type: "Album",
    year: 2026,
    date: "20 Μαρτίου 2026",
    cover: cover2,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [
      { title: "INTRO PERCEPTION" },
      { title: "LET GO" },
      { title: "ACID" },
      { title: "PASSED OUT" },
      { title: "MAKE THAT WET" },
      { title: "ΜΟΝΑΔΙΚΟ (MONADIKO)" },
      { title: "1524" },
      { title: "ΣΤΑ ΙΣΙΑΑ (STA ISIAA)" },
      { title: "WOOO" },
      { title: "JAGUAR" },
      { title: "NA FLEEXAREIS" },
      { title: "EGAR 111" },
      { title: "Ο ΕΑΥΤΟΣ ΜΟΥ (O EAFTOS MOU)" },
      { title: "ΟΠΩΣ ΕΣΥ (OPOS ESI)" },
    ],
  },
  {
    id: "lv-single",
    title: "LV (feat. Dirty Harry & Younggbeatz)",
    type: "Single",
    year: 2026,
    date: "2026",
    cover: lv,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "LV", feat: ["Dirty Harry", "Younggbeatz"] }],
  },
  {
    id: "wooo-single",
    title: "WOOO (Single)",
    type: "Single",
    year: 2026,
    date: "2026",
    cover: wooo,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "WOOO" }],
  },

  // ==================== 2025 ====================
  {
    id: "fatb-28",
    title: "FOR ALL THE BEACHES 2.8",
    type: "Album",
    year: 2025,
    date: "4 Αυγούστου 2025",
    cover: ftb28,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [
      { title: "TRAP PALACE" },
      { title: "DO DO DO" },
      { title: "BABE" },
      { title: "DOWN DOWN" },
      { title: "SPAASTO" },
      { title: "TO MONO POU ITHELA" },
      { title: "POTE DE THA XASW" },
      { title: "ANGELINA JOLIEE" },
      { title: "YPERVOLI" },
      { title: "KALOKAIRI" },
    ],
  },
  {
    id: "astro",
    title: "ASTRO",
    type: "Album",
    year: 2025,
    date: "9 Μαΐου 2025",
    cover: cover1,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [
      { title: "ASTRO INTRODUCTION" },
      { title: "YOUNGSTAR" },
      { title: "DOUBLE UP", feat: ["GrecoN"] },
      { title: "MOONLIGHT" },
      { title: "PERCIE" },
      { title: "ICE SPICEY" },
      { title: "BREAK IT DOWN" },
      { title: "HUSSLE" },
      { title: "BLICK" },
      { title: "EKATOMURIA" },
      { title: "JUNKIE" },
      { title: "TIFFANY" },
      { title: "MAGIA" },
      { title: "AUTO" },
      { title: "HOLA HOLA" },
      { title: "HOOD YOLTE" },
      { title: "OKEAN" },
      { title: "CRYPTO BUYERS" },
      { title: "TRAPPEST PLAQUE - Pt. 1" },
      { title: "DIP REMIX" },
      { title: "BALLER" },
    ],
  },
  {
    id: "gileko",
    title: "GILEKO",
    type: "Single",
    year: 2025,
    date: "2025",
    cover: gileko,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "GILEKO" }],
  },
  {
    id: "rockstar",
    title: "ROCKSTAR",
    type: "Single",
    year: 2025,
    date: "2025",
    cover: rockstar,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "ROCKSTAR" }],
  },
  {
    id: "groupie",
    title: "GROUPIE",
    type: "Single",
    year: 2025,
    date: "2025",
    cover: groupie,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "GROUPIE" }],
  },
  {
    id: "spb-single",
    title: "SPAASTO",
    type: "Single",
    year: 2025,
    date: "2025",
    cover: ftb28,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "SPAASTO" }],
  },
  {
    id: "let-go",
    title: "LET GO",
    type: "Single",
    year: 2025,
    date: "2025",
    cover: letgo,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "LET GO" }],
  },

  // ==================== 2024 ====================
  {
    id: "for-all-the-beaches",
    title: "FOR ALL THE BEACHES",
    type: "Album",
    year: 2024,
    date: "22 Ιουλίου 2024",
    cover: g6,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [
      { title: "MF" },
      { title: "POLI" },
      { title: "JETSKI" },
      { title: "WHAT IM ON" },
      { title: "NEARI" },
    ],
  },
  {
    id: "makigiaz",
    title: "Makigiaz",
    type: "Single",
    year: 2024,
    date: "2024",
    cover: makigiaz,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Makigiaz" }],
  },
  {
    id: "xenodohio",
    title: "Xenodohio (feat. Ypo)",
    type: "Single",
    year: 2024,
    date: "2024",
    cover: hotel,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Xenodohio", feat: ["Ypo"] }],
  },
  {
    id: "blick",
    title: "BLICK",
    type: "Single",
    year: 2024,
    date: "2024",
    cover: blick,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "BLICK" }],
  },
  {
    id: "blick-remix",
    title: "BLICK (Remix)",
    type: "Single",
    year: 2024,
    date: "2024",
    cover: blickr,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "BLICK (Remix)" }],
  },
  {
    id: "aggelos-sti-gi",
    title: "Aggelos Sti Gi",
    type: "Single",
    year: 2024,
    date: "2024",
    cover: asg,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Aggelos Sti Gi" }],
  },

  // ==================== 2023 ====================
  {
    id: "xadia",
    title: "Xadia",
    type: "Single",
    year: 2023,
    date: "2023",
    cover: xadia,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Xadia" }],
  },
  {
    id: "baby-luv-me",
    title: "Baby Luv Me",
    type: "Single",
    year: 2023,
    date: "2023",
    cover: blm,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Baby Luv Me" }],
  },
  {
    id: "ston-ypno-mou",
    title: "Ston Ypno Mou",
    type: "Single",
    year: 2023,
    date: "2023",
    cover: sym,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Ston Ypno Mou" }],
  },

  // ==================== 2022 ====================
  {
    id: "nearos",
    title: "Νεαρός",
    type: "Album",
    year: 2022,
    date: "25 Νοεμβρίου 2022",
    cover: cover3,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [
      { title: "Intro" },
      { title: "Αστέρια (Asteria)" },
      { title: "Σημάδι (Simadi)" },
      { title: "F*ck with Me", feat: ["FY"] },
      { title: "Με Περίεργους (Me Periergous)" },
      { title: "Sweet", feat: ["Roi 6/12"] },
      { title: "Ο Πατέρας Μου Ήταν Φυλακή (O Pateras Mou Itan Filaki)" },
      { title: "Amy Winehouse" },
      { title: "No Stress", feat: ["Yama"] },
      { title: "LOOPA" },
      { title: "BET" },
      { title: "Outro" },
    ],
  },
  {
    id: "thee-mou",
    title: "Thee Mou",
    type: "Single",
    year: 2022,
    date: "2022",
    cover: god,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Thee Mou" }],
  },
  {
    id: "sto-myalo-sou",
    title: "Sto Myalo Sou",
    type: "Single",
    year: 2022,
    date: "2022",
    cover: stoMyaloMoy,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Sto Myalo Sou" }],
  },
  {
    id: "merokamato",
    title: "Merokamato (feat. FY)",
    type: "Single",
    year: 2022,
    date: "2022",
    cover: merokamato,
    links: { spotify: "https://spotify.com", youtube: "https://youtube.com", apple: "https://music.apple.com" },
    tracks: [{ title: "Merokamato", feat: ["FY"] }],
  },
];

export type Milestone = { year: string; title: string; text: string; image: string };

export const timeline: Milestone[] = [
  {
    year: "Day 1",
    title: "Απ' το Λάλουκα στην Κορυφή της Ελληνικής Trap",
    text: "Ξεκινώντας από το Λάλουκα και μετακομίζοντας στην Αθήνα στα 20 του, ο Yolte άρχισε να χτίζει το δικό του αυτόνομο κίνημα αποκλειστικά μέσα από τη μουσική του, με αφοσίωση στον αληθινό ήχο και το κοινό του.",
    image: g2,
  },
  {
    year: "2022",
    title: "Τα Πρώτα Singles & «Νεαρός» Album",
    text: "Η επίσημη αρχή με singles όπως το 'Merokamato' (feat. FY), το breakthrough 'Thee Mou' και το ντεμπούτο studio album 'Νεαρός' (που περιείχε το 'Sweet').",
    image: g1,
  },
  {
    year: "2023",
    title: "Viral Singles & Συνεργασίες",
    text: "Μια γεμάτη χρονιά με releases όπως 'Baby Luv Me', 'Ston Ypno Mou' και το 'Xadia' που έγινε τεράστιο viral hit.",
    image: g4,
  },
  {
    year: "2024",
    title: "«FOR ALL THE BEACHES» Era",
    text: "Κυκλοφορούν τα hits 'Makigiaz', 'Xenodohio' (με Ypo) και το 2ο studio album 'FOR ALL THE BEACHES'.",
    image: g3,
  },
  {
    year: "2025",
    title: "«ASTRO» (21-track Project) & FATB 2.8",
    text: "Έκρηξη παραγωγικότητας με το τεράστιο album 'ASTRO' (21 κομμάτια), τα singles 'GROUPIE', 'GILEKO' και το sequel album 'FOR ALL THE BEACHES 2.8'.",
    image: g2,
  },
  {
    year: "2026",
    title: "«PERCEPTION», «FATB 4.4» & Νέα Hits",
    text: "Εδραίωση στην κορυφή με τα albums 'PERCEPTION' και το 'FOR ALL THE BEACHES 4.4', μαζί με hits όπως το 'LV' (με Dirty Harry & Younggbeatz) και το 'WOOO'.",
    image: g1,
  },
];

export const gallery = [
  { src: g1, alt: "Yolte live on stage under purple lights", w: 1024, h: 768 },
  { src: g2, alt: "Studio session at night", w: 768, h: 1024 },
  { src: g3, alt: "Backstage corridor before a show", w: 1024, h: 768 },
  { src: g4, alt: "Athens street at night", w: 768, h: 1024 },
  { src: g1, alt: "Crowd during the encore", w: 1024, h: 768 },
  { src: g4, alt: "Graffiti wall in the neighbourhood", w: 768, h: 1024 },
];

export type Show = { date: string; city: string; venue: string; status: "tickets" | "soldout" };

export const shows: Show[] = [
  { date: "18 Σεπ 2026", city: "Αθήνα", venue: "Gagarin 205", status: "tickets" },
  { date: "26 Σεπ 2026", city: "Θεσσαλονίκη", venue: "Principal Club", status: "soldout" },
  { date: "10 Οκτ 2026", city: "Πάτρα", venue: "Royal Theatre", status: "tickets" },
  { date: "24 Οκτ 2026", city: "Ηράκλειο", venue: "Κύτταρο Live", status: "tickets" },
  { date: "07 Νοε 2026", city: "Λονδίνο", venue: "Electric Brixton", status: "tickets" },
];

export const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Spotify", href: "https://spotify.com" },
  { label: "YouTube", href: "https://youtube.com" },
];