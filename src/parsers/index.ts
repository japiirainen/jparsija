import * as E from 'fp-ts/lib/Either';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as R from 'fp-ts/lib/Record';
import * as O from 'fp-ts/lib/Option';
import { pipe, flow, identity } from 'fp-ts/lib/function';
import { Parser } from 'parser-ts/lib/Parser';
import { char as C, parser as P } from 'parser-ts';
import { ParseError } from 'parser-ts/lib/ParseResult';

import { runParser } from '../util';
import { JSON } from '../domain/JSON';
import { JSONValueParser } from './JSONValue';

export type Err =
   | {
        type: 'jsErr';
        value: unknown;
     }
   | {
        type: 'parseErr';
        value: ParseError<C.Char>;
     };

export const parse = <A>(parser: Parser<string, A>) => (src: string) =>
   pipe(
      E.tryCatch(
         () =>
            pipe(
               runParser(parser, src),
               E.mapLeft((value): Err => ({ type: 'parseErr', value }))
            ),
         (value): Err => ({ type: 'jsErr', value })
      ),
      E.chain(identity)
   );

export const flatten = (
   src: JSON
): string | number | boolean | null | object => {
   switch (src._tag) {
      case 'string':
         return src.value;
      case 'number':
         return src.value;
      case 'boolean':
         return src.value;
      case 'null':
         return null;
      case 'object':
         return pipe(
            src.value,
            NEA.fromArray,
            O.map(
               flow(
                  NEA.groupBy(a => a.key),
                  R.map(NEA.last),
                  R.map(a => flatten(a.value))
               )
            ),
            O.getOrElse(() => ({}))
         );
      case 'array':
         return src.value.map(flatten);
   }
};

export const JSONP = pipe(JSONValueParser, P.apFirst(P.eof()));
