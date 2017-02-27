import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import axios from "axios";
import Footer from "../../components/footer.js";
import Header from "../../components/header.js";

export default class MainPage extends Component {
   componentWillMount(){
      axios.get('/checkSignedUpOrIn').then((res) => {
         if (res.data.loggedIn){
            browserHistory.push('/home');
         }
      });
   }

   render (){
      return (
         <div>
            <Header />
            <p className="welcome-paragraph-header"> Enjoy the best Arabic movies! </p>
            <div>
               <p className="welcome-paragraph-signin"> Already a member <i className="fa fa-smile-o" /> <Link className="welcome-link-signin" to="signin">Sign in</Link> <i className="fa fa-film"/></p>
               <p className="welcome-paragraph-signin-2"> Not a member <i className="fa fa-frown-o"/> <Link className="welcome-link-signup" to="signup">Sign up</Link> <i className="fa  fa-youtube-play"/></p>
            </div>
            <div className="welcome-background-image"> </div>
            <Footer />
         </div>
      );
   }
}
