import { parser as P, string as S } from 'parser-ts';
import { pipe } from 'fp-ts/lib/function';

import { JSONNull } from '../domain/JSON';

export const JSONNullParser = pipe(
   S.string('null'),
   P.map((_): JSONNull => ({ _tag: 'null' }))
);
