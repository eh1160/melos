import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class ContentHeader extends Component {

	handleCreate(clickEvent) {

	}

	handleHelp(clickEvent) {

	}

	render() {
		const { event, handleAddText, handleAddLink, handleAddAnnouncement, handleAddReference, handleAddPlan, handleAddGiving } = this.props
		return (
			<div className='content-header'>
				<Row>
					<Column s='medium-12'>
						<a onClick={handleAddText} className='hollow-button green'>Text</a>
						<a onClick={handleAddReference} className='hollow-button green'>Bible Reference</a>
						<a onClick={handleAddPlan} className='hollow-button green'>Plan</a>
						<a onClick={::this.handleCreate} className='hollow-button green'>Image</a>
						<a onClick={handleAddLink} className='hollow-button green'>External Link</a>
						<a onClick={handleAddGiving} className='hollow-button green'>Giving Link</a>
						<a onClick={handleAddAnnouncement} className='hollow-button green'>Announcement</a>
						<div className='right'>
							<a onClick={::this.handleHelp}>?</a>
						</div>
					</Column>
				</Row>
			</div>
		)
	}

}

ContentHeader.propTypes = {

}

export default ContentHeader
