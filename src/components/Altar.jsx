import { useState } from 'react'
import Slot from './Slots'

import lazoImg from '../assets/decoraciones/lazo.png'


function Altar({
    elementosColocados,
    colocarElemento,
    moverElemento,
    eliminarElemento,
    decoracionesColocadas,
    colocarDecoracion,
    moverDecoracion,
    eliminarDecoracion
}) {

    const [slotActivo, setSlotActivo] = useState(null)


    const esSlotCercano = (slotId) => {

        if (!slotActivo) {
            return false
        }

        const [nivelActivo, numeroActivo] = slotActivo.split('-')
        const [nivelSlot, numeroSlot] = slotId.split('-')

        if (nivelActivo !== nivelSlot) {
            return false
        }

        const diferencia = Math.abs(
            Number(numeroActivo) - Number(numeroSlot)
        )

        return diferencia <= 1
    }


    const crearSlots = (cantidad, nivel) => {

        return Array.from({ length: cantidad }, (_, index) => {

            const slotId = `${nivel}-${index + 1}`

            return (
                <Slot
                    key={slotId}
                    id={slotId}
                    elemento={elementosColocados[slotId]}
                    colocarElemento={colocarElemento}
                    moverElemento={moverElemento}
                    eliminarElemento={eliminarElemento}
                    slotActivo={slotActivo === slotId}
                    slotCercano={
                        esSlotCercano(slotId) &&
                        !elementosColocados[slotId]
                    }
                    setSlotActivo={setSlotActivo}
                />
            )
        })
    }


    const permitirDropDecoracion = (event) => {
        event.preventDefault()
    }


    const recibirDecoracion = (event) => {

        event.preventDefault()

        const datos =
            event.dataTransfer.getData('decoracion')

        if (!datos) {
            return
        }

        const datosArrastre = JSON.parse(datos)

        const rect =
            event.currentTarget.getBoundingClientRect()

        const x = (
            (event.clientX - rect.left) /
            rect.width
        ) * 100

        const y = (
            (event.clientY - rect.top) /
            rect.height
        ) * 100


        // Decoración que ya estaba colocada
        if (datosArrastre.origen === 'zona-decoracion') {

            moverDecoracion(
                datosArrastre.idColocada,
                x,
                y
            )

            return
        }


        // Decoración nueva desde el catálogo
        colocarDecoracion(
            datosArrastre,
            x,
            y
        )
    }


    const iniciarArrastreDecoracion = (
        event,
        decoracion
    ) => {

        const datos = {
            origen: 'zona-decoracion',
            idColocada: decoracion.idColocada,
            decoracion: decoracion
        }

        event.dataTransfer.setData(
            'decoracion',
            JSON.stringify(datos)
        )

        event.dataTransfer.effectAllowed = 'move'
    }


    const solicitarEliminarDecoracion = (
        decoracion
    ) => {

        const confirmado = window.confirm(
            `¿Seguro que deseas eliminar "${decoracion.nombre}"?`
        )

        if (!confirmado) {
            return
        }

        eliminarDecoracion(
            decoracion.idColocada
        )
    }


    return (
        <section
            className="altar"
            onDragEnd={() => setSlotActivo(null)}
            onDrop={() => setSlotActivo(null)}
        >

            <div
                className="zona-decoracion"
                onDragOver={permitirDropDecoracion}
                onDrop={recibirDecoracion}
            >

                {/* Lazo fijo */}
                <img
                    src={lazoImg}
                    alt="Lazo decorativo"
                    className="lazo-decoracion"
                    draggable={false}
                />


                {/* Decoraciones libres */}
                {decoracionesColocadas.map((decoracion) => (

                    <img
                        key={decoracion.idColocada}
                        src={decoracion.imagen}
                        alt={decoracion.nombre}
                        className="decoracion-colocada"
                        draggable

                        onDragStart={(event) =>
                            iniciarArrastreDecoracion(
                                event,
                                decoracion
                            )
                        }

                        onDoubleClick={() =>
                            solicitarEliminarDecoracion(
                                decoracion
                            )
                        }

                        title={
                            `${decoracion.nombre}. Arrastra para mover. Doble clic para eliminar.`
                        }

                        style={{
                            left: `${decoracion.x}%`,
                            top: `${decoracion.y}%`,
                            width: `${decoracion.ancho || 90}px`
                        }}
                    />

                ))}

            </div>


            <div className="nivel nivel-3">

                <div className="superficie">
                    {crearSlots(6, 'nivel3')}
                </div>

                <div className="mantel">
                    <div className="flores-mantel">
                        🌼 🌸 🌼 🌸 🌼 🌸 🌼
                    </div>
                </div>

            </div>


            <div className="nivel nivel-2">

                <div className="superficie">
                    {crearSlots(10, 'nivel2')}
                </div>

                <div className="mantel">
                    <div className="flores-mantel">
                        🌸 🌼 🌸 🌼 🌸 🌼 🌸 🌼 🌸
                    </div>
                </div>

            </div>


            <div className="nivel nivel-1">

                <div className="superficie">
                    {crearSlots(13, 'nivel1')}
                </div>

                <div className="mantel">
                    <div className="flores-mantel">
                        🌼 🌸 🌼 🌸 🌼 🌸 🌼 🌸 🌼 🌸 🌼
                    </div>
                </div>

            </div>

        </section>
    )
}

export default Altar