import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Stores from '../pages/Stores';
import StoreOwner from '../pages/StoreOwner';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes for Admin */}
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute element={<Dashboard />} role="admin" />}
                />

                {/* Protected Routes for User */}
                <Route
                    path="/stores"
                    element={<ProtectedRoute element={<Stores />} role="user" />}
                />

                {/* Protected Route for Store Owner */}
                <Route
                    path="/store-owner"
                    element={<ProtectedRoute element={<StoreOwner />} role="store-owner" />}
                />

                {/* Catch All */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
