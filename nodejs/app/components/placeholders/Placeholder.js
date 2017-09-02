import React, { PropTypes, Component } from 'react'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PLACEHOLDER_ANIMATIONS from './PLACEHOLDER_ANIMATIONS'


class Placeholder extends Component {

	shouldComponentUpdate() {
		return false
	}

	render() {
		const {
			fill,
			background,
			duplicate,
			childSpacing,
			height,
			width,
			children,
			className,
			animation,
		} = this.props

		const inheritedProps = {
			height,
			fill,
			width,
		}

		const placeholders = []
		for (let i = 0; i <= duplicate; i++) {
			placeholders.push(
				<div
					key={`placeholder-${animation}-${children.length}-${i}`}
					className={[
						'placeholder',
						`placeholder-animation-${animation} ${className}`,
						'vertical-center',
						'flex-wrap'
					].join(' ')}
					style={{ width, height, background }}
				>
					{
							React.Children.map(children, (c) => {
								return (
									<div className={`vertical-center ${c.props.className ? c.props.className : ''}`}>
										{
											React.cloneElement(c, Immutable
												.fromJS(inheritedProps)
												.merge(c.props)
												.toJS()
											)
										}
										<div
											style={{
												width: `${childSpacing}`,
												background: `${fill}`,
												height
											}}
										/>
									</div>
								)
							})
						}
				</div>
			)
		}

		return (
			<ReactCSSTransitionGroup
				transitionName='basic'
				transitionAppear={true}
				transitionAppearTimeout={300}
				transitionEnterTimeout={300}
				transitionLeaveTimeout={300}
			>
				{ placeholders }
			</ReactCSSTransitionGroup>
		)
	}
}

Placeholder.propTypes = {
	fill: PropTypes.string,
	className: PropTypes.string,
	background: PropTypes.string,
	childSpacing: PropTypes.string,
	duplicate: PropTypes.number,
	children: PropTypes.node.isRequired,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	animation: PropTypes.oneOf(PLACEHOLDER_ANIMATIONS),
}

Placeholder.defaultProps = {
	fill: 'white',
	background: null,
	height: '200px',
	width: '100%',
	childSpacing: '15px',
	animation: 'shimmer',
	className: '',
	duplicate: 0,
}

export default Placeholder
