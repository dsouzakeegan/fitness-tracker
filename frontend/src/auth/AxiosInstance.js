import axios from "axios";
import { API_BASE_URL } from "../configs/AppConfig";
import setAuthToken from "./setAuthToken";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  async config => {
    const jwtToken = localStorage.getItem("token");
    if (jwtToken) {
      config.headers['Authorization'] = `Bearer ${jwtToken}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  // async (error) => {
  //   const originalRequest = error.config;

  //   if (
  //     error.response &&
  //     error.response.status === 403 &&
  //     !originalRequest._retry
  //   ) {
  //     originalRequest._retry = true;
  //     try {
  //       // const refreshToken = localStorage.getItem('token');
  //       const response = await axiosInstance.post("/auth/refresh");
  //       // const response = await axios.post("http://192.168.0.124:9000/api/auth/refresh", {}, {
  //       //   withCredentials: true});
  //       console.log(response, "refresh login");
        

  //       const newAccessToken = response.data;

  //       localStorage.setItem("token", newAccessToken);
  //       setAuthToken(newAccessToken);

  //       originalRequest.headers["Authorization"] = `Bearer ${newRefreshToken}`;
  //       // axiosInstance.defaults.headers.common[
  //       //   'Authorization'
  //       // ] = `Bearer ${newAccessToken}`; 
  //       return axiosInstance(originalRequest);
  //     } catch (err) {
  //       localStorage.removeItem("token")
  //       window.dispatchEvent(new Event("logout-user"));
  //       return Promise.reject(err);
  //     }
  //   }
  // }
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      window.dispatchEvent(new Event("logout-user"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
