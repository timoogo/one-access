export type Brand<T, Name extends string> = T & {
    readonly [key in `__brand_${Name}`]: never;
  };