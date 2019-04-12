import React from "react"

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import { connect } from "react-redux"

import "./Container.css"

import RestaurantList from "../components/RestaurantList/RestaurantList"
import AddRestaurant from "../components/AddRestaurant/AddRestaurant"
import EditRestaurant from "../components/EditRestaurant/EditRestaurant"
import ReviewList from "../components/ReviewList/ReviewList"
import AddReview from "../components/AddReview/AddReview"

class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    console.log("CONTAINER PAGE PROPS:", this.props)
    console.log("CONTAINER PAGE STATE:", this.state)

    return (
      <div className="containerPage">
        <h1>Let's eat</h1>
        <BrowserRouter>
          <div className="contentContainer">
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/restaurants" />} />
              <Route path="/restaurants/new" component={AddRestaurant} />
              <Route exact path="/restaurants" component={RestaurantList} />
              <Route path="/restaurants/:id/review" render={(props) => <AddReview {...props} />} />
              <Route path="/restaurants/:id/edit" render={(props) => <EditRestaurant {...props} />} />
              <Route path="/restaurants/:id" render={(props) => <ReviewList {...props} />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container)
