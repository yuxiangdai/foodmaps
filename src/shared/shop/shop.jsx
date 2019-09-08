import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Coupon from '../coupon/coupon.jsx';
import './shop.scss';

export default class Shop extends Component {
    render () {
			const brief = this.props.type + ' | ' + 'rating: ' + this.props.rating;
			const coupons = this.props.coupons;
			return (
				<div>
					<h1>{this.props.res_name}</h1>
					<span>{brief}</span>
					{coupons.map(function(d, idx){
						return (
							<li key={idx}>
								<Coupon 
									id = {d.id}
									name={d.name} 
									price={d.price} 
									old_price={d.old_price} 
									link={d.link}
								/>
							</li>
						);
					})}
				</div>
			);	
    }
};

Shop.propTypes = {
	res_name: PropTypes.string,
	type: PropTypes.string,
	rating: PropTypes.number,
	coupons: PropTypes.arrayOf({
		id: PropTypes.number,
		name: PropTypes.string,
		price: PropTypes.number,
		old_price: PropTypes.number,
		link: PropTypes.string
	})
}

Shop.defaultProps = {
	res_name: 'KungFuTea',
	type: 'Boba',
	rating: 4.3,
	coupons: [{
		id: 123,
		itme: 'Poke Bowl',
		price: 100,
		old_price: 200,
		link: 'https://www.google.com/maps'}]
};