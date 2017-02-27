import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import InputPassword from 'react-ux-password-field';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import axios from "axios";
import {browserHistory} from 'react-router';
import Modal from './modal';
import NavBar from '../navbar';

export default class Profile extends Component {
   constructor(props){
      super(props);
      this.state = {
         mounted: false
      }
   }
   componentWillMount(){
      var that = this;
      axios.get('/checkSignedUpOrIn').then((res) => {
         const {email} = res.data;
         that.setState({
            email
         })
         if (!res.data.loggedIn){
            browserHistory.push('/home');
         }
      });
   }
   componentDidMount () {
		this.setState({ mounted: true });
	}
	handleSubmit (e) {
		this.setState({ mounted: false });
		e.preventDefault();
	}
   render (){
      const {email} = this.state;
      var child
      if (this.state.mounted) {
         child = (<Modal email={email} onSubmit={this.handleSubmit} />);
      }
      return (
         <div className="profile-background-image">
            <NavBar location={this.props.location.pathname} />
            <div className="profile">
   				<CSSTransitionGroup
   					transitionName="Modal"
   					transitionEnterTimeout={500}
   					transitionLeaveTimeout={300}>
   						{child}
   				</CSSTransitionGroup>
   			</div>
         </div>
      );
   }
}
