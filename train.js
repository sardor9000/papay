// TASK - I

function getCompute(arr){
    if(arr.length >= 2){
        const firstElement = arr[0];
        arr.shift();
        arr.push(firstElement)
    }
    return arr
}

const myArray = ['h','e','l','l','o'];
const result = getCompute(myArray)

console.log(result); // output: ['e', 'l', 'l', 'o', 'h']