import React from "react"
import "./ReviewList.css"

import { connect } from "react-redux"
import { Link } from "react-router-dom"

class ReviewList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      reviews: []
    }
  }

  componentDidMount = () => {
    let name = ""
    let reviews = []

    for (let i = 0; i < this.props.restaurants.length; i++) {
      if (parseInt(this.props.match.params.id) === this.props.restaurants[i].id) {
        name = this.props.restaurants[i].name
        reviews = this.props.restaurants[i].reviews

        this.setState({ name: name, reviews: reviews })
        break
      }
    }
  }

  render() {
    return (
      <div className="reviewListContainer">
        <p>Reviews for {this.state.name}</p>
        <Link to={"/restaurants/" + this.props.match.params.id + "/review"}>
          <button>New review</button>
        </Link>
        <Link to={"/restaurants/"}>
          <button>Go Back</button>
        </Link>
        <div className="reviewList_contentContainer">
          <div className="reviewList_resultContainer">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Stars</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {this.state.reviews.map((review, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{review.customer}</td>
                      <td>{review.stars}</td>
                      <td>{review.review}</td>
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

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewList)
