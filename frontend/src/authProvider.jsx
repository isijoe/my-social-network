import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { fetchWithToken } from './apiUtils';

// Create the authentication context
const AuthContext = createContext();

// Initial state for the authentication context
const initialState = {
  token: localStorage.getItem("token") || null,
  isLoading: true,
  isLoggedIn: false,
  loggedInUserId: null,
  profilePicture: null,
};

// Reducer function to handle authentication state changes
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    case 'SET_USER_ID':
      return { ...state, loggedInUserId: action.payload };
    case 'SET_PROFILE_PICTURE':
      return { ...state, profilePicture: action.payload };
    default:
      throw new Error('Unsupported action type');
  }
};

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [state, dispatch] = useReducer(reducer, initialState);
  const API = process.env.REACT_APP_API || 'http://localhost/api/'

  // Function to set the authentication token
  const setToken = useCallback((newToken) => {
    dispatch({ type: 'SET_TOKEN', payload: newToken });
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    // setToken_(newToken);
  }, []);

  // Function to retrieve user information
  const getUserDetails = useCallback(async () => {
    try {
      const response = await fetchWithToken(`${API}api/dj-rest-auth/user/`);
      if (response.status === 401) {
        dispatch({ type: 'SET_LOGGED_IN', payload: false });
        setToken(null);
      } else {
        const data = await response.json();
        dispatch({ type: 'SET_LOGGED_IN', payload: true });
        dispatch({ type: 'SET_USER_ID', payload: data.pk });
        return data.pk;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, [API, setToken]);

  // Function to retrieve user profile picture
  const getUserProfilePicture = useCallback(async (userId) => {
    try {
      const response = await fetch(`${API}accounts/api/${userId}/`);
      const data = await response.json();
      dispatch({ type: 'SET_PROFILE_PICTURE', payload: data.profile_picture });
    } catch (error) {
      console.error("Error fetching user profile picture:", error);
    }
  }, [API]);

  useEffect(() => {
    if (state.token) {
      getUserDetails().then(userId => {
        if (userId) {
          getUserProfilePicture(userId).then(() => {
            dispatch({ type: 'SET_LOADING', payload: false });
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [getUserDetails, getUserProfilePicture, state.token]);

  // Function to login a user
  const loginUser = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API}api/dj-rest-auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.key);
        const userId = await getUserDetails();
        await getUserProfilePicture(userId);
      } else {
        console.error("Error logging in.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }, [API, getUserDetails, getUserProfilePicture, setToken]);

  // Function to logout a user
  const logoutUser = useCallback(async () => {
    try {
      const response = await fetch(`${API}api/dj-rest-auth/logout/`, {
        method: 'POST',
      });

      if (response.ok) {
        setToken(null);
        dispatch({ type: 'SET_USER_ID', payload: null });
        dispatch({ type: 'SET_PROFILE_PICTURE', payload: null });
        dispatch({ type: 'SET_LOGGED_IN', payload: false });
      } else {
        console.error("Error logging out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [API, setToken]);

  // Function to login a user
  const registerUser = useCallback(async (username, email, password) => {
    try {
      const response = await fetch(`${API}api/dj-rest-auth/registration/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password1: password, password2: password })
      });

      if (response.ok) {
        console.log("Successfully registered!");
      } else {
        console.error("Error registering.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  }, [API]);

  const contextValue = {
    ...state,
    setToken,
    loginUser,
    logoutUser,
    registerUser,
  };

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to easily access the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
