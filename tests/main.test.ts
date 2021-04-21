import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

import { JSONP } from '../src/parsers';
import * as P from '../src/parsers';

import fs from 'fs';
import path from 'path';
import assert from 'assert';

const BASE_DIR = path.join(__dirname + '/dataset');

describe('RFC 8269 test suite', () => {
   const files = fs.readdirSync(BASE_DIR);
   files.forEach(file => {
      const jsonStr = fs.readFileSync(`${BASE_DIR}/${file}`, 'utf-8');
      if (file.startsWith('y_')) {
         it(file, () => {
            console.log(file);
            assert.deepStrictEqual(
               pipe(P.parse(JSONP)(jsonStr), E.map(P.flatten)),
               E.right(jsonStr)
            );
         });
      }
      if (file.startsWith('_n')) {
         it(file, () => {
            assert.strictEqual(pipe(P.parse(JSONP)(jsonStr), E.isLeft), true);
         });
      }
   });
});
