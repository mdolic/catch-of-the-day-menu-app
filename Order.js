import React from "react";
import PropTypes from 'prop-types';
import {formatPrice} from '../helpers';
import {TransitionGroup, CSSTransition} from 'react-transition-group';


class Order extends React.Component {
  static propTypes = {
    fishes: PropTypes.object,
    order: PropTypes.object,
    removeFromOrder: PropTypes.func
  };
    //when you ge tto larger of a render function with you can create a seprate render funciton
    renderOrder = (key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      const isAvailable = fish && fish.status === 'available';
      const transitionOptions ={ /*//animation.styl spread into transition stuff below*/
        classNames: "order",
        key,
        timeout:{enter: 250, exit:250}
      };
      if(!fish) return null; //this is to account for a return null when didMOUNT method runs
      if(!isAvailable){
          return  (
            <CSSTransition {...transitionOptions}>
            <li key={key}>
               Sorry {fish ? fish.name : 'fish'} is no longer available
            </li>
          </CSSTransition>
          );
        }
      return (
        <CSSTransition {...transitionOptions}>
           <li key={key}> {/* this needs a unique key prop */}
        <span>
        <TransitionGroup component="span" className="count">
          <CSSTransition
            classNames ="count"
            key={count}
            timeout={{enter: 250,exit:250}}
            >
            <span>{count}</span>
          </CSSTransition>
        </TransitionGroup>
            lbs {fish.name}
            {formatPrice(count * fish.price)}
            <button onClick ={()=> this.props.removeFromOrder(key)}>
              &times;
            </button>
        </span>
      </li>
      </CSSTransition>
      );
    };

  render() {
    const orderIds = Object.keys(this.props.order);//gets the keys id from orders that are passed from app to order
    const total = orderIds.reduce((prevTotal,key) =>{
      const fish = this.props.fishes[key];//grabbed key of fishes here used props t
      const count = this.props.order[key]; //made count const and grabbed order key here
      const isAvailable = fish && fish.status ==='available';
      if(isAvailable){ //if fish is aviaalble return the prevtotal
        return prevTotal +(count * fish.price);
      }
      return prevTotal; //if the fish was not avaialble skip over that fish go on with next set of fish

    },0);  //reduce is like a for loop or map that takes in some data and returns a tally
      //with reduce you gotta start with 0 value
    return (
    <div className="order-wrap">
       <h2> Order!!!</h2>
       <TransitionGroup component="ul" className="order">
       {orderIds.map(this.renderOrder)}
       </TransitionGroup>
        <div className="total">
          Total:
          <strong>{formatPrice(total)}</strong>
        </div>
    </div>
    );
  }
}

export default Order;