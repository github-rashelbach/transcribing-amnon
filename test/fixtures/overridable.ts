import merge from 'lodash/merge';
import { DeepPartial } from 'ts-essentials';

export const overridable =
  <T>(defaults: () => T) =>
  (overrides: DeepPartial<T> = {} as DeepPartial<T>): T =>
    merge(defaults(), overrides);
