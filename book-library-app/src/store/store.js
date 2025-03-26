import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,

  login: (user) => {
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("currentUser", JSON.stringify(user));
    set({ isLoggedIn: true, currentUser: user });
  },

  logout: () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    set({ isLoggedIn: false, currentUser: null });
  },

  signUp: (user) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("currentUser", JSON.stringify(user));
    set({ isLoggedIn: true, currentUser: user });
  },
}));

export default useAuthStore;