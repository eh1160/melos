import Immutable from 'immutable'

import type from '../actions/constants'
import bibleType from '../../Bible/actions/constants'


export default function reducer(state = {}, action) {
	switch (action.type) {
		case type('restartSubscriptionSuccess'):
		case type('resetSubscriptionSuccess'):
		case type('updateSubscribeUserSuccess'):
		case type('planInfoSuccess'):
			return (function planInfoSuccess() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const fromApiPlan = action.response
				const plan = Immutable.fromJS(inStatePlan).mergeDeep(fromApiPlan).toJS()
				return Immutable.fromJS(state).mergeDeep({ [plan.id]: plan }).toJS()
			}())

		case type('calendarSuccess'):
			return (function calendarSuccess() {
				const inStatePlan = state[action.params.id] || { id: action.params.id }
				const calendar = action.response
				// lets go through and mark all days with no content as completed like the apps do
				const updatedCal = calendar.calendar.map((day) => {
					if (
						day.references.length === 0
						&& !((typeof day.additional_content.html !== 'undefined' && day.additional_content.html !== null) ||
							(typeof day.additional_content.text !== 'undefined' && day.additional_content.text !== null))
					) {
						day.completed = true
					}
					return day
				})
				const plan = Immutable.fromJS(inStatePlan).mergeDeep({ calendar: updatedCal }).toJS()
				return Immutable.fromJS(state).mergeDeep({ [action.params.id]: plan }).toJS()
			}())

		case bibleType('bibleVersesSuccess'):
			return (function bibleVersesSuccess() {
				const { response: verse } = action
				let plan_id = null
				let plan_content = null
				let plan_day = null
				if (typeof action.extras !== 'undefined') {
					plan_id = parseInt(action.extras.plan_id, 10)
					plan_content = parseInt(action.extras.plan_content, 10)
					plan_day = parseInt(action.extras.plan_day, 10)
				}

				if (['string', 'number'].indexOf(typeof plan_id) > -1 && state[plan_id] &&
					!Number.isNaN(plan_content) && !Number.isNaN(plan_day)
				) {
					const plan = Immutable
						.fromJS(state[plan_id])
						.mergeDeepIn(['calendar', plan_day - 1, 'reference_content', plan_content], verse.verses[0])
						.mergeDeepIn(['calendar', plan_day - 1], { hasReferences: true })
						.toJS()
					return Immutable.fromJS(state).mergeDeep({ [plan.id]: plan }).toJS()
				}
				return state
			}())

		case bibleType('bibleChapterSuccess'):
			return (function bibleChapterSuccess() {
				const { response: verse } = action
				let plan_id = null
				let plan_content = null
				let plan_day = null
				if (typeof action.extras !== 'undefined') {
					plan_id = parseInt(action.extras.plan_id, 10)
					plan_content = parseInt(action.extras.plan_content, 10)
					plan_day = parseInt(action.extras.plan_day, 10)
				}

				if (['string', 'number'].indexOf(typeof plan_id) > -1 && state[plan_id] &&
					!Number.isNaN(plan_content) && !Number.isNaN(plan_day)
				) {
					const plan = Immutable
						.fromJS(state[plan_id])
						.mergeDeepIn(['calendar', plan_day - 1, 'reference_content', plan_content], verse)
						.mergeDeepIn(['calendar', plan_day - 1], { hasReferences: true })
						.toJS()
					return Immutable.fromJS(state).mergeDeep({ [plan.id]: plan }).toJS()
				}
				return state
			}())

		case type('planSelect'):
			return (function planSelect() {
				const inStatePlan = state[action.id] || { id: action.id }
				const plan = Immutable.fromJS(inStatePlan).toJS()
				return Immutable.fromJS(state).set('_SELECTED', plan).toJS()
			}())

		case type('updateCompletionSuccess'):
			return (function updateCompletionSuccess() {
				const { params: { day, id }, response: { references, additional_content } } = action
				// the api just comes back with the id if we've completed the plan
				if (!('references' in action.response) && !('additional_content' in action.response)) {
					return state
				}

				if (['string', 'number'].indexOf(typeof id) > -1 && state[id]) {
					let dayObj = Immutable.fromJS(state[id].calendar[day - 1])

					if (references !== 'undefined' && references.length > 0) {
						// build completed and remaining refs from api response
						const completedRefs = []
						const remainingRefs = []
						references.forEach((ref) => {
							if (ref.completed) {
								completedRefs.push(ref.reference)
							} else {
								remainingRefs.push(ref.reference)
							}
						})
						dayObj = dayObj
							.set('references_completed', completedRefs)
							.set('references_remaining', remainingRefs)

						// now check if all refs are completed
						if (completedRefs.length === references.length) {
							// if devo and all refs are completed, then the day is complete
							// or there is no devo, but it still defaults to complete
							dayObj = dayObj.set('refs_completed', true)
							if (additional_content.completed) {
								dayObj = dayObj.set('completed', true)
							}
						}
					} else {
					// if there are no refs then if the devo is complete, than so is the day
						dayObj = dayObj.set('completed', additional_content.completed)
					}

					// whether or not we have refs, we'll match the devo content with the
					// api response (default is true even if there is no devo content)
					dayObj = dayObj.setIn(['additional_content', 'completed'], additional_content.completed)
					const plan = Immutable.fromJS(state[id]).setIn(['calendar', day - 1], dayObj.toJS()).toJS()
					return Immutable.fromJS(state).set(plan.id, plan).toJS()
				} else {
					return state
				}

			}())

		default:
			return state
	}
}
