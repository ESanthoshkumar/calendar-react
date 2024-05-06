import React, { useState, useEffect } from 'react';

const Local = () => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('myValue', value);
  };

  useEffect(() => {
    const storedValue = localStorage.getItem('myValue');
    if (storedValue) {
      setValue(storedValue);
    }
  }, []); 

  return (
    <div className=''>
      <form onSubmit={handleSubmit}>
        <input type="text" value={value} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
      <div>Stored Value: {value}</div>
    </div>
  );
};

export default Local;
