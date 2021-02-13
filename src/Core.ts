// How many possible values are there?
export interface Size {
  size: number;
}

export function isSizeEqual(left: Size, right: Size): boolean {
  return left.size == right.size;
}

export interface Value {
  value: number;
}

// A value for a given size.
// 0 >= value < size
export interface SizedValue extends Size, Value {}

// Check that the value is between zero and less than size.
export function isValidSizedValue(value : SizedValue): boolean {
  return value.value >= 0 && value.value < value.size;
}

export function enumerateSizedValues(size: Size):SizedValue[] {
  const results = Array(size.size);
  for (let value = 0; value < size.size; value++) {
    results[value] = {...size, value};
  }
  return results;
}

export interface SumSize {
  sizes: number[];
}

export interface SumValue {
  sumIndex: number,
  sumValue: number
}

export interface SizedSumValue extends SumSize, SumValue {}

export function sumSizeToSize(sumSize : SumSize): Size {
  const size = sumSize.sizes
      .reduce(
        (total, current) => total + current,
        0
      );
  return { size };
}

export function isValidSizedSumValue(value : SizedSumValue): boolean {
  return value.sumIndex >= 0 &&
    value.sumIndex < value.sizes.length &&
    isValidSizedValue({
      size: value.sizes[value.sumIndex],
      value: value.sumValue
    });
}

export function sizedSumValueToSizedValue(sumValue : SizedSumValue): SizedValue {
  const previousSizeSum =
    sumValue.sizes
      .slice(0, sumValue.sumIndex)
      .reduce((result, value) => result + value, 0);
  return {
    ...sumSizeToSize(sumValue),
    value: previousSizeSum + sumValue.sumValue
  };
}

export function enumerateSumValues(sumSize: SumSize): SumValue[] {
  const results: SumValue[] = [];
  sumSize.sizes.reduce(
    ({previousSizeTotal, currentIndex}, size) => {
      const localValues = enumerateSizedValues({size});
      localValues.forEach((value, valueIndex) => {
        const totalIndex = previousSizeTotal + valueIndex;
        results.push({
          sumIndex: currentIndex,
          sumValue: value.value
        });
      });
      return {
        previousSizeTotal: previousSizeTotal + size,
        currentIndex: currentIndex + 1
      };
    }, {previousSizeTotal: 0, currentIndex: 0});
  return results;
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
    return makeFailure("size mismatch",
      {expectedSize, sizedValue});
  }

  let runningTotalSize: number = 0;
  const sumIndex = sumSize.sizes.findIndex(
    (size) => {
      if (sizedValue.value < size + runningTotalSize) {
        return true;
      } else {
        runningTotalSize += size;
        return false;
      }
    }
  );
  if (sumIndex < 0) {
    return makeFailure("no suitable size found",
      {runningTotalSize, sumIndex});
  }
  const localSize = sumSize.sizes[sumIndex];
  if (sizedValue.value >= runningTotalSize + localSize) {
    return makeFailure("sumIndex is positive but value is greater than expected size",
      {runningTotalSize, sizedValue, sumIndex}
    );
  }
  const sumValue = sizedValue.value - runningTotalSize;
  return makeSuccess({
      sumIndex,
      sumValue
    }
  );
}

export interface ProductSize {
  sizes: number[];
}

export interface ProductValue {
  values: number[];
}

export interface SizedProductValue extends ProductSize, ProductValue {}

export function productSizeToSize(productSize : ProductSize): Size {
  const size = productSize.sizes
      .reduce(
        (total, current) => total * current,
        1
      );
  return { size };
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
  const values: number[] = [];
  productSize.sizes.reduce(
    ((previousValue: number, current: number) => {
      values.push(previousValue % current)
      return Math.floor(previousValue / current);
    }),
    sizedValue.value
  );
  return makeSuccess({
    values
  });
}

export interface ArraySize {
  elementCount: number;
  elementSize: number;
}

export interface ArrayValue {
  elementValues: number[];
}

// we only need the size, since elementCount is redundant with elementValues.length
export interface SizedArrayValue extends ArrayValue {
  elementSize: number
}

export function isValidSizedArrayValue({elementSize, elementValues} : SizedArrayValue): boolean {
  return elementValues.reduce((combined:boolean, current) =>
    combined && current >= 0 && current < elementSize, true);
}

export function sizedArrayValueToArraySize({elementSize, elementValues} : SizedArrayValue): ArraySize {
  return {
    elementSize,
    elementCount: elementValues.length
  }
}

export function arraySizeToSize({elementCount, elementSize} : ArraySize): Size {
  const size = elementSize ** elementCount;
  return { size };
}

export function arraySizeToProductSize({elementCount, elementSize} : ArraySize): ProductSize {
  let sizes = Array(elementCount);
  sizes.fill(elementSize);
  return { sizes };
}

export function sizedArrayValueToSizedProductValue({elementSize, elementValues} : SizedArrayValue) : SizedProductValue {
  const sizes = elementValues.map((value) => elementSize);
  return {
    sizes,
    values: elementValues
  };
}
