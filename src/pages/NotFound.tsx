
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-5xl font-bold text-cutebae-coral mb-6">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Oops! Page not found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex justify-center">
            <Button asChild className="bg-cutebae-coral hover:bg-opacity-90">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
