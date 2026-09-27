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

        // Si el slot ya está ocupado, no hacemos nada
        if (elemento) {
            return
        }

        const datos = event.dataTransfer.getData('elemento')

        if (!datos) {
            return
        }

        const datosArrastre = JSON.parse(datos)

        // Elemento que ya estaba colocado en el altar
        if (datosArrastre.origen) {

            moverElemento(
                datosArrastre.origen,
                id,
                datosArrastre.elemento
            )

            return
        }

        // Elemento nuevo proveniente del catálogo
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

        event.dataTransfer.effectAllowed = 'move'
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
                    title={`${elemento.nombre}. Arrastra para mover. Doble clic para eliminar.`}
                >

                    {elemento.tipo === 'foto' ? (

                        <div className="foto-enmarcada">

                            <div className="contenedor-foto">
                                <img
                                    src={elemento.fotoUsuario}
                                    alt="Fotografía"
                                    className="foto-usuario"
                                    draggable={false}
                                />
                            </div>

                            <img
                                src={elemento.imagen}
                                alt="Marco de fotografía"
                                className="marco-foto"
                                draggable={false}
                            />

                        </div>

                    ) : (

                        <img
                            src={elemento.imagen}
                            alt={elemento.nombre}
                            className={`imagen-elemento imagen-${elemento.tipo}`}
                            draggable={false}
                        />

                    )}

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