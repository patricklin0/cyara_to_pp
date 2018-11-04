import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';


class Home extends Component {
    render() {
        return (
            <div>
                <Link to='/Transformer'>Transformer</Link>
            </div>
        );
    }
}
export default Home;