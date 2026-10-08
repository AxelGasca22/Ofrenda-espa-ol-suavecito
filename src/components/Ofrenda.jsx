import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

import elementos from '../data/elementos'
import decoraciones from '../data/decoraciones'

import Altar from './Altar'
import Catalogo from './Catalogo'
import CatalogoDecoraciones from './CatalogoDecoraciones'
import ModalFoto from './ModalFoto'

import marcoFoto from '../assets/elementos/foto.png'


function Ofrenda() {

    const [elementosColocados, setElementosColocados] = useState({})

    const [decoracionesColocadas, setDecoracionesColocadas] = useState([])

    const [actualizando, setActualizando] = useState(false)


    // Slot donde el usuario intentó colocar una fotografía
    const [slotFotoPendiente, setSlotFotoPendiente] = useState(null)

    // Elemento "Fotografía" proveniente del catálogo
    const [elementoFotoPendiente, setElementoFotoPendiente] = useState(null)


    // =========================================
    // CARGAR ELEMENTOS DEL ALTAR
    // =========================================

    const cargarElementos = async () => {

        const { data, error } = await supabase
            .from('elementos_colocados')
            .select('*')


        if (error) {

            console.error(
                'Error al cargar elementos:',
                error
            )

            return
        }


        const elementosCargados = {}


        data.forEach((registro) => {

            const elemento = elementos.find(
                (elemento) =>
                    elemento.id === registro.elemento_id
            )


            if (!elemento) {
                return
            }


            if (
                elemento.tipo === 'foto' &&
                registro.foto_url
            ) {

                elementosCargados[registro.slot_id] = {
                    ...elemento,
                    fotoUsuario: registro.foto_url
                }

            } else {

                elementosCargados[registro.slot_id] =
                    elemento
            }
        })


        setElementosColocados(
            elementosCargados
        )
    }


    // =========================================
    // CARGAR DECORACIONES
    // =========================================

    const cargarDecoraciones = async () => {

        const { data, error } = await supabase
            .from('decoraciones_colocadas')
            .select('*')


        if (error) {

            console.error(
                'Error al cargar decoraciones:',
                error
            )

            return
        }


        const decoracionesCargadas = data
            .map((registro) => {

                const decoracion = decoraciones.find(
                    (item) =>
                        item.id === registro.decoracion_id
                )


                if (!decoracion) {
                    return null
                }


                return {
                    ...decoracion,

                    idColocada: registro.id,
                    decoracionId: registro.decoracion_id,

                    x: registro.posicion_x,
                    y: registro.posicion_y
                }
            })
            .filter(Boolean)


        setDecoracionesColocadas(
            decoracionesCargadas
        )
    }


    // =========================================
    // CARGAR TODA LA OFRENDA
    // =========================================

    const cargarOfrenda = async () => {

        await Promise.all([
            cargarElementos(),
            cargarDecoraciones()
        ])
    }


    // =========================================
    // CARGA INICIAL
    // =========================================

    useEffect(() => {

        cargarOfrenda()

    }, [])


    // =========================================
    // BOTÓN ACTUALIZAR
    // =========================================

    const actualizarOfrenda = async () => {

        if (actualizando) {
            return
        }


        setActualizando(true)


        try {

            await cargarOfrenda()

        } catch (error) {

            console.error(
                'Error al actualizar la ofrenda:',
                error
            )

        } finally {

            setActualizando(false)
        }
    }


    // =========================================
    // COLOCAR ELEMENTO EN SLOT
    // =========================================

    const colocarElemento = async (
        slotId,
        elemento
    ) => {

        if (elementosColocados[slotId]) {
            return
        }


        if (elemento.tipo === 'foto') {

            setSlotFotoPendiente(slotId)

            setElementoFotoPendiente(
                elemento
            )

            return
        }


        const { error } = await supabase
            .from('elementos_colocados')
            .insert({
                slot_id: slotId,
                elemento_id: elemento.id
            })


        if (error) {

            console.error(
                'Error al guardar elemento:',
                error
            )

            return
        }


        setElementosColocados(
            (anteriores) => ({
                ...anteriores,
                [slotId]: elemento
            })
        )
    }


    // =========================================
    // MOVER ELEMENTO ENTRE SLOTS
    // =========================================

    const moverElemento = async (
        origen,
        destino,
        elemento
    ) => {

        if (elementosColocados[destino]) {
            return
        }


        const { error } = await supabase
            .from('elementos_colocados')
            .update({
                slot_id: destino
            })
            .eq(
                'slot_id',
                origen
            )


        if (error) {

            console.error(
                'Error al mover elemento:',
                error
            )

            return
        }


        setElementosColocados(
            (anteriores) => {

                const nuevos = {
                    ...anteriores
                }


                delete nuevos[origen]


                nuevos[destino] =
                    elemento


                return nuevos
            }
        )
    }


    // =========================================
    // ELIMINAR ELEMENTO
    // =========================================

    const eliminarElemento = async (
        slotId
    ) => {

        const elemento =
            elementosColocados[slotId]


        if (!elemento) {
            return
        }


        // Si es fotografía,
        // eliminar primero de Storage

        if (
            elemento.tipo === 'foto' &&
            elemento.fotoUsuario
        ) {

            const url =
                elemento.fotoUsuario


            const nombreArchivo =
                url.split('/').pop()


            const {
                error: errorStorage
            } = await supabase.storage
                .from('fotos-ofrenda')
                .remove([
                    nombreArchivo
                ])


            if (errorStorage) {

                console.error(
                    'Error al eliminar fotografía de Storage:',
                    errorStorage
                )

                return
            }
        }


        const {
            error: errorBD
        } = await supabase
            .from('elementos_colocados')
            .delete()
            .eq(
                'slot_id',
                slotId
            )


        if (errorBD) {

            console.error(
                'Error al eliminar elemento de la BD:',
                errorBD
            )

            return
        }


        setElementosColocados(
            (anteriores) => {

                const nuevos = {
                    ...anteriores
                }


                delete nuevos[slotId]


                return nuevos
            }
        )
    }


    // =========================================
    // COLOCAR DECORACIÓN
    // =========================================

    const colocarDecoracion = async (
        decoracion,
        posicionX,
        posicionY
    ) => {

        const {
            data,
            error
        } = await supabase
            .from('decoraciones_colocadas')
            .insert({
                decoracion_id:
                    decoracion.id,

                posicion_x:
                    posicionX,

                posicion_y:
                    posicionY
            })
            .select()
            .single()


        if (error) {

            console.error(
                'Error al guardar decoración:',
                error
            )

            return
        }


        const nuevaDecoracion = {
            ...decoracion,

            idColocada: data.id,
            decoracionId: decoracion.id,

            x: posicionX,
            y: posicionY
        }


        setDecoracionesColocadas(
            (anteriores) => [
                ...anteriores,
                nuevaDecoracion
            ]
        )
    }


    // =========================================
    // MOVER DECORACIÓN
    // =========================================

    const moverDecoracion = async (
        idDecoracionColocada,
        posicionX,
        posicionY
    ) => {

        const { error } = await supabase
            .from('decoraciones_colocadas')
            .update({
                posicion_x: posicionX,
                posicion_y: posicionY
            })
            .eq(
                'id',
                idDecoracionColocada
            )


        if (error) {

            console.error(
                'Error al mover decoración:',
                error
            )

            return
        }


        setDecoracionesColocadas(
            (anteriores) =>
                anteriores.map(
                    (decoracion) =>
                        decoracion.idColocada ===
                            idDecoracionColocada

                            ? {
                                ...decoracion,

                                x: posicionX,
                                y: posicionY
                            }

                            : decoracion
                )
        )
    }


    // =========================================
    // ELIMINAR DECORACIÓN
    // =========================================

    const eliminarDecoracion = async (
        idColocada
    ) => {

        const { error } = await supabase
            .from('decoraciones_colocadas')
            .delete()
            .eq(
                'id',
                idColocada
            )


        if (error) {

            console.error(
                'Error al eliminar decoración:',
                error
            )

            return
        }


        setDecoracionesColocadas(
            (anteriores) =>
                anteriores.filter(
                    (decoracion) =>
                        decoracion.idColocada !==
                        idColocada
                )
        )
    }


    // =========================================
    // CANCELAR FOTO
    // =========================================

    const cancelarFoto = () => {

        setSlotFotoPendiente(null)

        setElementoFotoPendiente(null)
    }


    // =========================================
    // CONFIRMAR FOTO
    // =========================================

    const confirmarFoto = async ({
        archivo
    }) => {

        if (
            !slotFotoPendiente ||
            !elementoFotoPendiente
        ) {
            return
        }


        // 1. Crear nombre único

        const extension =
            archivo.name
                .split('.')
                .pop()
                .toLowerCase()


        const nombreArchivo =
            `${crypto.randomUUID()}.${extension}`


        // 2. Subir archivo

        const {
            error: errorStorage
        } = await supabase.storage
            .from('fotos-ofrenda')
            .upload(
                nombreArchivo,
                archivo,
                {
                    cacheControl:
                        '3600',

                    upsert:
                        false
                }
            )


        if (errorStorage) {

            console.error(
                'Error al subir fotografía:',
                errorStorage
            )

            return
        }


        // 3. Obtener URL pública

        const {
            data: datosUrl
        } = supabase.storage
            .from('fotos-ofrenda')
            .getPublicUrl(
                nombreArchivo
            )


        const fotoUrl =
            datosUrl.publicUrl


        // 4. Guardar registro

        const {
            error: errorBD
        } = await supabase
            .from('elementos_colocados')
            .insert({
                slot_id:
                    slotFotoPendiente,

                elemento_id:
                    elementoFotoPendiente.id,

                foto_url:
                    fotoUrl
            })


        if (errorBD) {

            console.error(
                'Error al guardar fotografía en BD:',
                errorBD
            )


            const {
                error: errorEliminar
            } = await supabase.storage
                .from('fotos-ofrenda')
                .remove([
                    nombreArchivo
                ])


            if (errorEliminar) {

                console.error(
                    'No se pudo limpiar la fotografía de Storage:',
                    errorEliminar
                )
            }


            return
        }


        // 5. Crear objeto para React

        const elementoConFoto = {

            ...elementoFotoPendiente,

            fotoUsuario:
                fotoUrl
        }


        // 6. Actualizar interfaz

        setElementosColocados(
            (anteriores) => ({
                ...anteriores,

                [slotFotoPendiente]:
                    elementoConFoto
            })
        )


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


            {/* =================================
                CONTROLES
               ================================= */}

            <div className="controles-ofrenda">

                <button
                    type="button"
                    className="boton-actualizar"
                    onClick={actualizarOfrenda}
                    disabled={actualizando}
                >

                    {actualizando
                        ? 'Actualizando...'
                        : '↻ Actualizar'
                    }

                </button>

            </div>


            <div className="area-ofrenda">

                <Altar
                    elementosColocados={
                        elementosColocados
                    }

                    colocarElemento={
                        colocarElemento
                    }

                    moverElemento={
                        moverElemento
                    }

                    eliminarElemento={
                        eliminarElemento
                    }

                    decoracionesColocadas={
                        decoracionesColocadas
                    }

                    colocarDecoracion={
                        colocarDecoracion
                    }

                    moverDecoracion={
                        moverDecoracion
                    }

                    eliminarDecoracion={
                        eliminarDecoracion
                    }
                />


                <CatalogoDecoraciones />

            </div>


            <Catalogo />


            <ModalFoto

                abierto={
                    slotFotoPendiente !== null
                }

                marco={
                    marcoFoto
                }

                onCancelar={
                    cancelarFoto
                }

                onConfirmar={
                    confirmarFoto
                }

            />

        </div>
    )
}


export default Ofrenda