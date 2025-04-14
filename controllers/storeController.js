import { createStore, getAllStores, getStoreById } from '../models/StoreModel.js';

const addStore = async (req, res) => {
    const { name, address } = req.body;
    const ownerId = req.user.id;

    try {
        const store = await createStore(name, address, ownerId);
        res.status(201).json(store);
    } catch (err) {
        res.status(500).json({ message: 'Error creating store', error: err.message });
    }
};

const getStores = async (req, res) => {
    try {
        const stores = await getAllStores();
        res.status(200).json(stores);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stores', error: err.message });
    }
};

const getStoreByOwner = async (req, res) => {
    try {
        const store = await getStoreById(req.user.id);
        if (!store) return res.status(404).json({ message: 'Store not found' });

        res.status(200).json(store);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching store', error: err.message });
    }
};

export { addStore, getStores, getStoreByOwner };
