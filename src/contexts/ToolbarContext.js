import { createContext } from 'react';

// The active window hosts workspace actions. Each window also hosts its own
// canvas controls so they retain the live OpenSeadragon provider across a portal.
export const WorkspaceToolbarRef = createContext(null);
export const CanvasToolbarTarget = createContext(null);
