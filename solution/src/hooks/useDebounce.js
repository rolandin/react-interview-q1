import { useState, useEffect } from 'react';

/*
  The useDebounce hook delays function execution during rapid state changes, 
  like typing in an input. This optimizes performance for actions such as API 
  calls for input validation, which are inefficient if triggered on every keystroke. 
  By using debouncing, we make requests only after typing has paused, enhancing 
  user experience by reducing unnecessary server load and network traffic. 
  
  Debounce functionality is commonly available in some many hooks libraries, 
  catching more advanced use cases and providing also TypeScript support.

  In case like this is very useful as the validation is supposedly running 
  in a fetch call which is mocked but this is the idea of how it should be
*/

const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on component unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}

export default useDebounce
