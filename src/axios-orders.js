import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://react-my-burger-960eb.firebaseio.com/'
})

export default instance;