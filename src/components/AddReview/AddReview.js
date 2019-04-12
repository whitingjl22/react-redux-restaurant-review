import React from "react"
import "./AddReview.css"

import { connect } from "react-redux"
import { createReview } from "../../redux"
import { Redirect, Link } from "react-router-dom"

class AddReview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      customer: "",
      stars: null,
      review: "",
      customerValid: false,
      starsValid: false,
      reviewValid: false,
      toReviewList: false
    }
  }

  componentDidMount = () => {
    let name = ""

    for (let i = 0; i < this.props.restaurants.length; i++) {
      if (parseInt(this.props.match.params.id) === this.props.restaurants[i].id) {
        name = this.props.restaurants[i].name

        this.setState({ name: name })
        break
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.customer.length < 3) {
        this.setState({ customerValid: false })
      } else {
        this.setState({ customerValid: true })
      }
      if (this.state.review.length < 3) {
        this.setState({ reviewValid: false })
      } else {
        this.setState({ reviewValid: true })
      }
      if (this.state.stars < 6) {
        this.setState({ starsValid: true })
      } else {
        this.setState({ starsValid: false })
      }
    })
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
  }

  handleSubmitButton = () => {
    this.props.makeReview({
      id: parseInt(this.props.match.params.id),
      customer: this.state.customer,
      stars: this.state.stars,
      review: this.state.review
    })

    this.props.history.goBack()
  }

  render() {
    console.log("ADD-REVIEW PAGE STATE:", this.state)

    return (
      <div className="addReviewContainer">
        <p>Write a review for {this.state.name}</p>
        <div className="errorMessage">
          {this.state.customerValid ? null : "Name must contain at least three characters!"}
        </div>
        <div className="errorMessage">{this.state.starsValid ? null : "Stars must be a number between 1-5!"}</div>
        <div className="errorMessage">
          {this.state.reviewValid ? null : "Review must contain at least three characters!"}
        </div>
        <div className="table">
          <form onSubmit={this.handleFormSubmit}>
            <table>
              <thead />
              <tbody>
                <tr>
                  <td>Your name:</td>
                  <td>
                    <input type="text" name="customer" value={this.state.customer} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <td>Stars:</td>
                  <td>
                    <select name="stars" value={this.state.stars} onChange={this.handleChange}>
                      <option value="0" />
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Your review:</td>
                  <td>
                    <input type="text" name="review" value={this.state.review} onChange={this.handleChange} />
                  </td>
                </tr>
              </tbody>
            </table>
            <Link to={"/restaurants/" + this.props.match.params.id}>
              <button>Cancel</button>
            </Link>
            <input
              type="submit"
              value="Submit"
              disabled={!this.state.customerValid || !this.state.starsValid || !this.state.reviewValid}
              onClick={this.handleSubmitButton}
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
  makeReview: (newReview) => dispatch(createReview(newReview))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReview)
