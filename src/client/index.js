import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App from '../shared/components/App'
import HomePage from '../shared/components/HomePage'
import NotFoundPage from '../shared/components/NotFoundPage'

render(
  (
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={HomePage} />
        <Route path='*' component={NotFoundPage} />
      </Route>
    </Router>
  ),
  document.getElementById('root')
)
