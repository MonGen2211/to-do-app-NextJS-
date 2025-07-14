import axios from "axios";

export const getAuthInfo = () => {
  const authInfo = JSON.parse(localStorage.getItem('authInfo') || '{}');
  return authInfo;
}

export const axiosAuthInstance = () => axios.create({
  headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTc1MjAzMzM4MSwiZXhwIjoxNzUyNjM4MTgxfQ.zJ59_HyCqcXPNq7McyUr9HCsXpj5ekI7XgTv3f86E5Y`
  }
})