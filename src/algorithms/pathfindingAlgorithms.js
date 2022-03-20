
function primMaze(grid) {
    let height = grid.length, width = grid[0].length; 
    let sr = (height - 3) / 2, sc = (width - 3) /2; // set a starting point for generating maze at the middle
    for (let i = 0; i < height; i++) { //Create the frontier pattern of walls with the following for loops 
        for (let j = 0; j < width; j++) {
            makeWall(grid, i, j, false); //iterate through the whole grid, and make every node that was previously a wall a node again.
        }
    }
    for (let i = 0; i < height; i++) { //if the column is odd, make a wall every other node. If it is even make them all nodes.
        for (let j = i % 2 + 1; j < width; j += i % 2 + 1) { 
            makeWall(grid, i, j, true);
        }
    }
    for (let i = 0; i < height; i++) { //create a wall on the left side of the grid.
        makeWall(grid, i, 0, true);
    }

    let visited = []; //create track of the visited nodes from the start point.
    let path = [{ row: sr, col: sc }]; //The path that will be created from the grid. This will start by being just a position
    while (path.length > 0) {  /*Here we are iterating through the path node and getting all of its neighbours. We use the connected neighbours and chose one of them to create
        our path. The unconnected nodes will be used to create our wall.*/
        const index = randomSelect(path); //will start with one
        const node = path[index]; //will find the node at the path index
        path.splice(index, 1);  //remove everthing before index in the path
        visited = visited.concat([node]); //add this node to the visisted nodes
        const { c: connected, u: unconnected } = getNeighbors(grid, visited, node); //get the connected and unconnected neighbours of the nodes
        if (connected.length > 0) {
            let rn = randomSelect(connected); //chose a random node from the connected neighbours of the node.
            connect(grid, node, connected[rn]); 
            connected.splice(rn);
        }
        path = path.concat(unconnected); //add the unconnected neighbours, which will then be used again in the while loop.

    }
}

function randomSelect(path) { //select a random number from 0 and the number of elements in the paths - 1
    return randomInt(0, path.length - 1); 
}

function getNeighbors(grid, visited, node) { //get the neighbours of the node
    let { row, col } = node;
    let neighbors = [{ row: row + 2, col: col }, { row: row - 2, col: col },{ row: row, col: col + 2 }, { row: row, col: col - 2 }]; //the neighbours of the node. 
    neighbors = validate(grid, neighbors.slice()); //validate these neighbours
    let connected = [];
    let unconnected = [];
    neighbors.forEach(neighbor => {
        if (isVisited(visited, neighbor)) { //if the node has already been visited, make it a connected node.
            connected.push(neighbor);
        }
        else {
            unconnected.push(neighbor);
        }
    });
    return { c: connected, u: unconnected };
}


function connect(grid, a, b) {  //take two nodes, and create a node from the combination of their row and columns divided by 2.
    let { row: ar, col: ac } = a;
    let { row: br, col: bc } = b;
    let row = (ar + br) / 2;
    let col = (ac + bc) / 2;
    makeWall(grid, row, col, false);
}

function makeWall(grid, row, col, isW) { //creates a wall in the place of a node. Takes is wall as a boolean as an input to check if its a wall or not.
    const node = grid[row][col];
    const newNode = {
        ...node,
        isWall: isW
    }
    grid[row][col] = newNode;
}

