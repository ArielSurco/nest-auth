export type CustomPartial<T, K extends keyof T = keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
