import { createContext } from 'react';

// global contexts
export const WorkingDirectoryContext = createContext<string | null>(null);
export const SelectedFileContext = createContext<string | null>(null);


