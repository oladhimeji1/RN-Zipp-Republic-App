export const naira = (n: number) =>
  '₦' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || 'ZR';

export const firstName = (name: string) => name.trim().split(/\s+/)[0] || 'there';

export const prettyDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
