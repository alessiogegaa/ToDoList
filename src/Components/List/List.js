import React, { useRef, useCallback } from "react";
import "./List.css";
import Button from "../Button/Button";

const List = React.memo(
  ({ text, editTask, deleteTask, updateStatus, initialStatus }) => {
    const selectRef = useRef(null);

    const handleUpdateStatus = useCallback(() => {
      updateStatus(selectRef.current.value, text);
    }, [updateStatus, text]);

    return (
      <div className="list">
        <p>{text}</p>
        <select
          id="status"
          name="statusList"
          defaultValue={initialStatus}
          ref={selectRef}
          onChange={handleUpdateStatus}
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
  }
);

export default List;
