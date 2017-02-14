import Immutable from 'immutable'
import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('savedItemsRequest'):
			const { params: { page } } = action
			if (page === 1) {
				return { pages: {}, nextPage: null, items: [] }
			} else {
				return state
			}

		case type('savedItemsFailure'):
			return state

		case type('savedItemsSuccess'):
			if (state.pages) {
				const pages = Immutable.fromJS(state.pages).toJS()
				if (typeof pages[action.params.page] === 'undefined') {
					pages[action.params.page] = true
					return { pages, nextPage: action.response.next_page, items: Immutable.fromJS(state.items).concat(action.response.reading_plans).toJS() }
				} else {
					return state
				}
			} else {
				return state
			}

		default:
			return state
	}
}
