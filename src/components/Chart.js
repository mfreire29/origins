import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function Chart({ search, simbolo }) {

    const [ listado, setListado ] = useState(search)

    useEffect(() => {        
        const datos = search.map((a)=>{
            let data = []
            let date = new Date(a.datetime)
            let fecha3 = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
           data.push(fecha3, parseFloat(a.close))
            return data
        })
        setListado(datos)
    }, [search])

    const options = {
    chart: {
        type: 'spline'
    },
    title: {
        text: simbolo
    },
    xAxis: {
        type: 'category',
        title: {
            text: 'Fecha y Hora'
        },
        scrollbar: {
            enabled: true
        },
        tickLength: 0
    },
    series: [
        {
            data: listado,
            turboThreshold: 1000000
        }
    ]
};
    return (
        <div className="mt-5">
          <HighchartsReact highcharts={Highcharts} options={options} />  
        </div>
    )
}

export default Chart
