import elementos from '../data/elementos'

function Catalogo() {

    const iniciarArrastre = (event, elemento) => {
        event.dataTransfer.setData(
            'elemento',
            JSON.stringify(elemento)
        )

        event.dataTransfer.effectAllowed = 'copy'
    }

    return (
        <section className="catalogo">

            <h2>Agregar elemento</h2>

            <div className="catalogo-elementos">

                {elementos.map((elemento) => (

                    <div
                        key={elemento.id}
                        className="elemento-catalogo"
                        draggable
                        onDragStart={(event) =>
                            iniciarArrastre(event, elemento)
                        }
                    >

                        <img
                            src={elemento.imagen}
                            alt={elemento.nombre}
                            className="imagen-catalogo"
                            draggable={false}
                        />

                        <span>
                            {elemento.nombre}
                        </span>

                    </div>

                ))}

            </div>

        </section>
    )
}

export default Catalogo