import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AddModal from '../components/AddModal';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const token = localStorage.getItem('token');

    const fetchData = useCallback(async () => {
        if (!token) return;
        try {
            const endpoint =
                activeTab === 'users'
                    ? 'https://store-rating-backend-mkns.onrender.com/api/admin/users'
                    : 'https://store-rating-backend-mkns.onrender.com/api/admin/stores';

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            activeTab === 'users' ? setUsers(response.data) : setStores(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }, [activeTab, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAuth = () => {
        if (token) {
            localStorage.removeItem('token');
            window.location.reload();
        } else {
            window.location.href = '/login';
        }
    };

    const handleAdd = async (formData) => {
        try {
            const endpoint =
                activeTab === 'users'
                    ? 'https://store-rating-backend-mkns.onrender.com/api/admin/users'
                    : 'https://store-rating-backend-mkns.onrender.com/api/admin/stores';

            await axios.post(endpoint, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(`${activeTab === 'users' ? 'User' : 'Store'} added successfully!`);
            setIsAddModalOpen(false);
            fetchData(); // Refresh the list
        } catch (error) {
            console.error('Failed to add entity:', error);
            alert(error.response?.data?.message || 'Failed to add entity.');
        }
    };

    const filteredData = (activeTab === 'users' ? users : stores)
        .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

    const userFields = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'role', label: 'Role', type: 'text' },
    ];

    const storeFields = [
        { name: 'name', label: 'Store Name', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'rating', label: 'Rating', type: 'number' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <div className="flex gap-2">
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        + Add {activeTab === 'users' ? 'User' : 'Store'}
                    </button>
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded"
                        onClick={handleAuth}
                    >
                        {token ? 'Logout' : 'Login'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex mb-4">
                <button
                    className={`px-4 py-2 ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'stores' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => setActiveTab('stores')}
                >
                    Stores
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded w-full mb-4"
            />

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        {activeTab === 'users' && (
                            <>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Role</th>
                                <th className="border p-2">Address</th>
                            </>
                        )}
                        {activeTab === 'stores' && (
                            <>
                                <th className="border p-2">Address</th>
                                <th className="border p-2">Rating</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-100">
                            <td className="border p-2">{item.name || 'N/A'}</td>
                            {activeTab === 'users' && (
                                <>
                                    <td className="border p-2">{item.email || 'N/A'}</td>
                                    <td className="border p-2">{item.role || 'N/A'}</td>
                                    <td className="border p-2">{item.address || 'N/A'}</td>
                                </>
                            )}
                            {activeTab === 'stores' && (
                                <>
                                    <td className="border p-2">{item.address || 'N/A'}</td>
                                    <td className="border p-2">{item.rating || 'N/A'}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* AddModal */}
            <AddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAdd}
                fields={activeTab === 'users' ? userFields : storeFields}
                title={`Add ${activeTab === 'users' ? 'User' : 'Store'}`}
            />
        </div>
    );
};

export default Dashboard;
