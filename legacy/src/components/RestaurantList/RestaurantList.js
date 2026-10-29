import React from "react"
import "./RestaurantList.css"

import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { deleteRestaurant } from "../../redux"

class RestaurantList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="restaurantListContainer">
        <Link to={"/restaurants/new"}>
          <button>New restaurant</button>
        </Link>
        <div className="restaurantList_contentContainer">
          <div className="restaurantList_resultContainer">
            <table>
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Cuisine</th>
                  <th>Actions available</th>
                </tr>
              </thead>
              <tbody>
                {this.props.restaurants.map((restaurant, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{restaurant.name}</td>
                      <td>{restaurant.cuisine}</td>
                      <td>
                        <Link to={"/restaurants/" + restaurant.id}>
                          <button>Read reviews</button>
                        </Link>
                        <Link to={"/restaurants/" + restaurant.id + "/edit"}>
                          <button>Update</button>
                        </Link>
                        <button
                          onClick={() => {
                            this.props.removeRestaurant(restaurant.id)
                          }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  restaurants: state.restaurants
})

const mapDispatchToProps = (dispatch) => ({
  removeRestaurant: (id) => dispatch(deleteRestaurant(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestaurantList)
