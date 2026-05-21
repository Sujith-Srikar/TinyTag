import {customAlphabet} from 'nanoid';

const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateSlug = customAlphabet(alphabet, 6);