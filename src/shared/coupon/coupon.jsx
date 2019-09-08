import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './coupon.scss';

export default class Coupon extends Component {

	state = {
		open: false,
	}

	sendMsg(data = {}){
		fetch(`https://awesome-delight-252323.appspot.com/twilio/`,
		{ method: 'POST',
		headers: {
            'Content-Type': 'application/json',
        },
			body: JSON.stringify(data)
		})
		.then(function(response) {
		  console.log({response})
		  return response.json();
		})
		.then((myJson) => {
		  console.log(JSON.stringify(myJson));
		});
	}

	render(){
		// const [open, setOpen] = React.useState(false);

		const handleOpen = () => {
		  this.setState({
			  open: true,
		  })
		};
	  
		const handleClose = () => {
			this.setState({
				open: false,
			})
		};

		const discount = Math.round(((this.props.old_price - this.props.price) / this.props.old_price) * 100);
		const iteminfo = this.props.item + ' : ' + ' $' + this.props.price;
	

		const isFree = this.props.price == '0' 
		const price = isFree ? 'Free' : `$${this.props.price}` 
		const discountPercent = isFree ? 'Free' : `Discount: ${discount.toFixed()}%`
		
		const qrlink = `https://api.qrserver.com/v1/create-qr-code/?data=${this.props.link}&amp;size=100x100`
		if (this.props.id) {
			return (
				<div className='coupon_info'>
					<h2>{iteminfo}</h2>
					<h3>{discountPercent}</h3>
					<a href={qrlink}>Go to your QR code here</a>
					<button type="button" onClick={handleOpen}>
						Open Modal
					</button>
					<div class="w3-container">
					<p>Some text..</p>
					<p>Some text..</p>
					</div>
				</div>
			);
		}
	}
};

Coupon.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
    old_price: PropTypes.string,
    link: PropTypes.string
}
