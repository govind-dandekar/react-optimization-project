import { useState, memo, useCallback, useMemo } from 'react';

import IconButton from '../UI/IconButton.jsx';
import MinusIcon from '../UI/Icons/MinusIcon.jsx';
import PlusIcon from '../UI/Icons/PlusIcon.jsx';
import CounterOutput from './CounterOutput.jsx';
import { log } from '../../log.js';

function isPrime(number) {
  log(
    'Calculating if is prime number',
    2,
    'other'
  );
  if (number <= 1) {
    return false;
  }

  const limit = Math.sqrt(number);

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

// memo looks at props and determines if component
// prop value has changed;  if the same, will not
// re-execute (for arrays and objects need to be same
// in memory).  Counter would only re-execute if 
// initialCount changes or if its Counter internal state changes.
// memo only prevents fx executions triggered by parent component
// internal state changes that trigger component
// re-execution; memo impacts external changes (not internal)
// nested fx will also not re-execute if Counter doesn't re-execute
// can remove memo() based on updated component composition.
// memo() would only be useful if updated counter value is the same
// as old counter value (but not worth performance degredation)
const Counter = memo(function Counter({ initialCount }) {
  log('<Counter /> rendered', 1);

  // memo() is wrapped around component fx; useMemo() is
  // wrapped around normal fx that are executed in component
  // fx to prevent their execution; should be used with complex
  // calcs; useMemo will store result
  // and only re-executed if dependency changes
  const initialCountIsPrime = useMemo(() => isPrime(initialCount),
    [initialCount]);

  const [counter, setCounter] = useState(initialCount);

  // fx will be recreated every time Counter re-executes
  // and will be a new object in memory
  // state updating fx are guaranteed to not change by React
  // and dont need to be included in dependencies array
  const handleDecrement = useCallback(function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1);
  }, [])

  const handleIncrement = useCallback(function handleIncrement() {
    setCounter((prevCounter) => prevCounter + 1);
  }, [])

  return (
    <section className="counter">
      <p className="counter-info">
        The initial counter value was <strong>{initialCount}</strong>. It{' '}
        <strong>is {initialCountIsPrime ? 'a' : 'not a'}</strong> prime number.
      </p>
      <p>
        <IconButton icon={MinusIcon} onClick={handleDecrement}>
          Decrement
        </IconButton>
        <CounterOutput value={counter} />
        <IconButton icon={PlusIcon} onClick={handleIncrement}>
          Increment
        </IconButton>
      </p>
    </section>
  );
})

export default Counter;
