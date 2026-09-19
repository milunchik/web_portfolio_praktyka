export const trimToNull = (v?: string | null): string | null => {
  const s = (v ?? '').trim();
  return s.length ? s : null;
};

export const safeLower = (v: string): string => v.trim().toLowerCase();
