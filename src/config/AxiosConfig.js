import axios from "axios";

const clienteAxios = axios.create({
    //baseURL: "http://localhost:3200",
    baseURL: "http://localhost:9000",
    //baseURL: "http://200.80.43.109:3200",
});

export default clienteAxios;
