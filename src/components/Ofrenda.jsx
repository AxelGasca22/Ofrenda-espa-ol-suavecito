import { useState } from 'react'

import Altar from './Altar'
import Catalogo from './Catalogo'
import ModalFoto from './ModalFoto'

import marcoFoto from '../assets/elementos/foto.png'

function Ofrenda() {

    const [elementosColocados, setElementosColocados] = useState({})

    // Slot donde el usuario intentó colocar una fotografía
    const [slotFotoPendiente, setSlotFotoPendiente] = useState(null)

    // Elemento "Fotografía" proveniente del catálogo
    const [elementoFotoPendiente, setElementoFotoPendiente] = useState(null)


    const colocarElemento = (slotId, elemento) => {

        // No permitir colocar encima de otro elemento
        if (elementosColocados[slotId]) {
            return
        }

        // La fotografía tiene un comportamiento especial:
        // primero abrimos el modal.
        if (elemento.tipo === 'foto') {

            setSlotFotoPendiente(slotId)
            setElementoFotoPendiente(elemento)

            return
        }

        // Cualquier otro elemento se coloca normalmente
        setElementosColocados((anteriores) => ({
            ...anteriores,
            [slotId]: elemento
        }))
    }


    const moverElemento = (origen, destino, elemento) => {

        // No permitir mover encima de otro elemento
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


    const cancelarFoto = () => {

        setSlotFotoPendiente(null)
        setElementoFotoPendiente(null)
    }


    const confirmarFoto = ({ archivo, preview }) => {

        if (!slotFotoPendiente || !elementoFotoPendiente) {
            return
        }

        // Creamos una nueva versión del elemento fotografía
        // que además contiene la imagen seleccionada.
        const elementoConFoto = {
            ...elementoFotoPendiente,

            archivoFoto: archivo,
            fotoUsuario: preview
        }

        // Ahora sí colocamos la fotografía en el slot
        setElementosColocados((anteriores) => ({
            ...anteriores,
            [slotFotoPendiente]: elementoConFoto
        }))

        // Cerramos el modal
        setSlotFotoPendiente(null)
        setElementoFotoPendiente(null)
    }


    return (
        <div className="ofrenda">

            <header className="ofrenda-header">

                <h1>
                    Ofrenda español suavecito
                </h1>

                <p>
                    Día de Muertos 2026
                </p>

            </header>


            <Altar
                elementosColocados={elementosColocados}
                colocarElemento={colocarElemento}
                moverElemento={moverElemento}
                eliminarElemento={eliminarElemento}
            />


            <Catalogo />


            <ModalFoto
                abierto={slotFotoPendiente !== null}
                marco={marcoFoto}
                onCancelar={cancelarFoto}
                onConfirmar={confirmarFoto}
            />

        </div>
    )
}

export default Ofrenda