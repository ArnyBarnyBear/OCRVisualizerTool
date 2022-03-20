import React, {Component} from 'react';

import "../../styles/Node.css";

export default class Node extends Component {
  render() {
    const { /* the important variables a node must have is the row and column
        as well as if its a start finish or a wall node */
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;

    const extraClassName = isFinish /* here we are taking special cases,
    if the node is the finish node, it is assigned the node-finished classname, and so on for the other 
    checks. This is so that we can change the css of certain special types of nodes like walls and the start/end nodes */
    
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}