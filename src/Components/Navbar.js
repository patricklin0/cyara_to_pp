import '../Styles/Navbar.css';
import React, { Component } from 'react';
import { Image, Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../resources/logo.png';

const NavbarBar = () => (
    <div className='nav-container'>
        <Nav>
            <LinkContainer to='/'>
                <Image border='0' src={logo} rounded/>
            </LinkContainer>
        </Nav>
        <Nav>
            <LinkContainer to='/Transformer'>
                <NavItem>Transformer</NavItem>
            </LinkContainer>
        </Nav>
        <Nav>
            <LinkContainer to='/Help'>
                <NavItem>Help</NavItem>
            </LinkContainer>
        </Nav>
    </div>
)
export default NavbarBar;