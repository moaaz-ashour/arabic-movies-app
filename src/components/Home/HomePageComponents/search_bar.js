import React, { Component } from 'react';

class SearchBar extends Component {
   constructor(props){
      super(props);
      this.state = {
         term : "",
         placeholderText: "Search for your favorite movies"
      }
   }
   onInputChange(term){
      this.setState({ term });
      this.props.onSearchTermChange(term);
   }

   render(){
      return (
         <div className="search-bar" >
            <input
               value={this.state.term}
               onChange={event => this.onInputChange(event.target.value)}
               placeholder={this.state.placeholderText}
            />
         </div>
      )
   }
}
export default SearchBar;
