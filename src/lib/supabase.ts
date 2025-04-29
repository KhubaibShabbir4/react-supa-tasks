
import { createClient } from '@supabase/supabase-js';

// Types for our database
export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string;
};

export type TaskInput = Omit<Task, 'id' | 'user_id' | 'created_at'>;

// Initialize Supabase client with the provided URL and anon key
const supabaseUrl = 'https://bdtfghxofkkptzyqybxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdGZnaHhvZmtrcHR6eXF5YnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MDk5MzcsImV4cCI6MjA2MTQ4NTkzN30.6anROPuPDkfjyw07Q22pN_Z83rRljeYSFdlc0OGmiAM';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication helpers
export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// Task CRUD operations
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data: data as Task[] | null, error };
}

export async function createTask(task: TaskInput) {
  // Get the current user before inserting the task
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData?.user) {
    return { 
      data: null, 
      error: { message: 'User not authenticated' } 
    };
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      ...task,
      user_id: userData.user.id
    }])
    .select();
  
  return { data: data?.[0] as Task | null, error };
}

export async function updateTask(id: string, updates: Partial<TaskInput>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select();
  
  return { data: data?.[0] as Task | null, error };
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  return { error };
}
