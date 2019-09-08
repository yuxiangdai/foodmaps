import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './coupon.scss';

export default class Coupon extends Component {
	render(){
		const discount = ((this.props.old_price - this.props.price) / this.props.old_price) * 100;
		if (this.props.id) {
			return (
				<div className='coupon_info'>
					<h1>{this.props.name}</h1>
					<div>
						<h2>{this.props.itme}: ${this.props.price}</h2>
						<h3>Discount: {discount} % </h3>
					</div>
					<a href={this.props.link}>GET SOME GET SOME!</a>
				</div>
			);
		}
	}
};

Coupon.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    old_price: PropTypes.number,
    link: PropTypes.string
}

Coupon.defaultProps = {
	id: 123,
	itme: 'Poke Bowl',
	price: 100,
	old_price: 200,
	link: 'https://www.google.com/maps'
};