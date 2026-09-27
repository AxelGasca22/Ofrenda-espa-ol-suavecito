import { useEffect, useState } from 'react'

function ModalFoto({
    abierto,
    marco,
    onCancelar,
    onConfirmar
}) {

    const [foto, setFoto] = useState(null)
    const [preview, setPreview] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!abierto) {
            setFoto(null)
            setPreview(null)
            setError('')
        }
    }, [abierto])

    if (!abierto) {
        return null
    }

    const seleccionarFoto = (event) => {

        const archivo = event.target.files[0]

        if (!archivo) {
            return
        }

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]

        if (!tiposPermitidos.includes(archivo.type)) {
            setError('Solo se permiten imágenes JPG, PNG o WEBP.')
            return
        }

        const maximo = 5 * 1024 * 1024

        if (archivo.size > maximo) {
            setError('La imagen no puede superar los 5 MB.')
            return
        }

        setError('')
        setFoto(archivo)

        const url = URL.createObjectURL(archivo)

        setPreview(url)
    }

    const confirmar = () => {

        if (!foto || !preview) {
            setError('Selecciona una fotografía.')
            return
        }

        onConfirmar({
            archivo: foto,
            preview
        })
    }

    return (
        <div className="modal-overlay">

            <div className="modal-foto">

                <h2>Agregar fotografía</h2>

                <p>
                    Selecciona una fotografía para colocarla
                    en la ofrenda.
                </p>

                <div className="preview-marco">

                    {preview && (
                        <img
                            src={preview}
                            alt="Vista previa"
                            className="preview-fotografia"
                        />
                    )}

                    <img
                        src={marco}
                        alt=""
                        className="preview-marco-imagen"
                    />

                </div>

                <label className="boton-seleccionar">

                    Seleccionar fotografía

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={seleccionarFoto}
                        hidden
                    />

                </label>

                <p className="restricciones-foto">
                    JPG, PNG o WEBP · Máximo 5 MB
                </p>

                {error && (
                    <p className="error-foto">
                        {error}
                    </p>
                )}

                <div className="modal-acciones">

                    <button
                        type="button"
                        className="boton-cancelar"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="boton-agregar"
                        onClick={confirmar}
                        disabled={!foto}
                    >
                        Agregar
                    </button>

                </div>

            </div>

        </div>
    )
}

export default ModalFoto