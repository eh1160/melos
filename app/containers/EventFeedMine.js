import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import EventHeader from '../components/EventHeader'
import { fetchEventFeedMine } from '../actions'
import { Link } from 'react-router'
import Row from '../components/Row'
import Column from '../components/Column'
import EventListItem from '../features/EventFeedMine/components/EventListItem'
import ActionCreators from '../features/EventFeedMine/actions/creators'

class EventFeedMine extends Component {
	componentWillMount() {
		const { dispatch } = this.props
		dispatch(fetchEventFeedMine())
	}

	handleDuplicate(id) {
		const { dispatch } = this.props
		dispatch(ActionCreators.duplicate({id}))
	}

	render() {
		const { hasError, errors, isFetching, items, auth } = this.props
		const { userData } = auth
		const { first_name, last_name } = userData

		var itemList = items.map((item) => {
			return (<EventListItem key={item.id} item={item} handleDuplicate={::this.handleDuplicate} />)
		})

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title="My Events" />
				<EventHeader {...this.props} />
                <div className="event-title-section">
                    <Row className="collapse">
                        <Column s="medium-8" a="left">
                            <h1 className="title">My Events</h1>
                        </Column>
                        <Column s="medium-4" a="right">
                            <Link className="solid-button green" to="/event/edit">Create New Event</Link>
                        </Column>
                    </Row>
                    <Row>
                        <h2 className="subtitle">EVENTS I CREATED</h2>
                    </Row>
                </div>
				<ul className="unindented">
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
	return Object.assign({}, state.eventFeeds.mine || {
		hasError: false,
		errors: [],
		isFetching: false,
		items: []
	}, { auth: state.auth })
}

export default connect(mapStateToProps, null)(EventFeedMine)
