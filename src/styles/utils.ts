export function classes(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}