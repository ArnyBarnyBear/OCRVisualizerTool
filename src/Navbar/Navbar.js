import React, { Component } from 'react'
import { Link } from "react-router-dom";
import "../styles/Navbar.css"

export class Navbar extends Component {
    render() {
        return (
            <div className="navbar">
            <div className="leftSide"> {/* add a leftside class */ }
              <Link to="/OCRVisualizerTool"> Home </Link>
              <Link to="/pathfinding"> Pathfinding </Link>
              <Link to="/sorting"> Sorting </Link>
            </div>
            </div>

        )
    }
}

export default Navbar
