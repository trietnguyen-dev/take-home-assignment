import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    isAdmin?: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
export type { IUser };
