import { Switch, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import MainPage from "./Components/MainPage/MainPage";

const App = () => {
  return (
    <Switch>
      <Route path={"/ECGDataAnalyzer"}>
        <MainPage />
      </Route>
      <Route path={"/"}>
        <HomePage />
      </Route>
    </Switch>
  );
};

export default App;
