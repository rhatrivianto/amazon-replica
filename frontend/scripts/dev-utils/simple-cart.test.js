// simple-cart.test.js
import { describe, it, expect } from "vitest";

// Simulasikan fungsi calculateTotals
const calculateTotals = (cart, coupon = null, isCouponApplied = false) => {
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.price || item.product?.price || 0) * item.quantity,
    0
  );

  let discount = 0;
  let total = subtotal;

  if (coupon && isCouponApplied) {
    discount = subtotal * (coupon.discountPercentage / 100);
    total = Math.max(0, subtotal - discount);
  }

  return { subtotal, total, discount };
};

describe("Simple calculateTotals Test", () => {
  it("should work with your example", () => {
    const cart = [{ price: 90000, quantity: 1 }];
    const coupon = { discountPercentage: 10 };

    const result = calculateTotals(cart, coupon, true);

    expect(result.subtotal).toBe(90000);
    expect(result.discount).toBe(9000);
    expect(result.total).toBe(81000);
  });
});

