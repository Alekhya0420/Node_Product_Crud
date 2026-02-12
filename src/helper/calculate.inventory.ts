export function calculateStatus(quantity: number, minThreshold: number) {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= minThreshold) return "low_stock";
  return "in_stock";
}
