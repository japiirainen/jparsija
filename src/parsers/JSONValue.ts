import { pipe } from 'fp-ts/lib/function';
import { parser as P } from 'parser-ts';

import { JSON } from '../domain/JSON';

import { JSONStringParser } from './JSONString';
import { JSONNumberParser } from './JSONNumber';
import { JSONNullParser } from './JSONNull';
import { JSONBooleanParser } from './JSONBoolean';

export const JSONValueParser = pipe(
   JSONStringParser as P.Parser<string, JSON>,
   P.alt((): P.Parser<string, JSON> => JSONNumberParser),
   P.alt((): P.Parser<string, JSON> => JSONNullParser),
   P.alt((): P.Parser<string, JSON> => JSONBooleanParser)
);
