import React from 'react';
import * as Core from './Core';

test('isValidSizeValue', () => {
  expect(Core.isValidSizedValue({size:4, value:4})).toBe(false);
  expect(Core.isValidSizedValue({size:4, value:3})).toBe(true);
  expect(Core.isValidSizedValue({size:4, value:0})).toBe(true);
});

describe('enumerateSizedValues', () => {
  for(let size = 0; size < 256; size++) {
    test(`enumerateSizedValues({size:${size}})`, () => {
      const values = Core.enumerateSizedValues({size});
      expect(values.length).toBe(size);
      expect(values.reduce((prev, curr) =>
        prev && Core.isValidSizedValue(curr),
        true
        )).toBe(true);
  
      const valueSet = new Set();
      values.forEach((value) => valueSet.add(value.value));
      expect(valueSet.size).toBe(size);
    });
  }
})

test('sumSizeToSize', () => {
  expect(Core.sumSizeToSize({sizes:[]})).toStrictEqual({size:0});
  expect(Core.sumSizeToSize({sizes:[1,2,3,4]}))
    .toStrictEqual({size:10});
});

test('isValidSizedSumValue', () => {
  expect(Core.isValidSizedSumValue(
    {sizes:[2], sumIndex:1, sumValue: 0}))
    .toBe(false);
  expect(Core.isValidSizedSumValue(
    {sizes:[2], sumIndex:0, sumValue: 0}))
    .toBe(true);
  expect(Core.isValidSizedSumValue(
    {sizes:[2,3], sumIndex:1, sumValue: 0}))
    .toBe(true);
  expect(Core.isValidSizedSumValue(
    {sizes:[2,3], sumIndex:1, sumValue: 4}))
    .toBe(false);
});

test('sizedSumValueToSizedValue', () => {
  expect(Core.sizedSumValueToSizedValue(
    {sizes:[2], sumIndex:0, sumValue: 0})).toStrictEqual(
      {size:2, value:0}
    );
  expect(Core.sizedSumValueToSizedValue(
    {sizes:[2], sumIndex:0, sumValue: 1})).toStrictEqual(
      {size:2, value:1}
    );

  expect(Core.sizedSumValueToSizedValue(
    {sizes:[1,1,1], sumIndex:0, sumValue: 0})).toStrictEqual(
      {size:3, value:0}
    );

  expect(Core.sizedSumValueToSizedValue(
    {sizes:[2,1], sumIndex:0, sumValue: 0})).toStrictEqual(
      {size:3, value:0}
    );
  expect(Core.sizedSumValueToSizedValue(
    {sizes:[2,1], sumIndex:0, sumValue: 1})).toStrictEqual(
      {size:3, value:1}
    );
  expect(Core.sizedSumValueToSizedValue(
    {sizes:[2,1], sumIndex:1, sumValue: 0})).toStrictEqual(
      {size:3, value:2}
    );

  expect(Core.sizedSumValueToSizedValue(
    {sizes:[2,2], sumIndex:1, sumValue: 1})).toStrictEqual(
      {size:4, value:3}
    );
  expect(Core.sizedSumValueToSizedValue(
    {sizes:[2,3], sumIndex:0, sumValue: 1})).toStrictEqual(
      {size:5, value:1}
    );
  expect(Core.sizedSumValueToSizedValue(
    {sizes:[2,3], sumIndex:1, sumValue: 0})).toStrictEqual(
      {size:5, value:2}
    );
  expect(Core.sizedSumValueToSizedValue(
    {sizes:[1,1], sumIndex:0, sumValue: 0})).toStrictEqual(
      {size:2, value:0}
    );
  expect(Core.sizedSumValueToSizedValue(
    {sizes:[1,1], sumIndex:1, sumValue: 0})).toStrictEqual(
      {size:2, value:1}
    );
});

