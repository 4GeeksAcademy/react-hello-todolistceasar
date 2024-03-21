import React, { useState, useEffect } from "react";

// Create your first component
const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    // Fetch todos from the API
    useEffect(() => {
        fetchTodos(); // Call fetchTodos when the component mounts
    }, []);

    // Function to fetch todos
    const fetchTodos = () => {
        fetch('https://playground.4geeks.com/apis/fake/todos/user/Ceasar')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                const todosData = data.map(todo => ({ ...todo, label: todo.label }));
                setTodos(todosData);
            })
            .catch(error => console.error('Error fetching todos:', error));
    };

    // Function to add a new todo
    const addTodo = () => {
        const newTodo = { label: inputValue, done: false };
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos); // Update todos in the local state
        updateTodoList(updatedTodos); // Update todos in the backend
        setInputValue(""); // Reset input field
    };

    // Function to delete a todo
    const deleteTodo = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos); // Update todos in the local state
        updateTodoList(updatedTodos); // Update todos in the backend
    };

    // Function to update the entire list of todos for a particular user
    const updateTodoList = (updatedTodos) => {
        fetch('https://playground.4geeks.com/apis/fake/todos/user/Ceasar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodos)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('List updated:', data);
        })
        .catch(error => console.error('Error updating todo list:', error));
    };

    return (
        <div className="container">
            <h1>Todo List</h1>
            <input 
                type="text"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        addTodo();
                    }
                }}
                placeholder="Add a new task"
            />
            <ul>
                {todos.map((item, index) => (
                    <li key={index}>
                        {item.label} 
                        <i 
                            className="fa-solid fa-trash-can"
                            onClick={() => deleteTodo(index)}
                        ></i>
                    </li>
                ))}
            </ul>
            <div>{todos.length} tasks</div>
        </div>
    );
};

export default Home;
