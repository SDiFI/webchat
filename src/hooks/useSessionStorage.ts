import useStorage from './useStorage';

const useSessionStorage = <T,>(key: string, defaultValue: T) => useStorage(sessionStorage, key, defaultValue);
export default useSessionStorage;
