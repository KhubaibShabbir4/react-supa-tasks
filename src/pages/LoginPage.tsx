
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // If we're still checking auth status, show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // User is not logged in
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="py-8 text-center">
          <h1 className="text-3xl font-bold mb-2">TaskMaster</h1>
          <p className="text-muted-foreground">Your personal task management solution</p>
        </div>
        <AuthForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}
