import React, { Component } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

import Coupon from './shared/coupon/coupon.jsx';
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
    selectedPlace: {}
  };

  onMarkerClick = (props, marker, e) => {
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

  onSubmit(e) {
    console.log("You clicked me!")
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

      console.log({place})
      if (!place.geometry) return;

      if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      this.setState({ position: place.geometry.location });
    });
    
  }

  handleOnChange = (value) => {
    this.setState({
      maxPrice: value
    })
  }

  render() {
    const { position, maxPrice } = this.state;

    return (
      <div >
        <div className="search__form" >
          <input
                className="search__places"
                placeholder="Enter a location"
                ref={ref => (this.autocomplete = ref)}
                type="text"
              />
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
            <Marker position={position}
             onClick={this.onMarkerClick}
             name={'PennApps'}
            />
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
                <div>
                  <Coupon/>
                </div>
            </InfoWindow>
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
