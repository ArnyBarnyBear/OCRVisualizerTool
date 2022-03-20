import React, { Component } from 'react'
import "../styles/SortingVisualizer.css"
import { getInsertionSortAnimations, getBubbleSortAnimations,getMergeSortAnimations, getQuickSortAnimations} from '../algorithms/sortingAlgorithms';

export class SortingVisualizer extends Component {
    constructor() {
        super();

        this.state = {
          array: [],
          arrayBars: 50,
          primaryColour: "#0388fc" , //Base colour of bars
          secondaryColour: "red",
          width: 10,
          animationSpeed: 3,
          value: []
        };
        this.handleChange = this.handleChange.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.newArray();
      }

      newArray() {
        const array = [];
        for (let i = 0; i < this.state.arrayBars; i++) { //iterate through the bars and add random values from 5-200
          array.push(randomIntFromInterval(5, 200));
        }
        this.setState({array});
      }

      setSpeed(x) {
        this.state.animationSpeed = x; 
      }
      setArraySize(bars,width) {
        this.state.arrayBars = bars;
        this.state.width = width;
        this.newArray(); //create new array.
      }
      handleChange(event) {
        this.setState({value: event.target.value}); //set the value attribute equal to the input
      }
    
      handleSubmit(event) {
        const x = this.state.value
        this.arrayValidation(x) //validate the input.
        event.preventDefault(); //make sure the event is explicitly handled.
      }
      arrayInput(array) {
        this.setState({array});
        this.state.value = []
      }
      arrayValidation(input) {
        input = input.replace(/\s/g, '');//remove all spaces in the string
        if (input == "") { //check if arrry is blank
          alert("your array is blank! \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153") 
          return
        }
        if (isNaN(input[0])) {
          alert("your array doesnt begin with a number. \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153") 
          return
        }
        for (let i = 0; i < input.length; i++) {
          var x = input[i]
          if ((input[i] == input[i+1]) && (input[i] == ",")) { //if there are multiple commas together.
            alert("your array has multiple commas together! please ensure there is a number between each number.\nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153")
            return
          }
    
          if(isNaN(x) && x !== ",") { //if not an integer, or a comma.
            alert("Your array either has numbers which aernt integers, or elements which aern't numbers. \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153");
            return
          }
          
        }
        const array = input.split(',').map(Number)
        if (array.length < 10 || array.length > 100) {//check if the length of the array is smaller than 10 or bigger than 100.
          alert("Your array must only have 10-100 elements!. \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153")
          return
        }
        for (let i = 0; i < array.length; i++) {
          if (array[i] > 200 || array[i] < 5) { //check if each element is greater than 200 or smaller than 5.
            alert("At least one element in your array is either greater than 200, or smaller than 5. \nan example input would be the following: \n173, 93, 73, 85, 52, 162, 189, 117, 136, 129, 168, 195, 141, 100, 153")
            return
          }
        }
        this.arrayInput(array)

      }  
      insertionSort() {
        const animations = getInsertionSortAnimations(this.state.array);
        this.changeAnimations(animations);
      } 
      bubbleSort() {
        const animations = getBubbleSortAnimations(this.state.array);
        this.changeAnimations(animations);
      } 
      mergeSort() {
        const animations = getMergeSortAnimations(this.state.array);
        this.changeAnimations(animations);
      }     
      quickSort() {
        const animations = getQuickSortAnimations(this.state.array);
        this.changeAnimations(animations);
      }
      changeAnimations(animations) { //here we take an animation array, and display the necessary animation
        for (let i = 0; i < animations.length; i++) {
          const arrayBars = document.getElementsByClassName('array-bar');
          const isColorChange = i % 3 !== 2; //if its the second element when i mod 3 is not equal to 2 it will be true, so if i mod 3 is element 0, 1 or 3. this means that two will always be the else statement.
          if (isColorChange) {
            const [barOneIdx, barTwoIdx] = animations[i]; 
            const barOneStyle = arrayBars[barOneIdx].style;
            const barTwoStyle = arrayBars[barTwoIdx].style;
            const color = i % 3 === 0 ? this.state.secondaryColour : this.state.primaryColour; //if its the third element, make it red, otherwise make it blue only blue when first element. Third element represents the two bars that should be swapped. 
            setTimeout(() => {
              barOneStyle.backgroundColor = color; //change color of bar1 and bar2 according to their i element. both should be the same.
              barTwoStyle.backgroundColor = color;
            }, i * this.state.animationSpeed);
          } else {
            setTimeout(() => {
              const [barOneIdx, newHeight] = animations[i];
              const barOneStyle = arrayBars[barOneIdx].style;
              barOneStyle.height = `${newHeight}px`;
            }, i * this.state.animationSpeed);
            
          }
        }
      }
    


    render() {
        const {array} = this.state;

        return (
            <div className="array-container"> {/*added some css, so that the array bars can be changed in the sortingVisualized.css file.*/}
            <div className="array-bar-wrapper">
              {array.map((height) => (
                <div 
                // go through everything with the class name array-bar and add the following styling to it 
                  className="array-bar"
                  style={{
                    backgroundColor: this.state.primaryColour,
                    height: `${height}px`,
                    width: `${this.state.width}px`
                  }}>
                </div>
              ))}
            </div>
            <button onClick={() => this.newArray()}>Generate New Array</button>
            <button onClick={() => this.insertionSort()}>Insertion Sort</button>
            <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
            <button onClick={() => this.mergeSort()}>Merge Sort</button>
            <button onClick={() => this.quickSort()}>Quick Sort</button>
            <div> Animation Speed:
            <button onClick={() => this.setSpeed(7)}>Slow</button>
            <button onClick={() => this.setSpeed(3)}>Medium</button>
            <button onClick={() => this.setSpeed(1)}>Fast</button>
        </div>
        <button onClick={() => this.setArraySize(20,20)}>Small</button>
        <button onClick={() => this.setArraySize(50,13)}>Medium</button>
        <button onClick={() => this.setArraySize(100,9)}>Large</button>
        <form onSubmit={this.handleSubmit}>
        <label>
          Input array:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>Select the animation speed, and the size of the array, then choose your sorting algorithm to run the visualizer tool!</div>
      <div>For the array input please make sure numbers are seperated by commas, and the length of your array is between 10-100. Make sure no number is greater then 200.</div>

          </div>
          
          
        )
    }
}

export default SortingVisualizer

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
