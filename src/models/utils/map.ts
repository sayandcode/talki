function createMapFromObj<O extends Record<string, any>>(
  obj: O
): Map<string, O[keyof O]> {
  return new Map(Object.entries(obj));
}

// eslint-disable-next-line import/prefer-default-export
export { createMapFromObj };
