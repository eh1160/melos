import React, { Component, PropTypes } from 'react'
import ImageDrop from '../../../../../../app/components/ImageDrop'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { Link } from 'react-router'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import Select from '../../../../../../app/components/Select'
import Textarea from '../../../../../../app/components/Textarea'
import ErrorMessage from '../../../../../../app/components/ErrorMessage'

class DetailsEdit extends Component {
	render() {
		const { handleChange, handleNext, event, params } = this.props

		return (
			<form className="event-edit-details-form">
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<ErrorMessage hasError={Boolean(event.api_errors)} errors={event.api_errors} />
						<FormField disabled={!event.rules.details.canEdit} InputType={Input} size='large' placeholder='Event Name' name='title' onChange={handleChange} value={event.item.title} errors={event.errors.fields.title} />
					</div>
				</Row>

				<ImageDrop instruction="Ideally your image dimensions should be 1200 x 600 pixels, but don’t worry if it isn’t; we’ll make it work."/>

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField disabled={!event.rules.details.canEdit} InputType={Input} size='medium' placeholder="Church Name or Organization" name="org_name" onChange={handleChange} value={event.item.org_name} errors={event.errors.fields.org_name} />
					</div>
				</Row>

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField disabled={!event.rules.details.canEdit} InputType={Textarea} placeholder="Event Description" name="description" onChange={handleChange} value={event.item.description} errors={event.errors.fields.description} />
					</div>
				</Row>

				<Row>
					<Column s='medium-12' a='right'>
						<a disabled={event.errors.hasError || !event.rules.locations.canView} onClick={handleNext}>Next: Add Location & Times</a>
					</Column>
				</Row>
			</form>
		)
	}

}

DetailsEdit.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	handleLeave: PropTypes.func.isRequired,
	event: PropTypes.object.isRequired
}

export default DetailsEdit
