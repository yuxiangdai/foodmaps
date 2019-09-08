import React, { Component } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import Slider from 'react-rangeslider'
import Coupon from './shared/coupon/coupon.jsx';
import Shop from './shared/shop/shop.jsx';

import API_KEY from './config.js';
import 'react-rangeslider/lib/index.css';

import './App.css';

import logo from './logo.svg';

class Contents extends Component {
  state = {
    position: null,
    maxPrice: 0,
    showingInfoWindow: true,
    activeMarker: {},
    selectedPlace: {},
    placename: null
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

  handleOnChange = (value) => {
    this.setState({
      maxPrice: value
    })
  }

  render() {
    const { position, maxPrice } = this.state;
    return (
      <div >
        <div >
          <input
                placeholder="Enter a location"
                ref={ref => (this.autocomplete = ref)}
                type="text"
              />
          <form onSubmit={this.onSubmit}>
            <h3>Filters</h3>
            <div>
            <input type="checkbox" id="10Dollar" name="subscribe" value="newsletter"/>
              <label htmlFor="10Dollar">Under $10</label>
            </div>


          <div >
            <Slider
              min={0}
              max={100}
              value={maxPrice}
              orientation="horizontal"
              labels={{
                0: '$0',
                50: '$50',
                100: '$100'
              }}
              format={value =>  '$' + value}
              // handleLabel={maxPrice}
              onChange={this.handleOnChange}
            />
            <div className='value'>{'$' + maxPrice}</div>
          </div>
            <input type="submit" value="Apply" />
          </form>

          <div>
            <span>Lat: {position && position.lat()}</span>
            <span>Lng: {position && position.lng()}</span>
          </div>
        </div>

        <div >
          <Map
            {...this.props}
            center={position}
            centerAroundCurrentLocation={false}
            containerStyle={{
              height: '100vh',
              position: 'relative',
              width: '100%'
            }}>
            <Marker position={position}
             onClick={this.onMarkerClick}
            />
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
                <div>
                  <Shop res_name={this.state.placename}/>
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

// export default MapWrapper;


export default GoogleApiWrapper({
  apiKey: API_KEY
})(MapWrapper);
