// How many possible values are there?
export interface Size {
  size: number;
}

export function isSizeEqual(left: Size, right: Size): boolean {
  return left.size == right.size;
}

// A natural number, zero or more.
export interface UnsizedValue {
  value: number;
}

// A value for a given size.
// 0 >= value < size
export interface SizedValue extends Size, UnsizedValue {}

// Check that the value is between zero and less than size.
export function isValidSizedValue(value : SizedValue): boolean {
  return value.value >= 0 && value.value < value.size;
}

export interface SumSize {
  sizes: Size[];
}

export function sumSizeToSize(sumSize : SumSize): Size {
  const totalSize = sumSize.sizes
      .reduce(
        (total, current) => total + current.size,
        0
      );
  return { size: totalSize };
}

export interface SumValue extends SumSize {
  sumIndex: number,
  sumValue: number
}

export function isValidSumValue(sumValue : SumValue): boolean {
  return sumValue.sumIndex >= 0 &&
    sumValue.sumIndex < sumValue.sizes.length &&
    isValidSizedValue({
      size: sumValue.sizes[sumValue.sumIndex].size,
      value: sumValue.sumValue
    });
}

export function sumValueToSizedValue(sumValue : SumValue): SizedValue {
  return {
    size: sumSizeToSize(sumValue).size,
    value: sumValue.sizes.slice(0, sumValue.sumIndex).reduce((r,v) => r + v.size, 0)
      + sumValue.sumValue
  };
}

export function trySizedValueToSumValue(
  sizedValue: SizedValue,
  sumSize: SumSize
): SumValue | null {
  const expectedSize = sumSizeToSize(sumSize);
  if (isSizeEqual(sizedValue, expectedSize)) {
    return {
      sizes: sumSize.sizes,
      value: sizedValue.value
    };
  }
  return null;
}

export interface ProductSize {
  sizes: Size[];
}

export function productSizeToSize(productSize : ProductSize): Size {
  const totalSize = productSize.sizes
      .reduce(
        (total, current) => total * current.size,
        1
      );
  return { size: totalSize };
}

export interface ProductValue {
  values: SizedValue[];
}

export function trySizedValueToProductValue(
  sizedValue: SizedValue,
  productSize: ProductSize
): ProductValue | null {
  const expectedSize = productSizeToSize(productSize);
  if (isSizeEqual(sizedValue, expectedSize)) {
    const buildValues: SizedValue[] = [];
    productSize.sizes.reduce(
      ((previousValue: number,
        current: Size) => {
        buildValues.push({
          size: current.size,
          value: previousValue % current.size
        })
        return Math.floor(previousValue / current.size);
      }),
      sizedValue.value
    );
    return {
      values: buildValues
    };
  }
  return null;
}
