
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login to Your Account</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-cutebae-coral" />
                      <span className="ml-2 text-sm">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-cutebae-coral hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button className="w-full bg-cutebae-coral hover:bg-opacity-90">
                    Sign in
                  </Button>
                </div>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 mt-2">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-cutebae-coral hover:underline font-medium">
                  Create one now
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
