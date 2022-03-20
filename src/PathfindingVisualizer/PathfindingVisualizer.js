import React, { Component } from 'react'
import Node from './Node/Node';
import "../styles/PathfindingVisualizer.css"
import {primMaze, getDijkstraAnimations, getShortestPath, getAStarAnimations} from '../algorithms/pathfindingAlgorithms';

export class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            FR: 8, //Finish row and column variables
            FC: 30,
            numRow: 17, //num of rows and columns in grid.
            numCol: 37,
            SR: 8, //start row and column variables
            SC: 6,
            changingStart: false, //Adding attributes corresponding to if the start/finish node is currently being changed
            changingFinish: false,
            speed: 5 //added a speed variable to control my animation speed.
        };  
        
    }
      componentDidMount() {
        const grid = this.initializeGrid(); //create a grid, upon accessing the webpage.
        this.setState({grid: grid}) //set this grid as the state, in order to render it.
      }
      initializeGrid(clearWall) {
        const grid = []; 
        for (let row = 0; row < this.state.numRow; row++) { //iterate through all the rows and columns
            const currentRow = []; 
            for (let col = 0; col < this.state.numCol; col++) {
                let isW = false; //iswall
                const element = document.getElementById(`node-${row}-${col}`); //the position of the node is found
                if (element && (element.className === 'node node-path' || element.className === 'node node-visited')) {//if this node is either part of node-path or node-visited,
                    element.className = 'node'; //add this node to the class "node"
                }
                if (!clearWall && element && element.className === 'node node-wall') { //if  clearwall is false, and the specific node is a wall
                    isW = true; //isWall is true
                }
                currentRow.push(this.createNode(row, col, isW)); //create a node at the row and column, with is wall being true or false.
            }
            grid.push(currentRow);
        }
        return grid;
      }
      createNode(row, col, isW) {
        return {
            col,
            row,
            isStart: row === this.state.SR && col === this.state.SC, //the start node
            isFinish: row === this.state.FR && col === this.state.FC, //the end node.
            distance: Infinity, //added a distance attribute to node
            heuristic: Infinity, //add the heuristic attribute to node
            isVisited: false, //added a isvisited boolean to see if the node has been visited
            isWall: isW, 
            previousNode: null, //added a previous node attrribute, so we can get the previous node from a node
            //creates a node with the passed in parameters and default values for distance and heuristics.
        };
      }

handleMouseDown(row, col) {
  if (row === this.state.SR && col === this.state.SC) {
      this.setState({ changingStart: true }); //check if the node being held down is the start node.
  }
  else if (row === this.state.FR && col === this.state.FC) {
      this.setState({ changingFinish: true }); //check if the node being held down is the finish node.
  }
  else  { //if the node is neither the start or finish
      this.updateGridWithWall(this.state.grid, row, col); //change the node selected to either a wall, or revert it back to normal.
      this.setState({ mouseIsPressed: true });
      this.clearVisitedAndPath(); //reset the values of all the nodes back to default
  }
}

handleMouseEnter(row, col) {
  if (this.state.mouseIsPressed) { //wait until the mouse is pressed, before changing the node its hovering over to either a wall, or revert it back to normal
      this.updateGridWithWall(this.state.grid, row, col); 
      this.setState({ mouseIsPressed: true });
      this.clearVisitedAndPath(); //reset the values of all the nodes back to default

  }

  else if (this.state.changingStart && !(row === this.state.FR && col === this.state.FC)) { //if a start node has been selected, and it has been dragged to a place which isnt the position of the finish node
      const start = document.getElementById(`node-${this.state.SR}-${this.state.SC}`); //get the node corresponding to the position of the start node
      if (start) {
          start.className = 'node';
          start.isStart = false;
          this.state.grid[this.state.SR][this.state.SC].isStart = false; //change the node that used to be the start node, to a normal node now.
      }
      const newStart = document.getElementById(`node-${row}-${col}`); //get the node corresponding to the position of the new start node.
      if (newStart) {
          newStart.isStart = true;
          newStart.className = 'node node-start';
          this.state.grid[row][col].isStart = true; //change the node to become the new start node.
      }
      this.setState({ SR: row, SC: col }); //set the SR and SC attributes equal to the new row and column which where hovered over by the mouse
      this.clearVisitedAndPath(); //reset the values of all the nodes back to default


  }
  else if (this.state.changingFinish && !(row === this.state.SR && col === this.state.SC)) { //this section of code will do the same as the above section of code, except on the finish node instead of the start node.
      const finish = document.getElementById(`node-${this.state.FR}-${this.state.FC}`);
      if (finish) {
          finish.className = 'node';
          finish.isFinish = false;
          this.state.grid[this.state.FR][this.state.FC].isFinish = false;
      }
      const newFinish = document.getElementById(`node-${row}-${col}`);
      if (newFinish) {
          newFinish.isFinish = true;
          newFinish.className = 'node node-finish';
          this.state.grid[row][col].isFinish = true;
      }
      this.setState({ FR: row, FC: col });
      this.clearVisitedAndPath(); //reset the values of all the nodes back to default

  }

}

