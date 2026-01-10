import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';

const TaskBoard = ({ role }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tasks on mount
    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3000/tasks', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data);
                }
            } catch (err) {
                console.error('Failed to fetch tasks', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tasks</h2>
                {role === 'client' && <Button>+ New Task</Button>}
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <Card key={task.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} title={`Priority: ${task.priority}`}></div>

                                <div>
                                    <h4 className={`font-bold ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                                        {task.title}
                                    </h4>
                                    <p className="text-xs text-gray-500">Due: {task.due}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase
                 ${task.status === 'done' ? 'bg-gray-100 text-gray-600' :
                                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <Button variant="secondary" className="text-xs py-1 px-3">Details</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskBoard;
