export const logout = () => {
  localStorage.removeItem("userEmail");
  window.location.href = "/";
};
