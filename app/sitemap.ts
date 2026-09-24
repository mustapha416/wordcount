import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://wordcount-chi.vercel.app/', 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}