test('enumerateSumValues', () => {
  const sumSize = {sizes:[1,2,3,4]};
  const sumValues = Core.enumerateSumValues(sumSize);
  const size = Core.sumSizeToSize(sumSize);
  expect(sumValues.length).toBe(size.size);

  const values = sumValues.map((sumValue) =>
    Core.sizedSumValueToSizedValue({...sumSize,...sumValue}));
  const valueSet = new Set();
  values.forEach((value) => valueSet.add(value.value));
  expect(valueSet.size).toBe(size.size);
});

test('trySizedValueToSumValue', () => {
  expect(Core.trySizedValueToSumValue(
    {size:10, value:9},
    {sizes:[1,2,3]}
  )).toHaveProperty("status", "failure");

  expect(Core.trySizedValueToSumValue(
    {size:2, value:0},
    {sizes:[1,1]}
  )).toStrictEqual(
    Core.makeSuccess({
      sumIndex: 0,
      sumValue: 0
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:2, value:1},
    {sizes:[1,1]}
  )).toStrictEqual(
    Core.makeSuccess({
      sumIndex: 1,
      sumValue: 0
    })
  );

  expect(Core.trySizedValueToSumValue(
    {size:5, value:0},
    {sizes:[2,3]}
  )).toStrictEqual(
    Core.makeSuccess({
      sumIndex: 0,
      sumValue: 0
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:5, value:1},
    {sizes:[2,3]}
  )).toStrictEqual(
    Core.makeSuccess({
      sumIndex: 0,
      sumValue: 1
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:5, value:2},
    {sizes:[2,3]}
  )).toStrictEqual(
    Core.makeSuccess({
      sumIndex: 1,
      sumValue: 0
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:5, value:3},
    {sizes:[2,3]}
  )).toStrictEqual(
    Core.makeSuccess({
      sumIndex: 1,
      sumValue: 1
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:5, value:4},
    {sizes:[2,3]}
  )).toStrictEqual(
    Core.makeSuccess({
      sumIndex: 1,
      sumValue: 2
    })
  );
});

test('productSizeToSize', () => {
  expect(Core.productSizeToSize({sizes:[]})).toStrictEqual({size:1});
  expect(Core.productSizeToSize({sizes:[1,2,3,4]}))
    .toStrictEqual({size:24});
});

test('trySizedValueToProductValue', () => {
  expect(Core.trySizedValueToProductValue(
    {size:7, value:0},
    {sizes:[1,2,3]}
  )).toHaveProperty("status", "failure");

  expect(Core.trySizedValueToProductValue(
    {size:4, value:0},
    {sizes:[2,2]}
  )).toStrictEqual(Core.makeSuccess({values:[0,0]}));
  expect(Core.trySizedValueToProductValue(
    {size:4, value:1},
    {sizes:[2,2]}
  )).toStrictEqual(Core.makeSuccess({values:[1,0]}));
  expect(Core.trySizedValueToProductValue(
    {size:4, value:2},
    {sizes:[2,2]}
  )).toStrictEqual(Core.makeSuccess({values:[0,1]}));
  expect(Core.trySizedValueToProductValue(
    {size:4, value:3},
    {sizes:[2,2]}
  )).toStrictEqual(Core.makeSuccess({values:[1,1]}));
});

test('isValidSizedArrayValue', () => {
  expect(Core.isValidSizedArrayValue(
    {elementSize:4, elementValues:[4]})).toBe(false);
  expect(Core.isValidSizedArrayValue(
    {elementSize:4, elementValues:[0,1,2,3]})).toBe(true);
});

test('arraySizeToSize', () => {
  expect(Core.arraySizeToSize({elementCount:8, elementSize: 2}))
    .toStrictEqual({size: 256});
});

test('arraySizeToProductSize', () => {
  expect(Core.arraySizeToProductSize({elementCount:3, elementSize: 2}))
    .toStrictEqual({sizes: [2,2,2]});
});

test('sizedArrayValueToSizedProductValue', () => {
  expect(Core.sizedArrayValueToSizedProductValue(
      {elementSize: 2, elementValues: [0,1,1,1]})
    ).toStrictEqual({
      sizes: [2,2,2,2],
      values: [0,1,1,1]
    });
});
