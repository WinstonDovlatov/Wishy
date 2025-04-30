import { createContext } from 'react';

export const UserContext = createContext({
    user: null,
    platform: null,
    friend_to: null
  });