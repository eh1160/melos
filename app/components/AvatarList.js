import React, { Component, PropTypes } from 'react'
import Image from './Carousel/Image'
import { Link } from 'react-router'

class AvatarList extends Component {

	render() {
		const { avatarList } = this.props

		if (!avatarList) return <div></div>

		var friends = avatarList.map((friend) => {
			return (
				<a className='avatar'>
					<a href={friend.avatar.action_url}>
						<Image width={120} height={120} thumbnail={false} imageId="false" type="avatar" config={friend.avatar.renditions} />
					</a>
				</a>
			)
		})


		return (
			<div className='avatar-container'>
				{friends}
			</div>
		)
	}
}

export default AvatarList