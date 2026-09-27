import { useState } from 'react'
import Altar from './Altar'
import Catalogo from './Catalogo'

function Ofrenda() {

    const [elementosColocados, setElementosColocados] = useState({})

    const colocarElemento = (slotId, elemento) => {

        if (elementosColocados[slotId]) {
            return
        }

        setElementosColocados({
            ...elementosColocados,
            [slotId]: elemento
        })
    }

    const moverElemento = (origen, destino, elemento) => {

        if (elementosColocados[destino]) {
            return
        }

        setElementosColocados((anteriores) => {

            const nuevos = {
                ...anteriores
            }

            delete nuevos[origen]

            nuevos[destino] = elemento

            return nuevos
        })
    }

    const eliminarElemento = (slotId) => {

        setElementosColocados((anteriores) => {

            const nuevos = {
                ...anteriores
            }

            delete nuevos[slotId]

            return nuevos
        })
    }

    return (
        <div className="ofrenda">
            <header className="ofrenda-header">
                <h1>Ofrenda español suavecito</h1>
                <p>Día de Muertos 2026</p>
            </header>

            <Altar
                elementosColocados={elementosColocados}
                colocarElemento={colocarElemento}
                moverElemento={moverElemento}
                eliminarElemento={eliminarElemento}
            />

            <Catalogo />


        </div>
    )
}

export default Ofrenda