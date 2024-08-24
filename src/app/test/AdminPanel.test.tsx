import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { getOffers, addOffer, updateOffer, deleteOffer } from '@/app/api/admin';
import { AdminPanel } from '../(pages)/dashboard/page';
import { describe, test, beforeEach, expect } from '@jest/globals';

jest.mock('@/app/api/admin', () => ({
    getOffers: jest.fn(),
    addOffer: jest.fn(),
    updateOffer: jest.fn(),
    deleteOffer: jest.fn(),
}));

describe('AdminPanel', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('renders without crashing', () => {
        render(<AdminPanel />);
        const adminPanelHeader = screen.queryByText(/Admin Panel/i);
        expect(adminPanelHeader).not.toBeNull();
    });

    test('displays offers when fetched successfully', async () => {
        const mockOffers = [{ _id: '1', title: 'Offer 1', description: 'Description 1', discount: 10, originalPrice: 100, discountedPrice: 90 }];
        (getOffers as jest.Mock).mockResolvedValue({ data: mockOffers, status: 'success' });

        const { container } = render(<AdminPanel />);

        await waitFor(() => {
            const offerElement = container.querySelector('div');
            expect(offerElement?.textContent).toContain('Offer 1');
        });
    });

    test('shows error message when fetching offers fails', async () => {
        (getOffers as jest.Mock).mockRejectedValue(new Error('Failed to fetch offers'));

        const { container } = render(<AdminPanel />);

        await waitFor(() => {
            const errorElement = container.querySelector('div');
            expect(errorElement?.textContent).toContain('Failed to load offers');
        });
    });

    test('adds a new offer successfully', async () => {
        const mockOffer = { title: 'New Offer', description: 'New Description', discount: 20, originalPrice: 200, discountedPrice: 160 };
        (addOffer as jest.Mock).mockResolvedValue({ data: mockOffer, status: 'success' });

        const { container } = render(<AdminPanel />);

        fireEvent.change(screen.getByPlaceholderText(/Enter offer title/i), { target: { value: 'New Offer' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter offer description/i), { target: { value: 'New Description' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter discount percentage/i), { target: { value: '20' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter original price/i), { target: { value: '200' } });

        fireEvent.click(screen.getByText(/Add Offer/i));

        await waitFor(() => {
            const successElement = container.querySelector('div');
            expect(successElement?.textContent).toContain('Offer added successfully');
        });
    });

    test('updates an existing offer', async () => {
        const updatedOffer = { _id: '1', title: 'Updated Offer', description: 'Updated Description', discount: 30, originalPrice: 300, discountedPrice: 210 };
        (updateOffer as jest.Mock).mockResolvedValue({ data: updatedOffer, status: 'success' });

        const { container } = render(<AdminPanel />);

        fireEvent.click(screen.getByText(/Edit Offer/i));
        fireEvent.change(screen.getByPlaceholderText(/Enter offer title/i), { target: { value: 'Updated Offer' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter offer description/i), { target: { value: 'Updated Description' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter discount percentage/i), { target: { value: '30' } });
        fireEvent.change(screen.getByPlaceholderText(/Enter original price/i), { target: { value: '300' } });

        fireEvent.click(screen.getByText(/Update Offer/i));

        await waitFor(() => {
            const successElement = container.querySelector('div');
            expect(successElement?.textContent).toContain('Offer updated successfully');
        });
    });

    test('deletes an offer successfully', async () => {
        (deleteOffer as jest.Mock).mockResolvedValue({ status: 'success' });

        const { container } = render(<AdminPanel />);

        fireEvent.click(screen.getByText(/Delete Offer/i));

        await waitFor(() => {
            const successElement = container.querySelector('div');
            expect(successElement?.textContent).toContain('Offer deleted successfully');
        });
    });
});
