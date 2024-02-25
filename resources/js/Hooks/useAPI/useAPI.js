import {API} from "@/API/API.js";

/**
 * Creates and returns the singleton instance of the api class.
 * @returns {API} - the singleton instance of the api class.
 */
const useAPI = () => {
    return new API();
}

export default useAPI;