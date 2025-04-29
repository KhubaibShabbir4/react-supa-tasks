
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '@/lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleSignOut() {
    try {
      await signOut();
      toast({
        description: "You've been signed out successfully",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  }

  return (
    <header className="bg-card border-b border-border py-4">
      <div className="container max-w-4xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">TaskMaster</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              {user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
