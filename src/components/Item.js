import React from 'react'
import { NavLink } from 'react-router-dom'

function Item({ id, simbolo, nombre, moneda, handleDelete }) {
    return (
        <>
         <tr>
                        <td>
                            <NavLink to={`/itemDetail/${id}`}>
                            {simbolo}
                            </NavLink>
                        </td>
                        <td>{nombre}</td>
                        <td>{moneda}</td>
                        <td>
                            <button onClick={()=>{handleDelete(id)}} className="btn btn-danger"> X </button>
                        </td>
                    </tr>   
        </>
    )
}

export default Item
