import config from '../../config';

const API_BASE_URL = config.API_BASE_URL;
const CORS_DISABLE = config.CORS_DISABLE;

const auth_config = {
	client_id: config.client_id,
	client_secret: config.client_secret,
	redirect_uri: config.redirect_uri,
	code: config.code,
	grant_type: 'authorization_code',
};

// Get access && refresh tokens method by authorization_code
export async function getTokens() {
	try {
		const response = await fetch(
			`${CORS_DISABLE}${API_BASE_URL}/oauth2/access_token`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...auth_config }),
			}
		);

		const data = await response.json();
		if (data.access_token && data.refresh_token) {
			saveTokens(data);
			window.location.reload();
		}
	} catch (e) {
		console.error('Error getting tokens:', e);
	}
}

// save tokens to localStorage
const saveTokens = (token) => {
	localStorage.setItem('access_token', token.access_token);
	localStorage.setItem('refresh_token', token.refresh_token);
	localStorage.setItem('expires_in', token.expires_in);
};

async function refreshAccessToken() {
	try {
		const refresh_token = localStorage.getItem('refresh_token');

		const response = await fetch(
			`${CORS_DISABLE}${API_BASE_URL}/oauth2/access_token`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},

				body: JSON.stringify({
					refresh_token,
					grant_type: 'refresh_token',
					client_id: config.client_id,
					client_secret: config.client_secret,
					redirect_uri: config.redirect_uri,
				}),
			}
		);

		const data = await response.json();
		if (data.access_token && data.refresh_token) {
			saveTokens(data);
			window.location.reload();
		}
	} catch (e) {
		console.error('Error refreshing access token:', e);
		throw e;
	}
}

// check token to refresh
const expires_in = localStorage.getItem('expires_in');
const chekToken = () => {
	const timeOut = expires_in * 1000;

	if (expires_in && expires_in !== 'undefined') {
		setTimeout(refreshAccessToken, timeOut - 60000); // token refresh 60 seconds before expiration
	}
};

chekToken();
