import axiosInstance from './AxiosInstance';

const setAuthToken = (token) => {
  console.log(token, "token");
  
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;