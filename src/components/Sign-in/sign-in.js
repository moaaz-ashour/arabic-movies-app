import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import {browserHistory} from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Modal from './modal';

export default class SignIn extends Component {
   constructor(props){
      super(props);
      this.state = {
         mounted: false
      }
   }
   componentWillMount(){
      axios.get('/checkSignedUpOrIn').then((res) => {
         if (res.data.loggedIn){
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
      var child;
		if (this.state.mounted) {
			child = (<Modal onSubmit={this.handleSubmit} />);
      }
      return (
         <div className="sign-in">
				<CSSTransitionGroup
					transitionName="Modal"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}>
						{child}
				</CSSTransitionGroup>
			</div>
      )
   }
}