function randomInt(min, max) { //take two inputs, and return a random integer between them.
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isVisited(visited, node) { //returns true if the visited node is equal to the node in question.
    let { row: nr, col: nc } = node; 
    for (let index = 0; index < visited.length; index++) { //iterate through visited, until you find the correct node
        let { row: ir, col: ic } = visited[index];
        if (nr === ir && nc === ic) {
            return true; //if found return true
        }
    }
    return false;
}
function validate(grid, points) { //validate the points passed if they are in the grid
    let height = grid.length, width = grid[0].length;
    let all = [];
    for (let index = 0; index < points.length; index++) {
        let { row, col } = points[index];
        if (0 <= row && row < height && 0 <= col && col < width) { //make tsure only points who are in the grid are returned.
            all.push(points[index]);
        }
    }
    return all;

}
function getDijkstraAnimations(grid, start, finish) {
    const visitedInOrder = [];
    start.distance = 0; //start with the start node.
    const unvisited = allNodes(grid); //create an array of unvisited nodes, which contains all nodes.
    while (unvisited.length) {
        sortNodes(unvisited); //sort these nodes by distance.
        const closest = unvisited.shift(); //chose the closest node to visit
        if (closest === finish) { //if the nose is the finish node, return the visitedInOrder array
            return visitedInOrder;
        }
        if (closest.isWall) continue; //if its a wall do nothing
        if (closest.distance === Infinity) return visitedInOrder; //if the distance is infinity, return the array, as there is no more nodes to explore.
        closest.isVisited = true; //set the nodes isvisited attribute to true
        visitedInOrder.push(closest);//add this node to the visitedin order array
        updateUnvisitedNeighbors(closest, grid);//update the neighbours of array, to repeat the while loop again
    }
    return visitedInOrder; //once the visited in order array has been made return the array.
}

function allNodes(grid) {
    const all = []; //this function will go through all the nodes in the grid, and add them to a array to be returned.
    for (const row of grid) {
        for (const node of row) {
            all.push(node);
        }
    }
    return all;
}

function sortNodes(nodes) {
    nodes.sort((a, b) => a.distance - b.distance); //use the sort function, to sort the arrays by smallest distance between the current node (a) and b.
}

function updateUnvisitedNeighbors(closest, grid) { 
    const neighbors = [];
    const { row, col } = closest; 
    //add 4 checks to see if the node we are getting neighbours from is on the wall or close to it. If its not on the edge of a wall, all four of these if statements will run to add a neighbour.
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    for (const neighbor of neighbors) { 
        if (!neighbor.isVisited) {
            neighbor.distance = closest.distance + 1; 
            neighbor.previousNode = closest; //create the neighbour node by making its distance equal to the node its neighboured to's distance. Make the previousnode equal to the one it came from
            //this will be useful when backtracking our algorithm for the shortest path.
        }
    }
}
function getShortestPath(finish) {
    const path = [];
    let cur = finish; 
    while (cur !== null) { //backtrack through the algorithm, going through all the nodes visited to get to the finish node, and adding it to a path.
        path.unshift(cur);
        cur = cur.previousNode;
    }
    return path;
}

function getAStarAnimations(grid, start, finish) {
    const visitedInOrder = [];
    start.distance = 0; //start with the start node, and have a distance and a heuristic value
    start.heuristic = 0;
    const unvisited = allNodes(grid); //create an array of unvisited nodes, which contains all nodes.
    while (unvisited.length) {
        sortNodesStar(unvisited); //sort these nodes by distance.
        const cur = unvisited.shift();  //chose the closest node to visit
        if (cur === finish) {  //if the nose is the finish node, return the visitedInOrder array
            return visitedInOrder;
        }
        if (cur.isWall) continue;//if its a wall do nothing
        if (cur.distance + cur.heuristic === Infinity) return visitedInOrder; //if the distance is infinity, return the array, as there is no more nodes to explore.
        cur.isVisited = true; //set the nodes isvisited attribute to true
        visitedInOrder.push(cur); //add this node to the visitedin order array

        updateUnvisitedNeighborsStar(cur, grid, finish); //update the neighbours of array, to repeat the while loop again
    }
    
    return visitedInOrder; 
}

function sortNodesStar(nodes) {
    nodes.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic)); //sort the nodes based on the distance and the heuristic value
}


function updateUnvisitedNeighborsStar(cur, grid, finish) {
    const neighbors = [];
    const { row, col } = cur;
    //add 4 checks to see if the node we are getting neighbours from is on the wall or close to it. If its not on the edge of a wall, all four of these if statements will run to add a neighbour.
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
            neighbor.distance = cur.distance + 1;
            neighbor.heuristic = manhattanDistance(neighbor, finish); //set the heuirstic to the manhhatten distance between the neighbour and the finish node.
            neighbor.previousNode = cur;//create the neighbour node by making its distance equal to the node its neighboured to's distance. Make the previousnode equal to the one it came from
            //this will be useful when backtracking our algorithm for the shortest path.
        }
    }
}

function manhattanDistance(a, b) {
    let { row: ar, col: ac } = a; //method to calculate the manhattendistance which is how we work the heuristic value out
    let { row: br, col: bc } = b;
    return Math.abs(ar - br) + Math.abs(ac - bc);
}





export {primMaze, getDijkstraAnimations, getShortestPath, getAStarAnimations};