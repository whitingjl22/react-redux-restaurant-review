import { describe, expect, it } from "vitest";
import {
  average,
  filterRestaurants,
  restaurantInput,
  reviewInput,
  seed,
} from "../src/model";
import { actions, createAppStore, loadState, STORAGE_KEY } from "../src/store";
const restaurant = {
  name: "  New place  ",
  cuisine: "Italian",
  location: "",
  description: "",
  price: 2,
};
describe("validation", () => {
  it("trims values and rejects blank restaurant names", () => {
    expect(restaurantInput.parse(restaurant).name).toBe("New place");
    expect(
      restaurantInput.safeParse({ ...restaurant, name: "   " }).success,
    ).toBe(false);
  });
  it.each([0, -1, 6, 10, 2.5, NaN])("rejects invalid rating %s", (stars) => {
    expect(
      reviewInput.safeParse({ customer: "Alex", review: "Delicious!", stars })
        .success,
    ).toBe(false);
  });
  it("requires nonblank reviewer and review", () => {
    expect(
      reviewInput.safeParse({ customer: "   ", review: "   ", stars: 5 })
        .success,
    ).toBe(false);
  });
});
describe("directory", () => {
  it("combines search, cuisine, rating, and sort without mutating data", () => {
    expect(
      filterRestaurants(seed, " TACO ", "Mexican", 5, "rating").map(
        (r) => r.id,
      ),
    ).toEqual(["2"]);
    expect(filterRestaurants(seed, "", "", 5, "name")).toHaveLength(1);
    expect(filterRestaurants(seed, "missing", "", 0, "name")).toEqual([]);
    expect(filterRestaurants(seed, "", "", 0, "rating")[0].id).toBe("2");
    expect(seed[0].id).toBe("1");
    expect(average({ ...seed[0], reviews: [] })).toBe(0);
  });
});
describe("state and persistence", () => {
  it("creates, reviews, edits, reloads, deletes, and preserves an empty collection", () => {
    localStorage.clear();
    const store = createAppStore(localStorage);
    store.dispatch(actions.addRestaurant({ id: "new", data: restaurant }));
    store.dispatch(
      actions.addReview({
        restaurantId: "new",
        id: "review",
        createdAt: "2026-01-01",
        data: { customer: "Alex", stars: 4, review: "Delicious" },
      }),
    );
    store.dispatch(
      actions.editRestaurant({
        id: "new",
        data: { ...restaurant, name: "Changed place" },
      }),
    );
    expect(
      createAppStore(localStorage)
        .getState()
        .restaurants.find((r) => r.id === "new")?.reviews,
    ).toHaveLength(1);
    for (const r of store.getState().restaurants)
      store.dispatch(actions.deleteRestaurant(r.id));
    expect(createAppStore(localStorage).getState().restaurants).toEqual([]);
  });
  it("does not delete another restaurant when the id is missing", () => {
    const store = createAppStore();
    store.dispatch(actions.deleteRestaurant("missing"));
    expect(store.getState().restaurants).toHaveLength(2);
  });
  it("blocks invalid mutations and orphan reviews", () => {
    const store = createAppStore();
    store.dispatch(
      actions.addRestaurant({ id: "x", data: { ...restaurant, name: "" } }),
    );
    store.dispatch(
      actions.addReview({
        restaurantId: "missing",
        id: "x",
        createdAt: "",
        data: { customer: "Alex", review: "Nice", stars: 5 },
      }),
    );
    expect(store.getState().restaurants).toEqual(seed);
  });
  it("keeps corrupt persisted data intact", () => {
    localStorage.setItem(STORAGE_KEY, "{bad");
    const store = createAppStore(localStorage);
    expect(store.getState().storageError).toBeTruthy();
    store.dispatch(actions.deleteRestaurant("1"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("{bad");
  });
  it("reports unavailable reads and failed writes", () => {
    expect(
      loadState({
        getItem() {
          throw new Error("denied");
        },
      }).storageError,
    ).toBeTruthy();
    const storage = {
      getItem: () => null,
      setItem() {
        throw new Error("full");
      },
    } as unknown as Storage;
    const store = createAppStore(storage);
    store.dispatch(actions.deleteRestaurant("1"));
    expect(store.getState().storageError).toContain("could not be saved");
    expect(store.getState().restaurants).toHaveLength(1);
  });
});
