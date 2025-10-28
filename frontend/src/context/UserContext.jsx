import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";


export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                if (response && response.data) {
                    setUser(response.data);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [user]);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);
        setLoading(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
