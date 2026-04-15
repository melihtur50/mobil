import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'customer' | 'agency';

interface AuthContextType {
    userRole: UserRole;
    isLoading: boolean;
    login: (role?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    userRole: 'customer',
    isLoading: true,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userRole, setUserRole] = useState<UserRole>('customer');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserRole();
    }, []);

    const loadUserRole = async () => {
        try {
            const role = await AsyncStorage.getItem('userRole');
            if (role === 'agency') {
                setUserRole('agency');
            } else {
                setUserRole('customer'); // Default
            }
        } catch (error) {
            console.error('Failed to load user role:', error);
            setUserRole('customer');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (role?: string) => {
        const finalRole: UserRole = role === 'agency' ? 'agency' : 'customer';
        setUserRole(finalRole); // Ekranda anında değişmesi için önce State'i güncelliyoruz
        try {
            await AsyncStorage.setItem('userRole', finalRole);
        } catch (error) {
            console.warn('Failed to save user role (AsyncStorage bridged failed):', error);
        }
    };

    const logout = async () => {
        setUserRole('customer'); // Çıkış yapınca anında State'i müşteriye çekiyoruz
        try {
            await AsyncStorage.removeItem('userRole');
        } catch (error) {
            console.warn('Failed to remove user role (AsyncStorage bridged failed):', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userRole, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
