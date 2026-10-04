import { useState } from 'react'
import Slot from './Slots'

function Altar({
    elementosColocados,
    colocarElemento,
    moverElemento,
    eliminarElemento
}) {

    const [slotActivo, setSlotActivo] = useState(null)


    const esSlotCercano = (slotId) => {

        if (!slotActivo) {
            return false
        }

        const [nivelActivo, numeroActivo] = slotActivo.split('-')
        const [nivelSlot, numeroSlot] = slotId.split('-')

        // Solo mostrar slots del mismo nivel
        if (nivelActivo !== nivelSlot) {
            return false
        }

        const diferencia = Math.abs(
            Number(numeroActivo) - Number(numeroSlot)
        )

        // Slot actual + uno a cada lado
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


    return (
        <section
            className="altar"
            onDragEnd={() => setSlotActivo(null)}
            onDrop={() => setSlotActivo(null)}
        >

            <div className="zona-decoracion">
                Decoraciones
            </div>


            <div className="nivel nivel-3">

                <div className="superficie">
                    {crearSlots(5, 'nivel3')}
                </div>

                <div className="mantel">
                    <div className="flores-mantel">
                        🌼 🌸 🌼 🌸 🌼 🌸 🌼
                    </div>
                </div>

            </div>


            <div className="nivel nivel-2">

                <div className="superficie">
                    {crearSlots(8, 'nivel2')}
                </div>

                <div className="mantel">
                    <div className="flores-mantel">
                        🌸 🌼 🌸 🌼 🌸 🌼 🌸 🌼 🌸
                    </div>
                </div>

            </div>


            <div className="nivel nivel-1">

                <div className="superficie">
                    {crearSlots(11, 'nivel1')}
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