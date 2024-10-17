import React from "react";
import "./List.css";
import Button from "../Button/Button";

const List = ({ text, editTask, deleteTask, updateStatus, initialStatus }) => {
  return (
    <div className="list">
      <p>{text}</p>
      <select
        id="status"
        name="statusList"
        defaultValue={initialStatus}
        onChange={(e) => updateStatus(e.target.value)}
      >
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <div className="buttons">
        <Button text="Edit" type="secondary" onClick={editTask} />
        <Button text="Delete" type="tertiary" onClick={deleteTask} />
      </div>
    </div>
  );
};

export default List;

