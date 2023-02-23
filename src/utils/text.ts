export function getPlural(value: number) {
  if (value === 1) {
    return '';
  }

  return 's';
}
