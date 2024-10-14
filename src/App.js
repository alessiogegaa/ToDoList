import { useState } from 'react';
import './App.css';
import Input from './Components/Input/Input';
import List from './Components/List/List';

function App() {
  const [tasks, setTasks] = useState([]); 
  const [isEditing, setIsEditing] = useState(false); 
  const [taskIndex, setTaskIndex] = useState(null); 

  const addTask = (newTask) => {
    if (newTask.trim() !== "") {
      if (isEditing) {
        const updatedTasks = tasks.map((task, index) =>
          index === taskIndex ? newTask : task
        );
        setTasks(updatedTasks);
        setIsEditing(false);
        setTaskIndex(null); 
      } else {
        setTasks([...tasks, newTask]); 
      }
    }
  };

  const editTask = (index) => {
    setIsEditing(true);
    setTaskIndex(index);
  };

  
  const deleteTask = (index) => {
    const updatedTasks = [...tasks]; 
    updatedTasks.splice(index, 1);   
    setTasks(updatedTasks);          
  };

  return (
    <>
      <Input addTask={addTask} isEditing={isEditing} taskToEdit={isEditing ? tasks[taskIndex] : ''} />
      {tasks.map((item, index) => (
        <List 
          key={index} 
          text={item} 
          editTask={() => editTask(index)} 
          deleteTask={() => deleteTask(index)} 
        />
      ))}
    </>
  );
}

export default App;

