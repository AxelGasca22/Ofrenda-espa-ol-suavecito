function Slot({
    id,
    elemento,
    colocarElemento,
    moverElemento,
    eliminarElemento
}) {

    const permitirDrop = (event) => {
        event.preventDefault()
    }

    const recibirElemento = (event) => {
        event.preventDefault()

        // No permitimos colocar algo encima
        if (elemento) {
            return
        }

        const datos = event.dataTransfer.getData('elemento')

        if (!datos) {
            return
        }

        const datosArrastre = JSON.parse(datos)

        // ¿Viene de otro slot?
        if (datosArrastre.origen) {

            moverElemento(
                datosArrastre.origen,
                id,
                datosArrastre.elemento
            )

            return
        }

        // Viene directamente del catálogo
        colocarElemento(id, datosArrastre)
    }

    const iniciarArrastre = (event) => {

        if (!elemento) {
            return
        }

        const datos = {
            origen: id,
            elemento: elemento
        }

        event.dataTransfer.setData(
            'elemento',
            JSON.stringify(datos)
        )
    }

    const solicitarEliminar = () => {

        if (!elemento) {
            return
        }

        const confirmado = window.confirm(
            `¿Seguro que deseas eliminar "${elemento.nombre}" de la ofrenda?`
        )

        if (confirmado) {
            eliminarElemento(id)
        }
    }

    return (
        <div
            className={`slot ${elemento ? 'slot-ocupado' : ''}`}
            onDragOver={permitirDrop}
            onDrop={recibirElemento}
        >

            {elemento ? (

                <div
                    className="elemento-colocado"
                    draggable
                    onDragStart={iniciarArrastre}
                    onDoubleClick={solicitarEliminar}
                    title="Arrastra para mover. Doble clic para eliminar."
                >
                    {elemento.nombre}
                </div>

            ) : (

                <span className="slot-id">
                    {id}
                </span>

            )}

        </div>
    )
}

export default Slot