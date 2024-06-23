import { useContext, createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [services, setService] = useState([]);
  const authorizationToken = `Bearer ${token}`;

  const API = import.meta.env.VITE_APP_URI_API;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  let isLoggedIn = !!token;
  console.log(isLoggedIn);

  //   tackle logout functionality

  const LogoutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  // * ---------------------------
  // Jwt Authentication - to get the currently loggedIn User Data
  // * --------------------------

  const userAuthentication = async () => {
    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("user data:", data.userData);
        setUser(data.userData);
      }
    } catch (error) {
      console.error("Error from fetching user data");
    }
  };

  // * ---------------------------
  // getData from backend service
  // * --------------------------

  const getServices = async () => {
    try {
      const response = await fetch("http://localhost:5000/form/service", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setService(data.response);
      }
    } catch (error) {
      console.log(`Error from getServices ${error}`);
    }
  };

  useEffect(() => {
    userAuthentication();
    getServices();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authorizationToken,
        services,
        user,
        storeTokenInLS,
        LogoutUser,
        isLoggedIn,
        API,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};