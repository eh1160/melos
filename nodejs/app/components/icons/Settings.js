import React, { PropTypes } from 'react'
import getProportionalSize from '../../lib/imageProportions'

function Settings({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: Settings.defaultProps.height,
		defaultWidth: Settings.defaultProps.width,
		newHeight: height,
		newWidth: width
	})

	return (
		<svg
			className={className}
			width={finalWidth}
			height={finalHeight}
			viewBox="0 0 24 24"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			fillRule="evenodd"
		>
			<path
				stroke="none"
				fill={fill}
				d="M 20,11.65 L 20,12.35 20,12.35 C 20,12.85 19.62,13.28 19.12,13.34 L 17.05,13.6 16.96,12.88 17.66,13.05 C 17.53,13.59 17.03,14.81 16.75,15.28 L 16.12,14.91 16.69,14.46 17.99,16.11 17.99,16.11 C 18.3,16.51 18.26,17.07 17.91,17.43 L 17.43,17.91 17.43,17.91 C 17.08,18.27 16.51,18.31 16.11,18 L 14.46,16.72 14.9,16.14 15.27,16.77 C 14.82,17.04 13.65,17.5 13.07,17.64 L 12.9,16.94 13.62,17.03 13.35,19.13 13.35,19.13 C 13.29,19.63 12.86,20 12.36,20 L 11.65,20 11.65,20 C 11.14,20 10.72,19.63 10.65,19.13 L 10.39,17.03 11.11,16.94 10.93,17.64 C 10.37,17.5 9.21,17.04 8.75,16.77 L 9.12,16.14 9.57,16.72 7.95,18 7.95,18 C 7.55,18.31 6.98,18.28 6.62,17.92 L 6.11,17.41 6.11,17.41 C 5.75,17.05 5.72,16.48 6.03,16.09 L 7.32,14.42 7.9,14.86 7.27,15.23 C 6.97,14.73 6.47,13.57 6.34,13.05 L 7.05,12.88 6.96,13.6 4.91,13.34 4.91,13.34 C 4.42,13.28 4.05,12.87 4.04,12.37 L 4.02,11.67 4.02,11.67 C 4.01,11.16 4.39,10.72 4.9,10.65 L 6.96,10.4 7.05,11.12 6.34,10.94 C 6.47,10.42 6.98,9.26 7.27,8.76 L 7.9,9.13 7.32,9.57 6.02,7.89 6.02,7.89 C 5.71,7.48 5.76,6.91 6.12,6.56 L 6.6,6.1 6.6,6.1 C 6.96,5.75 7.52,5.72 7.91,6.03 L 9.56,7.31 9.12,7.89 8.75,7.26 C 9.21,6.99 10.41,6.5 10.96,6.36 L 11.14,7.07 10.42,6.99 C 10.42,6.97 10.42,6.97 10.43,6.88 10.44,6.78 10.45,6.68 10.46,6.57 10.48,6.41 10.55,5.84 10.66,4.88 L 10.66,4.88 C 10.72,4.38 11.15,4 11.66,4 L 12.36,4 12.36,4 C 12.86,4 13.29,4.37 13.35,4.87 L 13.62,6.97 12.9,7.07 13.07,6.36 C 13.63,6.5 14.81,6.97 15.27,7.24 L 14.9,7.87 14.45,7.3 16.06,6.01 16.06,6.01 C 16.46,5.69 17.04,5.73 17.4,6.1 L 17.92,6.63 17.92,6.63 C 18.27,6.99 18.29,7.55 17.98,7.95 L 16.73,9.53 16.16,9.08 16.78,8.71 C 17.05,9.16 17.52,10.37 17.66,10.94 L 16.96,11.12 17.05,10.4 19.12,10.65 19.12,10.65 C 19.62,10.72 20,11.14 20,11.65 Z M 8.94,12 L 8.94,12 C 8.94,13.7 10.32,15.07 12.01,15.07 13.7,15.07 15.07,13.7 15.07,12 15.07,10.31 13.7,8.93 12.01,8.93 10.32,8.93 8.94,10.31 8.94,12 L 8.94,12 Z M 8.94,12"
			/>
		</svg>
	)
}

Settings.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string
}

Settings.defaultProps = {
	width: 24,
	height: 24,
	fill: '#444444',
	className: ''
}

export default Settings
