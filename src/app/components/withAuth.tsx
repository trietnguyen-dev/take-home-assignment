"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const AuthHOC = (props: any) => {
        const router = useRouter();
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        useEffect(() => {
            if (!token) {
                router.push('/');
            }
        }, [token, router]);

        if (!token) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthHOC;
};

export default withAuth;
