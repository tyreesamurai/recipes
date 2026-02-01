// TODO: refactor these for readability!

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const parseOptionalInt = (v: string | string[] | undefined) => {
  const s = first(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

const parseOptionalString = (v: string | string[] | undefined) => {
  const s = first(v);
  const trimmed = s?.trim();
  return trimmed ? trimmed : undefined;
};

const parseStringArray = (v: string | string[] | undefined) => {
  if (!v) return undefined;
  const arr = Array.isArray(v) ? v : [v];
  const cleaned = arr.map((x) => x.trim()).filter(Boolean);
  return cleaned.length ? cleaned : undefined;
};

const parseNumberOr = (value: string | null, fallback: number) => {
  if (value == null || value.trim() === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const helpers = {
  parseOptionalInt,
  parseOptionalString,
  parseStringArray,
  parseNumberOr,
};
