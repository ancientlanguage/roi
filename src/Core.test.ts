import React from 'react';
import * as Core from './Core';

function makeSizes(numberSizes:number[]): Core.Size[] {
  return numberSizes.map((x) => ({size:x}));
}

test('isValidSizeValue', () => {
  expect(Core.isValidSizedValue({size:4, value:4})).toBe(false);
  expect(Core.isValidSizedValue({size:4, value:3})).toBe(true);
  expect(Core.isValidSizedValue({size:4, value:0})).toBe(true);
});

test('sumSizeToSize', () => {
  expect(Core.sumSizeToSize({sizes:[]})).toStrictEqual({size:0});
  expect(Core.sumSizeToSize({sizes:makeSizes([1,2,3,4])}))
    .toStrictEqual({size:10});
});

test('isValidSumValue', () => {
  expect(Core.isValidSumValue(
    {sizes:makeSizes([2]), sumIndex:1, sumValue: 0}))
    .toBe(false);
  expect(Core.isValidSumValue(
    {sizes:makeSizes([2]), sumIndex:0, sumValue: 0}))
    .toBe(true);
  expect(Core.isValidSumValue(
    {sizes:makeSizes([2,3]), sumIndex:1, sumValue: 0}))
    .toBe(true);
  expect(Core.isValidSumValue(
    {sizes:makeSizes([2,3]), sumIndex:1, sumValue: 4}))
    .toBe(false);
});

test('sumValueToSizedValue', () => {
  expect(Core.sumValueToSizedValue(
    {sizes:makeSizes([2]), sumIndex:0, sumValue: 0})).toStrictEqual(
      {size:2, value:0}
    );
  expect(Core.sumValueToSizedValue(
    {sizes:makeSizes([2]), sumIndex:0, sumValue: 1})).toStrictEqual(
      {size:2, value:1}
    );
  expect(Core.sumValueToSizedValue(
    {sizes:makeSizes([2,1]), sumIndex:1, sumValue: 0})).toStrictEqual(
      {size:3, value:2}
    );
  expect(Core.sumValueToSizedValue(
    {sizes:makeSizes([2,2]), sumIndex:1, sumValue: 1})).toStrictEqual(
      {size:4, value:3}
    );
  expect(Core.sumValueToSizedValue(
    {sizes:makeSizes([2,3]), sumIndex:0, sumValue: 1})).toStrictEqual(
      {size:5, value:1}
    );
  expect(Core.sumValueToSizedValue(
    {sizes:makeSizes([2,3]), sumIndex:1, sumValue: 0})).toStrictEqual(
      {size:5, value:2}
    );
  expect(Core.sumValueToSizedValue(
    {sizes:makeSizes([1,1]), sumIndex:0, sumValue: 0})).toStrictEqual(
      {size:2, value:0}
    );
  expect(Core.sumValueToSizedValue(
    {sizes:makeSizes([1,1]), sumIndex:1, sumValue: 0})).toStrictEqual(
      {size:2, value:1}
    );
});

test('trySizedValueToSumValue', () => {
  expect(Core.trySizedValueToSumValue(
    {size:10, value:9},
    {sizes:makeSizes([1,2,3])}
  )).toHaveProperty("status", "failure");

  expect(Core.trySizedValueToSumValue(
    {size:2, value:0},
    {sizes:makeSizes([1,1])}
  )).toStrictEqual(
    Core.makeSuccess({ sizes:makeSizes([1,1]),
      sumIndex: 0,
      sumValue: 0
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:2, value:1},
    {sizes:makeSizes([1,1])}
  )).toStrictEqual(
    Core.makeSuccess({ sizes:makeSizes([1,1]),
      sumIndex: 1,
      sumValue: 0
    })
  );

  expect(Core.trySizedValueToSumValue(
    {size:5, value:0},
    {sizes:makeSizes([2,3])}
  )).toStrictEqual(
    Core.makeSuccess({ sizes:makeSizes([2,3]),
      sumIndex: 0,
      sumValue: 0
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:5, value:1},
    {sizes:makeSizes([2,3])}
  )).toStrictEqual(
    Core.makeSuccess({ sizes:makeSizes([2,3]),
      sumIndex: 0,
      sumValue: 1
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:5, value:2},
    {sizes:makeSizes([2,3])}
  )).toStrictEqual(
    Core.makeSuccess({ sizes:makeSizes([2,3]),
      sumIndex: 1,
      sumValue: 0
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:5, value:3},
    {sizes:makeSizes([2,3])}
  )).toStrictEqual(
    Core.makeSuccess({ sizes:makeSizes([2,3]),
      sumIndex: 1,
      sumValue: 1
    })
  );
  expect(Core.trySizedValueToSumValue(
    {size:5, value:4},
    {sizes:makeSizes([2,3])}
  )).toStrictEqual(
    Core.makeSuccess({ sizes:makeSizes([2,3]),
      sumIndex: 1,
      sumValue: 2
    })
  );
});

test('productSizeToSize', () => {
  expect(Core.productSizeToSize({sizes:[]})).toStrictEqual({size:1});
  expect(Core.productSizeToSize({sizes:makeSizes([1,2,3,4])}))
    .toStrictEqual({size:24});
});

test('trySizedValueToProductValue', () => {
  expect(Core.trySizedValueToProductValue(
    {size:7, value:0},
    {sizes:makeSizes([1,2,3])}
  )).toHaveProperty("status", "failure");

  expect(Core.trySizedValueToProductValue(
    {size:4, value:0},
    {sizes:makeSizes([2,2])}
  )).toStrictEqual(Core.makeSuccess(
    { values:
      [ {size:2,value:0}
      , {size:2,value:0}
      ]
    }
  ));
  expect(Core.trySizedValueToProductValue(
    {size:4, value:1},
    {sizes:makeSizes([2,2])}
  )).toStrictEqual(Core.makeSuccess(
    { values:
      [ {size:2,value:1}
      , {size:2,value:0}
      ]
    }
  ));
  expect(Core.trySizedValueToProductValue(
    {size:4, value:2},
    {sizes:makeSizes([2,2])}
  )).toStrictEqual(Core.makeSuccess(
    { values:
      [ {size:2,value:0}
      , {size:2,value:1}
      ]
    }
  ));
  expect(Core.trySizedValueToProductValue(
    {size:4, value:3},
    {sizes:makeSizes([2,2])}
  )).toStrictEqual(Core.makeSuccess(
    { values:
      [ {size:2,value:1}
      , {size:2,value:1}
      ]
    }
  ));
});

test('isValidArrayValue', () => {
  expect(Core.isValidArrayValue(
    {elementSize:4, elementValues:[4]})).toBe(false);
  expect(Core.isValidArrayValue(
    {elementSize:4, elementValues:[0,1,2,3]})).toBe(true);
});

test('arraySizeToSize', () => {
  expect(Core.arraySizeToSize({elementCount:8, elementSize: 2}))
    .toStrictEqual({size: 256});
});

test('arraySizeToProductSize', () => {
  expect(Core.arraySizeToProductSize({elementCount:3, elementSize: 2}))
    .toStrictEqual({sizes: makeSizes([2,2,2])});
});

test('arrayValueToProductValue', () => {
  expect(Core.arrayValueToProductValue({elementSize: 2, elementValues: [0,1,1,1]}))
    .toStrictEqual({values:[
      {size:2,value:0},
      {size:2,value:1},
      {size:2,value:1},
      {size:2,value:1},
    ]});
});
