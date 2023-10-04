import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import BookList from './views/BookList';
import BookDetails from './views/BookDetails';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact Component={BookList} />
        <Route path='/book/:id' Component={BookDetails} />
      </Switch>

    </Router>
   
  );
}

export default App;
