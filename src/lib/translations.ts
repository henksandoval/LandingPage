import 'server-only';

// Define a type for our dictionaries
// This is a simplified example; you might want more specific types for your dictionary structure
export type Dictionary = Record<string, any>; 

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const load = dictionaries[locale] || dictionaries.es; // Fallback to Spanish
  try {
    return await load();
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    // Fallback to default locale if specific one fails
    return await dictionaries.es();
  }
};
