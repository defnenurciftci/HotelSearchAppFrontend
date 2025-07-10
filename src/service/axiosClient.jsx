import React from 'react'
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://dummyapi.test" // API URL'in varsa buraya
});

export default axiosClient