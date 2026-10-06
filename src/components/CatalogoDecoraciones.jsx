import decoraciones from '../data/decoraciones'

function CatalogoDecoraciones() {

    const iniciarArrastre = (event, decoracion) => {

        event.dataTransfer.setData(
            'decoracion',
            JSON.stringify(decoracion)
        )

        event.dataTransfer.effectAllowed = 'copy'
    }


    return (
        <section className="catalogo catalogo-decoraciones">

            <h2>
                Agregar decoración
            </h2>

            <div className="catalogo-elementos">

                {decoraciones.map((decoracion) => (

                    <div
                        key={decoracion.id}
                        className="elemento-catalogo"
                        draggable
                        onDragStart={(event) =>
                            iniciarArrastre(event, decoracion)
                        }
                    >

                        <img
                            src={decoracion.imagen}
                            alt={decoracion.nombre}
                            className="imagen-catalogo"
                            draggable={false}
                        />

                        <span>
                            {decoracion.nombre}
                        </span>

                    </div>

                ))}

            </div>

        </section>
    )
}

export default CatalogoDecoraciones