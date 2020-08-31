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
    ...sumSizeToSize(sumValue),
    value: sumValue.sizes.slice(0, sumValue.sumIndex).reduce((r,v) => r + v.size, 0)
      + sumValue.sumValue
  };
}

export type TryResultStatus = "success" | "failure";

export interface TryError {
  message: string,
  data: object
}

export interface TryResult<A> {
  status: TryResultStatus;
  error?: TryError;
  result?: A;
}

export function makeFailure<A>(message: string, data: object): TryResult<A> {
  return {
    status: "failure",
    error: {
      message,
      data
    }
  }
}

export function makeSuccess<A>(result: A): TryResult<A> {
  return {
    status: "success",
    result
  }
}

export function trySizedValueToSumValue(
  sizedValue: SizedValue,
  sumSize: SumSize
): TryResult<SumValue> {
  const expectedSize = sumSizeToSize(sumSize);
  if (!isSizeEqual(sizedValue, expectedSize)) {
    return makeFailure("size mismatch", {expectedSize, sizedValue}
    );
  }

  let runningTotalSize: number = 0;
  const sumIndex = sumSize.sizes.findIndex(
    (size) => {
      if (sizedValue.value < size.size + runningTotalSize) {
        return true;
      } else {
        runningTotalSize += size.size;
        return false;
      }
    }
  );
  if (sumIndex < 0) {
    return makeFailure("no suitable size found", {runningTotalSize, sumIndex});
  }
  const localSize = sumSize.sizes[sumIndex];
  if (sizedValue.value >= runningTotalSize + localSize.size) {
    return makeFailure("sumIndex is positive but value is greater than expected size",
      {runningTotalSize, sizedValue, sumIndex}
    );
  }
  const sumValue = sizedValue.value - runningTotalSize;
  return makeSuccess({
      ...sumSize,
      sumIndex,
      sumValue
    }
  );
}

export interface ProductSize {
  sizes: Size[];
}

export function productSizeToSize(productSize : ProductSize): Size {
  const size = productSize.sizes
      .reduce(
        (total, current) => total * current.size,
        1
      );
  return { size };
}

export interface ProductValue {
  values: SizedValue[];
}

export function trySizedValueToProductValue(
  sizedValue: SizedValue,
  productSize: ProductSize
): TryResult<ProductValue> {
  const expectedSize = productSizeToSize(productSize);
  if (!isSizeEqual(sizedValue, expectedSize)) {
    return makeFailure("sizes do not match",
      {sizedValue, expectedSize}
    );
  }
  const values: SizedValue[] = [];
  productSize.sizes.reduce(
    ((previousValue: number, current: Size) => {
      values.push({
        ...current,
        value: previousValue % current.size
      })
      return Math.floor(previousValue / current.size);
    }),
    sizedValue.value
  );
  return makeSuccess({
    values
  });
}
