import React, { useEffect, useReducer, useMemo } from "react";
import "./App.css";
import Input from "./Components/Input/Input";
import List from "./Components/List/List";
import { useFetch } from "./Components/Hooks/useFetch/useFetch";
import env from "react-dotenv";

const initialState = {
  tasks: [],
  isEditing: false,
  taskIndex: null,
  newTaskData: null,
  taskToUpdate: null,
  deleteTaskId: null,
  taskStatuses: {},
};

function taskReducer(state, action) {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };

    case "ADD_TASK":
      return { ...state, newTaskData: action.payload, shouldPostTask: true };

    case "POST_TASK_SUCCESS":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        newTaskData: null,
        shouldPostTask: false,
      };

    case "EDIT_TASK":
      return { ...state, isEditing: true, taskIndex: action.payload };

    case "UPDATE_TASK":
      const updatedTasks = state.tasks.map((task, index) =>
        index === state.taskIndex
          ? {
              ...task,
              title: action.payload.title,
              description: action.payload.description,
            }
          : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        isEditing: false,
        taskIndex: null,
        taskToUpdate: action.payload,
      };

    case "PATCH_TASK_SUCCESS":
      return { ...state, taskToUpdate: null };

    case "DELETE_TASK":
      return { ...state, deleteTaskId: action.payload };

    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== state.deleteTaskId),
        deleteTaskId: null,
      };

    case "UPDATE_STATUS":
      const updatedStatusTasks = state.tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, status: action.payload.newStatus }
          : task
      );
      return {
        ...state,
        tasks: updatedStatusTasks,
        taskStatuses: {
          ...state.taskStatuses,
          [action.payload.id]: action.payload.newStatus,
        },
        taskToUpdate: action.payload.taskToUpdate,
      };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const apiUrl = process.env.REACT_APP_API_URL;

  const { data, loading, error } = useFetch({ url: apiUrl, trigger: true });

  useEffect(() => {
    if (data) {
      const fetchedTasks = data.map((todo) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        status: todo.completed ? "Completed" : "In Progress",
      }));
      dispatch({ type: "SET_TASKS", payload: fetchedTasks });
    }
  }, [data]);

  const { data: postData, error: postError } = useFetch({
    url: apiUrl,
    METHOD: "POST",
    body: state.newTaskData,
    trigger: state.shouldPostTask,
  });

  useEffect(() => {
    if (postData) {
      dispatch({ type: "POST_TASK_SUCCESS", payload: postData });
    }
  }, [postData]);

  const { data: patchData, error: patchError } = useFetch({
    url: state.taskToUpdate ? `${apiUrl}/${state.taskToUpdate.id}` : null,
    METHOD: "PATCH",
    body: state.taskToUpdate
      ? {
          title: state.taskToUpdate.title,
          completed: state.taskToUpdate.completed,
        }
      : null,
    trigger: !!state.taskToUpdate,
  });

  useEffect(() => {
    if (patchData) {
      dispatch({ type: "PATCH_TASK_SUCCESS" });
    }
  }, [patchData]);

  const { data: deleteData, error: deleteError } = useFetch({
    url: `${apiUrl}/${state.deleteTaskId}`,
    METHOD: "DELETE",
    trigger: !!state.deleteTaskId,
  });

  useEffect(() => {
    if (deleteData) {
      dispatch({ type: "DELETE_TASK_SUCCESS" });
    }
  }, [deleteData]);

  const addTask = (newTask) => {
    if (newTask.trim() !== "") {
      if (state.isEditing) {
        const updatedTask = {
          title: newTask,
          description: newTask,
          id: state.tasks[state.taskIndex].id,
          completed: state.tasks[state.taskIndex].status === "Completed",
        };
        dispatch({ type: "UPDATE_TASK", payload: updatedTask });
      } else {
        const taskBody = {
          title: newTask,
          description: newTask,
          completed: false,
        };
        dispatch({ type: "ADD_TASK", payload: taskBody });
      }
    }
  };

  const editTask = (index) => {
    dispatch({ type: "EDIT_TASK", payload: index });
  };

  const deleteTask = (index) => {
    const taskId = state.tasks[index].id;
    dispatch({ type: "DELETE_TASK", payload: taskId });
  };

  const updateTaskStatus = (id, title, newStatus) => {
    const completed = newStatus === "Completed";
    const taskToUpdate = { id, title, completed };
    dispatch({
      type: "UPDATE_STATUS",
      payload: { id, newStatus, taskToUpdate },
    });
  };

  const taskCounts = useMemo(() => {
    let inProgressCount = 0;
    let completedCount = 0;

    state.tasks.forEach((task) => {
      const status = state.taskStatuses[task.id] || task.status;
      if (status === "Completed") {
        completedCount++;
      } else {
        inProgressCount++;
      }
    });

    return { inProgressCount, completedCount };
  }, [state.tasks, state.taskStatuses]);

  if (loading) return <div>Loading...</div>;
  if (error || postError || deleteError || patchError)
    return (
      <div>
        Error:{" "}
        {error?.message ||
          postError?.message ||
          deleteError?.message ||
          patchError?.message}
      </div>
    );

  return (
    <>
      <Input
        addTask={addTask}
        isEditing={state.isEditing}
        taskToEdit={state.isEditing ? state.tasks[state.taskIndex].title : ""}
      />
      <div>
        <h3>In Progress: {taskCounts.inProgressCount}</h3>
        <h3>Completed: {taskCounts.completedCount}</h3>
      </div>
      {state.tasks.map((item, index) => (
        <List
          key={item.id}
          text={item.title}
          editTask={() => editTask(index)}
          deleteTask={() => deleteTask(index)}
          updateStatus={(newStatus, title) =>
            updateTaskStatus(item.id, title, newStatus)
          }
          initialStatus={state.taskStatuses[item.id] || item.status}
        />
      ))}
    </>
  );
}

export default App;
