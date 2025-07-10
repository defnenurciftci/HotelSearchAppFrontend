import React from 'react'
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://f0da8c1664cc.ngrok-free.app" // API URL'in varsa buraya
});

export default axiosClient