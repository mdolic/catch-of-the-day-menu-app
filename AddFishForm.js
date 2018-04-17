import React from "react";
import PropTypes from 'prop-types';

class AddFishForm extends React.Component {
    nameRef = React.createRef(); //this is creating a reference from the onsubmit below
    priceRef = React.createRef();
    statusRef = React.createRef();
    descRef = React.createRef();
    imageRef = React.createRef();

    //proptypes
    static propTypes={
        addFish: PropTypes.func
    };
      createFish = event =>{
          //1.stop the form from submitting
          event.preventDefault();
    const fish = {
        //pulls values from the below form input by user
        name: this.nameRef.current.value, // you are creating an object here
        price: parseFloat(this.priceRef.current.value),//stored as 1054 but presented as $
        status: this.statusRef.current.value,
        desc: this.descRef.current.value,
        image: this.imageRef.current.value
    };
   this.props.addFish(fish);
   //refreshing the form here
   event.currentTarget.reset(); //reset clears form out
    };

    //any custom function that loads state or updates state needs to be done in the App Component
    //you use props to get a function from one component to another component

    //load sample fishes function


    render() {
    return (
    <form className="fish-edit" onSubmit={this.createFish}>

           <input name ="name" ref={this.nameRef} type="text" placeholder="Name"/>
            <input name ="price" ref={this.priceRef} type="text" placeholder="Price"/>
            <select name ="status" ref={this.statusRef} >
                <option value="available">Fresh</option>
                <option value="unavailable">Sold out</option>

            </select>
            <textarea name ="desc" ref={this.descRef} placeholder="Desc"/>
            <input name ="image" ref={this.imageRef} type="text" placeholder="Image"/>
        <button type="submit">+ Add Fish</button>
    </form>

    );
  }
}

export default AddFishForm;