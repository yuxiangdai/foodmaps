import React, { Component } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import moment from 'moment';

import Shop from './shared/shop/shop.jsx';
import Dropdown from './shared/dropdown/Dropdown';

import API_KEY from './config.js';
import ReactModal from 'react-modal';

import Button from '@material-ui/core/Button';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import 'react-rangeslider/lib/index.css';
import './App.scss';

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const conversion = {
  "popeyeslouisianakitchen": "Popeyes",
  "pandaexpress": "Panda Express",
  "cvs": "CVS",
  "shakeshack": "Shake Shack"
}

class Contents extends Component {
  state = {
    position: null,
    maxPrice: 0,
    showingInfoWindow: true,
    activeMarker: {},
    selectedPlace: {},
    placename: null,
    shopData: {},
    showModal: false,
    phone: undefined,
  };

  reformatName = (name) => name.replace(/\s/g, '').toLowerCase();

  sendMsg = (number) => {
    const message = "You are now subscribed to daily text notifications for deals";
    const data = {
      msg: message,
      phone: number
    }

    fetch(`https://awesome-delight-252323.appspot.com/twilio`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
    },
    })
      .then((response) => {
        this.sendDailyDeal(number)
        return response.json();
      })
      .then((myJson) => {
      });
  }

  sendDailyDeal = (number) => {
    var today = new Date();
    var weekday = days[today.getDay()].toLowerCase()

    var today = moment().format('dddd MMMM Do YYYY');

    fetch(`https://awesome-delight-252323.appspot.com/discounts/weekday/${weekday}`)
    .then(function(response) {
        return response.json();
      })
      .then((myJson) => {
        var deal = ""
        for(var key in myJson) {
          var value = myJson[key][0]
          deal += value.name + " from " + conversion[key] + " at " + value.price + "\n" + value.link + "\n\n" 
        }

        const dailyMsg = `Today is ${today}.
                          \nYour daily deals today are:
                          ${deal}`;

        const data = {
          msg: dailyMsg,
          phone: number
        }
           
        fetch(`https://awesome-delight-252323.appspot.com/twilio`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
        },
        })
      .then(function(response) {
        console.log({response})
        return response.json();
      })
      });
  }

  onMarkerClick = (props, marker, e) => {

    console.log(this.state.placename)


    if (this.state.placename != null) {
      const queryString = this.state.placename.replace(/\s/g, '').toLowerCase();

      fetch(`https://awesome-delight-252323.appspot.com/discounts/${queryString}`)
      .then(function(response) {
        console.log({response})
        return response.json();
      })
      .then((myJson) => {
        console.log(JSON.stringify(myJson));
  
        this.setState({
          shopData: myJson
        })
      });
    } else {
      this.setState({
        shopData: {}
      })
    }
    
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

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });

  // handleOnChange = (value) => {
  //   this.setState({
  //     maxPrice: value
  //   })
  // }

  // handleChange(event) {
  //   this.setState({phoneNumber: event.target.value});
  // }
    
  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
  

  render() {
    const { position, maxPrice } = this.state;
    return (
      <div>
        <div>
        <img src={require('./MP.jpeg')} className="logo"/>
        </div>
        
        <div className="search__form" >
          <input
            className="search__places"
            placeholder="  Enter a location"
            ref={ref => (this.autocomplete = ref)}
            type="text"
          />
          <Dropdown />
        </div>
        <button className="phone__button" onClick={this.handleOpenModal.bind(this)}>Subscribe to Text Notifications</button>
        <ReactModal 
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
        >
          <div>
            Phone Number
          </div>
          <div className="modal__description">
            Input your phone number to receive daily deals around you
          </div>
          <PhoneInput
            className="phone__input"
            placeholder="Enter phone number"
            value={ this.state.phone }
            onChange={ phone => this.setState({ phone }) } />
       
        <input className="modal__button_submit" type="submit" value="Submit"
        onClick={() => this.sendMsg(this.state.phone)} 
        />

        <button className="modal__button_close" onClick={this.handleCloseModal.bind(this)}>Cancel</button>

        </ReactModal>
        <div className="map">
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
            />
            <InfoWindow
              onClose={this.onInfoWindowClose}
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
                <div>
                  <Shop res_name={this.state.placename}
                    data={this.state.shopData}
                  />
                </div>
            </InfoWindow>
          </Map>
        </div>

        <footer className="footer">
          <div>Created by: Team Hulk</div>
          <div>Contact information: <a href="mailto:hulk@example.com">
          hulk@example.com</a>.</div>
          <small>&copy; Copyright 2019 Nowhere Inc.</small>
        </footer>
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
