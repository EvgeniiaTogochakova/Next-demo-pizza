export const checkArraysEqual = (a: number[], b: number[]): boolean => {
  return a.length === b.length && a.every((val, index) => val === b[index]);
};
