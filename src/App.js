import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Articles from './components/articles/articles';
import Summary from './components/summary/summary';

function App() {
  return <>
    <Router>
      <Switch>
        <Route exact path={'/'} component={Articles} />
        <Route exact path={'/summary'} component={Summary} />
      </Switch>
    </Router>
  </>
}

export default App;