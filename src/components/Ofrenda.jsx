import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import elementos from '../data/elementos'

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

    useEffect(() => {

        const cargarElementos = async () => {

            const { data, error } = await supabase
                .from('elementos_colocados')
                .select('*')

            if (error) {
                console.error('Error al cargar elementos:', error)
                return
            }

            const elementosCargados = {}

            data.forEach((registro) => {

                const elemento = elementos.find(
                    (elemento) => elemento.id === registro.elemento_id
                )

                if (elemento) {

                    if (elemento.tipo === 'foto' && registro.foto_url) {

                        elementosCargados[registro.slot_id] = {
                            ...elemento,
                            fotoUsuario: registro.foto_url
                        }

                    } else {

                        elementosCargados[registro.slot_id] = elemento

                    }
                }
            })

            setElementosColocados(elementosCargados)
        }

        cargarElementos()

    }, [])


    const colocarElemento = async (slotId, elemento) => {

        // No permitir colocar encima de otro elemento
        if (elementosColocados[slotId]) {
            return
        }

        // Las fotografías las resolveremos después con Storage
        if (elemento.tipo === 'foto') {

            setSlotFotoPendiente(slotId)
            setElementoFotoPendiente(elemento)

            return
        }

        // Guardar primero en Supabase
        const { error } = await supabase
            .from('elementos_colocados')
            .insert({
                slot_id: slotId,
                elemento_id: elemento.id
            })

        if (error) {
            console.error('Error al guardar elemento:', error)
            return
        }

        // Si Supabase respondió correctamente,
        // actualizamos también la interfaz
        setElementosColocados((anteriores) => ({
            ...anteriores,
            [slotId]: elemento
        }))
    }


    const moverElemento = async (origen, destino, elemento) => {

        // No permitir mover encima de otro elemento
        if (elementosColocados[destino]) {
            return
        }

        const { error } = await supabase
            .from('elementos_colocados')
            .update({
                slot_id: destino
            })
            .eq('slot_id', origen)

        if (error) {
            console.error('Error al mover elemento:', error)
            return
        }

        // Supabase funcionó, ahora actualizamos React
        setElementosColocados((anteriores) => {

            const nuevos = {
                ...anteriores
            }

            delete nuevos[origen]

            nuevos[destino] = elemento

            return nuevos
        })
    }


    const eliminarElemento = async (slotId) => {

        const elemento = elementosColocados[slotId]

        if (!elemento) {
            return
        }

        // Si es fotografía, primero eliminamos el archivo de Storage
        if (elemento.tipo === 'foto' && elemento.fotoUsuario) {

            const url = elemento.fotoUsuario

            // Extraer el nombre del archivo desde la URL pública
            const nombreArchivo = url.split('/').pop()

            const { error: errorStorage } = await supabase.storage
                .from('fotos-ofrenda')
                .remove([nombreArchivo])

            if (errorStorage) {
                console.error(
                    'Error al eliminar fotografía de Storage:',
                    errorStorage
                )
                return
            }
        }

        // Eliminar el registro de la base de datos
        const { error: errorBD } = await supabase
            .from('elementos_colocados')
            .delete()
            .eq('slot_id', slotId)

        if (errorBD) {
            console.error(
                'Error al eliminar elemento de la BD:',
                errorBD
            )
            return
        }

        // Finalmente eliminarlo de React
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


    const confirmarFoto = async ({ archivo, preview }) => {

        if (!slotFotoPendiente || !elementoFotoPendiente) {
            return
        }

        // 1. Crear nombre único
        const extension = archivo.name.split('.').pop()
        const nombreArchivo = `${crypto.randomUUID()}.${extension}`

        // 2. Subir archivo a Storage
        const { error: errorStorage } = await supabase.storage
            .from('fotos-ofrenda')
            .upload(nombreArchivo, archivo)

        if (errorStorage) {
            console.error('Error al subir fotografía:', errorStorage)
            return
        }

        // 3. Obtener URL pública
        const { data: datosUrl } = supabase.storage
            .from('fotos-ofrenda')
            .getPublicUrl(nombreArchivo)

        const fotoUrl = datosUrl.publicUrl

        // 4. Guardar la fotografía en nuestra tabla
        const { error: errorBD } = await supabase
            .from('elementos_colocados')
            .insert({
                slot_id: slotFotoPendiente,
                elemento_id: elementoFotoPendiente.id,
                foto_url: fotoUrl
            })

        if (errorBD) {
            console.error('Error al guardar fotografía en BD:', errorBD)
            return
        }

        // 5. Crear el elemento que React mostrará
        const elementoConFoto = {
            ...elementoFotoPendiente,
            fotoUsuario: fotoUrl
        }

        // 6. Actualizar interfaz
        setElementosColocados((anteriores) => ({
            ...anteriores,
            [slotFotoPendiente]: elementoConFoto
        }))

        // 7. Cerrar modal
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