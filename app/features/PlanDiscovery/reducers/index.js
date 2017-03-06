import Immutable from 'immutable'
import type from '../actions/constants'

export default function plansDiscovery(state = {}, action) {
	switch (action.type) {
		case type('discoverRequest'):
			return Immutable.fromJS(state).mergeDeep({ isFetching: true, hasErrors: false, errors: [] }).toJS()

		case type('discoverFailure'):
			return Immutable.fromJS(state).mergeDeep({ isFetching: false, hasErrors: true, errors: action.errors }).toJS()

		case type('discoverSuccess'):
			var items = action.response.items.map((item) => {
				return Immutable.fromJS(item).set('items', []).toJS()
			})
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], items, map: buildMap(items) }).toJS()

		case type('planSaveforlaterRequest'):
		case type('planRemoveSaveRequest'):
		case type('planInfoRequest'):
		case type('planStatsRequest'):
		case type('savedItemsRequest'):
		case type('recommendationsItemsRequest'):
		case type('collectionsItemsRequest'):
		case type('planSubscribeRequest'):
		// case type("userSubscriptionsRequest"):
			if (action.params.uiFocus) {
				return Immutable.fromJS(state).mergeDeep({ isFetching: true, hasErrors: false, errors: [], collection: { isFetching: true } }).toJS()
			} else {
				return Immutable.fromJS(state).mergeDeep({ isFetching: true, hasErrors: false, errors: [] }).toJS()
			}


		case type('planSaveforlaterFailure'):
		case type('planRemoveSaveFailure'):
		case type('planInfoFailure'):
		case type('planStatsFailure'):
		case type('savedItemsFailure'):
		case type('collectionsItemsFailure'):
		case type('planSubscribeFailure'):
		// case type("userSubscriptionsFailure"):
			return Immutable.fromJS(state).mergeDeep({ isFetching: false, hasErrors: true, errors: action.errors, collection: { isFetching: false } }).toJS()

		case type('recommendationsItemsFailure'):
			// if there are no related plans let's clear it out so we don't show related plans from a previous plan
			if (action.params.readingplanInfo) {
				return Immutable.fromJS(state).mergeDeep({ isFetching: false, hasErrors: true, errors: action.errors, collection: { isFetching: false } }).deleteIn(['plans', 'related']).toJS()
			} else {
				return Immutable.fromJS(state).mergeDeep({ isFetching: false, hasErrors: true, errors: action.errors, collection: { isFetching: false } }).toJS()
			}

		case type('collectionsItemsSuccess'):
			if (action.params.uiFocus) {

				let collection
				if (action.params.ids.indexOf(state.collection.id) > -1) {
					const uniqueKeys = {}
					const allItems = [
						...state.collection.items,
						...action.response.collections[0].items
					].map((item) => {
						if (!uniqueKeys[item.id]) {
							uniqueKeys[item.id] = true
							return item
						}
					})
					const next_page = action.response.collections[0].next_page || 0
					collection = Immutable.fromJS(action.response.collections[0]).mergeDeep(state.collection).set('items', allItems).set('next_page', next_page).toJS()
				} else {
					collection = Immutable.fromJS(action.response.collections[0]).set('next_page', action.response.collections[0].next_page || 0).toJS()
				}

				const responseItems = collection.items.map((item) => {
					if (item.type === 'collection') {
						return Immutable.fromJS(item).set('items', []).toJS()
					} else {
						return item
					}
				})
				const map = buildMap(responseItems) // let's build a mapping for placing collections items inside any of these collections
				var updatedCollection = Immutable.fromJS(collection).mergeDeep({ map, isFetching: false }).toJS()
				return Immutable.fromJS(state).mergeDeep({ isFetching: false }).set('collection', updatedCollection).toJS()

			//  if a collection is inside a collection, then we need to get those items
			} else if (action.params.collectInception) {
				const { collections } = action.response
				var items = state.collection.items.slice(0)
				const updatedstateItems = populateItems(collections, items, state.collection.map)
				var updatedCollection = Immutable.fromJS(state.collection).set('items', updatedstateItems).toJS()
				return Immutable.fromJS(state).mergeDeep({ isFetching: false, collection: updatedCollection }).toJS()

			} else {
				const { collections } = action.response
				var items = state.items.slice(0)
				const updatedStateItems = populateItems(collections, items, state.map)
				return Immutable.fromJS(state).mergeDeep({ isFetching: false, hasErrors: false, errors: [], items: updatedStateItems }).toJS()
			}

		case type('savedItemsSuccess'):
		case type('recommendationsItemsSuccess'):

			if (action.params.readingplanInfo) {
				var reading_plans = action.response.reading_plans.map((plan) => {
					let p = Immutable.fromJS(plan).mergeDeep({ title: plan.name.default, type: 'reading_plan' })

					// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
					if (plan.images != null) p = p.set('image_id', plan.id) // else plan.image_id doesn't exist

					return p.toJS()
				})
				console.log(state.plans)
				return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { related: { items: reading_plans, id: action.params.id } } }).toJS()

			} else if (action.params.savedplanCheck) {
				var { reading_plans } = action.response
				const saved = typeof (reading_plans.find((plan) => { return plan.id == action.params.id })) !== 'undefined'
				return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { saved } }).toJS()

			} else if (action.params.dynamicCollection) { // let's populate collection view data for related or saved plans view
				var reading_plans = action.response.reading_plans.map((plan) => {
					let p = Immutable.fromJS(plan).mergeDeep({ title: plan.name.default, type: 'reading_plan' })

					// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
					if (plan.images != null) p = p.set('image_id', plan.id) // else plan.image_id doesn't exist

					return p.toJS()
				})
				if (action.params.context == 'saved') {
					return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], collection: { id: 'saved', context: 'saved' } }).setIn(['collection', 'items'], reading_plans).toJS()
				} else {
					return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], collection: { id: action.params.id, context: 'recommended' } }).setIn(['collection', 'items'], reading_plans).toJS()
				}

			} else {
				var { reading_plans } = action.response
				var items = state.items.slice(0)
				// saved items and recommended are the same except saved doesn't come back with an id, so we set it to "saved" in discoverSuccess
				const discoveryIndex = Array.isArray(state.map) ? state.map[action.params.id] : null

				var reading_plans = action.response.reading_plans.map((plan) => {
					let p = Immutable.fromJS(plan)

					if (discoveryIndex !== null && typeof discoveryIndex !== 'undefined') {
						p = p.mergeDeep({ title: plan.name.default, type: 'reading_plan' })
						// when slides are being built, if there are no images then when the slide checks for image_id, it'll be null
						if (plan.images != null) p = p.set('image_id', plan.id) // else plan.image_id doesn't exist
					}

					return p.toJS()
				})

				if (discoveryIndex !== null && typeof discoveryIndex !== 'undefined') {
					items[discoveryIndex] = Immutable.fromJS(items[discoveryIndex]).set('items', reading_plans).toJS()
				}

				return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], items }).toJS()
			}

		case type('planSaveforlaterSuccess'):
		case type('planRemoveSaveSuccess'):
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { saved: !state.plans.saved } }).toJS()

		case type('planInfoSuccess'):
			return (function () {
				let newState
				if ('plans' in state && state.plans.id === action.response.id) {
					newState = Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: action.response }).toJS()
				} else {
					newState = Immutable
						.fromJS(state)
						.set('plans', action.response)
						.set('hasErrors', false)
						.set('errors', [])
						.toJS()
				}
				return newState
			}())

		case type('planStatsSuccess'):
			return Immutable.fromJS(state).mergeDeep({ hasErrors: false, errors: [], plans: { stats: action.response } }).toJS()

		case type('configurationRequest'):
		case type('configurationFailure'):
			return state

		case type('configurationSuccess'):
			return Immutable.fromJS(state).mergeDeep({ configuration: action.response }).toJS()

		default:
			return state
	}
}


