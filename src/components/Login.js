import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/User";

function Login() {
  const { sesion, setSesion, login } = useContext(UserContext);
  const [userC, setUserC] = useState(sesion.id);
  const [pass, setPass] = useState("");
  const [msj, setMsj] = useState("");
  const [loader, setLoader] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setLoader(true)
    if(sesion.id ===  null  || sesion.token ===  null || sesion.nombre ===  null) {
        history.push('/');
    } else {
        history.push('/misacciones');
    }
}, [sesion])

  const handleSubmit = async () => {
    if (userC === "" || pass === "") {
      setMsj("¡Complete todos los campos!");
    } else {
      if(login(userC, pass)){
          setSesion({
            token: localStorage.getItem("token"),
            id: localStorage.getItem("user_id"),
            nombre: localStorage.getItem("nombre"),
          })
    } else {
        setMsj('Usuario o clave incorrectos')
      }
    }
  };

  return (
    <>
      <div className="mb-3">
        <label htmlFor="usuario" className="form-label">
          Usuario
        </label>
        <input
          type="text"
          id="user"
          className="form-control"
          name={userC}
          onChange={(e) => setUserC(e.target.value)}
          onClick={() => {
            setMsj("");
          }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Clave
        </label>
        <input
          type="password"
          id="pass"
          className="form-control"
          name={pass}
          onChange={(e) => setPass(e.target.value)}
          onClick={() => {
            setMsj("");
          }}
        />
      </div>
      {msj !== "" ? <p>{msj}</p> : ""}
      <div className="text-center">
        <button className="btn btn-primary" onClick={handleSubmit}>
          INGRESAR
        </button>
      </div>
    </>
  );
}

export default Login;
