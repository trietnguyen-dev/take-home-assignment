"use client";
import withAuth from '@/app/components/withAuth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from '../../../../ultis/auth';
import { buyOffer, getOffers } from '../../api/user';

function OfferListing() {
    const [offers, setOffers] = useState<IOffer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [purchasedOffers, setPurchasedOffers] = useState<Set<string>>(new Set());
    const router = useRouter();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response: IResponseOffer = await getOffers();
                const offerData = Array.isArray(response.data) ? response.data : [response.data];
                setOffers(offerData || []);
            } catch (error) {
                setError("Failed to update the offer.");
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);
    const handleBuyNow = async (id: string) => {
        try {
            await buyOffer(id);
            setPurchasedOffers(new Set([...purchasedOffers, id]));
        } catch (error) {
            console.error(error);
        }
    };
    const handleSignOut = () => {
        signOut();
        router.push('/');
    };
    console.log(offers[0]);
    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-6"
            >
                Sign Out
            </button>
            <h1 className="text-4xl font-bold text-center mb-12 text-white">Available Offers</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map((offer) => (
                    <motion.div
                        key={offer._id}
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * offers.indexOf(offer) }}
                    >
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">{offer.title}</h2>
                        <p className="text-gray-600 mb-4">{offer.description}</p>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-medium text-gray-500 line-through">Original: ${offer.originalPrice}</p>
                            <p className="text-lg font-bold text-green-600">Now: ${offer.discountedPrice}</p>
                        </div>
                        <p className="text-sm text-green-600 mb-4 font-medium">Save {offer.discount}%</p>
                        <button
                            onClick={() => handleBuyNow(offer._id as string)}
                            disabled={purchasedOffers.has(offer._id as string)}
                            className={`w-full text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform ${purchasedOffers.has(offer._id as string) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {purchasedOffers.has(offer._id as string) ? 'Bought' : 'Buy Now'}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default withAuth(OfferListing);
