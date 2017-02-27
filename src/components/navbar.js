import React from 'react';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import axios from "axios";

export default class NavBar extends React.Component {
   constructor(props){
      super(props);
      this.state = {

      };
   }
   handleLogout() {
      axios.get('/logout').then((res) => {
         if (res.data.loggedOut){
            browserHistory.push('/');
         }
      });
   }
   render() {
      return (
         <div className="navbar-main">
            <div className="navbar-left-link">
               {this.props.location === "/profile" ? <Link to="/" className="nav-link">Home</Link> : <Link to="/profile" className="nav-link">Profile</Link>}
            </div>

            <div className="navbar-center">
               {this.props.location === "/profile" ? <div className="navbar-center-profile">Arabic Movies Forum </div> : <div className="navbar-center-main">Arabic Movies Forum </div>}
            </div>

            <div className="navbar-left-link">
               <Link onClick={() => this.handleLogout()} className="nav-link"  to="/logout"> Log Out</Link>
            </div>
         </div>
      );
   }
}
