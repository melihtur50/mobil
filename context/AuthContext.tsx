import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'customer' | 'agency' | 'superadmin';

interface AuthContextType {
    userRole: UserRole;
    isGuest: boolean;
    isLoading: boolean;
    login: (role?: string) => Promise<void>;
    loginAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    userRole: 'customer',
    isGuest: true,
    isLoading: true,
    login: async () => {},
    loginAsGuest: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userRole, setUserRole] = useState<UserRole>('customer');
    const [isGuest, setIsGuest] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserStatus();
    }, []);

    const loadUserStatus = async () => {
        try {
            const role = await AsyncStorage.getItem('userRole');
            const guestStatus = await AsyncStorage.getItem('isGuest');
            
            if (role === 'agency') {
                setUserRole('agency');
            } else if (role === 'superadmin') {
                setUserRole('superadmin');
            } else {
                setUserRole('customer');
            }

            setIsGuest(guestStatus === 'false' ? false : true);
        } catch (error) {
            console.error('Failed to load user status:', error);
            setUserRole('customer');
            setIsGuest(true);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (role?: string) => {
        let finalRole: UserRole = 'customer';
        if (role === 'agency') finalRole = 'agency';
        if (role === 'superadmin') finalRole = 'superadmin';
        
        setUserRole(finalRole);
        setIsGuest(false);
        try {
            await AsyncStorage.setItem('userRole', finalRole);
            await AsyncStorage.setItem('isGuest', 'false');
        } catch (error) {
            console.warn('Failed to save user status:', error);
        }
    };

    const loginAsGuest = async () => {
        setUserRole('customer');
        setIsGuest(true);
        try {
            await AsyncStorage.setItem('userRole', 'customer');
            await AsyncStorage.setItem('isGuest', 'true');
        } catch (error) {
            console.warn('Failed to save guest status:', error);
        }
    };

    const logout = async () => {
        setUserRole('customer');
        setIsGuest(true);
        try {
            await AsyncStorage.removeItem('userRole');
            await AsyncStorage.setItem('isGuest', 'true');
        } catch (error) {
            console.warn('Failed to remove user status:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userRole, isGuest, isLoading, login, loginAsGuest, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
