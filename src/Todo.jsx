import { useEffect, useRef, useState } from "react";
import "./app.css";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export default function Todo() {
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("todos");
    if (localValue == null) return [];
    return JSON.parse(localValue);
  });

  const [mode, setMode] = useState("add");
  const [editIndex, setEditIndex] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    const text = inputRef.current.value;
    if (text !== "") {
      setTodos([...todos, { status: false, text }]);
      inputRef.current.value = "";
    }
  };

  const handleChecked = (index) => {
    const copyTodos = [...todos];
    copyTodos[index].status = !copyTodos[index].status;
    setTodos(copyTodos);
  };

  const handleDelete = (index) => {
    const copyTodos = [...todos];
    copyTodos.splice(index, 1);
    setTodos(copyTodos);
  };

  const handleEdit = (index) => {
    const copyTodos = [...todos];
    inputRef.current.value = copyTodos[index].text;
    inputRef.current.focus();
    setEditIndex(index);
    setMode("edit");
  };

  const saveEdit = () => {
    const copyTodos = [...todos];
    if (editIndex !== null) {
      copyTodos[editIndex].text = inputRef.current.value;
      setTodos(copyTodos);
      setMode("add");
      inputRef.current.value = "";
      setEditIndex(null);
    }
  };

  return (
    <div className="container">
      <h1>📋 Todo-list</h1>
      <input ref={inputRef} type="text" placeholder="To Do..." />
      {mode === "add" ? (
        <button onClick={handleAdd} className="add">
          Add
        </button>
      ) : (
        <button onClick={saveEdit} className="save">
          Save
        </button>
      )}
      <ul style={{ pointerEvents: mode === "edit" && "none" }}>
        {todos.map(({ status, text }, index) => (
          <div key={index} className="content">
            <input
              className="checkbox"
              type="checkbox"
              checked={status}
              readOnly
            />
            <li
              className={status ? "checked" : ""}
              onClick={() => handleChecked(index)}
            >
              {text}
            </li>
            <div className="controls">
              <FaEdit className="edit" onClick={() => handleEdit(index)} />
              <MdDelete
                className="delete"
                onClick={() => handleDelete(index)}
              />
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
