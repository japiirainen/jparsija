import { pipe } from 'fp-ts/lib/function';
import { char as C, parser as P, string as S } from 'parser-ts';
import { JSONString } from '../domain/JSON';
import { JSONStringEscapeParser } from '../util';

export const CTRL_CHAR_SET = [
   '\x00',
   '\x01',
   '\x02',
   '\x03',
   '\x04',
   '\x05',
   '\x06',
   '\x07',
   '\x08',
   '\x09',
   '\x0A',
   '\x0B',
   '\x0C',
   '\x0D',
   '\x0E',
   '\x0F',
   '\x10',
   '\x11',
   '\x12',
   '\x13',
   '\x14',
   '\x15',
   '\x16',
   '\x17',
   '\x18',
   '\x19',
   '\x1A',
   '\x1B',
   '\x1C',
   '\x1D',
   '\x1E',
   '\x1F',
];

export const JSONStringParser = pipe(
   C.char('"'),
   P.chain(() =>
      S.many(
         pipe(
            C.notOneOf(['"', '\\', ...CTRL_CHAR_SET].join('')),
            P.alt(() => JSONStringEscapeParser)
         )
      )
   ),
   P.apFirst(C.char('"')),
   P.map((value): JSONString => ({ _tag: 'string', value }))
);
