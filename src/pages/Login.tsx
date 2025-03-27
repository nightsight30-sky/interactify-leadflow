
import { Link } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50/50 px-4 py-12 page-transition">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          <span className="text-sm">Back to home</span>
        </Link>
      </div>
      
      <div className="text-center mb-8">
        <Link to="/" className="inline-block">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            LeadFlow
          </h1>
        </Link>
      </div>
      
      <Alert className="mb-6 max-w-md bg-blue-50">
        <InfoIcon className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm text-gray-700">
          Admin access: Use <span className="font-medium">admin@leadflow.com</span> with password <span className="font-medium">admin123</span>
        </AlertDescription>
      </Alert>
      
      <AuthForm type="login" />
      
      <div className="max-w-md text-center mt-8 text-sm text-gray-500">
        <p>By logging in, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
      </div>
    </div>
  );
};

export default Login;
