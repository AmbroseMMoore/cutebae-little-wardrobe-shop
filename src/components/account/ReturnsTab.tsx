
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

export default function ReturnsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Returns & Cancellations</CardTitle>
        <CardDescription>
          Manage your returns and cancellations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <X className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-1">No returns or cancellations</h3>
          <p className="text-gray-500 mb-4">You don't have any pending returns or cancellations.</p>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            If you need to return or cancel an order, please visit the order details page or contact our customer support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
