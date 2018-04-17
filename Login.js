import React from 'react';
import PropTypes from 'prop-types';
const Login = (props) => (
    <nav className="login">
        <h2> Inventory Login</h2>
        <p>Sign in to manage your store's inventory.</p>
        <button className="github" onClick={()=> props.authenticate('Github')}
        >Log In With Github</button>{/*using props.authenticate b/c its a stateless functional componenet.. no this needed since its not a class compoenent*/}
        <button className="twitter" onClick={()=> props.authenticate('Twitter')}
        >Log In With Twitter</button>
    </nav>
);
Login.propTypes = {
    authenticate: PropTypes.func.isRequired
};
export default Login;