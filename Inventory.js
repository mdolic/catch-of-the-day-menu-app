import React from "react";
import PropTypes from 'prop-types';
import firebase from 'firebase';
import AddFishForm from './AddFishForm';
import EditFishForm from './EditFishForm';
import Login from './Login';
import base, {firebaseApp} from '../base';


class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    loadSampleFishes: PropTypes.func
  };
  state = {
    uid: null,
    owner: null
  };

  /*when we refresh a page this will recheck if you're logged in//then if we are logged in, proceeds with original
  verifications below*/
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user =>{
      if(user){
        this.authHandler({user});
      }
    })
  }
  authHandler = async(authData)=>{
    //1.looks up the current store in the firebase database
   //1.1 fetch returns a promise, so we have to use await to get the store and not th epromise
    const store = await base.fetch(this.props.storeId,{context: this});
    //2 claim if there is no owner in the store and we get to own the store in our firebaase database
    if(!store.owner){
      //save it as our own store
      await base.post(`${this.props.storeId}/owner`,{
        data: authData.user.uid
      });
    }
    //3. set the state of the inventory component to reflect the current user
      //whenever someone logs into a store,
      //we figured out who is user and who is the owner, if they're same person we let them manage the store otherwise error message is displayed

    this.setState({
      uid:authData.user.uid,
      owner:store.owner || authData.user.uid
    });

  };
  //authenticate method from login
  //dyanmically account sfor whichever authprovide is
  authenticate = provider =>{
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
    .auth()
    .signInWithPopup(authProvider)
    .then(this.authHandler);
  };

  logout = async ()=>{
    console.log('logging out');
    await firebase.auth().signOut();
    this.setState({uid: null});
  };

  render() {
    const logout = <button onClick={this.logout}>Log Out!</button> //can make this into a seprate logout component later..

    //1.check if the user is logged in
    if(!this.state.uid){
    return <Login authenticate={this.authenticate} />;
    }
    //2. check if they are not the owner of the store & id's dont match up return
    if(this.state.uid !== this.state.owner){
      return (
      <div>
      <p> Sorry you are not the owner!</p>
      {logout} {/*this is jsx being used in a variable */}
      </div>
      );
    }
    //3. the user must be the owner, so app will just render the inventory
    return (
    <div className="inventory">
    <h2> Inventory</h2>
    {logout} {/* this is jsx being used in a variable */}
    {Object.keys(this.props.fishes).map(key => (
      <EditFishForm
          key={key}
          index={key} /* passing index so we can get the key of fish into editfishform here*/
          fish={this.props.fishes[key]}
          updateFish={this.props.updateFish}
          deleteFish={this.props.deleteFish}
      />
      ))}
    <AddFishForm addFish={this.props.addFish}/> {/* this is jsx comment -- adding the addfishform action here on the inventory
                which becomes. inventory parent to addfishform child structure  */}
    <button onClick={this.props.loadSampleFishes}>
    Load Sample Fishes</button> {/* this is the button that passed the function of loadsample finshes from the inventory compoent*/}

    </div>
    );
  }
}

export default Inventory;