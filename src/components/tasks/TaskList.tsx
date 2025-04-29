
import React, { useState, useEffect } from 'react';
import { Task, getTasks } from '@/lib/supabase';
import TaskItem from './TaskItem';
import { useToast } from '@/hooks/use-toast';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data, error } = await getTasks();
      
      if (error) throw error;
      setTasks(data || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleTaskUpdated(updatedTask: Task) {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  }

  function handleTaskDeleted(taskId: string) {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      ))}
    </div>
  );
}
