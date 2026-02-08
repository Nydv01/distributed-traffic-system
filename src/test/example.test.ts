import { describe, it, expect, vi } from "vitest";

describe("Basic Sanity Checks", () => {
  it("should confirm the test environment works", () => {
    expect(true).toBe(true);
  });

  it("should handle basic math correctly", () => {
    expect(2 + 3).toBe(5);
    expect(10 - 4).toBe(6);
  });
});

describe("Async Behavior", () => {
  it("should resolve async values", async () => {
    const asyncFn = async () => "success";
    const result = await asyncFn();

    expect(result).toBe("success");
  });

  it("should reject async errors", async () => {
    const asyncError = async () => {
      throw new Error("failure");
    };

    await expect(asyncError()).rejects.toThrow("failure");
  });
});

describe("Mocking & Spies", () => {
  it("should track function calls", () => {
    const fn = vi.fn();

    fn();
    fn("hello");

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith("hello");
  });
});

describe("Edge Cases", () => {
  it("should handle null and undefined safely", () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });

  it("should validate object structure", () => {
    const user = {
      id: 1,
      name: "Nitin",
      role: "developer",
    };

    expect(user).toMatchObject({
      name: "Nitin",
      role: "developer",
    });
  });
});
