import { expect, test } from "@playwright/test";
test("complete restaurant lifecycle persists across refresh", async ({
  page,
}) => {
  await page.goto("/restaurants");
  await page.getByRole("link", { name: "Add restaurant", exact: true }).click();
  await page.getByLabel("Restaurant name *").fill("The Corner Table");
  await page.getByLabel("Cuisine *", { exact: true }).fill("Italian");
  await page.getByLabel("Location (optional)").fill("Chicago");
  await page
    .getByRole("button", { name: "Add restaurant", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "The Corner Table" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Write a review", exact: true }).click();
  await page.getByLabel("Your name *").fill("Jeremy");
  await page.getByLabel("Your rating *").selectOption("5");
  await page
    .getByLabel("Your review *")
    .fill("A lovely dinner and thoughtful service.");
  await page.getByRole("button", { name: "Publish review" }).click();
  await page.reload();
  await expect(
    page.getByText("A lovely dinner and thoughtful service."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Edit restaurant" }).click();
  await page.getByLabel("Restaurant name *").fill("The New Corner Table");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(
    page.getByRole("heading", { name: "The New Corner Table" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete restaurant", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep restaurant" }).click();
  await expect(
    page.getByRole("heading", { name: "The New Corner Table" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete restaurant", exact: true })
    .click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "The New Corner Table" }),
  ).toHaveCount(0);
});
test("filters, URL state, empty results, and narrow screens", async ({
  page,
}) => {
  await page.goto("/restaurants");
  await page.getByRole("textbox", { name: "Search restaurants" }).fill("taco");
  await expect(page.getByRole("status")).toHaveText("Showing 1 restaurant");
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Search restaurants" }),
  ).toHaveValue("taco");
  await page
    .getByRole("combobox", { name: "Cuisine", exact: true })
    .selectOption("Caribbean");
  await expect(page.getByText("No matches just yet")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("status")).toHaveText("Showing 2 restaurants");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
