import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'

function NavArrows(props) {

	const {
		previousURL,
		nextURL,
		customPrevious,
		customNext,
		bottomPos,
		onNextClick,
		onPrevClick,
		leftClass,
		rightClass,
		localizedLink,
	} = props

	if (!previousURL && !nextURL) return (<div />)


	let left, right = null
	let previousIcon, nextIcon = null
	let style = {}

	if (bottomPos) {
		style = {
			bottom: bottomPos
		}
	}

	if (customPrevious) {
		previousIcon = customPrevious
	} else {
		previousIcon = (
			<CarouselArrow
				key='left'
				dir='left'
				fill='#888888'
				containerClass='circle-buttons'
				arrowClass='reader-arrow'
				width={18}
				height={35}
			/>
		)
	}
	if (customNext) {
		nextIcon = customNext
	} else {
		nextIcon = (
			<CarouselArrow
				key='right'
				dir='right'
				fill='#888888'
				containerClass='circle-buttons'
				arrowClass='reader-arrow'
				width={18}
				height={35}
			/>
		)
	}

	if (previousURL) {
		left = (
			<Link
				to={localizedLink(`${previousURL}`)}
				onClick={onPrevClick}
				className={leftClass}
			>
				{ previousIcon }
			</Link>
		)
	}

	if (nextURL) {
		right = (
			<Link
				to={localizedLink(`${nextURL}`)}
				onClick={onNextClick}
				className={rightClass}
			>
				{ nextIcon }
			</Link>
		)
	}

	return (
		<div className='reader-arrows'>
			<div className='prev-arrow' style={style}>{ left }</div>
			<div className='next-arrow' style={style}>{ right }</div>
		</div>
	)
}


/**
 *	previousURL			{string}		url to link to on the previous icon
 *	nextURL					{string}		url to link to on the next icon
 *	customPrevious	{node}			optional component to pass as the previous icon
 *	customNext			{node}			optional component to pass as the next icon
 */
NavArrows.propTypes = {
	previousURL: PropTypes.string,
	nextURL: PropTypes.string,
	customPrevious: PropTypes.node,
	customNext: PropTypes.node,
	onNextClick: PropTypes.func,
	onPrevClick: PropTypes.func,
	leftClass: PropTypes.string,
	rightClass: PropTypes.string,
	bottomPos: PropTypes.string,
}

NavArrows.defaultProps = {
	previousURL: null,
	nextURL: null,
	customPrevious: null,
	customNext: null,
	onNextClick: null,
	onPrevClick: null,
	leftClass: null,
	rightClass: null,
	bottomPos: null,
}

export default NavArrows
