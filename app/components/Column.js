import React, { Component, PropTypes } from 'react'

class Column extends Component {
	render() {
		const { a, s, children } = this.props		
		return (
			<div className={`columns ${s} text-${a}`}>
				{children}
			</div>
		)
	}
}

Column.defaultProps = {
	a: 'left'
}

Column.propTypes = {
	s: function(props, propName, componentName) {
		if (!/(small|medium|large)-(1[0-2]|[1-9]{1})/.test(props[propName])) {
			return new Error('Validation failed!');
		}
	},
	a: React.PropTypes.oneOf(['left', 'center', 'right'])
}

export default Column