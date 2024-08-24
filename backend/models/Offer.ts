import { Schema, model, Document } from 'mongoose';

interface IOffer extends Document {
    title: string;
    description: string;
    originalPrice: number;
    discount: number;
    discountedPrice: number;
}

const offerSchema = new Schema<IOffer>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, required: false },
    discountedPrice: { type: Number, required: false }
});

const Offer = model<IOffer>('Offer', offerSchema);

export default Offer;
