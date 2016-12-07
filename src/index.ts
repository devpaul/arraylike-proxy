import factory, { traps } from './ArrayLike';

(<any> factory).traps = traps;
export = factory;
