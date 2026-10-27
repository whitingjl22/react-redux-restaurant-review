import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import {
  restaurantSchema,
  restaurantInput,
  reviewInput,
  seed,
  type Restaurant,
  type RestaurantInput,
  type ReviewInput,
} from "./model";

export const STORAGE_KEY = "lets-eat:v1";
const savedSchema = z.object({
  version: z.literal(1),
  restaurants: z.array(restaurantSchema),
});
export type AppState = {
  restaurants: Restaurant[];
  storageError: string | null;
};
export function loadState(storage?: Pick<Storage, "getItem">): AppState {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (raw)
      return {
        restaurants: savedSchema.parse(JSON.parse(raw)).restaurants,
        storageError: null,
      };
    return { restaurants: seed, storageError: null };
  } catch {
    return {
      restaurants: seed,
      storageError:
        "Saved data could not be read. Showing demo data; changes will not be saved until storage is available and the saved data is repaired or removed.",
    };
  }
}
const slice = createSlice({
  name: "directory",
  initialState: { restaurants: seed, storageError: null } as AppState,
  reducers: {
    addRestaurant(
      state,
      action: PayloadAction<{ id: string; data: RestaurantInput }>,
    ) {
      const data = restaurantInput.safeParse(action.payload.data);
      if (
        data.success &&
        !state.restaurants.some((r) => r.id === action.payload.id)
      )
        state.restaurants.push({
          ...data.data,
          id: action.payload.id,
          reviews: [],
        });
    },
    editRestaurant(
      state,
      action: PayloadAction<{ id: string; data: RestaurantInput }>,
    ) {
      const r = state.restaurants.find((r) => r.id === action.payload.id);
      const data = restaurantInput.safeParse(action.payload.data);
      if (r && data.success) Object.assign(r, data.data);
    },
    deleteRestaurant(state, action: PayloadAction<string>) {
      state.restaurants = state.restaurants.filter(
        (r) => r.id !== action.payload,
      );
    },
    addReview(
      state,
      action: PayloadAction<{
        restaurantId: string;
        id: string;
        createdAt: string;
        data: ReviewInput;
      }>,
    ) {
      const r = state.restaurants.find(
        (r) => r.id === action.payload.restaurantId,
      );
      const data = reviewInput.safeParse(action.payload.data);
      if (
        r &&
        data.success &&
        !r.reviews.some((v) => v.id === action.payload.id)
      )
        r.reviews.push({
          ...data.data,
          id: action.payload.id,
          createdAt: action.payload.createdAt,
        });
    },
    storageFailed(state) {
      state.storageError =
        "Your changes are available in this tab but could not be saved. Browser storage may be full or disabled.";
    },
  },
});
export const actions = slice.actions;
export const reducer = slice.reducer;
export function createAppStore(storage?: Storage) {
  const initial = loadState(storage);
  const store = configureStore({ reducer, preloadedState: initial });
  let previous = store.getState().restaurants;
  // Never overwrite unreadable saved data with the fallback seed.
  if (storage && !initial.storageError)
    store.subscribe(() => {
      const restaurants = store.getState().restaurants;
      if (previous === restaurants) return;
      previous = restaurants;
      try {
        storage.setItem(
          STORAGE_KEY,
          JSON.stringify({ version: 1, restaurants }),
        );
      } catch {
        store.dispatch(actions.storageFailed());
      }
    });
  return store;
}
export type AppStore = ReturnType<typeof createAppStore>;
export const useAppDispatch = useDispatch.withTypes<AppStore["dispatch"]>();
export const useAppSelector = useSelector.withTypes<AppState>();
