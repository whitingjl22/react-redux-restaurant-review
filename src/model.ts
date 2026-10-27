import { z } from "zod";

export const restaurantInput = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters.")
    .max(80, "Use 80 characters or fewer."),
  cuisine: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters.")
    .max(40, "Use 40 characters or fewer."),
  location: z.string().trim().max(100, "Use 100 characters or fewer."),
  description: z.string().trim().max(500, "Use 500 characters or fewer."),
  price: z.number().int().min(1).max(4),
});
export const reviewInput = z.object({
  customer: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters.")
    .max(60, "Use 60 characters or fewer."),
  stars: z
    .number()
    .int()
    .min(1, "Choose a rating from 1 to 5.")
    .max(5, "Choose a rating from 1 to 5."),
  review: z
    .string()
    .trim()
    .min(3, "Tell us a little more (at least 3 characters).")
    .max(2000, "Use 2,000 characters or fewer."),
});
export const reviewSchema = reviewInput.extend({
  id: z.string(),
  createdAt: z.string(),
});
export const restaurantSchema = restaurantInput.extend({
  id: z.string(),
  reviews: z.array(reviewSchema),
});
export type RestaurantInput = z.infer<typeof restaurantInput>;
export type ReviewInput = z.infer<typeof reviewInput>;
export type Restaurant = z.infer<typeof restaurantSchema>;
export const average = (r: Restaurant) =>
  r.reviews.length
    ? r.reviews.reduce((sum, v) => sum + v.stars, 0) / r.reviews.length
    : 0;
export function filterRestaurants(
  restaurants: Restaurant[],
  query: string,
  cuisine: string,
  minimum: number,
  sort: string,
) {
  const q = query.trim().toLocaleLowerCase();
  return restaurants
    .filter(
      (r) =>
        (!q ||
          [r.name, r.cuisine, r.location].some((v) =>
            v.toLocaleLowerCase().includes(q),
          )) &&
        (!cuisine || r.cuisine === cuisine) &&
        (!minimum || average(r) >= minimum),
    )
    .sort((a, b) =>
      sort === "rating"
        ? average(b) - average(a) || a.name.localeCompare(b.name)
        : sort === "reviews"
          ? b.reviews.length - a.reviews.length || a.name.localeCompare(b.name)
          : a.name.localeCompare(b.name),
    );
}

// Original names and review text retained. Invalid legacy ratings (10 and 6)
// are normalized to the documented five-star scale in this fresh demo dataset.
export const seed: Restaurant[] = [
  {
    id: "1",
    name: "Back-A-Yard",
    cuisine: "Caribbean",
    location: "",
    description: "",
    price: 2,
    reviews: [
      {
        id: "1",
        customer: "Kermit",
        stars: 5,
        review: "Loved it.",
        createdAt: "2019-06-01",
      },
      {
        id: "2",
        customer: "Rick",
        stars: 3,
        review: "My meal came late.",
        createdAt: "2019-06-02",
      },
    ],
  },
  {
    id: "2",
    name: "Taco Bell",
    cuisine: "Mexican",
    location: "",
    description: "",
    price: 1,
    reviews: [
      {
        id: "1",
        customer: "Morty",
        stars: 5,
        review: "I like everything.",
        createdAt: "2019-06-01",
      },
      {
        id: "2",
        customer: "Robert",
        stars: 5,
        review: "Good service.",
        createdAt: "2019-06-02",
      },
    ],
  },
];
