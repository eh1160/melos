import contentType from './constants'
import { validateSetContentFieldParams, validateRemoveContentParams, validateAddContentParams } from '../validators/content'

const ActionCreators = {
	add(params) {
		validateAddContentParams(params)
		return {
			params: {
				...params,				
			},
			api_call: {
				endpoint: 'events',
				method: 'add_content',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: params,
				http_method: 'post',
				types: [ contentType('addRequest'), contentType('addSuccess'), contentType('addFailure') ]
			}
		}
	},

	setField(params) {
		validateSetContentFieldParams(params)
		return {
			type: contentType('setField'),
			...params
		}	
	},

	update(params) {
		validateAddContentParams(params)
		return {
			params: {
				...params,				
			},
			api_call: {
				endpoint: 'events',
				method: 'update_content',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: params,
				http_method: 'post',
				types: [ contentType('updateRequest'), contentType('updateSuccess'), contentType('updateFailure') ]
			}
		}
	},

	remove(params) {
		validateRemoveContentParams(params)
		return {
			params: {
				...params,				
			},
			api_call: {
				endpoint: 'events',
				method: 'remove_content',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: params,
				http_method: 'post',
				types: [ contentType('updateRequest'), contentType('updateSuccess'), contentType('updateFailure') ]
			}
		}
	},

	reorder(params) {
		validateReorderContentParams(params)
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'reorder_content',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: params,
				http_method: 'post',
				types: [ contentType('reorderRequest'), contentType('reorderSuccess'), contentType('reorderFailure') ]
			}
		}
	}
}

export default ActionCreators