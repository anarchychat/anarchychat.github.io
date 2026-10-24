export function getRandomDigit(): number {
  return Math.floor(Math.random() * 9999) + 1;
}

export function getRandomColor(): string {
  return "#" + Math.random().toString(16).slice(2, 8).padStart(6, "0");
}