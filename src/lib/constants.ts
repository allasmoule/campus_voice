export const SITE_NAME = "TheCampusVoice";
export const SITE_TAGLINE = "Your Campus. Your Voice.";
export const SITE_DESCRIPTION =
  "A confidential, research-driven platform capturing how students, faculty, and staff experience academic environments.";

export const CATEGORIES = [
  { name: "News", slug: "news", color: "#DC2626", icon: "newspaper", description: "What's happening on and off campus" },
  { name: "Opinion", slug: "opinion", color: "#7C3AED", icon: "message-circle", description: "Student takes on the issues" },
  { name: "Campus Life", slug: "campus-life", color: "#2563EB", icon: "heart", description: "Events, culture & student experiences" },
  { name: "Careers", slug: "careers", color: "#D97706", icon: "briefcase", description: "Internships, jobs & career advice" },
  { name: "Wellness", slug: "wellness", color: "#059669", icon: "activity", description: "Mind, body & student health" },
  { name: "Voices", slug: "voices", color: "#6366F1", icon: "megaphone", description: "Amplifying every student voice" },
] as const;

export const NAV_LINKS = [
  { name: "News", href: "/categories/news" },
  { name: "Opinion", href: "/categories/opinion" },
  { name: "Campus Life", href: "/categories/campus-life" },
  { name: "Careers", href: "/categories/careers" },
  { name: "Wellness", href: "/categories/wellness" },
  { name: "Voices", href: "/categories/voices" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
] as const;

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/TheCampusVoice",
  tiktok: "https://tiktok.com/@TheCampusVoice",
  twitter: "https://x.com/TheCampusVoice",
  facebook: "https://facebook.com/TheCampusVoice",
} as const;

export const INSTITUTION_TYPES = [
  "Public university",
  "Private university",
  "Community college",
  "Other",
] as const;

export const ROLES = [
  "Undergraduate student",
  "Graduate student",
  "Staff",
  "Faculty",
  "Other",
] as const;

export const ACADEMIC_AREAS = [
  "STEM",
  "Social Sciences",
  "Humanities",
  "Professional Programs",
  "Other",
] as const;

export const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
] as const;
