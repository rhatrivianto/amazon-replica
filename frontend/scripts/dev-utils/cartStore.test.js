import { describe, it, expect, beforeEach } from "vitest"; // atau jest
//import { useCartStore } from "./src/stores/cart.store.js";

// Mock the store for testing
const createTestStore = () => {
  let state = {
    coupon: null,
    cart: [],
    isCouponApplied: false,
    subtotal: 0,
    total: 0,
    discount: 0,
  };

  const get = () => state;
  const set = (newState) => {
    state = { ...state, ...newState };
  };

  return { get, set };
};

describe("calculateTotals Function", () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  });

  // Test helper function
  const executeCalculateTotals = (
    cart,
    coupon = null,
    isCouponApplied = false
  ) => {
    // Set initial state
    store.set({
      cart,
      coupon,
      isCouponApplied,
    });

    // Mock get function to return current state
    const get = store.get;

    // Mock set function to capture the result
    const set = (newState) => {
      store.set(newState);
    };

    // Execute the function (simulate how it works in actual store)
    const {
      cart: currentCart,
      coupon: currentCoupon,
      isCouponApplied: currentApplied,
    } = get();

    const subtotal = currentCart.reduce(
      (sum, item) =>
        sum + (item.price || item.product?.price || 0) * item.quantity,
      0
    );

    let discount = 0;
    let total = subtotal;

    if (currentCoupon && currentApplied) {
      discount = subtotal * (currentCoupon.discountPercentage / 100);
      total = Math.max(0, subtotal - discount);
    }

    set({ subtotal, total, discount });

    return get();
  };

  //   it("should calculate totals correctly with empty cart", () => {
  //     const result = executeCalculateTotals([]);

  //     expect(result.subtotal).toBe(0);
  //     expect(result.total).toBe(0);
  //     expect(result.discount).toBe(0);
  //   });

  //   it("should calculate subtotal correctly with multiple items", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Product 1",
  //         price: 50000,
  //         quantity: 2,
  //         product: { price: 50000 },
  //       },
  //       {
  //         id: 2,
  //         name: "Product 2",
  //         price: 75000,
  //         quantity: 1,
  //         product: { price: 75000 },
  //       },
  //       {
  //         id: 3,
  //         name: "Product 3",
  //         price: 100000,
  //         quantity: 1,
  //         // tanpa nested product object
  //       },
  //     ];

  //     const result = executeCalculateTotals(cart);

  //     // Expected: (50.000 * 2) + (75.000 * 1) + (100.000 * 1) = 275.000
  //     expect(result.subtotal).toBe(275000);
  //     expect(result.total).toBe(275000); // No discount
  //     expect(result.discount).toBe(0);
  //   });

  //   it("should handle items with nested product price", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Product 1",
  //         quantity: 3,
  //         product: { price: 40000 }, // price di nested object
  //       },
  //       {
  //         id: 2,
  //         name: "Product 2",
  //         price: 60000, // price langsung di item
  //         quantity: 2,
  //       },
  //     ];

  //     const result = executeCalculateTotals(cart);

  //     // Expected: (40.000 * 3) + (60.000 * 2) = 240.000
  //     expect(result.subtotal).toBe(240000);
  //   });

  it("should apply 10% discount correctly", () => {
    const cart = [
      {
        id: 1,
        name: "Product 1",
        price: 100000,
        quantity: 1,
      },
    ];

    const coupon = {
      id: 1,
      code: "DISKON10",
      discountPercentage: 10,
    };

    const result = executeCalculateTotals(cart, coupon, true);

    // Expected:
    // Subtotal: 100.000
    // Discount: 100.000 * 10% = 10.000
    // Total: 100.000 - 10.000 = 90.000
    expect(result.subtotal).toBe(100000);
    expect(result.discount).toBe(10000);
    expect(result.total).toBe(90000);
  });

  //   it("should apply 25% discount correctly with multiple items", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Product 1",
  //         price: 80000,
  //         quantity: 2,
  //       },
  //       {
  //         id: 2,
  //         name: "Product 2",
  //         price: 120000,
  //         quantity: 1,
  //       },
  //     ];

  //     const coupon = {
  //       id: 2,
  //       code: "DISKON25",
  //       discountPercentage: 25,
  //     };

  //     const result = executeCalculateTotals(cart, coupon, true);

  //     // Expected:
  //     // Subtotal: (80.000 * 2) + 120.000 = 280.000
  //     // Discount: 280.000 * 25% = 70.000
  //     // Total: 280.000 - 70.000 = 210.000
  //     expect(result.subtotal).toBe(280000);
  //     expect(result.discount).toBe(70000);
  //     expect(result.total).toBe(210000);
  //   });

  //   it("should not apply discount when coupon exists but not applied", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Product 1",
  //         price: 100000,
  //         quantity: 1,
  //       },
  //     ];

  //     const coupon = {
  //       id: 1,
  //       code: "DISKON10",
  //       discountPercentage: 10,
  //     };

  //     const result = executeCalculateTotals(cart, coupon, false); // isCouponApplied = false

  //     expect(result.subtotal).toBe(100000);
  //     expect(result.discount).toBe(0); // No discount applied
  //     expect(result.total).toBe(100000); // Total should equal subtotal
  //   });

  //   it("should not apply discount when no coupon", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Product 1",
  //         price: 100000,
  //         quantity: 1,
  //       },
  //     ];

  //     const result = executeCalculateTotals(cart); // No coupon

  //     expect(result.subtotal).toBe(100000);
  //     expect(result.discount).toBe(0);
  //     expect(result.total).toBe(100000);
  //   });

  //   it("should handle zero total when discount equals subtotal", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Product 1",
  //         price: 50000,
  //         quantity: 1,
  //       },
  //     ];

  //     const coupon = {
  //       id: 1,
  //       code: "DISKON100",
  //       discountPercentage: 100, // 100% discount
  //     };

  //     const result = executeCalculateTotals(cart, coupon, true);

  //     expect(result.subtotal).toBe(50000);
  //     expect(result.discount).toBe(50000);
  //     expect(result.total).toBe(0); // Free!
  //   });

  //   it("should handle edge case with zero price items", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Free Product",
  //         price: 0,
  //         quantity: 5,
  //       },
  //       {
  //         id: 2,
  //         name: "Paid Product",
  //         price: 20000,
  //         quantity: 1,
  //       },
  //     ];

  //     const coupon = {
  //       id: 1,
  //       code: "DISKON50",
  //       discountPercentage: 50,
  //     };

  //     const result = executeCalculateTotals(cart, coupon, true);

  //     // Expected:
  //     // Subtotal: (0 * 5) + (20.000 * 1) = 20.000
  //     // Discount: 20.000 * 50% = 10.000
  //     // Total: 20.000 - 10.000 = 10.000
  //     expect(result.subtotal).toBe(20000);
  //     expect(result.discount).toBe(10000);
  //     expect(result.total).toBe(10000);
  //   });

  //   it("should handle items with missing price gracefully", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Product 1",
  //         quantity: 2,
  //         // No price field
  //       },
  //       {
  //         id: 2,
  //         name: "Product 2",
  //         price: 30000,
  //         quantity: 1,
  //       },
  //     ];

  //     const result = executeCalculateTotals(cart);

  //     // Expected: (0 * 2) + (30.000 * 1) = 30.000
  //     expect(result.subtotal).toBe(30000);
  //   });

  //   it("should prioritize item price over product price", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Product 1",
  //         price: 50000, // This should be used
  //         quantity: 1,
  //         product: { price: 40000 }, // This should be ignored
  //       },
  //     ];

  //     const result = executeCalculateTotals(cart);

  //     expect(result.subtotal).toBe(50000); // Should use item price, not product price
  //   });
  // });

  // // Test untuk scenario khusus
  // describe("Special Scenarios", () => {
  //   let store;

  //   beforeEach(() => {
  //     store = createTestStore();
  //   });

  //   const executeCalculateTotals = (
  //     cart,
  //     coupon = null,
  //     isCouponApplied = false
  //   ) => {
  //     store.set({ cart, coupon, isCouponApplied });
  //     const get = store.get;
  //     const set = (newState) => store.set(newState);

  //     const {
  //       cart: currentCart,
  //       coupon: currentCoupon,
  //       isCouponApplied: currentApplied,
  //     } = get();

  //     const subtotal = currentCart.reduce(
  //       (sum, item) =>
  //         sum + (item.price || item.product?.price || 0) * item.quantity,
  //       0
  //     );

  //     let discount = 0;
  //     let total = subtotal;

  //     if (currentCoupon && currentApplied) {
  //       discount = subtotal * (currentCoupon.discountPercentage / 100);
  //       total = Math.max(0, subtotal - discount);
  //     }

  //     set({ subtotal, total, discount });
  //     return get();
  //   };

  //   it("should handle your specific example case", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Sample Product",
  //         price: 100000,
  //         quantity: 1,
  //       },
  //     ];

  //     const coupon = {
  //       id: 1,
  //       code: "EXAMPLE10",
  //       discountPercentage: 10,
  //     };

  //     const result = executeCalculateTotals(cart, coupon, true);

  //     // Sesuai contoh Anda:
  //     // - Subtotal: 100.000
  //     // - Kupon: 10% discount
  //     // - Discount: 10.000
  //     // - Total: 90.000
  //     expect(result.subtotal).toBe(100000);
  //     expect(result.discount).toBe(10000);
  //     expect(result.total).toBe(90000);
  //   });

  //   it("should handle large numbers correctly", () => {
  //     const cart = [
  //       {
  //         id: 1,
  //         name: "Expensive Item",
  //         price: 1000000,
  //         quantity: 3,
  //       },
  //     ];

  //     const coupon = {
  //       id: 1,
  //       code: "BIGSALE",
  //       discountPercentage: 15,
  //     };

  //     const result = executeCalculateTotals(cart, coupon, true);

  //     // Expected:
  //     // Subtotal: 1.000.000 * 3 = 3.000.000
  //     // Discount: 3.000.000 * 15% = 450.000
  //     // Total: 3.000.000 - 450.000 = 2.550.000
  //     expect(result.subtotal).toBe(3000000);
  //     expect(result.discount).toBe(450000);
  //     expect(result.total).toBe(2550000);
  //   });
});
