import { useState, useEffect } from 'react';

const algorithm = {
    name: "AES-GCM",
    length: 256
};
const keyUsages = ["encrypt", "decrypt"];
const keyStorageName = 'encryptionKey';

async function generateKey() {
    return await crypto.subtle.generateKey(algorithm, true, keyUsages);
}

async function getKey() {
    let storedKey = localStorage.getItem(keyStorageName);
    if (storedKey) {
        return await crypto.subtle.importKey(
            'jwk',
            JSON.parse(storedKey),
            algorithm,
            true,
            keyUsages
        );
    } else {
        const newKey = await generateKey();
        const exportedKey = await crypto.subtle.exportKey('jwk', newKey);
        localStorage.setItem(keyStorageName, JSON.stringify(exportedKey));
        return newKey;
    }
}

async function encryptData(data) {
    const key = await getKey();
    const encodedData = new TextEncoder().encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encrypted = await crypto.subtle.encrypt(
        {
            name: algorithm.name,
            iv: iv,
        },
        key,
        encodedData
    );
    return { iv, encrypted };
}

async function decryptData(iv, encrypted) {
    const key = await getKey();
    const decrypted = await crypto.subtle.decrypt(
        {
            name: algorithm.name,
            iv: iv,
        },
        key,
        encrypted
    );
    return new TextDecoder().decode(decrypted);
}

function useEncryptedLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(initialValue);
    useEffect(() => {
        // Retrieve and decrypt the value from local storage on mount
        const fetchData = async () => {
            const storedItem = window.localStorage.getItem(key);
            if (storedItem) {
                const { iv, encrypted } = JSON.parse(storedItem);
                try {
                    const decryptedData = await decryptData(new Uint8Array(iv), new Uint8Array(encrypted));
                    setStoredValue(JSON.parse(decryptedData));
                } catch (error) {
                    console.error('Decryption failed', error);
                }
            }
        };
        fetchData();
    }, [key]);

    const setValue = async (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            const dataToEncrypt = JSON.stringify(valueToStore);
            const { iv, encrypted } = await encryptData(dataToEncrypt);
            window.localStorage.setItem(
                key,
                JSON.stringify({
                    iv: Array.from(iv),
                    encrypted: Array.from(new Uint8Array(encrypted))
                })
            );
            setStoredValue(valueToStore);
        } catch (error) {
            console.error('Encryption failed', error);
        }
    };

    const removeItem = () => {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
    };

    return [storedValue, setValue, removeItem];
}

export default useEncryptedLocalStorage;
