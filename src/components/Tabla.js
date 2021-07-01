import React from 'react'
import Item from './Item'

function Tabla({ items, handleDelete }) {
    return (
        <div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Símbolo</th>
                        <th>Nombre</th>
                        <th>Moneda</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                    items.map(a=>{
                        return <Item key={parseInt(a.id)} id={a.id} simbolo={a.simbolo} nombre={a.nombre} moneda={a.moneda} handleDelete={handleDelete} />
                    })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Tabla