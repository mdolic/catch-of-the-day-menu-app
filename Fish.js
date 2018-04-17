import React from 'react';
import PropTypes from 'prop-types';
import {formatPrice} from '../helpers';

class Fish extends React.Component{
    static propTypes = { //declaring proptypes for all fish here since its regular react component
        details:PropTypes.shape({
            image:PropTypes.string,
            name:PropTypes.string,
            desc:PropTypes.string,
            status: PropTypes.string,
            price: PropTypes.number
        }),
        addToOrder: PropTypes.func
    };
    handleClick = ()=>{
       this.props.addToOrder(this.props.index); // runs addtoORder prop and
       //grabs the index "fish8"
    };
render(){
    //can rename this.props.details.image into something smaller but has to
    //be in this area
    //example done with ES6 destructuring
    const {image, name, price, desc, status} = this.props.details;
    const isAvailable =  status === 'available';//this is boolean to tell us if its available or not
    return (
        <li className="menu-fish">
            <img src={image} alt={name}/>
            <h3 className="fish-name">{name}
            <span className="price">{formatPrice(price)}</span>{/* used formatprice helper method here*/}
            </h3>
            <p>{desc}</p>
            <button disabled ={!isAvailable} onClick={this.handleClick}>
            {isAvailable ? 'Add To Cart' : 'Sold out'}</button> {/*turnary if statement here*/}
        </li>
    )
}
}

export default Fish;