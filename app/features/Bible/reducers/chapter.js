import type from '../actions/constants'
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('bibleChapterRequest'):
			return { loading: true }

		case type('bibleChapterFailure'):
			return { loading: false }

		case type('bibleChapterSuccess'):
			return Immutable.fromJS(action.response).delete('audio').toJS()

		default:
			return state
	}
}