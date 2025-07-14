import axios from "axios";

export const getAuthInfo = () => {
  const authInfo = JSON.parse(localStorage.getItem('authInfo') || '{}');
  return authInfo;
}

export const axiosAuthInstance = () => axios.create({
  headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTc1MjUwNzA4MywiZXhwIjoxNzUzMTExODgzfQ.beysSjbcol6k3bVB99Rmcr-VT3q0HuTDl5hxPiRYSJI`
  }
})