import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import axios from "axios";
import {browserHistory} from 'react-router';
import Input, * as inputHelper from 'react-validated-input';
import Header from "../header.js";
import Footer from "../footer.js";

export default class Modal extends Component {
   constructor(props){
      super(props);
      this.state = {
         target: {},
         username: null,
         email: null,
         password: null,
         emailExistsInDb: false,
         validation: {
            results: ""
         }
      };
   }

   doValidateAll() {
      inputHelper.validate(this, [this.state.target], null, ["validation"])
      .then ( () => {
         const {username, email, password} = this.state.target;
         axios.post('/signup', {username, email, password}).then((res) => {
            if (res.data.success) {
               browserHistory.push('/home');
            } else {
               const {emailExistsInDb} = res.data;
               this.setState({
                  emailExistsInDb: emailExistsInDb
               });
            }
         });
         this.setState({
            usernameError: null,
            emailError: null,
            passwordError: null
         })
      },
        (errorMessage) => {
            const error = this.state.validation.results;
            this.setState({
               usernameError: error.username,
               emailError: error.email,
               passwordError: error.password,
            })
            this.state.validation.targets = [];
         }
      ).catch((err) => console.log(err))
   }

   render (){
      return (
         <div className="signup-background-image">
            <Header />
            <div className="signup-form">
               <div style={{width: "200px"}} className="Modal-sign-up">
      				<div className="ModalForm">
                     <Input type="text" validate={this.state.validation} instance={this.state.target} propertyKey="username" rules={{presence: true}} placeholder="Username"/>
                        {this.state.validation.results.username ? (<p style={{color: "yellow"}}> {this.state.usernameError} </p>) : null}
                     <Input type="email" validate={this.state.validation} instance={this.state.target} propertyKey="email" rules={{presence: true, email: true}} placeholder="Email Address"/>
                        {this.state.validation.results.email ? (<p style={{color: "yellow"}}> {this.state.emailError} </p>) : null}
                     <Input type="password" validate={this.state.validation} instance={this.state.target} propertyKey="password" rules={{presence: true}} placeholder="Your Password"/>
                        {this.state.validation.results.password ? (<p style={{color: "yellow"}}> {this.state.passwordError} </p>) : null}
         				<button onClick = {() => this.doValidateAll()}>
         					SIGN UP <i className="fa fa-fw fa-angle-double-right"></i>
         				</button>
                     <div style={{fontFamily:"monospace", color:'white', fontSize:'13px', margin:"10px 20px", width:"160px"}}> Have an account? Sign in <Link to="/signin">here</Link>.</div>
         			</div>
                  <div className="email-exists-in-db"> { this.state.emailExistsInDb }</div>
         		</div>
               <div> <p className="signup-paragraph">Sign up now and enjoy a variety of Arabic movies.</p> </div>
            </div>
            <Footer />
         </div>
      )
   }
}
