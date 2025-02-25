// Slope calculation function with type checks
export function calculateSlope(
  next_length: number,
  current_length: number,
  next_height: number,
  current_height: number
): number {
  if (
    !isNaN(current_length) &&
    !isNaN(current_height) &&
    !isNaN(next_length) &&
    !isNaN(next_height)
  ) {
    const deltaY = next_height - current_height;
    const deltaX = next_length - current_length;
    const result = deltaY / deltaX;
    return parseFloat(result.toFixed(2));
  } else {
    return 0;
  }
}

// Function to calculate the high point
export function isHighPoint(a: number, b: number, c: number): boolean {
  console.log("a: ", a);
  console.log("b: ", b);
  console.log("c: ", c);
  return b > a && b > c;
}

// Function to calculate the value in the start label
export function calculateStart(
  next_length: number,
  current_length: number
): number {
  if (!isNaN(current_length) && !isNaN(next_length)) {
    return current_length;
  } else {
    return 0;
  }
}
