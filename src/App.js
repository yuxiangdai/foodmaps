import React, { Component } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

import Coupon from './shared/coupon/coupon.jsx';
import Shop from './shared/shop/shop.jsx';
import Dropdown from './shared/dropdown/Dropdown';

import API_KEY from './config.js';

import 'react-rangeslider/lib/index.css';
import './App.scss';

class Contents extends Component {
  state = {
    position: null,
    maxPrice: 0,
    showingInfoWindow: true,
    activeMarker: {},
    selectedPlace: {},
    places: [],
    value: '',
    placename: null
  };

  onMarkerClick = (props, marker, e) => {
    fetch('https://awesome-delight-252323.appspot.com/discounts/popeyeslouisianakitchen', 
    {
      mode: 'no-cors'
    })
    .then(function(response) {
      console.log({response})
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
    });


    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
    console.log("You clicked me!");
  }
    
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  componentDidMount() {
    this.renderAutoComplete();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps.map) this.renderAutoComplete();
  }


  handleChange(event) {
    this.setState({value: event.target.value});
  }


  onSubmit(e) {
    console.log("You clicked me!")

    console.log(e)

    console.log( this.state.value )
    const { google, map } = this.props;

    if (!google || !map) return;
    const placesService = new google.maps.places.PlacesService(map);
    // const findPlaceQuery = new google.maps.places.FindPlaceFromQueryRequest();

    var request = {
      query: this.state.value,
      fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
    }

    // findPlaceQuery.setQuery("")

    // findPlaceQuery.setFields(
    //   ['address_components', 'geometry', 'price_level', 'rating', 'icon', 'types', 'name']);

    const callback = (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          this.setState({ 
            places: [...this.state.places,
              place
            ],
          });
        }
        console.log(this.state.places)
      }
      else{
          alert("status bad");
      }
    }

    placesService.findPlaceFromQuery(request, callback);

    if (this.state.places[0]) {

      console.log(this.state.places[0])
      const place = this.state.places[0]

      // this.setState({ placename: place.name });
  
      if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
  
      // this.setState({ position: place.geometry.location });
    }

    e.preventDefault();
  }

  renderAutoComplete() {
    const { google, map } = this.props;

    if (!google || !map) return;

    const autocomplete = new google.maps.places.Autocomplete(this.autocomplete);
    
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);
    
    // autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry) return;
      this.setState({ placename: place.name });
      if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      this.setState({ position: place.geometry.location });
    });
    
  }

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });

  handleOnChange = (value) => {
    this.setState({
      maxPrice: value
    })
  }

  displayMarkers = () => {

    const { google, map } = this.props;

    if (!google || !map) return;

    var bounds = new google.maps.LatLngBounds();

    var infowindow = new google.maps.InfoWindow();    

    if (this.state.places[0]) {
      const place = this.state.places[0]

      // this.setState({ placename: place.name });
  
      if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
  
      // this.setState({ position: place.geometry.location });
    }

    


    return this.state.places.map((store, index) => {
      return (
        <Marker key={index} id={index} position={{
         lat: store.geometry.location.lat(),
         lng: store.geometry.location.lng()
       }}
  
       onClick={() => console.log("You clicked me!")} />
   
      )
    })
  }

  render() {
    const { position, maxPrice, places } = this.state;

    return (
      <div >
        <div className="search__form" >

          <form onSubmit={e => this.onSubmit(e)}>
            <input
             onChange={e => this.handleChange(e)}
             value={this.state.value} 
                  className="search__places"
                  placeholder="Enter a location"
                  ref={ref => (this.autocomplete = ref)}
                  type="text"
                />
            <input type="submit" value="Submit"/>
          </form>
         
              <Dropdown />
          <div>
            <span>Lat: {position && position.lat()}</span>
            <div>Long: {position && position.lng()}</div>
          </div>
        </div>
        <div >
          <Map
            {...this.props}
            center={position}
            centerAroundCurrentLocation={false}
            containerStyle={{
              height: '400px',
              position: 'relative',
              margin: '2.5%',
              width: '95%'
            }}>


            {this.displayMarkers()}
            
            {/* <Marker position={position}
             onClick={this.onMarkerClick}
            />
            <InfoWindow
              onClose={this.onInfoWindowClose}
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
                <div>
                  <Shop res_name={this.state.placename}/>
                </div> */}
            {/* </InfoWindow> */}
          </Map>
        </div>
      </div>
    );
  }
}

const MapWrapper = props => (
  <Map className="map" google={props.google} visible={false}>
    <Contents {...props} />
  </Map>
);

export default GoogleApiWrapper({
  apiKey: API_KEY
})(MapWrapper);
