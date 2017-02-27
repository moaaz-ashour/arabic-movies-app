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
         email: null,
         password: null,
         emailNotExist: null,
         passwordErr: false,
         validation: {
            results: ""
         }
      };
   }

   doValidateAll() {
      inputHelper.validate(this, [this.state.target], null, ["validation"])
      .then ( () => {
         const {email, password} = this.state.target;
         axios.post('/signin', {email, password}).then((res) => {
            if (!res.data.emailSuccess) {
               const {emailNotExist} = res.data;
               this.setState({
                  emailNotExist: emailNotExist
               })
            }

            if (res.data.passSuccess && res.data.emailSuccess){
               browserHistory.push('/home');
            } else {
               const {wrongPass} = res.data;
               this.setState({
                  passwordErr: wrongPass
               });
            }
         });
      },
         (errorMessage) => {
            const error = this.state.validation.results;
            this.setState({
               emailError: error.email,
               passwordError: error.password
            });
            this.state.validation.targets = [];
         }
      ).catch((err) => console.log(err))
   }

   render (){
      return (
         <div className="signin-background-image">
            <Header />
            <div className="signin-form">
               <div style={{width: "200px"}} className="Modal-sign-in">
      				<div className="ModalForm">
                     <Input type="email" validate={this.state.validation} instance={this.state.target} propertyKey="email" rules={{presence: true, email: true}} placeholder="Email Address"/>
                        {this.state.validation.results.email ? (<p style={{color: "yellow"}}> {this.state.emailError} </p>) : null}
                     <Input type="password" validate={this.state.validation} instance={this.state.target} propertyKey="password" rules={{presence: true}} placeholder="Your Password"/>
                        {this.state.validation.results.password ? (<p style={{color: "yellow"}}> {this.state.passwordError} </p>) : null}
      					<button onClick = {() => this.doValidateAll()}>
      						Log in <i className="fa fa-fw fa-angle-double-right"></i>
      					</button>
                     <div style={{color:'white', fontSize:'13px', margin:"10px 20px", fontFamily: "monospace"}}> No acount yet? Sign up <Link to="/signup"> here</Link>.</div>
      				</div>
                  <div className="wrong-password"> { this.state.passwordErr }</div>
                  <div className="email-does-not-exist"> { this.state.emailNotExist }</div>
   			   </div>
               <p className="signin-paragraph">Please sign in to your account.</p>
            </div>
            <Footer />
         </div>
      )
   }
}
