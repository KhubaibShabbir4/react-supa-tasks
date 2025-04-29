
import React, { useState } from 'react';
import { Task, updateTask, deleteTask } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Trash2, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Toggle task completion
  async function handleToggleComplete() {
    setIsUpdating(true);
    try {
      const { data, error } = await updateTask(task.id, { 
        is_complete: !task.is_complete 
      });
      
      if (error) throw error;
      if (data) {
        onTaskUpdated(data);
        toast({
          description: data.is_complete ? "Task marked as complete" : "Task marked as incomplete",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  // Save edited task
  async function handleSaveEdit() {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await updateTask(task.id, { 
        title, 
        description: description || null 
      });
      
      if (error) throw error;
      if (data) {
        onTaskUpdated(data);
        setIsEditing(false);
        toast({
          description: "Task updated successfully",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  // Delete task
  async function handleDelete() {
    setIsDeleting(true);
    try {
      const { error } = await deleteTask(task.id);
      
      if (error) throw error;
      onTaskDeleted(task.id);
      toast({
        description: "Task deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete task",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className={`mb-3 border-l-4 ${task.is_complete ? 'border-l-green-500' : 'border-l-blue-500'} transition-all`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="font-medium mb-2"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description (optional)"
                className="min-h-[80px] text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTitle(task.title);
                  setDescription(task.description || '');
                  setIsEditing(false);
                }}
                disabled={isUpdating}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                disabled={isUpdating}
              >
                <Check className="h-4 w-4 mr-1" />
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className="pt-1">
                <Checkbox 
                  checked={task.is_complete} 
                  onCheckedChange={handleToggleComplete}
                  disabled={isUpdating}
                  className={task.is_complete ? 'opacity-100' : 'opacity-70'}
                />
              </div>
              <div className={`flex-1 ${task.is_complete ? 'text-muted-foreground' : ''}`}>
                <h3 className={`font-medium ${task.is_complete ? 'line-through opacity-70' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm mt-1 ${task.is_complete ? 'line-through opacity-70' : 'text-muted-foreground'}`}>
                    {task.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(task.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
