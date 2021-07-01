import React, { useContext } from 'react'
import { UserContext } from "../context/User";
import { useHistory } from "react-router-dom";

function Header({ title, user}) {

    const { logout, setSesion } = useContext(UserContext);
  let history = useHistory();


    const exit = ()=>{
        setSesion({
            token: null,
            id: null,
            nombre: null,
          })
        logout()
        history.push('/');
    }
     
    return (
        <div className='container-fluid mt-2'>
            <div className="row border-bottom px-5 py-2">
                <div className="col-6">
                    {title}
                </div>
                <div className="col-6 text-end">
                    Bienvenido {user} <button className="btn btn-danger btn-sm" onClick={()=>{exit()}}> Salir </button>
                </div>
            </div>
            
        </div>
    )
}

export default Header
