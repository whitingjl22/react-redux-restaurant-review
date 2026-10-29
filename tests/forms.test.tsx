import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { App } from "../src/App";
import { createAppStore } from "../src/store";
function setup(route: string) {
  const store = createAppStore();
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>,
  );
  return { user: userEvent.setup(), store };
}
it("shows associated errors on submit and accepts a valid restaurant", async () => {
  const { user, store } = setup("/restaurants/new");
  await user.click(screen.getByRole("button", { name: "Add restaurant" }));
  expect(screen.getByLabelText("Restaurant name *")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await user.type(
    screen.getByLabelText("Restaurant name *"),
    "The Corner Table",
  );
  await user.type(screen.getByLabelText("Cuisine *"), "Italian");
  await user.click(screen.getByRole("button", { name: "Add restaurant" }));
  expect(
    await screen.findByRole("heading", { name: "The Corner Table" }),
  ).toBeInTheDocument();
  expect(store.getState().restaurants).toHaveLength(3);
});
it("requires a rating, then publishes a review using form submission", async () => {
  const { user, store } = setup("/restaurants/1/review");
  await user.type(screen.getByLabelText("Your name *"), "Alex");
  await user.type(screen.getByLabelText("Your review *"), "Wonderful lunch.");
  await user.click(screen.getByRole("button", { name: "Publish review" }));
  expect(screen.getByLabelText("Your rating *")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await user.selectOptions(screen.getByLabelText("Your rating *"), "4");
  await user.click(screen.getByRole("button", { name: "Publish review" }));
  expect(await screen.findByText("Wonderful lunch.")).toBeInTheDocument();
  expect(store.getState().restaurants[0].reviews).toHaveLength(3);
});
it("allows saving an unchanged prefilled restaurant", async () => {
  const { user } = setup("/restaurants/1/edit");
  expect(screen.getByLabelText("Restaurant name *")).toHaveValue("Back-A-Yard");
  await user.click(screen.getByRole("button", { name: "Save changes" }));
  expect(
    await screen.findByRole("heading", { name: "Back-A-Yard" }),
  ).toBeInTheDocument();
});
it.each([
  "/restaurants/missing",
  "/restaurants/missing/edit",
  "/restaurants/missing/review",
  "/missing",
])("handles unknown route %s", (route) => {
  setup(route);
  expect(
    screen.getByRole("heading", { name: "We couldn’t find that page." }),
  ).toBeInTheDocument();
});
