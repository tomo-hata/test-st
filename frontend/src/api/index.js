import axios from 'axios'

export default () => {
  return axios.create({
    // AWSで取得したIPアドレス
    baseURL: `http://xxx.xxx.xxx.xxx:3000/`
  })
}
