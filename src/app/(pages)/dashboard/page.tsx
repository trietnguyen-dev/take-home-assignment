"use client";
import { addOffer, deleteOffer, getOffers, updateOffer } from '@/app/api/admin';
import withAuth from '@/app/components/withAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export function AdminPanel() {
    const [offers, setOffers] = useState<IOffer[]>([]);
    const [newOffer, setNewOffer] = useState<IOffer>({
        title: '',
        description: '',
        discount: 1,
        originalPrice: 1,
        discountedPrice: 1
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editingOffer, setEditingOffer] = useState<IOffer | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
                setSuccessMessage(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsAuthenticated(true);
                setIsAdmin(true);
                loadOffers();
            } catch (error) {
                setIsAuthenticated(false);
                setIsAdmin(false);
                router.push('/');
            }
        };

        fetchUserData();
    }, [router]);

    const handleEditOffer = (offer: IOffer) => {
        setEditingOffer(offer);
        setNewOffer(offer);
    };

    const handleUpdateOffer = async () => {
        if (!editingOffer || !editingOffer._id) return;

        const validationError = validateOffer(newOffer);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const response: IResponseOffer = await updateOffer(editingOffer._id, newOffer);
            if (response.status === 'success') {
                setOffers((prev) =>
                    prev.map((offer) =>
                        offer._id === editingOffer._id ? response.data : offer
                    ) as IOffer[]
                );
                setSuccessMessage("Offer updated successfully!");
                setErrorMessage(null);
                setEditingOffer(null);
                setNewOffer({
                    title: '',
                    description: '',
                    discount: 1,
                    originalPrice: 1,
                    discountedPrice: 1
                });
            } else {
                setErrorMessage(response.msg);
            }
        } catch (error) {
            setErrorMessage("Failed to update the offer.");
        }
    };

    const loadOffers = async () => {
        try {
            const response: IResponseOffer = await getOffers();
            const offerData = Array.isArray(response.data) ? response.data : [response.data];
            setOffers(offerData || []);
        } catch (error) {
            setErrorMessage("Failed to load offers.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewOffer((prev) => ({ ...prev, [name]: name === 'discount' || name === 'originalPrice' ? Number(value) : value }));
    };

    const handleAddOffer = async () => {
        const validationError = validateOffer(newOffer);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const response: IResponseOffer = await addOffer(newOffer);
            if (response.status === 'success') {
                const newOfferData = response.data;

                if (!Array.isArray(newOfferData)) {
                    setOffers((prev) => [...prev, newOfferData]);
                } else {
                    setOffers((prev) => [...prev, ...newOfferData]);
                }

                setSuccessMessage("Offer added successfully!");
                setErrorMessage(null);
                setNewOffer({
                    title: '',
                    description: '',
                    discount: 1,
                    originalPrice: 1,
                    discountedPrice: 1
                });
            } else {
                setErrorMessage(response.msg);
            }
        } catch (error) {
            setErrorMessage("Failed to add the offer.");
        }
    };

    const handleDeleteOffer = async (id: string) => {
        setOffers((prev) => prev.filter((offer) => offer._id !== id));

        try {
            await deleteOffer(id);
            setSuccessMessage("Offer deleted successfully!");
        } catch (error) {
            loadOffers();
            setErrorMessage("Failed to delete the offer.");
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setIsAdmin(false);
        router.push('/');
    };

    return isAuthenticated && isAdmin ? (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-100 mb-12">Admin Panel</h1>

                {errorMessage && (
                    <div className="mb-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-8 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Success</p>
                        <p>{successMessage}</p>
                    </div>
                )}
                <button
                    onClick={handleSignOut}
                    className="mb-8 bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
                >
                    Sign Out
                </button>

                <div className="mb-12 bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-100 mb-6">
                        {editingOffer ? 'Edit Offer' : 'Add New Offer'}
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Enter offer title"
                                value={newOffer.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                placeholder="Enter offer description"
                                value={newOffer.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="discount" className="block text-sm font-medium text-gray-300">Discount Percentage</label>
                                <input
                                    type="number"
                                    name="discount"
                                    id="discount"
                                    placeholder="Enter discount percentage"
                                    value={newOffer.discount}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-300">Original Price</label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    id="originalPrice"
                                    placeholder="Enter original price"
                                    value={newOffer.originalPrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                                />
                            </div>
                        </div>
                        <button
                            onClick={editingOffer ? handleUpdateOffer : handleAddOffer}
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                        >
                            {editingOffer ? 'Update Offer' : 'Add Offer'}
                        </button>
                        {editingOffer && (
                            <button
                                onClick={() => {
                                    setEditingOffer(null);
                                    setNewOffer({
                                        title: '',
                                        description: '',
                                        discount: 1,
                                        originalPrice: 1,
                                        discountedPrice: 1
                                    });
                                }}
                                className="w-full mt-4 bg-gray-600 text-gray-200 font-bold py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-gray-100 mb-6">Existing Offers</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {offers.map((offer) => (
                            <div key={offer._id} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-xl font-semibold text-gray-100 mb-2">{offer.title}</h3>
                                    <p className="text-gray-400 mb-4">{offer.description}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-300">Discount</span>
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {offer.discount}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-300">Original Price</span>
                                        <span className="text-sm text-gray-100 line-through">${offer.originalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-gray-300">Discounted Price</span>
                                        <span className="text-lg font-semibold text-indigo-400">
                                            ${(offer.originalPrice - (offer.originalPrice * offer.discount) / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gray-700 px-4 py-4 sm:px-6">
                                    <button
                                        onClick={() => handleEditOffer(offer)}
                                        className="w-full mb-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                                    >
                                        Edit Offer
                                    </button>
                                    <button
                                        onClick={() => handleDeleteOffer(offer._id || '')}
                                        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
                                    >
                                        Delete Offer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

function validateOffer(offer: IOffer) {
    const { title, description, discount, originalPrice } = offer;

    if (!title || !description || discount === undefined || originalPrice === undefined) {
        return "All fields are required.";
    }

    if (isNaN(discount) || isNaN(originalPrice)) {
        return "Discount and Original Price must be numbers.";
    }

    if (discount < 0 || discount > 100) {
        return "Discount must be between 0 and 100.";
    }

    if (originalPrice < 0) {
        return "Original Price must be a positive number.";
    }

    return null;
}

export default withAuth(AdminPanel);
