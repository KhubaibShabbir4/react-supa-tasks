
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import NewTaskForm from '@/components/tasks/NewTaskForm';
import TaskList from '@/components/tasks/TaskList';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function DashboardPage() {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [refreshTaskList, setRefreshTaskList] = useState(0);

  // Function to refresh task list after task creation
  const handleTaskCreated = () => {
    setRefreshTaskList(prev => prev + 1);
    setShowNewTaskForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <Button 
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            variant={showNewTaskForm ? "outline" : "default"}
          >
            {showNewTaskForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </>
            )}
          </Button>
        </div>

        {showNewTaskForm && (
          <div className="mb-8 animate-fade-in">
            <NewTaskForm onTaskCreated={handleTaskCreated} />
          </div>
        )}

        <TaskList key={refreshTaskList} />
      </main>
    </div>
  );
}
