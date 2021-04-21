import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';

import * as U from './util';

export const flatten = U.flatten;
export const parse = U.parse;

/**
 * Convinience function. Parses JSON `string` into an Either<Err, javascriptObject>
 * @param src JSON input string
 * @returns Either<Err, javascriptObject>
 */
export const parseJson = flow(parse, E.map(flatten));

export * as P from './parsers';
