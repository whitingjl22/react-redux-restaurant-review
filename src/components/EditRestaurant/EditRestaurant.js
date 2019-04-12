import React from "react"
import "./EditRestaurant.css"

import { connect } from "react-redux"
import { updateRestaurant } from "../../redux"
import { Redirect, Link } from "react-router-dom"

class EditRestaurant extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      cuisine: "",
      nameValid: false,
      cuisineValid: false,
      toRestaurantList: false
    }
  }

  componentDidMount = () => {
    let name = ""
    let cuisine = ""

    for (let i = 0; i < this.props.restaurants.length; i++) {
      if (parseInt(this.props.match.params.id) === this.props.restaurants[i].id) {
        name = this.props.restaurants[i].name
        cuisine = this.props.restaurants[i].cuisine

        this.setState({
          name: name,
          cuisine: cuisine
        })
        break
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.name.length < 3) {
        this.setState({ nameValid: false })
      } else {
        this.setState({ nameValid: true })
      }
      if (this.state.cuisine.length < 3) {
        this.setState({ cuisineValid: false })
      } else {
        this.setState({ cuisineValid: true })
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  handleUpdateButton = () => {
    this.props.reviseRestaurant(parseInt(this.props.match.params.id), {
      name: this.state.name,
      cuisine: this.state.cuisine
    })

    this.setState({
      toRestaurantList: true
    })
  }

  render() {
    if (this.state.toRestaurantList === true) {
      return <Redirect to="/" />
    }
    return (
      <div className="editRestaurantContainer">
        <p>
          <b>Edit a restaurant</b>
        </p>
        <div className="errorMessage">
          {this.state.nameValid ? null : "Restaurant name must contain at least three characters!"}
        </div>
        <div className="errorMessage">
          {this.state.cuisineValid ? null : "Cuisine must contain at least three characters!"}
        </div>
        <div className="table">
          <form onSubmit={this.handleSubmit}>
            <br />
            <label>Restaurant name:</label>
            <br />
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
            <br />
            <label>Cuisine type:</label>
            <br />
            <input type="text" name="cuisine" value={this.state.cuisine} onChange={this.handleChange} />
            <br />
            <br />
            <Link to={"/"}>
              <input type="button" name="cancel" value="Cancel" />
            </Link>
            <input
              type="submit"
              name="edit"
              value="Edit"
              disabled={!this.state.nameValid || !this.state.cuisineValid}
              onClick={this.handleUpdateButton}
            />
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  restaurants: state.restaurants
})

const mapDispatchToProps = (dispatch) => ({
  reviseRestaurant: (id, updatedRestaurant) => dispatch(updateRestaurant(id, updatedRestaurant))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRestaurant)
