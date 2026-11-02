/** Tiny, dependency-free pseudo-data helpers for the demo / offline mode. */

const WORDS =
  'platform scalable cloud native modern elegant secure performance design system experience innovative robust seamless intelligent enterprise digital strategy delivery agile crafted reliable'.split(
    ' ',
  );

const FIRST = ['Aarav', 'Diya', 'Vivaan', 'Ananya', 'Kabir', 'Isha', 'Reyansh', 'Meera', 'Arjun', 'Sara'];
const LAST = ['Sharma', 'Patel', 'Reddy', 'Iyer', 'Nair', 'Gupta', 'Mehta', 'Rao', 'Bose', 'Khan'];
const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai', 'Delhi'];

let counter = 0;

export function uid(prefix = 'mock'): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}

export function pick<T>(arr: T[], seed = Math.random()): T {
  return arr[Math.floor(seed * arr.length) % arr.length];
}

export function words(n: number): string {
  return Array.from({ length: n }, () => pick(WORDS)).join(' ');
}

export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function sentence(): string {
  return titleCase(words(3)) + ' ' + words(6) + '.';
}

export function paragraph(): string {
  return Array.from({ length: 3 }, sentence).join(' ');
}

export function richParagraph(): string {
  return `<p>${sentence()}</p><p>${sentence()} ${sentence()}</p><ul><li>${words(3)}</li><li>${words(3)}</li></ul>`;
}

export function personName(): string {
  return `${pick(FIRST)} ${pick(LAST)}`;
}

export function email(name = personName()): string {
  return `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
}

export function mobile(): string {
  return `+91 ${Math.floor(70000 + Math.random() * 29999)}${Math.floor(10000 + Math.random() * 89999)}`;
}

export function city(): string {
  return pick(CITIES);
}

export function image(seed: string | number): string {
  return `https://picsum.photos/seed/sv-${seed}/640/420`;
}

export function avatar(seed: string | number): string {
  return `https://i.pravatar.cc/120?u=sv-${seed}`;
}

export function recentDate(daysBack = 120): string {
  const ms = Date.now() - Math.floor(Math.random() * daysBack) * 86_400_000;
  return new Date(ms).toISOString();
}
