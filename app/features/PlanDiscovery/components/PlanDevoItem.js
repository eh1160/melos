import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import Circle from '../../../components/Circle'
import CheckMark from '../../../components/CheckMark'

class PlanDevoItem extends Component {
	constructor(props) {
		super(props)
		this.handleDevoComplete = this.handleDevoComplete.bind(this)
	}

	handleDevoComplete() {
		const { handleCompleteRef, day, devoCompleted } = this.props
		if (typeof handleCompleteRef === 'function') {
			handleCompleteRef(day, 'devo', !devoCompleted)
		}
	}

	render() {
		const { link, day, devoCompleted, iconStyle } = this.props
		const itemLink = { pathname: `${link}/devo`, query: { day } }

		let icon
		if (devoCompleted) {
			icon = <CheckMark fill="#444444" style={iconStyle} />
		} else {
			icon = <Circle style={iconStyle} />
		}

		return (
			<li className="li-right">
				<a tabIndex={0} onClick={this.handleDevoComplete}>
					{icon}
				</a>
				<Link to={itemLink}>
					<FormattedMessage id="plans.devotional" />
				</Link>
			</li>
		)
	}
}

PlanDevoItem.propTypes = {
	link: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	handleCompleteRef: PropTypes.func.isRequired,
	iconStyle: PropTypes.object,
	devoCompleted: PropTypes.bool.isRequired
}

PlanDevoItem.defaultProps = {
	iconStyle: {}
}

export default PlanDevoItem
