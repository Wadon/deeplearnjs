/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as test_util from '../test_util';
import {MathTests} from '../test_util';

import {Array1D, Array2D, Scalar} from './ndarray';

// element-wise mul / div
{
  const tests: MathTests = it => {
    it('multiplies same-shaped ndarrays', math => {
      const a = Array2D.new([2, 2], [1, 2, -3, -4]);
      const b = Array2D.new([2, 2], [5, 3, 4, -7]);
      const expected = new Float32Array([5, 6, -12, 28]);
      const result = math.elementWiseMul(a, b);

      expect(result.shape).toEqual([2, 2]);
      test_util.expectArraysClose(result.getValues(), expected);

      a.dispose();
      b.dispose();
    });

    it('propagates NaNs', math => {
      const a = Array2D.new([2, 2], [1, 3, 4, 0]);
      const b = Array2D.new([2, 2], [NaN, 3, NaN, 3]);

      const result = math.elementWiseMul(a, b).getValues();
      test_util.expectArraysClose(result, new Float32Array([NaN, 9, NaN, 0]));

      a.dispose();
      b.dispose();
    });

    it('mul throws when passed ndarrays of different shapes', math => {
      const a = Array2D.new([2, 3], [1, 2, -3, -4, 5, 6]);
      const b = Array2D.new([2, 2], [5, 3, 4, -7]);

      expect(() => math.elementWiseMul(a, b)).toThrowError();
      expect(() => math.elementWiseMul(b, a)).toThrowError();

      a.dispose();
      b.dispose();
    });

    it('divide', math => {
      const a = Array2D.new([2, 3], [1, 2, 3, 4, 5, 6]);
      const c = Array2D.new([2, 3], [1, 2, 3, 4, 2, 5]);

      const r = math.divide(a, c);

      expect(r.get(0, 0)).toBeCloseTo(1);
      expect(r.get(0, 1)).toBeCloseTo(1);
      expect(r.get(0, 2)).toBeCloseTo(1);
      expect(r.get(1, 0)).toBeCloseTo(1);
      expect(r.get(1, 1)).toBeCloseTo(2.5);
      expect(r.get(1, 2)).toBeCloseTo(6 / 5);

      a.dispose();
      c.dispose();
    });

    it('divide propagates NaNs', math => {
      const a = Array2D.new([2, 1], [1, 2]);
      const c = Array2D.new([2, 1], [3, NaN]);

      const r = math.divide(a, c).getValues();

      expect(r[0]).toBeCloseTo(1 / 3);
      expect(r[1]).toEqual(NaN);

      a.dispose();
      c.dispose();
    });

    it('div throws when passed ndarrays of different shapes', math => {
      const a = Array2D.new([2, 3], [1, 2, -3, -4, 5, 6]);
      const b = Array2D.new([2, 2], [5, 3, 4, -7]);

      expect(() => math.divide(a, b)).toThrowError();
      expect(() => math.divide(b, a)).toThrowError();

      a.dispose();
      b.dispose();
    });

    it('scalar divided by array', math => {
      const c = Scalar.new(2);
      const a = Array2D.new([2, 3], [1, 2, 3, 4, 5, 6]);

      const r = math.scalarDividedByArray(c, a);

      expect(r.get(0, 0)).toBeCloseTo(2 / 1);
      expect(r.get(0, 1)).toBeCloseTo(2 / 2);
      expect(r.get(0, 2)).toBeCloseTo(2 / 3);
      expect(r.get(1, 0)).toBeCloseTo(2 / 4);
      expect(r.get(1, 1)).toBeCloseTo(2 / 5);
      expect(r.get(1, 2)).toBeCloseTo(2 / 6);

      a.dispose();
      c.dispose();
    });

    it('scalar divided by array propagates NaNs', math => {
      const c = Scalar.new(NaN);
      const a = Array2D.new([1, 3], [1, 2, 3]);

      const r = math.scalarDividedByArray(c, a).getValues();

      expect(r).toEqual(new Float32Array([NaN, NaN, NaN]));

      a.dispose();
      c.dispose();
    });

    it('scalar divided by array throws when passed non scalar', math => {
      // tslint:disable-next-line:no-any
      const c: any = Array1D.new([1, 2, 3]);
      const a = Array2D.new([2, 3], [1, 2, 3, 4, 5, 6]);

      expect(() => math.scalarDividedByArray(c, a)).toThrowError();

      a.dispose();
      c.dispose();
    });

    it('array divided by scalar', math => {
      const a = Array2D.new([2, 3], [1, 2, 3, 4, 5, 6]);
      const c = Scalar.new(2);

      const r = math.arrayDividedByScalar(a, c);

      expect(r.get(0, 0)).toBeCloseTo(1 / 2);
      expect(r.get(0, 1)).toBeCloseTo(2 / 2);
      expect(r.get(0, 2)).toBeCloseTo(3 / 2);
      expect(r.get(1, 0)).toBeCloseTo(4 / 2);
      expect(r.get(1, 1)).toBeCloseTo(5 / 2);
      expect(r.get(1, 2)).toBeCloseTo(6 / 2);

      a.dispose();
      c.dispose();
    });

    it('array divided by scalar propagates NaNs', math => {
      const a = Array2D.new([1, 3], [1, 2, NaN]);
      const c = Scalar.new(2);

      const r = math.arrayDividedByScalar(a, c).getValues();

      expect(r[0]).toBeCloseTo(1 / 2);
      expect(r[1]).toBeCloseTo(2 / 2);
      expect(r[2]).toEqual(NaN);

      a.dispose();
      c.dispose();
    });

    it('array divided by scalar throws when passed non scalar', math => {
      // tslint:disable-next-line:no-any
      const c: any = Array1D.new([1, 2, 3]);
      const a = Array2D.new([2, 3], [1, 2, 3, 4, 5, 6]);

      expect(() => math.arrayDividedByScalar(a, c)).toThrowError();

      a.dispose();
      c.dispose();
    });

    it('scalar times ndarray', math => {
      const a = Array2D.new([3, 2], [2, -5, 1, 1, 4, 0]);
      const c = Scalar.new(2);

      const expected = new Float32Array([4, -10, 2, 2, 8, 0]);
      const result = math.scalarTimesArray(c, a);

      expect(result.shape).toEqual([3, 2]);
      test_util.expectArraysClose(result.getValues(), expected);

      a.dispose();
      c.dispose();
    });

    it('scalar times ndarray throws when passed non-scalar', math => {
      const a = Array2D.new([3, 2], [2, -5, 1, 1, 4, 0]);
      // tslint:disable-next-line:no-any
      const c: any = Array1D.new([1, 2, 3, 4]);

      expect(() => math.scalarTimesArray(c, a)).toThrowError();

      a.dispose();
      c.dispose();
    });
  };

  test_util.describeMathCPU('element-wise mul/div', [tests]);
  test_util.describeMathGPU('element-wise mul/div', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}

// element-wise add / sub
{
  const tests: MathTests = it => {
    it('c + A', math => {
      const c = Scalar.new(5);
      const a = Array1D.new([1, 2, 3]);

      const result = math.scalarPlusArray(c, a);

      test_util.expectArraysClose(
          result.getValues(), new Float32Array([6, 7, 8]));

      a.dispose();
      c.dispose();
    });

    it('c + A propagates NaNs', math => {
      const c = Scalar.new(NaN);
      const a = Array1D.new([1, 2, 3]);

      const res = math.scalarPlusArray(c, a).getValues();

      expect(res).toEqual(new Float32Array([NaN, NaN, NaN]));

      a.dispose();
      c.dispose();
    });

    it('c + A throws when passed non scalar', math => {
      // tslint:disable-next-line:no-any
      const c: any = Array1D.new([1, 2, 3]);
      const a = Array1D.new([1, 2, 3]);

      expect(() => math.scalarPlusArray(c, a)).toThrowError();

      a.dispose();
      c.dispose();
    });

    it('c - A', math => {
      const c = Scalar.new(5);
      const a = Array1D.new([7, 2, 3]);

      const result = math.scalarMinusArray(c, a);

      test_util.expectArraysClose(
          result.getValues(), new Float32Array([-2, 3, 2]));

      a.dispose();
      c.dispose();
    });

    it('c - A throws when passed non scalar', math => {
      // tslint:disable-next-line:no-any
      const c: any = Array1D.new([1, 2, 3]);
      const a = Array1D.new([1, 2, 3]);

      expect(() => math.scalarMinusArray(c, a)).toThrowError();

      a.dispose();
      c.dispose();
    });

    it('A - c', math => {
      const a = Array1D.new([1, 2, -3]);
      const c = Scalar.new(5);

      const result = math.arrayMinusScalar(a, c);

      test_util.expectArraysClose(
          result.getValues(), new Float32Array([-4, -3, -8]));

      a.dispose();
      c.dispose();
      result.dispose();
    });

    it('A - c propagates NaNs', math => {
      const a = Array1D.new([1, NaN, 3]);
      const c = Scalar.new(5);

      const res = math.arrayMinusScalar(a, c).getValues();

      test_util.expectArraysClose(res, new Float32Array([-4, NaN, -2]));

      a.dispose();
      c.dispose();
    });

    it('A - c throws when passed non scalar', math => {
      // tslint:disable-next-line:no-any
      const c: any = Array1D.new([1, 2, 3]);
      const a = Array1D.new([1, 2, 3]);

      expect(() => math.arrayMinusScalar(a, c)).toThrowError();

      a.dispose();
      c.dispose();
    });

    it('A - B', math => {
      const a = Array1D.new([2, 5, 1]);
      const b = Array1D.new([4, 2, -1]);

      const result = math.sub(a, b);

      const expected = new Float32Array([-2, 3, 2]);
      test_util.expectArraysClose(result.getValues(), expected);

      a.dispose();
      b.dispose();
    });

    it('A - B propagates NaNs', math => {
      const a = Array1D.new([2, 5, 1]);
      const b = Array1D.new([4, NaN, -1]);

      const res = math.sub(a, b).getValues();

      test_util.expectArraysClose(res, new Float32Array([-2, NaN, 2]));

      a.dispose();
      b.dispose();
    });

    it('A - B throws when passed ndarrays with different shape', math => {
      const a = Array1D.new([2, 5, 1, 5]);
      const b = Array1D.new([4, 2, -1]);

      expect(() => math.sub(a, b)).toThrowError();
      expect(() => math.sub(b, a)).toThrowError();

      a.dispose();
      b.dispose();
    });

    it('A + B', math => {
      const a = Array1D.new([2, 5, 1]);
      const b = Array1D.new([4, 2, -1]);

      const result = math.add(a, b);

      const expected = new Float32Array([6, 7, 0]);
      test_util.expectArraysClose(result.getValues(), expected);

      a.dispose();
      b.dispose();
    });

    it('A + B propagates NaNs', math => {
      const a = Array1D.new([2, 5, NaN]);
      const b = Array1D.new([4, 2, -1]);

      const res = math.add(a, b).getValues();
      test_util.expectArraysClose(res, new Float32Array([6, 7, NaN]));

      a.dispose();
      b.dispose();
    });

    it('A + B throws when passed ndarrays with different shape', math => {
      const a = Array1D.new([2, 5, 1, 5]);
      const b = Array1D.new([4, 2, -1]);

      expect(() => math.add(a, b)).toThrowError();
      expect(() => math.add(b, a)).toThrowError();

      a.dispose();
      b.dispose();
    });
  };

  test_util.describeMathCPU('element-wise add/sub', [tests]);
  test_util.describeMathGPU('element-wise add/sub', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}

// math.scaledArrayAdd
{
  const tests: MathTests = it => {
    it('Scaled ndarray add', math => {
      const a = Array2D.new([2, 3], [2, 4, 6, 8, 10, 12]);
      const b = Array2D.new([2, 3], [1, 2, 3, 4, 5, 6]);
      const c1 = Scalar.new(3);
      const c2 = Scalar.new(2);

      const expected = Array2D.new([2, 3], [8, 16, 24, 32, 40, 48]);
      expect(math.scaledArrayAdd<Array2D>(c1, a, c2, b).equals(expected))
          .toBe(true);

      // Different sizes throws an error.
      const wrongSizeMat = Array2D.new([2, 2], [1, 2, 3, 4]);
      expect(() => math.scaledArrayAdd<Array2D>(c1, wrongSizeMat, c2, b))
          .toThrowError();

      a.dispose();
      b.dispose();
      c1.dispose();
      c2.dispose();
    });

    it('throws when passed non-scalars', math => {
      const a = Array2D.new([2, 3], [2, 4, 6, 8, 10, 12]);
      const b = Array2D.new([2, 3], [1, 2, 3, 4, 5, 6]);
      // tslint:disable-next-line:no-any
      const c1: any = Array1D.randNormal([10]);
      const c2 = Scalar.new(2);

      expect(() => math.scaledArrayAdd(c1 as Scalar, a, c2, b)).toThrowError();
      expect(() => math.scaledArrayAdd(c2, a, c1 as Scalar, b)).toThrowError();

      a.dispose();
      b.dispose();
      c1.dispose();
      c2.dispose();
    });

    it('throws when NDArrays are different shape', math => {
      const a = Array2D.new([2, 3], [2, 4, 6, 8, 10, 12]);
      const b = Array2D.new([2, 4], [1, 2, 3, 4, 5, 6, 7, 8]);
      const c1 = Scalar.new(3);
      const c2 = Scalar.new(2);

      expect(() => math.scaledArrayAdd<Array2D>(c1, a, c2, b)).toThrowError();

      a.dispose();
      b.dispose();
      c1.dispose();
      c2.dispose();
    });
  };

  test_util.describeMathCPU('scaledArrayAdd', [tests]);
  test_util.describeMathGPU('scaledArrayAdd', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}