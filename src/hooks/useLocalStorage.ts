import useStorage from './useStorage';

const useLocalStorage = <T,>(key: string, defaultValue: T) => useStorage(localStorage, key, defaultValue);
export default useLocalStorage;
