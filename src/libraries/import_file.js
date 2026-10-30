import { pathToFileURL } from "node:url";

/**
 * 
 * @param {string} filePath 
 * @returns 
 */
export const importFile = (filePath) => import(pathToFileURL(filePath).href);