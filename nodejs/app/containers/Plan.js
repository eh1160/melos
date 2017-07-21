import React, { Component } from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { FormattedHTMLMessage } from 'react-intl'
import rtlDetect from 'rtl-detect'
import moment from 'moment'
import { routeActions } from 'react-router-redux'
// actions
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import subscriptionDay from '@youversion/api-redux/lib/batchedActions/subscriptionDay'
import subscriptionDayUpdate from '@youversion/api-redux/lib/batchedActions/subscriptionDayUpdate'
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
// selectors
// utils
import { calcCurrentPlanDay, isFinalSegment } from '../lib/readingPlanUtils'
import Routes from '../lib/routes'
import { getBibleVersionFromStorage } from '../lib/readerUtils'
// components
import PlanComponent from '../features/PlanDiscovery/components/Plan'


class Plan extends Component {
	componentDidMount() {
		const { dispatch, params: { id, subscription_id, day }, serverLanguageTag } = this.props
		if (subscription_id) {
			const plan_id = id.split('-')[0]
			// get sub data
			dispatch(subscriptionDay({
				plan_id,
				subscription_id,
				language_tag: serverLanguageTag,
				day,
			}))
			// get bible version for building reference strings
			dispatch(bibleAction({
				method: 'version',
				params: {
					id: getBibleVersionFromStorage(),
				}
			}))
		}
	}

	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl = () => {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	onCatchUp = () => {
		const { dispatch, auth, subscription } = this.props
		if (subscription) {
			// calculate last completed day to set the new start date
			let newStartDt = null
			subscription.days.some((progressDay, i) => {
				// start plan however many days are completed away from today
				// i.e. we have 2 days completed and we're behind, let's start the plan
				// 2 days ago
				newStartDt = moment().subtract(i, 'days').toISOString()
				return !progressDay.complete
			})
			if (newStartDt) {
				dispatch(plansAPI.actions.subscription.put({
					id: subscription.id
				}, {
					auth: auth.isLoggedIn,
					body: {
						start_dt: newStartDt
					}
				})).then(() => {
					// refresh progress
					dispatch(plansAPI.default.actions.progress.get({
						id: subscription.id,
						page: '*',
						fields: 'days,overall'
					}, {
						auth: true
					}))
				})
			}
		}
	}

	OnContentCheck = ({ contentIndex, complete }) => {
		const { params: { day, subscription_id, id }, dispatch, auth } = this.props

		dispatch(subscriptionDayUpdate({
			contentIndex,
			complete,
			daySegments: this.daySegments,
			dayProgress: this.dayProgress,
			subscription_id,
			day
		}))

		if (isFinalSegment(contentIndex, this.dayProgress.partial)) {
			dispatch(routeActions.push(Routes.subscriptionDayComplete({
				username: auth.userData.username,
				plan_id: id.split('-')[0],
				slug: id.split('-')[1],
				subscription_id,
				day,
			})))
		}
	}

	render() {
		const { children, subscription, plan, bible, params: { day } } = this.props

		this.daySegments = null
		this.currentDay = null
		this.dayProgress = null
		let progressDays = null
		let progressString = null
		let dayOfString = null
		let startString = null
		let endString = null
		let subscription_id = null
		const together_id = subscription && 'together_id' in subscription ?
												subscription.together_id : null
		if (plan && subscription && subscription.start_dt) {
			subscription_id = subscription.id
			this.currentDay = day ||
				calcCurrentPlanDay({
					total_days: plan.total_days,
					start_dt: subscription.start_dt
				})
			dayOfString = (
				<FormattedHTMLMessage
					id='plans.which day in plan'
					values={{
						day: calcCurrentPlanDay({
							total_days: plan.total_days,
							start_dt: subscription.start_dt
						}),
						total: plan.total_days
					}}
				/>
			)
			startString = moment(subscription.start_dt).format('dddd, MMMM Do YYYY')
			endString = moment(subscription.start_dt)
				.add(plan.total_days, 'days')
				.format('dddd, MMMM Do YYYY')
			progressDays = subscription.days
				? subscription.days
				: null
			this.dayProgress = progressDays && progressDays[this.currentDay - 1]
				? progressDays[this.currentDay - 1]
				: null
			progressString = subscription.overall
				? subscription.overall.progress_string
				: null
		}

		this.daySegments = plan
			&& plan.days
			&& plan.days[this.currentDay - 1]
			? plan.days[this.currentDay - 1].segments
			: null

		const bookList = Immutable
			.fromJS(bible)
			.getIn(['versions', getBibleVersionFromStorage(), 'response', 'books'])

		return (
			<PlanComponent
				{...this.props}
				localizedLink={::this.localizedLink}
				isRtl={::this.isRtl}
				together_id={together_id}
				day={this.currentDay}
				progressDays={progressDays}
				dayProgress={this.dayProgress}
				daySegments={this.daySegments}
				progressString={progressString}
				bookList={bookList ? bookList.toJS() : null}
				start_dt={subscription ? subscription.start_dt : null}
				subscription_id={subscription ? subscription.id : null}
				handleContentCheck={this.OnContentCheck}
				handleCatchUp={this.onCatchUp}
			>
				{
					children &&
					React.cloneElement(children, {
						localizedLink: this.localizedLink,
						isRtl: this.isRtl,
						together_id,
						day: this.currentDay,
						progressDays,
						subscription_id,
						dayOfString,
						startString,
						endString,
					})
				}
			</PlanComponent>
		)
	}
}

function mapStateToProps(state, props) {
	const { params: { id, subscription_id } } = props
	const plan_id = id.split('-')[0]
	console.log('SUB', getSubscriptionModel(state));
	return {
		plan: getPlansModel(state) && plan_id in getPlansModel(state).byId ?
					getPlansModel(state).byId[plan_id] :
					null,
		subscription: getSubscriptionModel(state) && subscription_id in getSubscriptionModel(state).byId ?
									getSubscriptionModel(state).byId[subscription_id] :
									null,
		bible: getBibleModel(state),
		savedPlans: state.readingPlans && state.readingPlans.savedPlans ? state.readingPlans.savedPlans : null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts
	}
}

Plan.propTypes = {

}

export default connect(mapStateToProps, null)(Plan)
