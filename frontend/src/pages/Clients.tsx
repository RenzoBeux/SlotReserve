
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User, Plus } from 'lucide-react';

// Mock data
const MOCK_CLIENTS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bookings: 3,
    lastBooking: new Date(2025, 3, 10).toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    bookings: 1,
    lastBooking: new Date(2025, 4, 2).toISOString(),
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    bookings: 5,
    lastBooking: new Date(2025, 4, 12).toISOString(),
  },
];

const Clients = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button className="bg-bookify-500 hover:bg-bookify-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>Manage your client relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_CLIENTS.map((client) => (
              <div key={client.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-bookify-100 flex items-center justify-center mr-4">
                    <User className="w-5 h-5 text-bookify-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{client.bookings} bookings</div>
                  <div className="text-xs text-muted-foreground">
                    Last: {new Date(client.lastBooking).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Users className="mr-2 h-4 w-4" />
            View All Clients
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Clients;
