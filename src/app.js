import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import MainPage from "./components/Main-page/main-page";
import SignUp from "./components/Sign-up/sign-up";
import SignIn from "./components/Sign-in/sign-in";
import HomePage from "./components/Home/home-page";
import Profile from "./components/Profile/profile";


class App extends React.Component {
   render(){
      return (
         <Router history={browserHistory}>
            <Route path="/" component={MainPage}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/signin" component={SignIn}/>
            <Route path="/home" component={HomePage}/>
            <Route path="/profile" component={Profile}/>
         </Router>
      )
   }
}

ReactDOM.render(<App />, document.getElementById('root'));
