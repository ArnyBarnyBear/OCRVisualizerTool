function getInsertionSortAnimations(array) {
    const animations = [];
    let n = array.length;
    for (let i = 1; i < n; i++) {
        // Choosing the first element in our unsorted subarray
        let current = array[i];
        // The last element of our sorted subarray
        let j = i-1; 
        while ((j > -1) && (current < array[j])) {



          animations.push([j, j + 1]);
          animations.push([j, j + 1]);
          animations.push([j + 1, array[j]]);
          array[j+1] = array[j];
            j--;
        }
        

        animations.push([j + 1, i]);
        animations.push([j + 1, i]);
        animations.push([j+1, current]); 
        array[j+1] = current

        ; //this j+1 resembles element 0. 0 is equal to the element that was stored at 1.
    }

    return animations;
  }
  function getBubbleSortAnimations(mainArray) {
    const animations = []
    let length = mainArray.length;
    for (let i = 0; i < length; i++) { //iterate through the array, with a flag set at false.
      let swapped = false;
  
      for (let j = 0; j < length - i - 1; j++) {
        if (mainArray[j] > mainArray[j + 1]) { //iterate through the array again, and check if two elements next to each other need to be swapped.
  
          animations.push([j, j + 1]); //if a swap is necessary add the following animations to the animations array.
          animations.push([j, j + 1]);
          animations.push([j, mainArray[j + 1]]);
          animations.push([j + 1, j]);
          animations.push([j + 1, j]);
          animations.push([j + 1, mainArray[j]]);
          let temp = mainArray[j]; //swap the value at these two points.
          mainArray[j] = mainArray[j + 1];
          mainArray[j + 1] = temp;
          swapped = true;
        }
      }
  
      if (swapped === false) { //if no swap was made in a pass, the array is sorted so stop.
        break;
      }
    }
    return animations
  }

  function getMergeSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    const auxiliaryArray = array.slice(); //create a new auxillar array that will be used for the recursive call.
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations); 
    return animations;
  }
  function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) { //a helper function to allow for the recursive call of merge sort.
    if (startIdx === endIdx) return; //end condition of recursive call.
    const middleIdx = Math.floor((startIdx + endIdx) / 2); //find the middle, and call the function on the left and right hand side.
    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
    mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {  //if a swap is to be made.
      animations.push([i, j]);
      animations.push([i, j]); //add the two animations to represent a swap.
      if (auxiliaryArray[i] <= auxiliaryArray[j]) { //if the left element is bigger then the right do a swap.
        animations.push([k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
      } else { 
        animations.push([k, auxiliaryArray[j]]); //otherwise, do nothing and go to the next element.
        mainArray[k++] = auxiliaryArray[j++];
      }
    }
    while (i <= middleIdx) {
      animations.push([i, i]); //perform a swap, and then increment i and k.
      animations.push([i, i]);
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++]; 
    }
    while (j <= endIdx) {
      animations.push([j, j]); //perform a swap, and then increment i and k
      animations.push([j, j]);
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

    function getQuickSortAnimations(array) { 
        const animations = [];
        if (array.length <= 1) return array;
        quickSortHelper(array, 0, array.length - 1, animations);
        return animations;
    }
  
    function quickSortHelper(mainArray, startIdx, endIdx, animations) { //helper function to allow for recursive call.
        if (startIdx < endIdx) {
          let pi = doPartition(mainArray, startIdx, endIdx, animations); //get pivot point, and partition array into two sides.
          quickSortHelper(mainArray, startIdx, pi - 1, animations); //recursively solve these two sides, by partitioning them again.
          quickSortHelper(mainArray, pi + 1, endIdx, animations);
        }
      }
      function doPartition(mainArray, startIdx, endIdx, animations) {
        let i = startIdx - 1;
        let pivot = mainArray[endIdx]; //create a pivot
        for (let j = startIdx; j < endIdx; j++) {
          if (mainArray[j] < pivot) {//go through each element and if its bigger then move it to the right.
            i++;
            animations.push([i, j]); //add the following animations
            animations.push([i, j]);
            animations.push([i, mainArray[j]]); 
            animations.push([j, i]);
            animations.push([j, i]);
            animations.push([j, mainArray[i]]);
            let temp = mainArray[i]; //swap values which are smaller then the pivot.
            mainArray[i] = mainArray[j];
            mainArray[j] = temp;
          }
        }
        i++; 
        animations.push([i, endIdx]); //add the following animations
        animations.push([i, endIdx]);
        animations.push([i, mainArray[endIdx]]);
        animations.push([endIdx, i]);
        animations.push([endIdx, i]);
        animations.push([endIdx, mainArray[i]]);
        let temp = mainArray[i]; //swap values which are greater then the pivot
        mainArray[i] = mainArray[endIdx];
        mainArray[endIdx] = temp;
        return i
      }



  
  export {getInsertionSortAnimations, getBubbleSortAnimations, getMergeSortAnimations, getQuickSortAnimations};