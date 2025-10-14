export interface HeroProps {
  version: string;
  title: string;
  description: string;
  footer: string;
}

export interface LinkItem {
  title: string;
  description: string;
  route: string;
  disabled: boolean;
}

export interface LandingContent {
  hero: HeroProps;
  link: LinkItem[]; // ubah jadi array
}