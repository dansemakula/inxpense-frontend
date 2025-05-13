import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-6 text-center space-y-4">
      <h1 className="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-gray-600">Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="text-blue-600 underline">
        Go back to Home
      </Link>
    </div>
  );
}