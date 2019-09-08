import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Coupon from '../coupon/coupon.jsx';
import './shop.scss';

export default class Shop extends Component {
    render () {
			const brief = this.props.type + ' | ' + 'rating: ' + this.props.rating;
			return (
				<div>
					<h1>{this.props.res_name}</h1>
					<span>{brief}</span>
					{this.props.coupons.map(function(d, idx){
						return (
							<span key={idx}>
								<Coupon 
									id = {d.id}
									item={d.item} 
									price={d.price} 
									old_price={d.old_price} 
									link={d.link}
								/>
							</span>
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
		item: PropTypes.string,
		price: PropTypes.number,
		old_price: PropTypes.number,
		link: PropTypes.string
	})
}	

Shop.defaultProps = {
	res_name: 'KungFuTea',
	type: 'Boba',
	rating: 4.3,
	coupons: [
		{
			id: 1,
			item: 'Cheese steak',
			price: 100,
			old_price: 200,
			link: 'http://www.fiveguys.com/'
		},
		{
			id: 2,
			item: 'Takoyaki',
			price: 200,
			old_price: 300,
			link: 'https://bonchon.com/'
		}]
};