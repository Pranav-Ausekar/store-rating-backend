import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
    const token = localStorage.getItem('token');

    if (token) {
        // Redirect to dashboard if logged in
        return <Navigate to="/dashboard" />;
    }

    return element;
};

export default PublicRoute;
