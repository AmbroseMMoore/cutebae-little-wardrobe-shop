
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CartTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
        <CardDescription>
          Items currently in your shopping cart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button asChild className="w-full bg-cutebae-coral hover:bg-opacity-90">
            <a href="/cart">Go to Cart</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
