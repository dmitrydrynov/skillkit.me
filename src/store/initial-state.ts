type InitStateType = {
	auth?: {
		loggedIn: boolean;
	};
};

const initialState: InitStateType = {
	auth: {
		loggedIn: false,
	},
};

export default initialState;
