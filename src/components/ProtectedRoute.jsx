import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    console.log('Token:', token);
    console.log('User Role:', userRole);

    if (!token) {
        console.warn('No token found. Redirecting to login.');
        return <Navigate to="/login" replace />;
    }

    // Allow role to be an array
    if (role && ![].concat(role).includes(userRole)) {
        console.warn(`Role mismatch. Expected: ${role}, Found: ${userRole}`);
        return <Navigate to="/unauthorized" replace />;
    }

    return element;
};

export default ProtectedRoute;
