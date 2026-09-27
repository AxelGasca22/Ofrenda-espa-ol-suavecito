import velaImg from '../assets/elementos/vela.png'
import florImg from '../assets/elementos/flor.png'
import calaveraImg from '../assets/elementos/calavera.png'
import panImg from '../assets/elementos/pan.png'
import aguaImg from '../assets/elementos/agua.png'
import fotoImg from '../assets/elementos/foto.png'

const elementos = [
    {
        id: 'vela',
        nombre: 'Vela',
        tipo: 'vertical',
        imagen: velaImg
    },
    {
        id: 'flor',
        nombre: 'Cempasúchil',
        tipo: 'grande',
        imagen: florImg
    },
    {
        id: 'calavera',
        nombre: 'Calavera',
        tipo: 'vertical',
        imagen: calaveraImg
    },
    {
        id: 'pan',
        nombre: 'Pan de muerto',
        tipo: 'horizontal',
        imagen: panImg
    },
    {
        id: 'agua',
        nombre: 'Vaso de agua',
        tipo: 'vertical',
        imagen: aguaImg
    },
    {
        id: 'foto',
        nombre: 'Fotografía',
        tipo: 'foto',
        imagen: fotoImg
    }
]

export default elementos