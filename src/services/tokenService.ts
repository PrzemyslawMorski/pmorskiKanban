export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const tokenExists = () => {
  return getToken() != null;
};

export const getToken = () => {
  localStorage.getItem("token");
};

export const buildAuthHeader = () => {
  return `Authorization: Bearer ${getToken()}`;
};
