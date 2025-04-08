// src/utils/api.js
export const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("leadnova_token");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