handleMouseUp() {
  this.setState({
      changingStart: false, //after releasing the mouse, set the following attributes back to false, if they were ever true.
      changingFinish: false,
      mouseIsPressed: false
  });
}

updateGridWithWall(grid, row, col) {
  const node = grid[row][col]; //take a row and column and grid as input
  //create a new node, with the same attributes as the node it has taken as input, except the iswall is set to true.
  const newNode = {
      ...node,
      isWall: !node.isWall //Set the wall to be the opposite of what it currently is
  }
  grid[row][col] = newNode; //change the node at this position to the newly made node.
}

clearVisualizer() {
    this.setState({ grid: this.initializeGrid(true) });

}
visualize(algorithm) { //in this function, we want to get the parameters we will use for the animate function
  let g = this.initializeGrid(false); 
  this.setState({
      grid: g
  });
  const grid = this.state.grid; //create the grid, start and finish variables
  const start = grid[this.state.SR][this.state.SC];
  const finish = grid[this.state.FR][this.state.FC];
  let visitedNodesInOrder = null
  if (algorithm) {
    visitedNodesInOrder = getDijkstraAnimations(grid, start, finish); //get an array of the visited nodes in order from dijkstra
  }
  else {
    visitedNodesInOrder = getAStarAnimations(grid, start, finish); //else do astar

  }

  const shortedPath = getShortestPath(finish); //get an array of the shortest path.
  this.animate(visitedNodesInOrder, shortedPath); //call the animation subroutine

}
animate(visitedNodesInOrder, nodesInShortestPathOrder) {
  for (let i = 1; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) { //if the node is the finish node, animate the shortest path
      setTimeout(() => {
        this.animateShortestPath(nodesInShortestPathOrder); //call the animateShortestPath function to display the optiomal path.
      }, this.state.speed * i); 
      return;
    }
    setTimeout(() => { //go through all the nodes visited in order, and update their class name to the node-visited class to display the css animation
      const node = visitedNodesInOrder[i];
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited'; //iterate through the visited nodes in order and animate them one by one, by changing the CSS to the node-visited class.
    }, this.state.speed * i);
  }
}




animateShortestPath(nodesInShortestPathOrder) {
  for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
    setTimeout(() => { //go through all the nodes visited in order, and update their class name to the node-path class to display the css animation
      const node = nodesInShortestPathOrder[i];
      document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-path'; //iterate through the nodesInShortestPathOrder array, and display all these nodes, by changing the CSS to the node-path class.
    }, this.state.speed * i * 5);
  }
}
setSpeed(speed){
  this.setState({speed: speed});
  console.log(this.state.speed + " Is the current speed.") //this is only for the purpose of testing, to see if the speed is changed.
}

clearVisitedAndPath(){ //go through all the nodes in the grid, and check whether the node is part of the node-visited/ node-path class
  for(let row = 0; row < this.state.numRow; row++){
      for(let col = 0; col < this.state.numCol; col++){
          let n = document.getElementById(`node-${row}-${col}`);
          console.log(n);
          if(n && (n.className === 'node node-visited' || n.className === 'node node-path')){
              n.className = 'node'; //change the class back to the original node class
          }
      }
  }
}














      
      render() {
        const {grid} = this.state; //the grid object is the state, which is whats rendered.
        return (
          <>
            <div className="grid">
              {grid.map((row, rowIdx) => { //create a grid of multiple different rows
                return (
                  <div key={rowIdx}> 
                    {row.map((node, nodeIdx) => { //create a row of multiple different nodes
                      const {row, col, isFinish, isStart, isWall} = node; //create each node object
                      return (
                        <Node 
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall} 
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}></Node>
                      );
                    })}
                  </div>
                  
                );
              })}
            </div>
            <div className="button">
            <button onClick={() => this.clearVisualizer()}>Reset Grid</button>
            <button 
                          onClick={() => { 
                              primMaze(this.state.grid);
                              this.setState({ finish: false}); /*make it so the code will run on button click */
                          }}>
                          Maze Generation
          </button>
          <button onClick={() => this.visualize(true)}>Visualize Dijkstra's Algorithm</button>
          <button onClick={() => this.visualize(false)}>Visualize A* Pathfinding Algorithm</button>
          <div>
            Animation Speed:
          <button onClick={() => this.setSpeed(20)}>Slow</button>
          <button onClick={() => this.setSpeed(10)}>Medium</button>
          <button onClick={() => this.setSpeed(5)}>Fast</button>
          </div>
          <div>Create and remove walls on the grid with your mouse, or use the maze generation to create obstacles!</div>
          <div>Drag the start/end nodes around with your mouse, and change the animation speed to your liking.</div>
        </div>
          </>
        );
      }
    }
    

export default PathfindingVisualizer
