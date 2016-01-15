import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedMine } from '../actions'
import { Link } from 'react-router'

class EventFeedMine extends Component {
	componentWillMount() {
		const { dispatch } = this.props
		dispatch(fetchEventFeedMine())
	}

	render() {
		const { hasError, errors, isFetching, items } = this.props

		console.log(items)

		var itemList = items.map((item) => {
			return (
				<li><Link to={`/event/edit/${item.id}`}>{item.title}</Link></li>
			)
		})

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title="My Events" />
				<h1 className="eventPageTitle">My Events</h1>
				<Link className="solid-button green" to="/event/edit">Create New Event</Link>
				<ul>
					{itemList}
				</ul>				
			</div>
		)
	}
}

EventFeedMine.defaultProps = {
	hasError: false,
	errors: [], 
	isFetching: false,
	items: []
}
 
function mapStateToProps(state) {
	return state.eventFeeds.mine || {
		hasError: false,
		errors: [], 
		isFetching: false,
		items: []
	}
}

export default connect(mapStateToProps, null)(EventFeedMine)