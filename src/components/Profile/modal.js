import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import axios from "axios";
import {browserHistory} from 'react-router';
import Input, * as inputHelper from 'react-validated-input';


export default class Modal extends Component {
   constructor(props){
      super(props);
      this.state = {
         target: {
            email: this.props.email
         },
         email: this.props.email,
         emailNotValid: null,
         sameEmailUpdate: "",
         emailExistsInDb: "",
         password: null,
         emailUpdatedMsg: "",
         passUpdatedMsg: "",
         validation: {
            results: ""
         }
      };
   }

   componentWillMount(){
      this.setState({
         email: this.props.email
      })
   }

   emailUpdated(){
      this.setState({
         emailUpdated: true
      })
   }

   doValidateAll(){
      this.setState({
         passUpdatedMsg: null,
         emailUpdatedMsg: null,
         emailExistsInDb: null,
         sameEmailUpdate: null,
         emailNotValid: null
      })
      inputHelper.validate(this, [this.state.target], null, ["validation"])
         .then (() => {
            const {email, password} = this.state.target;
            if (email === this.state.email && !password){
               this.setState({
                  sameEmailUpdate: "Same email address! Email will not be updated."
               })
            }
            else if (email !== this.state.email) {
               axios.post('/profileUpdateEmail', {email}).then((res) => {
                  const {emailUpdated, emailUpdatedMsg} = res.data;
                  if (emailUpdated){
                     this.setState({
                        emailUpdatedMsg: emailUpdatedMsg
                     })
                  } else {
                     const {emailExistsInDb} = res.data;
                     this.setState({
                        emailExistsInDb: emailExistsInDb
                     });
                  }
               })
            }
            if (password){
               axios.post('/profileUpdatePassword', {email, password}).then((res) => {
                  const {passUpdated, passUpdatedMsg} = res.data;
                  if (passUpdated){
                     this.setState({
                        passUpdatedMsg: passUpdatedMsg
                     })
                  }

               });
            }

         },
         (errorMessage) => {
            const error = this.state.validation.results;
            if (error.email){
               this.setState({
                  emailNotValid: error.email
               })
            } else {
               return
            }
            this.state.validation.targets = [];
         }
      ).catch((err) => {
         console.log(err)
      })
   }

   render (){
      return (
         <div>
            <div className="profile-form">
               <div className="modal-profile">
      				<div className="modal-profile-form">
                     <Input defaultValue={this.props.email} type="email" validate={this.state.validation} instance={this.state.target} rules={{email:true}} propertyKey="email" placeholder="Update Email"/>
                     <Input type="password" validate={this.state.validation} instance={this.state.target} propertyKey="password" placeholder="Update Password"/>
      					<button onClick = {() => this.doValidateAll()}>
      						EDIT <i className="fa fa-fw fa-angle-double-right"></i>
      					</button>
      				</div>
   			   </div>
               <div className="email-updated"> { this.state.emailUpdatedMsg ? <div> {this.state.emailUpdatedMsg} <Link className="email-updated-link-to-signin" to="/signin"> here</Link>.</div> : null }</div>
               <div className="password-updated"> { this.state.passUpdatedMsg ? <div> {this.state.passUpdatedMsg} <Link className="email-updated-link-to-signin" to="/signin"> here</Link>.</div> : null }</div>
               <div className="email-exists"> { this.state.emailExistsInDb }</div>
               <div className="same-email-update"> { this.state.sameEmailUpdate ? <div> {this.state.sameEmailUpdate} </div> : null }</div>
               <div className="not-valid-email"> { this.state.emailNotValid ? <div> {this.state.emailNotValid}!  </div> : null }</div>
            </div>
         </div>
      )
   }
}
