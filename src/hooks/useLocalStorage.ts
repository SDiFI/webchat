import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getLocalStorageOrDefault<T>(key: string, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }
    return JSON.parse(stored) as T;
}

export default function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(
        getLocalStorageOrDefault(key, defaultValue)
    );

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
