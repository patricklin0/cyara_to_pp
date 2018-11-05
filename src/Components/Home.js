import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';


class Home extends Component {
    render() {
        return (
            <div>
                <h1>QA Tools Home page</h1>
                <Link to='/Transformer'>Transformer</Link><br />
                <Link to='/Help'>Help</Link>
            </div>
        );
    }
}
export default Home;