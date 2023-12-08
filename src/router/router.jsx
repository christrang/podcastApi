import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
//import DetailsPodcast from "../DetailsPodcast.jsx";
import NoMatch from "../NoMatch.jsx";
import Root from "../Root.jsx";
import Login from "../Login.jsx";
import SignUp from "../SignUp.jsx";
//import Subscription from "../Subscription.jsx";

const Router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <NoMatch />,
      children: [
        {path: "/", element: <App />},
        //{path: "/podcast/:id", element: <DetailsPodcast />},
        {path: "/login", element: <Login />},
        {path: "/signUp", element: <SignUp />},
        //{path: "/subscriptions", element: <Subscription />}
      ]},
  ]);
  
  export default Router;
  