import { char as C, parser as P, string as S } from 'parser-ts';
import { pipe } from 'fp-ts/lib/function';

import { JSONNumber } from '../domain/JSON';

export const JSONNumberParser = pipe(
   S.fold([
      S.maybe(C.char('-')),
      pipe(
         C.char('0'),
         P.alt(() => S.fold([C.oneOf('123456789'), C.many(C.digit)]))
      ),
      S.maybe(S.fold([C.char('.'), C.many1(C.digit)])),
      S.maybe(
         S.fold([C.oneOf('Ee'), S.maybe(C.oneOf('+-')), C.many1(C.digit)])
      ),
   ]),
   P.map(s => +s),
   P.map((value): JSONNumber => ({ _tag: 'number', value }))
);
