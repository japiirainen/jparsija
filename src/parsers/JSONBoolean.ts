import { parser as P, string as S } from 'parser-ts';
import { pipe } from 'fp-ts/lib/function';

import { JSONBoolean } from '../domain/JSON';

export const JSONBooleanParser = pipe(
   S.string('true'),
   P.map(() => true),
   P.alt(() =>
      pipe(
         S.string('false'),
         P.map(() => false)
      )
   ),
   P.map((value): JSONBoolean => ({ _tag: 'boolean', value }))
);
