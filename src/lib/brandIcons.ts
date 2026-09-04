import {
  siAndroid,
  siApachemaven,
  siApachespark,
  siCoursera,
  siCss,
  siDatabricks,
  siGit,
  siGithub,
  siHtml5,
  siKotlin,
  siLinux,
  siMongodb,
  siMysql,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siSnowflake,
  siSpring,
  siSpringboot,
} from 'simple-icons'

/** The logos the site ships. Content and components both key off this map. */
export const BRAND_ICONS = {
  android: siAndroid,
  apachemaven: siApachemaven,
  apachespark: siApachespark,
  coursera: siCoursera,
  css: siCss,
  databricks: siDatabricks,
  git: siGit,
  github: siGithub,
  html5: siHtml5,
  kotlin: siKotlin,
  linux: siLinux,
  mongodb: siMongodb,
  mysql: siMysql,
  openjdk: siOpenjdk,
  postgresql: siPostgresql,
  postman: siPostman,
  python: siPython,
  react: siReact,
  snowflake: siSnowflake,
  spring: siSpring,
  springboot: siSpringboot,
} as const

export type BrandName = keyof typeof BRAND_ICONS

/** Brands whose official color is black, so they take the current text color instead. */
export const MONO_BRANDS: ReadonlySet<BrandName> = new Set<BrandName>(['github', 'openjdk', 'linux'])

