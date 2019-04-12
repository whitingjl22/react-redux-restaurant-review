import React from "react"
import "./AddRestaurant.css"

import { connect } from "react-redux"
import { createRestaurant } from "../../redux"
import { Redirect, Link } from "react-router-dom"

class AddRestaurant extends React.Component {
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

    this.props.makeRestaurant({
      name: this.state.name,
      cuisine: this.state.cuisine
    })

    this.setState({
      toRestaurantList: true
    })
  }

  render() {
    if (this.state.toRestaurantList === true) {
      return <Redirect to="/restaurants" />
    }
    return (
      <div className="addRestaurantContainer">
        <p>
          <b>Register a restaurant</b>
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
            <label>Cuisine:</label>
            <br />
            <input type="text" name="cuisine" value={this.state.cuisine} onChange={this.handleChange} />
            <br />
            <br />
            <Link to={"/restaurants"}>
              <input type="button" name="cancel" value="Cancel" />
            </Link>
            <input
              type="submit"
              name="add"
              value="Register"
              disabled={!this.state.nameValid || !this.state.cuisineValid}
            />
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  makeRestaurant: (newRestaurant) => dispatch(createRestaurant(newRestaurant))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRestaurant)
