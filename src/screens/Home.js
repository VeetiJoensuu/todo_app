import './Home.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Row from '../components/Row';
import { useUser } from '../context/useUser.js';

// Base URL for the backend API
const url = 'http://localhost:3001';

function Home() {
  const { user } = useUser();
  const [task, setTask] = useState(''); // State for new task input
  const [tasks, setTasks] = useState([]); // State for list of tasks

  // Fetch tasks when the component mounts
  useEffect(() => {
    axios.get(url, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(response => {
      setTasks(response.data);
    })
    .catch(error => {
      alert(error.response?.data?.error ? error.response.data.error : error.message);
    });
  }, [user.token]);

  // Function to add a new task
  const addTask = () => {
    axios.post(url + '/create', {
      description: task
    }, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(response => {
      setTasks([...tasks, { id: response.data.id, description: task }]);
      setTask('');
    })
    .catch(error => {
      alert(error.response?.data?.error ? error.response.data.error : error.message);
    });
  };

  // Function to delete a task
  const deleteTask = (id) => {
    axios.delete(url + '/delete/' + id, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(response => {
      const withoutRemoved = tasks.filter((item) => item.id !== id);
      setTasks(withoutRemoved);
    })
    .catch(error => {
      alert(error.response?.data?.error ? error.response.data.error : error.message);
    });
  };

  return (
    <div id="home-container">
      <h3 className="home-title">Todos</h3>
      <form
        className="home-form"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          className="home-input"
          placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
        />
      </form>
      <ul className="home-list">
        {tasks.map(item => (
          <Row key={item.id} item={item} deleteTask={deleteTask} />
        ))}
      </ul>
    </div>
  );
}

export default Home;
