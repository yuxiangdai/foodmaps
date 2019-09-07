import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import API_KEY from './config.js';

const MapApiKey = require('./config.js');

const mapStyles = {
  width: '100%',
  height: '100%',
};

export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: null,
      stores: [{lat: 47.49855629475769, lng: -122.14184416996333},
              {latitude: 47.359423, longitude: -122.021071},
              {latitude: 47.2052192687988, longitude: -121.988426208496},
              {latitude: 47.6307081, longitude: -122.1434325},
              {latitude: 47.3084488, longitude: -122.2140121},
              {latitude: 47.5524695, longitude: -122.0425407}]
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps.map) this.renderAutoComplete();
  }

  onSubmit(e) {
    e.preventDefault();
  }

  renderAutoComplete() {
    const { google, map } = this.props;

    if (!google || !map) return;

    const autocomplete = new google.maps.places.Autocomplete(this.autocomplete);
    autocomplete.bindTo('bounds', map);

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

  displayMarkers = () => {
    return this.state.stores.map((store, index) => {
      return <Marker key={index} id={index} position={{
       lat: store.latitude,
       lng: store.longitude
     }}
     onClick={() => console.log("You clicked me!")} />
    })
  }

  render() {
    const { position } = this.state;

    return (
      <>
        <form onSubmit={this.onSubmit}>
            <input
              placeholder="Enter a location"
              ref={ref => (this.autocomplete = ref)}
              type="text"
            />

            <input type="submit" value="Go" />
        </form>
        <Map
            {...this.props}
            center={position}
            centerAroundCurrentLocation={false}
            containerStyle={{
              height: '100vh',
              position: 'relative',
              width: '100%'
            }}>
            <Marker position={position} />
        </Map>
        </>
    );
  }
}

class Contents extends Component {
  state = {
    position: null
  };

  componentDidMount() {
    this.renderAutoComplete();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps.map) this.renderAutoComplete();
  }

  onSubmit(e) {

    const { google, map } = this.props;

    console.log("test")


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

      if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      this.setState({ position: place.geometry.location });
    });
    
  }

  render() {
    const { position } = this.state;

    return (
      <div >
        <div >
          <form onSubmit={this.onSubmit}>
            <input
              placeholder="Enter a location"
              ref={ref => (this.autocomplete = ref)}
              type="text"
            />

            <input type="submit" value="Go" />
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
            <Marker position={position} />
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
