import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home/Home" //home is imported as a component
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer";
import Navbar from "./Navbar/Navbar";
import "./styles/App.css";


function App() {
  return (
    <div className="App">
      
      <Router> {/* Create a router with a switch that will assign the "/"
       path to the home component.*/}
       <Navbar/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/pathfinding" exact component={PathfindingVisualizer} />
          <Route path="/sorting" exact component={SortingVisualizer} /> 
        </Switch>
      </Router>
      


    </div>
  );
}

export default App;
