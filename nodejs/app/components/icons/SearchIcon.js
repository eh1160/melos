import React, { PropTypes } from 'react'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function Search({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: Search.defaultProps.height,
		defaultWidth: Search.defaultProps.width,
		newHeight: height,
		newWidth: width
	})
	return (
		<svg
			className={className}
			viewBox="0 0 14 14"
			width={finalWidth}
			height={finalHeight}
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g transform="translate(-223.000000, -20.000000)" fill={fill}>
				<g transform="translate(221.000000, 15.000000)">
					<path d="M13.3437662,14.9783187 L15.7172065,17.351759 C16.0942645,17.7288169 16.0942645,18.3401486 15.7172065,18.7172065 C15.3401486,19.0942645 14.7288169,19.0942645 14.351759,18.7172065 L11.9783187,16.3437662 C10.9404323,17.1033055 9.66051411,17.5517241 8.27586207,17.5517241 C4.80979916,17.5517241 2,14.741925 2,11.2758621 C2,7.80979916 4.80979916,5 8.27586207,5 C11.741925,5 14.5517241,7.80979916 14.5517241,11.2758621 C14.5517241,12.6605141 14.1033055,13.9404323 13.3437662,14.9783187 Z M8.27586207,15.6206897 C10.6754441,15.6206897 12.6206897,13.6754441 12.6206897,11.2758621 C12.6206897,8.87628005 10.6754441,6.93103448 8.27586207,6.93103448 C5.87628005,6.93103448 3.93103448,8.87628005 3.93103448,11.2758621 C3.93103448,13.6754441 5.87628005,15.6206897 8.27586207,15.6206897 Z" id="search-black" />
				</g>
			</g>
		</svg>
	)
}


Search.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string,
}

Search.defaultProps = {
	width: 16,
	height: 16,
	fill: '#979797',
	className: '',
}

export default Search
