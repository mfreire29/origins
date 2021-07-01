import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import clienteAxios from "../config/AxiosConfig";
import { ReactSearchAutocomplete} from "react-search-autocomplete";
import Tabla from "./Tabla";
import Loader from "./Loader";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/User";
import Header from "./Header";

function MisAcciones() {
    const { sesion, setUser, login } = useContext(UserContext);
  const [acciones, setAcciones] = useState([]);
  const [accionesUser, setAccionesUser] = useState([]);
  const [accionSelected, setAccionSelected] = useState({
    id_usuario: "",
    simbolo: "",
    nombre: "",
    moneda: "",
  });
  const [estado, setEstado] = useState(true);
  const [loaderT, setLoaderT] = useState(true);
  const [loaderAt, setLoaderAt] = useState(true);
  const [loader, setLoader] = useState(false);
  let history = useHistory();

  useEffect(() => {
    if(sesion.id ===  null  || sesion.token ===  null || sesion.nombre ===  null) {
        history.push('/');
    }
}, [sesion])


  useEffect(() => {
    const peticion = async () => {
      await axios
        .get(`https://api.twelvedata.com/stocks?source=docs&exchange=NYSE`)
        .then((res) => {
          const data = res.data.data;
          setAcciones(data);
          setLoaderAt(false);
        })
        .catch((err) => console.log("error refrescando empresa", err));
    };
    peticion();
  }, []);

  useEffect(() => {
    if (estado) {
      const peticion2 = async () => {
        await clienteAxios
          .get(`/accionesusuarios/${sesion.id}`)
          .then((res) => {
            const data = res.data;
            setAccionesUser(data);

            setEstado(false);
            setLoaderT(false);
          })
          .catch((err) => {
            alert("error refrescando empresa", err);
            setLoaderT(false);
          });
      };
      peticion2();
    }
  }, [estado]);

  const handleOnSelect = (item) => {
    // the item selected
    setAccionSelected({
      id_usuario: sesion.id,
      simbolo: item.symbol,
      nombre: item.name,
      moneda: item.currency,
    });
  };

  const handleAdd = async () => {
    setLoader(true);

    await clienteAxios
      .post("/add", {
          arr: accionSelected,
        token: sesion.token
            
      })
      .then((response) => {
        if (response.status === 200) {
          setEstado(true);
          setLoader(false);
          setAccionSelected({
            id_usuario: sesion.id,
            simbolo: "",
            nombre: "",
            moneda: "",
          });
        }
      })
      .catch((e) => {
        alert(e);
        setLoader(false);
      });
  };

  const handleDelete = async (id) => {
    setLoaderT(true);

    await clienteAxios
      .delete(`/delete/${id}`, {
        headers: {
            Authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        id: id,
      })
      .then((response) => {
        if (response.status === 200) {
          setEstado(true);
          setLoaderT(false);
        }
    })
    .catch((e) => {
        alert(e);
        setLoaderT(false);
      });
  };

  return (
    <>
      <Header title={"Mis Acciones"} user={sesion.nombre} />
      <div className="container">
        <div className="row m-5">
          <div className="col-xs-12 mx-auto text-center">
            {loaderAt ? (
              <Loader />
            ) : (
              <ReactSearchAutocomplete
                items={acciones}
                onSelect={handleOnSelect}
                fuseOptions={{ keys: ["symbol", "name"] }}
                resultStringKeyName="name"
                autoFocus
              />
            )}
            {
              <p className="text-danger pt-2">
                Selección:{" "}
                {accionSelected.simbolo !== ""
                  ? `${accionSelected.simbolo} - ${accionSelected.nombre} - ${accionSelected.moneda}`
                  : "No hay selección"}
              </p>
            }
            {loader ? (
              <button
                className="btn btn-primary my-3"
                onClick={handleAdd}
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Cargando...
              </button>
            ) : accionSelected.simbolo === "" ? (
              <button
                className="btn btn-primary my-3"
                onClick={handleAdd}
                disabled
              >
                Agregar Símbolo
              </button>
            ) : (
              <button className="btn btn-primary my-3" onClick={handleAdd}>
                Agregar Símbolo
              </button>
            )}
            {loaderT ? (
              <Loader />
            ) : (
              <Tabla items={accionesUser} handleDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MisAcciones;
