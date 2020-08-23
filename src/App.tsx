import React from 'react';
import './App.css';

// You have a bag with 'size' items inside.
interface Size {
  size: number;
}

// If you were to pick an item from the bag,
// this represents which item it is.
// Without a size, we don't know how big it could be.
interface UnsizedValue {
  value: number;
}

// We have a value that is bounded by size.
// 'value' should be less than 'size' and
// greater than or equal to 0.
// 0 <= value < size
interface Value extends Size, UnsizedValue {
}

const isValidValue: (value : Value) => boolean =
  (value) =>
    value.value >= 0 && value.value <= value.size;

function App() {
  return (
    <div className="App">
      <div>
        <p>
          Shark
        </p>
      </div>
      <div>
        <canvas />
      </div>
    </div>
  );
}

export default App;
