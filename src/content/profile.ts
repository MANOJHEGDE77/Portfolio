/**
 * Every piece of copy and data on the site lives here so the components stay
 * purely presentational. Source of truth: Manoj Mahableshwar Hegde's resume.
 */

import { BRAND_COLOR, DELTA_GRADIENT, type DotShape } from '@/lib/brand'
import type { BrandName } from '@/lib/brandIcons'

export type RichText = ReadonlyArray<string | { strong: string }>

export const SECTION_IDS = [
  'top',
  'about',
  'experience',
  'pipelines',
  'skills',
  'projects',
  'credentials',
  'contact',
  'end',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Accessible names for the section landmarks. */
export const SECTION_TITLES: Record<SectionId, string> = {
  top: 'Introduction',
  about: 'At a glance',
  experience: 'Education and achievements',
  pipelines: 'System architecture simulations',
  skills: 'Technical skills',
  projects: 'Projects',
  credentials: 'Certifications',
  contact: 'Contact',
  end: 'Footer',
}

/** DAG rail labels. The rail prefixes each with its cell index. */
export const RAIL_LABELS: Record<SectionId, string> = {
  top: '%md hero',
  about: 'describe()',
  experience: 'education',
  pipelines: 'simulations.live()',
  skills: 'skills',
  projects: 'projects',
  credentials: 'credentials',
  contact: '%md contact',
  end: '%sh',
}

export const NAV_LINKS: ReadonlyArray<{ id: SectionId; label: string }> = [
  { id: 'experience', label: 'education' },
  { id: 'pipelines', label: 'simulations' },
  { id: 'skills', label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
]

export const PROFILE = {
  name: 'Manoj Mahableshwar Hegde',
  firstName: 'Manoj',
  lastName: 'Hegde',
  notebook: 'manoj_hegde',
  tagline: 'Software Developer · Java · Spring Boot · SQL · Bengaluru',
  location: 'Bengaluru, Karnataka, India',
  email: 'mhegdemanoj@gmail.com',
  phone: { display: '+91 80736 50381', href: 'tel:+918073650381' },
  linkedin: { handle: 'in/MANOJHEGDE77', url: 'https://www.linkedin.com/in/MANOJHEGDE77/' },
  github: { handle: 'MANOJHEGDE77', url: 'https://github.com/MANOJHEGDE77' },
  resume: {
    fileName: 'Manoj_Mahableshwar_Hegde_Resume.pdf',
    url: `${import.meta.env.BASE_URL}Manoj_Mahableshwar_Hegde_Resume.pdf?v=2`,
    sizeLabel: 'PDF',
  },
  availability: 'open to software developer opportunities',
  cluster: { name: 'backend-dev', workers: 8 },
} as const

export const HERO = {
  lead: 'I build software systems with',
  accent: 'robust backend foundations.',
  body:
    'Computer Science and Data Science undergraduate with strong foundations in Java, SQL, and Object-Oriented Programming. Familiar with Spring Boot, MySQL, and web development concepts, with a keen interest in backend development and problem-solving. Seeking an entry-level Software Developer role to apply and enhance my technical skills.',
} as const

export interface Stat {
  metric: string
  value: number
  prefix?: string
  suffix?: string
  tone: 'txt' | 'teal'
  source: string
}

export const STATS: ReadonlyArray<Stat> = [
  { metric: 'engineering_cgpa', value: 7.3, suffix: ' / 10', tone: 'teal', source: 'Vivekananda College of Engineering and Technology' },
  { metric: 'class_12_pcmb', value: 86.16, suffix: '%', tone: 'txt', source: 'SDM PU College · Honnavar' },
  { metric: 'featured_projects', value: 4, suffix: ' apps', tone: 'teal', source: 'PlacementPro AI · CivicConnect · Smart-Task · Mesh Link' },
  { metric: 'national_hackathon_rank', value: 1, prefix: '#', suffix: ' Place', tone: 'teal', source: 'Winner — iVITon Medical Track, graVITas 2025 (VIT Vellore)' },
]

export const EXPERIENCE = {
  period: 'OCT 2023 → MAY 2027',
  status: 'IN PROGRESS',
  org: 'Vivekananda College of Engineering and Technology',
  role: 'Bachelor of Engineering · Computer Science and Data Science · Puttur, India',
  stack: [
    { label: 'Java', icon: 'openjdk' },
    { label: 'Spring Boot', icon: 'springboot' },
    { label: 'MySQL', icon: 'mysql' },
    { label: 'SQL' },
    { label: 'REST APIs' },
    { label: 'OOP' },
    { label: 'DSA' },
  ] as ReadonlyArray<{ label: string; icon?: BrandName }>,
  highlights: [
    [
      'Pursuing ',
      { strong: 'Bachelor of Engineering in Computer Science and Data Science' },
      ' with CGPA of 7.3/10.0, establishing rigorous foundations in software engineering and database systems.',
    ],
    [
      'Secured ',
      { strong: '#1 Place Winner at iVITon Medical Track, graVITas 2025 (VIT Vellore)' },
      ', leading innovation in a competitive national-level engineering hackathon.',
    ],
    [
      'Core focus on ',
      { strong: 'Object-Oriented Programming (OOP), Data Structures and Algorithms (DSA)' },
      ', and scalable application architecture.',
    ],
    [
      'Engineered full-stack and backend systems with ',
      { strong: 'Java, Spring Boot, MySQL, RESTful APIs, and JWT authentication' },
      ' across multiple deployed projects.',
    ],
  ] as ReadonlyArray<RichText>,
} as const

export const EDUCATION = {
  period: 'AUG 2021 → MAY 2023',
  status: 'COMPLETED',
  school: 'SDM PU College',
  detail: 'Class 12th - PCMB · Percentage: 86.16% · Honnavar, India',
  award: [
    'Completed Pre-University education in ',
    { strong: 'Physics, Chemistry, Mathematics, and Biology (PCMB)' },
    ' with distinction (86.16%).',
  ] as RichText,
} as const

export const PIPELINE_CARDS = {
  medallion: 'Structured backend processing: request ingestion, validation & sanitation, domain logic execution, and transactional persistence.',
  spark: 'Distributed execution engine: concurrent thread pools, stage decomposition, and task scheduling across service workers.',
  adf: 'Spring Boot scheduled jobs and async tasks: automatic triggers, error recovery with exponential backoff, and state monitoring.',
  delta: [
    'ACID transaction log & audit trail. Versioned state persistence, ',
    { strong: 'Entity auditing' },
    ', and optimistic locking across concurrent writes.',
  ] as RichText,
  powerbi: 'Analytics & placement dashboard: real-time metric calculation, skill gap analysis, and candidate progress evaluation charts.',
  api: 'RESTful API gateway with token-bucket rate limiting. Burst handling, payload validation, and reliable response streaming.',
} as const

export type SkillTone = 'default' | 'ember' | 'teal'

export interface Skill {
  label: string
  tone?: SkillTone
  icon?: BrandName
  /** For brands without a logo: any CSS background (color or gradient). */
  dot?: { color: string; shape?: DotShape }
}

export interface SkillGroup {
  category: string
  skills: ReadonlyArray<Skill>
}

export const SKILL_GROUPS: ReadonlyArray<SkillGroup> = [
  {
    category: 'Programming languages',
    skills: [
      { label: 'Java', tone: 'ember', icon: 'openjdk' },
      { label: 'Kotlin', tone: 'ember', icon: 'kotlin' },
      { label: 'SQL', tone: 'ember' },
    ],
  },
  {
    category: 'Frameworks & backend',
    skills: [
      { label: 'Spring Boot', tone: 'teal', icon: 'springboot' },
      { label: 'Spring Data JPA', tone: 'teal', dot: { color: BRAND_COLOR.spring } },
      { label: 'RESTful APIs', tone: 'teal' },
      { label: 'Maven', icon: 'apachemaven' },
    ],
  },
  {
    category: 'Databases & storage',
    skills: [
      { label: 'MySQL', tone: 'ember', icon: 'mysql' },
      { label: 'MongoDB', icon: 'mongodb' },
      { label: 'Room Database', dot: { color: BRAND_COLOR.azure, shape: 'square' } },
      { label: 'SQLCipher', dot: { color: DELTA_GRADIENT, shape: 'diamond' } },
    ],
  },
  {
    category: 'Core concepts',
    skills: [
      { label: 'Object-Oriented Programming (OOP)', tone: 'teal' },
      { label: 'Data Structures and Algorithms (DSA)', tone: 'teal' },
      { label: 'JWT Authentication', dot: { color: BRAND_COLOR.jwt, shape: 'diamond' } },
      { label: 'AES-256-GCM Encryption', dot: { color: BRAND_COLOR.azure, shape: 'diamond' } },
      { label: 'Offline-First Architecture' },
    ],
  },
  {
    category: 'Web & developer tools',
    skills: [
      { label: 'HTML', icon: 'html5' },
      { label: 'CSS', icon: 'css' },
      { label: 'React', icon: 'react' },
      { label: 'Git', icon: 'git' },
      { label: 'GitHub', icon: 'github' },
      { label: 'Visual Studio Code', dot: { color: BRAND_COLOR.azure, shape: 'square' } },
      { label: 'Postman', icon: 'postman' },
    ],
  },
]

export const SKILL_COUNT = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0)

export interface Project {
  kicker: string
  kickerTone: 'amber' | 'teal' | 'ember' | 'mut'
  kickerIcon: BrandName | 'medallion'
  title: string
  body: string
  tags: ReadonlyArray<string>
  url: string
}

export const PROJECTS: ReadonlyArray<Project> = [
  {
    kicker: 'AI-POWERED · FULL-STACK',
    kickerTone: 'teal',
    kickerIcon: 'openjdk',
    title: 'PlacementPro AI',
    body: 'Developed an AI-powered placement preparation platform featuring resume analysis, coding practice, and mock interview modules. Implemented secure authentication, personalized dashboards, AI-driven skill extraction, responsive UI, progress tracking, and performance analytics.',
    tags: ['Java', 'Spring Boot', 'React', 'MySQL', 'JWT', 'REST API', 'Git'],
    url: 'https://github.com/MANOJHEGDE77/placmentpro-ai',
  },
  {
    kicker: 'BACKEND APIS · CIVIC TECH',
    kickerTone: 'amber',
    kickerIcon: 'springboot',
    title: 'CivicConnect',
    body: 'Built secure backend APIs and complaint management modules to streamline communication between citizens and authorities. Features citizen registration, complaint tracking with image upload, real-time status updates, complaint filtering, and notifications.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'JWT', 'REST API', 'Cloudinary', 'Maven'],
    url: 'https://github.com/MANOJHEGDE77/CivicConnect',
  },
  {
    kicker: 'PRODUCTIVITY · PERSISTENCE',
    kickerTone: 'ember',
    kickerIcon: 'mysql',
    title: 'Smart-Task-Manager',
    body: 'Developed a task management application for creating, updating, and tracking daily tasks efficiently. Implemented secure user authentication, persistent data storage via JPA, task categorization, and status-tracking features to improve productivity.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'JPA', 'REST API'],
    url: 'https://github.com/MANOJHEGDE77/smart-task-manager',
  },
  {
    kicker: 'OFFLINE-FIRST · P2P MESH',
    kickerTone: 'mut',
    kickerIcon: 'kotlin',
    title: 'Mesh Link',
    body: 'Developed an offline-first Android application enabling secure peer-to-peer communication over decentralized mesh networks. Implemented end-to-end AES-256-GCM encryption, reliable messaging, local trust management, modern Jetpack Compose UI, and data synchronization.',
    tags: ['Kotlin', 'Jetpack Compose', 'Room', 'SQLCipher', 'WorkManager', 'Dagger Hilt'],
    url: 'https://github.com/MANOJHEGDE77/Mesh-Link',
  },
]

export interface Certification {
  issuer: string
  issuerIcon?: BrandName
  issuerDot?: string
  title: string
  year: number
  url: string
}

export const CERTIFICATIONS: ReadonlyArray<Certification> = [
  { issuer: 'CodeHelp', issuerDot: BRAND_COLOR.spring, title: 'Basics of Java Programming', year: 2026, url: 'https://github.com/MANOJHEGDE77' },
  { issuer: 'VIT Vellore · graVITas', issuerDot: BRAND_COLOR.azure, title: 'Winner — iVITon Medical Track (graVITas 2025)', year: 2025, url: 'https://github.com/MANOJHEGDE77' },
  { issuer: 'Outskill', issuerDot: '#a855f7', title: 'Generative AI Mastermind', year: 2026, url: 'https://github.com/MANOJHEGDE77' },
]

export const CONTACT = {
  heading: "Let's",
  accent: 'connect.',
  codeLine: 'Hiring for a Software Developer role or want to discuss backend engineering? Email is fastest.',
  body: 'Seeking an entry-level Software Developer role to apply and enhance my technical skills. Open to conversations about software engineering, backend systems, and internships or full-time opportunities.',
} as const

export const FOOTER = {
  year: 2026,
  text: '© 2026 Manoj Mahableshwar Hegde · built with React & TypeScript · try typing: ',
} as const
