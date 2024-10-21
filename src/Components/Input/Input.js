import React, { useEffect, useRef, useCallback } from "react";
import "./Input.css";
import Button from "../Button/Button";

const Input = ({ addTask, isEditing, taskToEdit }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.value = isEditing ? taskToEdit : "";
  }, [isEditing, taskToEdit]);

  const handleAddTask = useCallback(() => {
    addTask(inputRef.current.value);
    inputRef.current.value = "";
  }, [addTask]);

  return (
    <div className="input">
      <input type="text" placeholder="Enter your task" ref={inputRef} />
      <Button
        text={isEditing ? "Update Task" : "Add Task"}
        onClick={handleAddTask}
      />
    </div>
  );
};

export default Input;
