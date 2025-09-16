import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, incrementByAmount, reset } from '../../app/features/counter/counterSlice';

const Counter = () => {
  const { count } = useSelector((state) => state.counterR);
  const dispatch = useDispatch();
  const hanleIncrement = () => {
     dispatch(increment());
  };
  const hanleIncrementBy5 = () => {
     dispatch(incrementByAmount(5));
  };
  const hanleDecrement = () => {
     dispatch(decrement());
  };
  const hanleReset = () => {
     dispatch(reset());
  };
  return (
    <div>
        <h2>Count : {count}</h2>
        <button onClick={hanleIncrement}>+</button>
        <button onClick={hanleReset}>0</button>
        <button onClick={hanleDecrement}>-</button>
        <button onClick={hanleIncrementBy5}>+5</button>
    </div>
  );
};

export default Counter;



