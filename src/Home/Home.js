import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "../styles/Home.css" //Added the css file corresponding to the component.

export class Home extends Component {
    render() {
        return (
            <div className="home"> {/* creating some css class names, so that i can change the design later */ }
             <div className="headerContainer">
              <h1> OCR Algorithms </h1>  {/* Will display the text i created in the design section */ }
              <p> A website to help you learn algorithms.</p>
              <Link to="/pathfinding">
               <button> PATHFINDING </button>
              </Link>
              <Link to="/sorting">
                <button> SORTING </button>
              </Link>
             </div>
           </div>
        )
    }
}

export default Home
