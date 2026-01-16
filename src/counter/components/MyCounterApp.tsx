import { useCounter } from '../hooks/useCounter';

export const MyCounterApp = () => {

  const { counter, handleAdd, handleSubtract, handleReset } = useCounter();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        marginTop: '20px',
      }}
    >
      <h1>Counter: {counter}</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        <button onClick={handleAdd}>+1</button>
        <button onClick={handleSubtract}>-1</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};
