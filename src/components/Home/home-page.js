import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import YTSearch from 'youtube-api-search';
import _ from 'lodash';
import axios from "axios";
import NavBar from '../../components/navbar';
import SearchBar from './HomePageComponents/search_bar';
import VideoList from './HomePageComponents/video_list';
import VideoDetail from './HomePageComponents/video_detail';


const API_KEY = 'AIzaSyCVnoFXSkdiWr2dgiCM_DY4FLcc-pb_yuA';

export default class Home extends Component {
   constructor(props){
      super(props);

      this.state = {
         videos: [],
         selectedVideo: null
      };
      this.videoSearch('دمشق الياسمين');
   }

   componentWillMount(){
      axios.get('/checkSignedUpOrIn').then((res) => {
         if (!res.data.loggedIn){
            browserHistory.push('/');
         }
      });
   }

   videoSearch(term){
      YTSearch({ key: API_KEY, term: term }, (videos) => {
         this.setState({
            videos: videos,
            selectedVideo: videos[0]
         });
      });
   }

   render (){
      {/*debounced version */}
      const videoSearchDelay = _.debounce((term) => {this.videoSearch(term)}, 300);

      return (
         <div>
            <div className="homepage-img-container">
               <NavBar params = {this.props.params}/>
               <SearchBar onSearchTermChange={ videoSearchDelay } />  {/* this will delay videoSearch function 300 miliseconds to prevent lagging when searching (making a new search whenever the user types something in the search bar) */ }
               <VideoDetail video={ this.state.selectedVideo } />
               <VideoList
                  onVideoSelect={ selectedVideo => this.setState({ selectedVideo }) }
                  videos={ this.state.videos }
               />
            </div>
         </div>
      )
   }
}
