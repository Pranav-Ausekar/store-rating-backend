import { useEffect, useState } from 'react';
import axios from 'axios';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ratings, setRatings] = useState({});
    const token = localStorage.getItem('token');

    // Fetch stores on load
    useEffect(() => {
        if (!token) {
            setError('Unauthorized. Please log in.');
            return;
        }
        fetchStores();
    }, []);

    // Fetch stores from API
    const fetchStores = async () => {
        if (!token) return;

        setLoading(true);
        setError('');
        try {
            const response = await axios.get('https://store-rating-backend-mkns.onrender.com/api/admin/stores', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('API Response:', response.data);
            setStores(Array.isArray(response.data) ? response.data : []);
            // Set initial ratings from backend data
            const initialRatings = response.data.reduce((acc, store) => {
                acc[store.id] = store.rating || '';
                return acc;
            }, {});
            setRatings(initialRatings);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
            setError(error.response?.data?.message || 'Failed to fetch stores');
        } finally {
            setLoading(false);
        }
    };

    // Handle rating input change
    const handleRatingChange = (storeId, value) => {
        setRatings((prev) => ({
            ...prev,
            [storeId]: value
        }));
    };

    // Submit rating functionality
    const handleRatingSubmit = async (storeId) => {
        const rating = ratings[storeId];

        if (!rating || rating < 1 || rating > 5) {
            alert('Please provide a rating between 1 and 5.');
            return;
        }

        try {
            const response = await axios.post(
                `https://store-rating-backend-mkns.onrender.com/api/ratings`,
                { storeId, rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Rating submitted:', response.data);

            // Update the rating directly in state without refreshing
            setStores((prevStores) =>
                prevStores.map((store) =>
                    store.id === storeId ? { ...store, rating } : store
                )
            );

            alert('Rating submitted successfully!');
        } catch (error) {
            console.error('Failed to submit rating:', error);
            alert(error.response?.data?.message || 'Failed to submit rating. Please try again.');
        }
    };



    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // Filter stores based on search term
    const filteredStores = stores.filter((store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Available Stores</h2>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <input
                type="text"
                placeholder="Search..."
                className="border px-3 py-2 rounded mb-4 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading && <p className="text-center text-gray-500">Loading stores...</p>}

            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Stores List */}
            <div>
                {filteredStores.length > 0 ? (
                    filteredStores.map((store) => (
                        <div key={store.id} className="p-4 border rounded mb-4 bg-white shadow">
                            <h3 className="text-lg font-bold">{store.name}</h3>
                            <p>{store.address || 'No address available'}</p>
                            <p>Rating: {store.rating || 'Not rated yet'}</p>

                            {/* Rating Input */}
                            <div className="flex gap-2 mt-2">
                                <select
                                    value={ratings[store.id] || ''}
                                    onChange={(e) => handleRatingChange(store.id, parseInt(e.target.value) || '')}
                                    className="border px-2 py-1 rounded"
                                >
                                    <option value="" disabled>
                                        Rate this store
                                    </option>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleRatingSubmit(store.id)}
                                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    ))
                ) : !loading && !error ? (
                    <p className="text-center text-gray-500">No stores found.</p>
                ) : null}
            </div>
        </div>
    );
};

export default Stores;
