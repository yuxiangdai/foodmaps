import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './coupon.scss';

export default class Coupon extends Component {
	render(){
		const discount = Math.round(((this.props.old_price - this.props.price) / this.props.old_price) * 100);
		const iteminfo = this.props.item + ' : ' + ' $' + this.props.price;
		const qrlink = `https://api.qrserver.com/v1/create-qr-code/?data=${this.props.link}&amp;size=100x100`
		if (this.props.id) {
			return (
				<div className='coupon_info'>
					<h2>{iteminfo}</h2>
					<h3>Discount: {discount} % </h3>
					<a href={qrlink}>Go to your QR code here</a>
				</div>
			);
		}
	}
};

Coupon.propTypes = {
    id: PropTypes.number,
    item: PropTypes.string,
    price: PropTypes.number,
    old_price: PropTypes.number,
    link: PropTypes.string
}

// Coupon.defaultProps = {
// 	id: 123,
// 	item: 'Poke Bowl',
// 	price: 100,
// 	old_price: 200,
// 	link: 'http://www.fiveguys.com/'
// };