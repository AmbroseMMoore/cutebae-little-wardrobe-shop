
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AccountTabs from '@/components/account/AccountTabs';

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg max-w-3xl mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="mb-6">You need to be signed in to view your account details.</p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        <AccountTabs />
      </div>
    </Layout>
  );
}
