import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getSessionStorageOrDefault<T>(key: string, defaultValue: T): T {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }
    return JSON.parse(stored) as T;
}

export default function useSessionStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(
        getSessionStorageOrDefault(key, defaultValue)
    );

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
