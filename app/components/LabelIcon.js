import React, { Component } from 'react'

class LabelIcon extends Component {

	render() {
		const width = this.props.width || 17
		const height = this.props.height || 17
		const fill = this.props.fill || '#979797'

	  return (
			<svg className='label-icon' viewBox="0 0 16 16" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
				<path stroke="none" fill={fill} fill-rule="evenodd" d="M1.02039116,9.00034007 L1.02039116,9.00034007 L1.02039116,9.00034007 C1.02031626,9.04463194 1.02031626,9.04463194 1.0199723,9.24387698 C1.01950899,9.50953124 1.01950899,9.50953124 1.0188374,9.88586966 C1.01764394,10.5500027 1.01639415,11.2141381 1.01514881,11.8340136 C1.01445131,12.1811947 1.01377385,12.5049784 1.01312246,12.8009676 C1.01107513,13.7312601 1.00937117,14.3499362 1.00811297,14.57699 C1.00718317,14.7447822 1.24332649,14.9826077 1.39330222,14.9855081 C1.65739711,14.9906155 2.65443278,14.9898809 4.12596473,14.9847476 C4.4635053,14.9835701 4.81819165,14.9821875 5.18415728,14.9806414 C5.61552394,14.978819 6.04017545,14.9768664 6.43979298,14.9749137 C6.66415145,14.9738073 6.66415145,14.9738073 6.81771505,14.9730264 C6.93130306,14.9724408 6.93130306,14.9724408 6.95578422,14.972311 L6.25518003,15.2639908 L14.9905695,6.55820915 C14.9917528,6.5570299 14.9917586,6.55547782 14.9939621,6.55769093 L9.45987795,0.999552356 C9.45992095,0.99959554 9.46397842,0.99960112 9.46072565,1.0028426 L0.726269077,9.70698399 L1.02039116,9.00034007 Z M8.75484916,0.294507658 C9.15047852,-0.0997485642 9.77981367,-0.0964116915 10.1685165,0.293980655 L15.7026006,5.85211923 C16.0901007,6.24130361 16.0885608,6.87575826 15.6964749,7.26651529 L6.96108542,15.9722969 C6.96108542,15.9722969 2.0474357,15.9983455 1.37396661,15.9853212 C0.700497523,15.9722968 0.00404023564,15.309183 0.00812832494,14.5714487 C0.0122164142,13.8337144 0.0203925931,8.99864905 0.0203925931,8.99864905 L8.75484916,0.294507658 Z M3.7898975,13.6156328 C3.09943645,13.6156328 2.5404918,13.0563806 2.5404918,12.3652367 C2.5404918,11.6756771 3.09943645,11.1156328 3.7898975,11.1156328 C4.48035854,11.1156328 5.04049159,11.6756771 5.04049159,12.3652367 C5.04088773,13.0563806 4.48075467,13.6156328 3.7898975,13.6156328 Z" ></path>
			</svg>
	  );
	}
}

export default LabelIcon