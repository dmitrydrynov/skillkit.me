type InitStateType = {
	auth?: {
		loggedIn: boolean;
		logginingIn: boolean;
		isOTP: boolean;
	};
};

const initialState: InitStateType = {
	auth: {
		loggedIn: false,
		logginingIn: false,
		isOTP: true,
	},
};

export default initialState;
