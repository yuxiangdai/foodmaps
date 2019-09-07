import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Slider from 'react-rangeslider'

import API_KEY from './config.js';
import 'react-rangeslider/lib/index.css';

import './App.css';

import logo from './logo.svg';

class Contents extends Component {
  state = {
    position: null,
    maxPrice: 0
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

  renderModal() {
    console.log("You clicked me!")
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
            <div>Lat: {position && position.lat()}</div>
            <div>Lng: {position && position.lng()}</div>
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
             onClick={() => this.renderModal()}
            />
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