/**
 * @brief: 		[ goes through each collection and populates the items for that collection
 * 							based on the map of where each collection is in the state ]
 *
 * @param: 		{object}  collections  [ all the collections to loop through and populate items for ]
 * @param:  	{array}  	stateItems   [ the current items in the state (could be state.items for planDiscovery, or state.collection.items for
 * 																		 populating items for collections) ]
 * @param: 	  {object}  map          [ map for determining what collection is where in the list ]
 */
function populateItems(collections, stateItems, map) {
	collections.forEach((collection) => {
		const discoveryIndex = map[collection.id]
		if (typeof discoveryIndex !== 'undefined') {
			let newItems = collection.items
			if (Array.isArray(stateItems[discoveryIndex].items)) {
				newItems = [
					...stateItems[discoveryIndex].items,
					...collection.items
				]
			}
			stateItems[discoveryIndex] = Object.assign({}, stateItems[discoveryIndex], collection, { items: newItems })
		}
	})
	return stateItems
}


/**
 * @brief: 		[ builds a map that relates the collection id to its index
 * 							used to populateItems() ]
 *
 * @param     {array}		responseItems  [ items received from response (new collections items) ]
 */
function buildMap(responseItems) {
	const map = {}
	responseItems.forEach((item, index) => {
		if (item.type === 'saved') {
			map.saved = index
		} else {
			map[item.id] = index
		}
	})
	return map
}
