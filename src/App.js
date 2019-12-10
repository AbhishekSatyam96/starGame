import React, { Fragment } from 'react';
import { useState } from 'react';
import "./App.css";
// STAR MATCH - V2

const StarsDisplay = (props) => (
  <Fragment>
    {utils.range(1, props.counts).map(starId =>
      <div key={starId} className="star" />
    )}
  </Fragment>
);

const PlayNumber = props => (
  <button className="number"
    style={{ backgroundColor: colors[props.status] }}
    onClick={() => props.onClick(props.number, props.status)}>
    {props.number}</button>
);

const App = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  console.log('range',utils.range(1,9));
  const [candidateNums, setCandidateNums] = useState([]);

  const canndidatesAreWrong = utils.sum(candidateNums) > stars;

  const numberStatus = number => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return canndidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    if(currentStatus == 'used') {
      return;
  }
  const newCandidateNums = candidateNums.concat(number);
  if(utils.sum(newCandidateNums) !== stars){
    setCandidateNums(newCandidateNums);
  }else{
    const newAvailableNums = availableNums.filter(
      n => !newCandidateNums.includes(n)
    );
    setStars(utils.randomSumIn(newAvailableNums, 9))
    setAvailableNums(newAvailableNums);
    setCandidateNums([]);
  }
};

return (
  <div className="game">
    <div className="help">
      Pick 1 or more numbers that sum to the number of stars
      </div>
    <div className="body">
      <div className="left">
        <StarsDisplay counts={stars} />
      </div>
      <div className="right">
        {utils.range(1, 9).map(number =>
          <PlayNumber key={number} number={number} status={numberStatus(number)} onClick={onNumberClick} />
        )}
      </div>
    </div>
    <div className="timer">Time Remaining: 10</div>
  </div>
);
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};
export default App;
