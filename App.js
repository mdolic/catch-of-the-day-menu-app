import React from "react";
import PropTypes from 'prop-types';
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from'../sample-fishes';
import Fish from'./Fish';
import base from '../base';
//life cycle methods in react are = jquery $document ready
class App extends React.Component {
  //state inside an object property
  state ={
    fishes: {},//this is an empty object created
    order:{} //function to add to order
  };
    //proptypes creation here
    static propTypes ={
      match: PropTypes.object
    };

  //1st lifecyle did mount method that syncs state to our firebase database
  componentDidMount(){
    const {params } = this.props.match;
    //first reinstate our localstorage if we do a refresh to retain previous orders
    const localStorageRef = localStorage.getItem(params.storeId);
    if(localStorageRef){
      this.setState({order: JSON.parse(localStorageRef)}) //this returns a string back into an object when we are looking at a new store
    }

    this.ref = base.syncState(`${params.storeId}/fishes`,{
      context:  this,
      state: 'fishes'
    }); //referencing the stored id from router
  }
    //2nd lifecycle method that is called after an update occurs
    //specifically tied to the order updating.. adding more fish or c
    componentDidUpdate(){ //using localstorage here
     // const {params}
      localStorage.setItem(this.props.match.params.storeId, JSON.stringify(this.state.order));
      //json.stringify = produces the actual name of the store here, otherwise when adding orders looks like (object object)
    }
  //2nd lifecycle method that unmounts the previous sync when a new sync is created
  componentWillUnmount(){
    //gets the upper binding reference and than removes it here
    base.removeBinding(this.ref);
  }



  //methods that update state and actual state always need to live in the same component
  //things get into state thru props
  //add fish method
  addFish= (fish) =>{
  //to update state here you need to use reacts existing set state API
    //1. copy the exisiting state b/c never want to reach into the real state and modify directly
    const fishes ={...this.state.fishes};//object spread and clean wa to copy copy that object

    //2 add our new fishes to that fishes variable
    fishes[`fish${Date.now()}`]= fish; //increases the fish variable count per milisecond that is assocaited with each click

    //3. set the new fishes object to state by calling state method
    this.setState({
      fishes:fishes //(fishes = const fishes + //2 line fishes )
    });
  };
  //updating fishes
  updateFish = (key, updatedFish) =>{
    //1.takes copy of current state
    const fishes = {...this.state.fishes};
    //2. update that state here
    fishes[key] = updatedFish;
    //3.set that to state
    this.setState({fishes});
  };

  //deleting fish function
  deleteFish = (key) =>{
    //1. take a copy of state
    const fishes = {...this.state.fishes};
    //2. update the state here
    fishes[key] = null; //doing it this way b/c we're also remvoing it from firebase DB
    //3. update state
    this.setState({fishes});
  }
    loadSampleFishes = () =>{
      this.setState({fishes: sampleFishes});
    };

    //add to order function
    addToOrder = key =>{
      //1. copy of state goes here
      const order = { ...this.state.order};
      //2. either add to the order or update the number in our orde rhere
      order[key] = order[key] + 1 || 1; //or operator here.. if order.fish1 exists add 1 to the total order of fish1.
      //otherwis add 1 as a new order entry
      //3. call setState to update our state object
      this.setState({order }); //just updating and pass the state here
    }; //pass addtoorder via props down below

    //removefromOrder function
    removeFromOrder = key =>{
      //1. copy of state here
      const order = {...this.state.order};
      //2. remove item from order
      delete order[key] ;//doing it this was b/c we don't care about deleting it from firebase here
      //3. call setstate here
      this.setState({order});


    };
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" age={100} />
          <ul className="fishes">
           {/* looping over the fishes here.
              you loop over by calling the $r.state.fishes  than go with below code
          */}
            {Object.keys(this.state.fishes).map(key =>(
              <Fish
              key ={key}
              index ={key}//*if you need access, passed 2nd time with prop someting other than key
              details={this.state.fishes[key]}
              addToOrder= {this.addToOrder}
              />
              ))}
          </ul>
        </div>
        <Order
        fishes={this.state.fishes}
        order={this.state.order}
        removeFromOrder = {this.removeFromOrder}
        />

        <Inventory
        addFish ={this.addFish}
        updateFish = {this.updateFish}
        deleteFish = {this.deleteFish}
        loadSampleFishes = {this.loadSampleFishes}
        fishes={this.state.fishes}
        storeId={this.props.match.params.storeId}

        /> {/* app loads the fish function stuff here on inventory componeent*/}
      </div>
    );
  }
}

export default App;