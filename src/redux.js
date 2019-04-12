import { createStore } from "redux"

//ACTIONS
export const deleteRestaurant = (id) => ({
  type: "DELETE_RESTAURANT",
  id
})
export const createRestaurant = (newRestaurant) => ({
  type: "CREATE_RESTAURANT",
  newRestaurant
})
// Nested Object
export const createReview = (newReview) => ({
  type: "CREATE_REVIEW",
  newReview
})
export const updateRestaurant = (id, updatedRestaurant) => ({
  type: "UPDATE_RESTAURANT",
  id,
  updatedRestaurant
})

///REDUCERS
export const reducers = (state = initialState, action) => {
  switch (action.type) {
    case "DELETE_RESTAURANT":
      console.log(" -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --")
      console.log(" -- REDUCER -- DELETE_RESTAURANT | state: ", state)
      console.log(" -- REDUCER -- DELETE_RESTAURANT | action", action)
      let deleteIndex = state.restaurants.findIndex((obj) => obj["id"] === action.id)
      return {
        ...state,
        restaurants: [...state.restaurants.slice(0, deleteIndex), ...state.restaurants.slice(deleteIndex + 1)]
      }

    case "CREATE_RESTAURANT":
      console.log(" -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --")
      console.log(" -- REDUCER -- CREATE_RESTAURANT | state: ", state)
      console.log(" -- REDUCER -- CREATE_RESTAURANT | action", action)
      console.log(" -- REDUCER -- CREATE_RESTAURANT | id ", id)
      id++
      return {
        ...state,
        restaurants: [
          ...state.restaurants,
          {
            id,
            name: action.newRestaurant.name,
            cuisine: action.newRestaurant.cuisine,
            reviews: []
          }
        ]
      }

    case "CREATE_REVIEW": // Nested Object
      console.log(" -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --")
      console.log(" -- REDUCER -- CREATE_REVIEW | state: ", state)
      console.log(" -- REDUCER -- CREATE_REVIEW | action", action)
      console.log(" -- REDUCER -- CREATE_REVIEW | id ", id)
      id++
      return {
        ...state,
        restaurants: [
          ...state.restaurants.map((restaurant) => {
            console.log("RESTAURANT CHECK: ", restaurant.id, action.newReview.id)
            if (restaurant.id === action.newReview.id) {
              console.log("RESTAURANT FOUND: ", restaurant.id, action.newReview.id)
              return {
                ...restaurant,
                reviews: [
                  ...restaurant.reviews,
                  {
                    id,
                    customer: action.newReview.customer,
                    stars: action.newReview.stars,
                    review: action.newReview.review
                  }
                ]
              }
            }
            return restaurant
          })
        ]
      }

    case "UPDATE_RESTAURANT":
      console.log(" -- REDUCER -- UPDATE_RESTAURANT | state: ", state)
      console.log(" -- REDUCER -- UPDATE_RESTAURANT | action", action)
      return {
        ...state,
        restaurants: state.restaurants.map((restaurant) => {
          if (restaurant.id === action.id) {
            return {
              ...restaurant,
              name: action.updatedRestaurant.name,
              cuisine: action.updatedRestaurant.cuisine
            }
          }
          return restaurant
        })
      }

    default:
      return state
  }
}

// Initial State
let id = 2
const initialState = {
  restaurants: [
    {
      id: 1,
      name: "Back-A-Yard",
      cuisine: "Caribbean",
      reviews: [
        {
          id: 1,
          customer: "Kermit",
          stars: 5,
          review: "Loved it."
        },
        {
          id: 2,
          customer: "Rick",
          stars: 3,
          review: "My meal came late."
        }
      ]
    },
    {
      id: 2,
      name: "Taco Bell",
      cuisine: "Mexican",
      reviews: [
        {
          id: 1,
          customer: "Morty",
          stars: 10,
          review: "I like everything."
        },
        {
          id: 2,
          customer: "Robert",
          stars: 6,
          review: "Good service."
        }
      ]
    }
  ]
}

// STORE -- store.js
export function configureStore(initialState = initialState) {
  const store = createStore(
    reducers,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  console.log(store)
  return store
}

export const store = configureStore()
