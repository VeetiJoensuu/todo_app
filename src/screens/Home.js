import '.Home.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Row from '../components/Row';
import useUser from '/src/context/useUser.js';

const url = 'http://localhost:3001'

function Home() {
  const { user } = useUser()
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    axios.get(url)
    .then(response => {
      setTasks(response.data)
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })
  }, [])

  const addTask = () => {
    const headers = {headers: {Authorization:user.token}}
    axios.post(url + '/create', {
      description: task
    })
    .then(response => {
      setTasks([...tasks, { id: response.data.id, description: task }]);
      setTask('');
    })
    .catch(error => {
      alert(error.response && error.response.data && error.response.data.error ? error.response.data.error : error.message);
    });
  };  

  const deleteTask = (id) => {
    const headers = {headers: {Authorization:user.token}}
    axios.delete(url + '/delete/' + id)
      .then(response => {
        const withoutRemoved = tasks.filter((item) => item.id !== id)
        setTasks(withoutRemoved)
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error)
      })
  }

return (
    <div id="container">
      <h3>Todos</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        addTask();
      }}>
        <input
          placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
        />
      </form>
      <ul>
        {
          tasks.map(item => (
            <Row key={item.id} item={item} deleteTask={deleteTask}/>
          ))
        }
      </ul>
    </div>
  );
}

export default Home;