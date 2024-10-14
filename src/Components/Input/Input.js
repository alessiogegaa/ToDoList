import { useState, useEffect } from 'react';
import './Input.css';
import Button from '../Button/Button';

const Input = ({ addTask, isEditing, taskToEdit }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isEditing) {
      setInput(taskToEdit);
    } else {
      setInput('');
    }
  }, [isEditing, taskToEdit]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddTask = () => {
    addTask(input);
    setInput('');
  };

  return (
    <div className='input'>
      <input
        type="text"
        placeholder="Enter your task"
        value={input}
        onChange={handleChange}
      />
      <Button 
        text={isEditing ? 'Update Task' : 'Add Task'}
        onClick={handleAddTask}
      />
    </div>
  );
};

export default Input;

