
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, Package, PlusCircle, List, 
  Home, Users, FileText, LogOut, Truck, X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  React.useEffect(() => {
    // Check if user is admin (you would need to add this field to your user profiles)
    const checkAdmin = async () => {
      if (!user) {
        navigate('/login');
      }
      
      // In a real app, you would check if the user has admin privileges
      // For now, we'll allow any logged-in user to access the CMS
    };
    
    checkAdmin();
  }, [user, navigate]);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the admin area</h1>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <Link to="/" className="flex items-center">
            <div className="text-xl font-bold text-cutebae-coral">
              <span>Cutebae Admin</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/orders') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <ShoppingCart size={18} className="mr-2" />
                Orders
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/shipments" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/shipments') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <Truck size={18} className="mr-2" />
                Shipments
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/products') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <Package size={18} className="mr-2" />
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/add-product" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/add-product') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <PlusCircle size={18} className="mr-2" />
                Add Product
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/categories" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/categories') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <List size={18} className="mr-2" />
                Categories
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/customers" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/customers') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <Users size={18} className="mr-2" />
                Customers
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/returns" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/returns') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <X size={18} className="mr-2" />
                Returns & Cancellations
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/reports" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/reports') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <FileText size={18} className="mr-2" />
                Reports
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="ghost"
            className="w-full text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-center"
            onClick={signOut}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <div className="flex items-center">
              <span className="mr-4 text-sm">Welcome, {user.email}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
              >
                View Store
              </Button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
