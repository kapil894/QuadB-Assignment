import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = (status) => {
    setShowModal(true);
    setNewTask({ ...newTask, status });
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const saveTask = async () => {
    try {
      const response = await axios.post('http://localhost:4000/tasks', newTask);
      setTasks({ ...tasks, [newTask.status]: [...tasks[newTask.status], response.data] });
      setNewTask({ title: '', description: '', status: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const deleteTask = async (task) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${task._id}`);
      const updatedTasks = { ...tasks };
      updatedTasks[task.status] = updatedTasks[task.status].filter(t => t._id !== task._id);
      setTasks(updatedTasks);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateStatus = async (task, newStatus) => {
    try {
      const response = await axios.patch(`http://localhost:4000/tasks/${task._id}`, { status: newStatus });
      const updatedTasks = { ...tasks };
      updatedTasks[task.status] = updatedTasks[task.status].filter(t => t._id !== task._id);
      updatedTasks[newStatus] = [...updatedTasks[newStatus], response.data];
      setTasks(updatedTasks);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4 text-center underline mb-5">TO-DO List</h1>
      <hr className='mb-5' />
      <div className="flex flex-wrap justify-center">
        {Object.keys(tasks).map(status => (
          <section key={status} className="w-full md:w-96 mb-8 md:mb-0 md:mr-4">
            <h2 className={`text-lg font-semibold mb-2 text-center ${
              status === 'todo' ? 'text-red-600' : 
              status === 'inProgress' ? 'text-yellow-600' : 'text-green-600'}`}>
              {status.toUpperCase()}
            </h2>
            <article className={`border border-gray-200 p-4 rounded mb-4 ${
              status === 'todo' ? 'bg-red-300' : 
              status === 'inProgress' ? 'bg-yellow-300' : 'bg-green-300'}`}>
              {tasks[status].map((task) => (
                <div key={task._id} className="border-b border-gray-200 py-2 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm">{task.description}</p>
                  </div>
                  <div>
                    {(status === 'todo' && (
                      <>
                        <button onClick={() => updateStatus(task, 'inProgress')} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">In Progress</button>
                        <button onClick={() => updateStatus(task, 'done')} className="bg-green-500 text-white px-2 py-1 rounded">Done</button>
                      </>
                    )) || (status === 'inProgress' && (
                      <button onClick={() => updateStatus(task, 'done')} className="bg-green-500 text-white px-2 py-1 rounded">Done</button>
                    ))}
                    <button onClick={() => deleteTask(task)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={() => addTask(status)} className="mt-4 bg-blue-500 text-white px-2 py-1 rounded">New Task</button>
            </article>
            <p className="text-center">Tasks: {tasks[status].length}</p>
          </section>
        ))}
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-xl font-semibold mb-4">New Task</h2>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Title"
            />
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Description"
            />
            <button onClick={saveTask} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Save</button>
            <button onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
