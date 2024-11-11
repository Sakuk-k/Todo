import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'http://localhost:3001';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the server when the component mounts
  useEffect(() => {
    axios.get(url)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        alert(error.response?.data?.error ? error.response.data.error : error.message);
      });
  }, []);

  // Function to add a new task
  const addTask = () => {
    axios.post(url + '/create', { description: task })
      .then(response => {
        setTasks([...tasks, { id: response.data.id, description: task }]);
        setTask('');
      })
      .catch(error => {
        alert(error.response?.data?.error ? error.response.data.error : error.message);
      });
  };

 
  const deleteTask = (id) => {
    axios.delete(url + '/delete/' + id)
      .then(() => {
        const withoutRemoved = tasks.filter((item) => item.id !== id);
        setTasks(withoutRemoved);
      })
      .catch(error => {
        alert(error.response?.data?.error ? error.response.data.error : error.message);
      });
  };

  return (
    <div id="container">
      <h3>Todos</h3>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        if (task.trim()) addTask();
      }}>
        <input 
          placeholder="Add new task" 
          value={task}
          onChange={e => setTask(e.target.value)}
        />
      </form>
      
      <ul>
        {tasks.map(item => (
          <li key={item.id}>
            {item.description}
            <button className="delete-button" onClick={() => deleteTask(item.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
