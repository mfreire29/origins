import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import Chart from "./Chart";
import clienteAxios from "../config/AxiosConfig";
import Header from "./Header";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/User";

function ItemDetail() {
  const { id } = useParams();

  let date = new Date();
  const fechaD =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    "%2000:00:00";
  const fechaH =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    "%20" +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":00";
    const { sesion, setUser, login } = useContext(UserContext);
  const [accion, setAccion] = useState([]);
  const [filtro, setFiltro] = useState("Real");
  const [search, setSearch] = useState([]);
  const [intervalo, setIntervalo] = useState(1);
  const [fechaHoyD, setFechaHoyD] = useState(fechaD);
  const [fechaHoyH, setFechaHoyH] = useState(fechaH);
  const [historicoD, setHistoricoD] = useState(fechaD);
  const [historicoH, setHistoricoH] = useState(fechaH);
  const [loader, setLoader] = useState(false);
  const [seconds, setSeconds] = useState(-1);
  const [iniciarContador, setIniciarContador] = useState(false);
  const [mensaje, setMensaje] = useState("");
  let history = useHistory();

  useEffect(() => {
    if(sesion.id ===  null  || sesion.token ===  null || sesion.nombre ===  null) {
      history.push('/');
    }
}, [sesion])

  useEffect(() => {
    const getAccion = async () => {
      await clienteAxios
        .get(`/accionesusuarios/accion/${id}`)
        .then((res) => {
          const data = res.data;
          setAccion(data);
        })
        .catch((err) => console.log("error refrescando empresa", err));
      setLoader(false);
    };
    getAccion();
  }, [id]);

  useEffect(() => {
    if (iniciarContador) {
      const interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [iniciarContador]);

  useEffect(() => {
    if (search !== undefined) {
        if (search.length > 0) {
        if (seconds === 0) {
            getSearch();
          setSeconds(-1);
        }
      }
    }
  }, [seconds]);

  const modFecha = (fecha) => {
    let date = new Date(Date.parse(fecha));
    let fechaFinal =
      +date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      "%20" +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":00";
    return fechaFinal;
  };

  const selectFiltro = (filtro) => {
    setFiltro(filtro);
    if (filtro === "Real") {
      setHistoricoD(fechaD);
      setHistoricoH(fechaH);
    } else {
      setIniciarContador(false);
      setHistoricoD("");
      setHistoricoH("");
    }
  };

  const getSearch = async () => {
      setMensaje('')
    setSeconds(-1);
    if (filtro !== "Real") {
      if (historicoD === "" || historicoH === "") {
        alert("Debes elegir un periodo");
        return;
      }
    } else {
      setHistoricoD(fechaD);
      setHistoricoH(fechaH);
    }

    setLoader(true);
    await axios
      .get(
        `https://api.twelvedata.com/time_series?symbol=${accion[0].simbolo}&interval=${intervalo}min&start_date=${historicoD}&end_date=${historicoH}&apikey=23a60d2344a7495ca5676eaedbe6847f`
      )
      .then((res) => {
        const data = res.data;
        if (data.code === 400) {
          setMensaje(data.message);
          setSearch([]);
        } else {
          setSearch(data.values);
          setSeconds(intervalo * 60);
          if (filtro === "Real") {
            setIniciarContador(true);
          }
        }

        setLoader(false);
      })
      .catch((err) => console.log("error refrescando empresa", err));
  };

  return (
    <>
      <Header
        title={
          accion.length > 0
            ? `${accion[0].simbolo} - ${accion[0].nombre} - ${accion[0].moneda}`
            : ""
        }
        user="Mauro"
      />
      <div className="p-5">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="parametro"
            id="tiempoReal"
            defaultChecked
            onClick={() => {
              selectFiltro("Real");
            }}
          />
          <label className="form-check-label" htmlFor="tiempoReal">
            Tiempo Real
          </label>
        </div>
        <div className="form-check">
          <div className="row">
            <div className="col-xs-12 col-sm-2 py-2">
              <input
                className="form-check-input"
                type="radio"
                name="parametro"
                id="historico"
                onClick={() => {
                  selectFiltro("Historico");
                }}
              />
              <label className="form-check-label" htmlFor="historico">
                Histórico
              </label>
            </div>
            {filtro !== "Real" ? (
              <>
                <div className="col-xs-12 col-sm-5 py-2">
                  Fecha Desde
                  <input
                    type="datetime-local"
                    className="form-control"
                    disabled={filtro === "Real" ? `disabled` : ""}
                    onChange={(e) => {
                      setHistoricoD(modFecha(e.target.value));
                    }}
                  />
                </div>
                <div className="col-xs-12 col-sm-5 py-2">
                  Fecha Hasta
                  <input
                    type="datetime-local"
                    className="form-control"
                    disabled={filtro === "Real" ? `disabled` : ""}
                    onChange={(e) => {
                      setHistoricoH(modFecha(e.target.value));
                    }}
                  />
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="form-check">
          <div className="row">
            <div className="col-xs-12 col-sm-2 py-2">
              <label className="form-check-label" htmlFor="historico">
                Intervalo
              </label>
            </div>
            <div className="col-xs-12 col-sm-5 py-2">
              <select
                className="form-select"
                onChange={(e) => {
                  setIntervalo(e.target.value);
                }}
              >
                <option value={1}>1 minuto</option>
                <option value={5}>5 minutos</option>
                <option value={15}>15 minutos</option>
              </select>
            </div>
          </div>
        </div>
        {mensaje !== "" ? <p className="text-danger text-center">{mensaje}</p> : ""}
        <div className="d-grid gap-2 col-3 mx-auto">
          <button className="btn btn-primary mt-4" onClick={getSearch}>
            GRAFICAR
          </button>
        </div>
        {iniciarContador ? (
          seconds >= 0 ? (
            <h1 className="text-center mt-3">
              <span className="badge bg-danger text-white">
                El gráfico se recargará en {seconds} segundos
              </span>
            </h1>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {loader ? (
          <Loader />
        ) : search !== undefined ? (
          search.length > 0 ? (
            <Chart
              search={search}
              historicoD={historicoD}
              historicoH={historicoH}
            />
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default ItemDetail;
