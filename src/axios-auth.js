import axios from "axios";

const token = localStorage.getItem("jwt");

const instance = axios.create({
  baseURL: 'http://localhost',
  headers: {
    Authorization: token ? `Bearer ${token}` : ''
  }
})

export default instance;
