import * as E from 'fp-ts/lib/Either';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as O from 'fp-ts/lib/Option';
import * as R from 'fp-ts/lib/Record';
import { pipe, flow, identity } from 'fp-ts/lib/function';
import { char as C, parser as P, string as S } from 'parser-ts';
import { ParseError } from 'parser-ts/ParseResult';
import { stream } from 'parser-ts/Stream';

import { JSON } from '../domain/JSON';
import { JSONParser } from '../parsers';

export type ExtractParserRight<T> = T extends P.Parser<any, infer R>
   ? R
   : never;

export const runParser = <A>(
   p: P.Parser<C.Char, A>,
   s: string
): E.Either<ParseError<C.Char>, A> =>
   pipe(
      p(stream(s.split(''))),
      E.map(a => a.value)
   );

const hexCharParser = C.oneOf('0123456789abcdefABCDEF');

/**
 *  Double quote is replaced with `\"`
 *  Backslash is replaced with `\\`
 *  Backspace is replaced with `\b`
 *  Form feed is replaced with `\f`
 *  Newline is replaced with `\n`
 *  Carriage return is replaced with `\r`
 *  Tab is replaced with `\t`
 *  Unicode `\u0000`
 */
export const JSONStringEscapesParser = pipe(
   pipe(
      S.string('\\"'),
      P.map(() => '"')
   ),
   P.alt(() =>
      pipe(
         S.string('\\/'),
         P.map(() => '/')
      )
   ),
   P.alt(() =>
      pipe(
         S.string('\\\\'),
         P.map(() => '\\')
      )
   ),
   P.alt(() =>
      pipe(
         S.string('\\b'),
         P.map(() => '\b')
      )
   ),
   P.alt(() =>
      pipe(
         S.string('\\f'),
         P.map(() => '\f')
      )
   ),
   P.alt(() =>
      pipe(
         S.string('\\n'),
         P.map(() => '\n')
      )
   ),
   P.alt(() =>
      pipe(
         S.string('\\r'),
         P.map(() => '\r')
      )
   ),
   P.alt(() =>
      pipe(
         S.string('\\t'),
         P.map(() => '\t')
      )
   ),
   P.alt(() =>
      pipe(
         S.string('\\u'),
         P.apSecond(
            S.fold([hexCharParser, hexCharParser, hexCharParser, hexCharParser])
         ),
         P.map(src => pipe(parseInt(src, 16), String.fromCharCode))
      )
   )
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

export type Err =
   | {
        type: 'jsErr';
        value: unknown;
     }
   | {
        type: 'parseErr';
        value: ParseError<C.Char>;
     };

export const parse = (src: string) =>
   pipe(
      E.tryCatch(
         () =>
            pipe(
               runParser(JSONParser, src),
               E.mapLeft((value): Err => ({ type: 'parseErr', value }))
            ),
         (value): Err => ({ type: 'jsErr', value })
      ),
      E.chain(identity)
   );
