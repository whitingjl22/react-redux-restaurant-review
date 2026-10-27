import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Utensils,
  X,
} from "lucide-react";
import { actions, useAppDispatch, useAppSelector } from "./store";
import {
  average,
  filterRestaurants,
  restaurantInput,
  reviewInput,
  type Restaurant,
} from "./model";

const path = (id: string) => `/restaurants/${encodeURIComponent(id)}`;
function Rating({ restaurant }: { restaurant: Restaurant }) {
  const score = average(restaurant);
  return (
    <span className="rating">
      <Star size={15} fill="currentColor" aria-hidden="true" />{" "}
      {score ? score.toFixed(1) : "New"}{" "}
      <span className="muted">
        {restaurant.reviews.length
          ? `(${restaurant.reviews.length} ${restaurant.reviews.length === 1 ? "review" : "reviews"})`
          : "No reviews yet"}
      </span>
    </span>
  );
}
function Artwork({
  cuisine,
  large = false,
}: {
  cuisine: string;
  large?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`artwork ${cuisine.toLowerCase().includes("mex") ? "terracotta" : "olive"} ${large ? "large" : ""}`}
    >
      <span className="art-label">GOOD FOOD. GOOD COMPANY.</span>
      <div className="plate">
        <div className="food">
          <i />
          <i />
          <i />
          <b />
          <b />
          <b />
        </div>
      </div>
      <span className="art-caption">{cuisine} kitchen</span>
    </div>
  );
}
function PageFocus() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById("main")?.focus();
    window.scrollTo?.(0, 0);
  }, [pathname]);
  return null;
}
export function App() {
  const error = useAppSelector((s) => s.storageError);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/restaurants" className="brand">
          <span className="brand-icon">
            <Utensils size={21} />
          </span>
          let’s eat<span className="brand-dot">.</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link className="nav-link" to="/restaurants">
            Explore restaurants
          </Link>
          <Link className="button small" to="/restaurants/new">
            <Plus size={16} /> Add restaurant
          </Link>
        </nav>
      </header>
      <PageFocus />
      <main id="main" tabIndex={-1}>
        {error && (
          <div role="alert" className="notice">
            {error}
          </div>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/restaurants" replace />} />
          <Route path="/restaurants" element={<Directory />} />
          <Route path="/restaurants/new" element={<RestaurantForm />} />
          <Route
            path="/restaurants/:id/edit"
            element={<RestaurantForm edit />}
          />
          <Route path="/restaurants/:id/review" element={<ReviewForm />} />
          <Route path="/restaurants/:id" element={<Detail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <Link className="brand footer-brand" to="/restaurants">
          let’s eat.
        </Link>
        <span>A little journal for great meals.</span>
        <span className="local-label">
          <span /> Local demo · Saved in this browser
        </span>
      </footer>
    </>
  );
}
function Directory() {
  const restaurants = useAppSelector((s) => s.restaurants);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "",
    cuisine = params.get("cuisine") || "",
    minimum = Number(params.get("rating")) || 0,
    sort = params.get("sort") || "name";
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }
  const results = filterRestaurants(restaurants, query, cuisine, minimum, sort);
  const cuisines = [...new Set(restaurants.map((r) => r.cuisine))].sort();
  const reviewCount = restaurants.reduce((sum, r) => sum + r.reviews.length, 0);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> YOUR NEXT GREAT MEAL STARTS HERE
          </p>
          <h1>
            Good food.
            <br />
            Better discoveries.
          </h1>
          <p className="hero-description">
            The places you love. The meals worth sharing.
            <br />
            Find a favorite, or put a new one on the map.
          </p>
          <a className="text-link" href="#directory">
            Explore the collection <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-ring" />
          <span className="hero-note">
            a taste of
            <br />
            <em>something good.</em>
          </span>
          <div className="hero-dish">
            <div className="dish-center">
              <span>✳</span>
              <span>✳</span>
              <span>✳</span>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="hero-sticker">
            MADE FOR
            <br />
            <strong>food lovers</strong>
            <Utensils size={22} />
          </div>
          <span className="vertical-note">DISCOVER · SAVOR · SHARE</span>
        </div>
      </section>
      <section className="collection" id="directory">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2>Find your next favorite</h2>
          </div>
          <p className="collection-count">
            {restaurants.length} restaurants <span>·</span> {reviewCount}{" "}
            reviews
          </p>
        </div>
        <div className="filters">
          <label className="search-field">
            <Search size={19} />
            <span className="sr-only">Search restaurants</span>
            <input
              value={query}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Search restaurants, cuisines, places…"
            />
          </label>
          <label>
            <span className="sr-only">Cuisine</span>
            <select
              aria-label="Cuisine"
              value={cuisine}
              onChange={(e) => update("cuisine", e.target.value)}
            >
              <option value="">All cuisines</option>
              {cuisines.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Minimum rating</span>
            <select
              aria-label="Minimum rating"
              value={minimum}
              onChange={(e) => update("rating", e.target.value)}
            >
              <option value="0">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="5">5 stars</option>
            </select>
          </label>
          <label className="sort-field">
            <SlidersHorizontal size={17} />
            <span className="sr-only">Sort restaurants</span>
            <select
              aria-label="Sort restaurants"
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="name">Name: A–Z</option>
              <option value="rating">Top rated</option>
              <option value="reviews">Most reviewed</option>
            </select>
          </label>
        </div>
        <div className="results-line">
          <span role="status">
            Showing {results.length}{" "}
            {results.length === 1 ? "restaurant" : "restaurants"}
          </span>
          {(query || cuisine || minimum !== 0) && (
            <button className="text-button" onClick={() => setParams({})}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>
        <div className="restaurant-grid">
          {results.map((r) => (
            <article className="restaurant-card" key={r.id}>
              <Link
                to={path(r.id)}
                className="card-art"
                aria-label={`View ${r.name}`}
              >
                <Artwork cuisine={r.cuisine} />
                <span className="cuisine-badge">{r.cuisine}</span>
              </Link>
              <div className="card-body">
                <div className="card-title">
                  <h3>
                    <Link to={path(r.id)}>{r.name}</Link>
                  </h3>
                  <span className="price">{"$".repeat(r.price)}</span>
                </div>
                <p className="card-description">
                  {r.description ||
                    `Discover ${r.cuisine.toLowerCase()} flavors and share your experience.`}
                </p>
                {r.location && (
                  <p className="location">
                    <MapPin size={14} />
                    {r.location}
                  </p>
                )}
                <div className="card-bottom">
                  <Rating restaurant={r} />
                  <Link
                    to={path(r.id)}
                    className="round-link"
                    aria-label={`Read reviews for ${r.name}`}
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
          <Link className="add-card" to="/restaurants/new">
            <span className="add-circle">
              <Plus size={25} />
            </span>
            <h3>A great spot missing?</h3>
            <p>
              Good discoveries are better shared.
              <br />
              Add a place to the collection.
            </p>
            <span className="text-link">
              Add a restaurant <ArrowUpRight size={17} />
            </span>
          </Link>
        </div>
        {results.length === 0 && (
          <div className="empty">
            <Search size={28} />
            <h3>
              {restaurants.length
                ? "No matches just yet"
                : "Your collection starts here"}
            </h3>
            <p>
              {restaurants.length
                ? "Try another search or clear your filters."
                : "Add your first restaurant and start sharing good meals."}
            </p>
          </div>
        )}
      </section>
      <aside className="bottom-note">
        <Utensils size={22} />
        <p>
          <strong>Every great meal has a story.</strong> Share yours with a
          review.
        </p>
        <span>Stay curious. Eat well.</span>
      </aside>
    </>
  );
}
function NotFound() {
  return (
    <section className="empty page">
      <h1>We couldn’t find that page.</h1>
      <p>The restaurant may have been removed, or the link may be incorrect.</p>
      <Link className="button" to="/restaurants">
        Explore restaurants
      </Link>
    </section>
  );
}
function Back({
  to = "/restaurants",
  children = "All restaurants",
}: {
  to?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link className="back-link" to={to}>
      <ArrowLeft size={17} />
      {children}
    </Link>
  );
}
function Detail() {
  const { id } = useParams();
  const r = useAppSelector((s) => s.restaurants.find((r) => r.id === id));
  const dispatch = useAppDispatch(),
    navigate = useNavigate();
  const dialog = useRef<HTMLDialogElement>(null);
  if (!r) return <NotFound />;
  return (
    <section className="page detail">
      <Back />
      <div className="detail-heading">
        <div>
          <p className="eyebrow">
            {r.cuisine} · {"$".repeat(r.price)}
          </p>
          <h1>{r.name}</h1>
          <Rating restaurant={r} />
          {r.location && (
            <p className="location">
              <MapPin size={17} />
              {r.location}
            </p>
          )}
        </div>
        <div className="actions">
          <Link className="button" to={`${path(r.id)}/review`}>
            <Plus size={17} /> Write a review
          </Link>
          <Link className="button secondary" to={`${path(r.id)}/edit`}>
            Edit restaurant
          </Link>
        </div>
      </div>
      {r.description && <p className="detail-description">{r.description}</p>}
      <div className="detail-layout">
        <Artwork cuisine={r.cuisine} large />
        <div>
          <div className="section-heading">
            <h2>At the table</h2>
            <span className="muted">{r.reviews.length} reviews</span>
          </div>
          {r.reviews.length ? (
            [...r.reviews].reverse().map((v) => (
              <article className="review" key={v.id}>
                <div className="review-heading">
                  <span className="avatar">
                    {v.customer.charAt(0).toUpperCase()}
                  </span>
                  <strong>{v.customer}</strong>
                  <span
                    className="review-stars"
                    aria-label={`${v.stars} out of 5 stars`}
                  >
                    {"★".repeat(v.stars)}
                    <span className="empty-stars">
                      {"★".repeat(5 - v.stars)}
                    </span>
                  </span>
                </div>
                <p>{v.review}</p>
              </article>
            ))
          ) : (
            <div className="empty">
              <h3>Be the first at the table.</h3>
              <p>Have you eaten here? Tell us about it.</p>
              <Link to={`${path(r.id)}/review`}>Write the first review</Link>
            </div>
          )}
        </div>
      </div>
      <div className="danger-zone">
        <button
          className="text-button danger"
          onClick={() => dialog.current?.showModal()}
        >
          Delete restaurant
        </button>
        <span>Removes this restaurant and its reviews.</span>
      </div>
      <dialog ref={dialog} aria-labelledby="delete-title">
        <h2 id="delete-title">Delete {r.name}?</h2>
        <p>
          This removes the restaurant and all {r.reviews.length} reviews from
          this browser. This cannot be undone.
        </p>
        <div className="actions">
          <button
            className="button secondary"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            Keep restaurant
          </button>
          <button
            className="button destructive"
            onClick={() => {
              dispatch(actions.deleteRestaurant(r.id));
              navigate("/restaurants");
            }}
          >
            Delete permanently
          </button>
        </div>
      </dialog>
    </section>
  );
}
type Errors = Record<string, string>;
function Field({
  name,
  label,
  errors,
  children,
}: {
  name: string;
  label: string;
  errors: Errors;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {errors[name] && (
        <p id={`${name}-error`} className="field-error">
          {errors[name]}
        </p>
      )}
    </div>
  );
}
function errorProps(name: string, errors: Errors) {
  return {
    id: name,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  };
}
function parseErrors(issues: { path: PropertyKey[]; message: string }[]) {
  return Object.fromEntries(issues.map((i) => [String(i.path[0]), i.message]));
}
function focusInvalid(errors: Errors) {
  requestAnimationFrame(() =>
    document.getElementById(Object.keys(errors)[0])?.focus(),
  );
}
function RestaurantForm({ edit = false }: { edit?: boolean }) {
  const { id } = useParams();
  const r = useAppSelector((s) => s.restaurants.find((r) => r.id === id));
  // Key the inner form so navigation between restaurants resets its draft.
  return edit && !r ? (
    <NotFound />
  ) : (
    <RestaurantEditor
      key={edit ? id : "new"}
      restaurant={edit ? r : undefined}
    />
  );
}
function RestaurantEditor({ restaurant: r }: { restaurant?: Restaurant }) {
  const dispatch = useAppDispatch(),
    navigate = useNavigate();
  const [values, setValues] = useState({
    name: r?.name || "",
    cuisine: r?.cuisine || "",
    location: r?.location || "",
    description: r?.description || "",
    price: r?.price || 2,
  });
  const [errors, setErrors] = useState<Errors>({});
  const back = r ? path(r.id) : "/restaurants";
  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = restaurantInput.safeParse(values);
    if (!parsed.success) {
      const next = parseErrors(parsed.error.issues);
      setErrors(next);
      focusInvalid(next);
      return;
    }
    const id = r?.id || crypto.randomUUID();
    dispatch(
      r
        ? actions.editRestaurant({ id, data: parsed.data })
        : actions.addRestaurant({ id, data: parsed.data }),
    );
    navigate(path(id));
  }
  return (
    <section className="page form-page">
      <Back to={back} />
      <p className="eyebrow">GROW THE COLLECTION</p>
      <h1>{r ? "Edit your discovery." : "Share a good spot."}</h1>
      <p className="form-intro">
        A neighborhood favorite or a new find — every great place belongs here.
      </p>
      <form noValidate onSubmit={submit} className="form-panel">
        {Object.keys(errors).length > 0 && (
          <p role="alert" className="notice">
            Please check the highlighted fields.
          </p>
        )}
        <Field name="name" label="Restaurant name *" errors={errors}>
          <input
            {...errorProps("name", errors)}
            value={values.name}
            maxLength={80}
            autoComplete="off"
            placeholder="e.g. Back-A-Yard"
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </Field>
        <div className="form-row">
          <Field name="cuisine" label="Cuisine *" errors={errors}>
            <input
              {...errorProps("cuisine", errors)}
              value={values.cuisine}
              maxLength={40}
              placeholder="e.g. Caribbean"
              onChange={(e) =>
                setValues({ ...values, cuisine: e.target.value })
              }
            />
          </Field>
          <Field name="price" label="Price range *" errors={errors}>
            <select
              {...errorProps("price", errors)}
              value={values.price}
              onChange={(e) =>
                setValues({ ...values, price: Number(e.target.value) })
              }
            >
              <option value="1">$ · Budget-friendly</option>
              <option value="2">$$ · Everyday treat</option>
              <option value="3">$$$ · Special occasion</option>
              <option value="4">$$$$ · Fine dining</option>
            </select>
          </Field>
        </div>
        <Field name="location" label="Location (optional)" errors={errors}>
          <input
            {...errorProps("location", errors)}
            value={values.location}
            maxLength={100}
            placeholder="Neighborhood or city"
            onChange={(e) => setValues({ ...values, location: e.target.value })}
          />
        </Field>
        <Field
          name="description"
          label="What makes it special? (optional)"
          errors={errors}
        >
          <textarea
            {...errorProps("description", errors)}
            value={values.description}
            maxLength={500}
            rows={4}
            placeholder="The flavors, the atmosphere, the dish you keep coming back for…"
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
          />
        </Field>
        <p className="form-help">
          * Required. Your collection is saved in this browser.
        </p>
        <div className="form-footer">
          <Link className="button secondary" to={back}>
            Cancel
          </Link>
          <button className="button" type="submit">
            <Check size={17} />
            {r ? "Save changes" : "Add restaurant"}
          </button>
        </div>
      </form>
    </section>
  );
}
function ReviewForm() {
  const { id } = useParams();
  const r = useAppSelector((s) => s.restaurants.find((r) => r.id === id));
  const dispatch = useAppDispatch(),
    navigate = useNavigate();
  const [values, setValues] = useState({ customer: "", stars: 0, review: "" });
  const [errors, setErrors] = useState<Errors>({});
  if (!r) return <NotFound />;
  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = reviewInput.safeParse(values);
    if (!parsed.success) {
      const next = parseErrors(parsed.error.issues);
      setErrors(next);
      focusInvalid(next);
      return;
    }
    dispatch(
      actions.addReview({
        restaurantId: r!.id,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        data: parsed.data,
      }),
    );
    navigate(path(r!.id));
  }
  return (
    <section className="page form-page">
      <Back to={path(r.id)} children={r.name} />
      <p className="eyebrow">YOUR SEAT AT THE TABLE</p>
      <h1>How was your meal?</h1>
      <p className="form-intro">
        Share your experience at <strong>{r.name}</strong>.
      </p>
      <form noValidate className="form-panel" onSubmit={submit}>
        {Object.keys(errors).length > 0 && (
          <p className="notice" role="alert">
            Please check the highlighted fields.
          </p>
        )}
        <Field name="customer" label="Your name *" errors={errors}>
          <input
            {...errorProps("customer", errors)}
            autoComplete="name"
            maxLength={60}
            value={values.customer}
            onChange={(e) => setValues({ ...values, customer: e.target.value })}
          />
        </Field>
        <Field name="stars" label="Your rating *" errors={errors}>
          <select
            {...errorProps("stars", errors)}
            value={values.stars}
            onChange={(e) =>
              setValues({ ...values, stars: Number(e.target.value) })
            }
          >
            <option value="0">Choose a rating</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)} · {n} {n === 1 ? "star" : "stars"}
              </option>
            ))}
          </select>
        </Field>
        <Field name="review" label="Your review *" errors={errors}>
          <textarea
            {...errorProps("review", errors)}
            rows={6}
            maxLength={2000}
            value={values.review}
            placeholder="What did you order? What would bring you back?"
            onChange={(e) => setValues({ ...values, review: e.target.value })}
          />
        </Field>
        <p className="form-help">
          * Required. Be thoughtful, specific, and kind.
        </p>
        <div className="form-footer">
          <Link className="button secondary" to={path(r.id)}>
            Cancel
          </Link>
          <button className="button" type="submit">
            Publish review <ArrowUpRight size={17} />
          </button>
        </div>
      </form>
    </section>
  );
}
