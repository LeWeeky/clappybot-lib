import { pathToFileURL } from "node:url";

export const importFile = (filePath) => import(pathToFileURL(filePath).href);