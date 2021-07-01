import React, { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/AxiosConfig";
import { useHistory } from "react-router-dom";


export const UserContext = createContext();

const UserProvider = (props) => {
  const [sesion, setSesion] = useState({
    token: localStorage.getItem("token"),
    id: localStorage.getItem("user_id"),
    nombre: localStorage.getItem("nombre"),
  });
  const history = useHistory();

  useEffect(() => {
    if (sesion.token === null && sesion.user_id === null) {
      history.replace("/");
    }
  }, [sesion]);

  const login = async (user, pass)=>{
    await clienteAxios
    .post("/login", {
      usuario: user,
      clave: pass,
    })
    .then((response) => {
      setSesion({
        token: response.data.token,
        id: response.data.user_id,
        nombre: response.data.nombre,
      })
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("nombre", response.data.nombre);
      return true
    })
    .catch((e) => {
        alert(e)
      return false
    });
  }

  const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('nombre');
  }

  return (
    <UserContext.Provider
      value={{
        login,
        logout,
        setSesion,
        sesion
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
