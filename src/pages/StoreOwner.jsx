import { useEffect, useState } from 'react';
import axios from 'axios';

const StoreOwner = () => {
    const [ratings, setRatings] = useState([]);
    const [storeDetails, setStoreDetails] = useState({
        name: '',
        address: '',
        averageRating: 0
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRatings();
    }, []);

    // Fetch store details and ratings
    const fetchRatings = async () => {
        try {
            const response = await axios.get('https://store-rating-backend-mkns.onrender.com/api/store-owner/ratings', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Ratings:', response.data);

            // Set ratings and store details
            setRatings(response.data.ratings || []);
            setStoreDetails({
                name: response.data.storeName || 'N/A',
                address: response.data.storeAddress || 'N/A',
                averageRating: response.data.averageRating || 0
            });
        } catch (error) {
            console.error('Failed to fetch ratings:', error);
        }
    };

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">{storeDetails.name}</h2>
                    <p className="text-gray-600">📍 {storeDetails.address}</p>
                    <p className="text-gray-600">⭐ Average Rating: {storeDetails.averageRating.toFixed(1)}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>

            {/* Ratings Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">User</th>
                        <th className="border p-2">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {ratings.length > 0 ? (
                        ratings.map((rating) => (
                            <tr key={rating.id}>
                                <td className="border p-2">{rating.user_name}</td>
                                <td className="border p-2">{rating.rating}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="border p-2 text-center" colSpan="2">
                                No ratings yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StoreOwner;
