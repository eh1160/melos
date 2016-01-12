import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import EventFeedMine from './containers/EventFeedMine'
import EventEdit from './containers/EventEdit'
import EventEditDetails from './containers/EventEditDetails'
import EventEditLocation from './containers/EventEditLocation'
import EventEditContent from './containers/EventEditContent'
import EventEditPreview from './containers/EventEditPreview'
import EventEditShare from './containers/EventEditShare'

export default (
  <Route path="/" component={App} >
  	<IndexRoute component={EventFeedMine} />
  	<Route path="/event/edit(/:id)" component={EventEdit} >
  		<IndexRoute component={EventEditDetails} />
  		<Route path="locations_and_times" component={EventEditLocation} />
  		<Route path="content" component={EventEditContent} />
  		<Route path="preview" component={EventEditPreview} />
  		<Route path="share" component={EventEditPreview} />
  	</Route>
  </Route>
)