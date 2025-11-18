import axios from 'axios'

export const http = axios.create({
	timeout: 10000,
})

// External base URLs
export const API = {
	jsonPlaceholder: 'https://jsonplaceholder.typicode.com',
	dummyJson: 'https://dummyjson.com',
	coinGecko: 'https://api.coingecko.com/api/v3',
}
