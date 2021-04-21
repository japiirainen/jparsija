import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

import { parse, flatten } from '../src';

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
            const res = pipe(parse(jsonStr), E.map(flatten));
            assert.deepStrictEqual(res, E.right(JSON.parse(jsonStr)));
         });
      }
      if (file.startsWith('n_')) {
         it(file, () => {
            assert.strictEqual(pipe(parse(jsonStr), E.isLeft), true);
         });
      }
   });
});
