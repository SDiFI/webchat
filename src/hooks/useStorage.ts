import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getStorageOrDefault<T>(storage: Storage, key: string, defaultValue: T): T {
    const stored = storage.getItem(key);
    if (!stored) {
        return defaultValue;
    }
    return {
        ...defaultValue,
        ...JSON.parse(stored),
    } as T;
}

export default function useStorage<T>(
    storage: Storage,
    key: string,
    defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(getStorageOrDefault(storage, key, defaultValue));

    useEffect(() => {
        storage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
