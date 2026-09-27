import Slot from './Slots'

function Altar({
    elementosColocados,
    colocarElemento,
    moverElemento,
    eliminarElemento
}) {

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
                />
            )
        })
    }

    return (
        <section className="altar">

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