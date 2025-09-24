const dev = {
  API_ENDPOINT_URL:  import.meta.env.VITE_BACKEND_API_ENDPOINT_URL
};

const prod = {
  API_ENDPOINT_URL:  import.meta.env.VITE_BACKEND_API_ENDPOINT_URL
};

const test = {
  API_ENDPOINT_URL:  import.meta.env.VITE_BACKEND_API_ENDPOINT_URL
};

const getEnv = () => {
	switch (import.meta.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			break;
	}
}

export const env = getEnv()
