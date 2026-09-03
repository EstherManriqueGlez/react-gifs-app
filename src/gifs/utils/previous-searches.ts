export const MAX_PREVIOUS_TERMS = 8;

const STORAGE_KEY = 'gifs-app:previous-terms';

export const loadPreviousTerms = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((term): term is string => typeof term === 'string')
      .map((term) => term.toLowerCase().trim())
      .slice(0, MAX_PREVIOUS_TERMS);
  } catch {
    return [];
  }
};

export const savePreviousTerms = (terms: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
  } catch {
    // Storage may be unavailable (e.g. private mode); fail silently.
  }
};
