import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Creamos una instancia de Axios con la configuración base necesaria para la comunicación con el backend.
const api = axios.create({ baseURL: 'http://localhost:3000' })

export default boot(({ /* app */ }) => {

})

export { api }
