export interface Organization {
  id: number
  title: string
  slug: string
  summary: string
  description?: string
  website?: string
  image?: string
  date: string
  private: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface Post {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  date: string
  image?: string
  weight?: number
  private: boolean
  created_at: string
  updated_at: string
  categories?: Category[]
  tags?: Tag[]
}

export interface Contributor {
  id: number
  name: string
  role: string
  bio: string
  avatar?: string
  github?: string
  twitter?: string
  linkedin?: string
  created_at: string
  updated_at: string
}

export interface NavLink {
  name: string
  url: string
  icon?: string
}

export interface ButtonVariant {
  primary: string
  secondary: string
  outline: string
  ghost: string
}

export interface ButtonSize {
  sm: string
  md: string
  lg: string
}

export interface CardProps {
  title: string
  description: string
  image?: string
  link?: string
  tags?: string[]
  date?: string
  category?: string
}
