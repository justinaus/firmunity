// TODO. 더 좋은 방법.
export function getOneString(value?: string | string[] | null) {
  if (typeof value !== 'string') {
    return null;
  }

  return value;
}
