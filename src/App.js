import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-notifications-component/dist/theme.css'
import { AppContext } from "./libs/contextLib";
import { useHistory } from "react-router-dom";
import { onError } from "./libs/errorLib";
import { useTranslation } from "react-i18next";
import NavBar from "./app/components/NavBar";
import Sidebar from "./app/components/Sidebar"
import {Footer} from "./app/components/Footer";

function App() {

	const [isAuthenticated, userHasAuthenticated] = useState(false);
	const [isAuthenticating, setIsAuthenticating] = useState(true);
	const history = useHistory();
	const { t } = useTranslation();

	useEffect(() => {
		onLoad();
	}, []);

	async function onLoad() {
		try {
			if (localStorage.getItem("jwtoken")) {
				// TODO set client-side expiry for this token
				userHasAuthenticated(true);
			}
		}
		catch (e) {
			if (e !== 'No current user') {
				onError(e);
			}
		}
		setIsAuthenticating(false);
	}

	function handleLogout() {
		// need to clear cookies?
		localStorage.removeItem('jwtoken');
		localStorage.clear();
		userHasAuthenticated(false);
		setIsAuthenticating(false);
		history.push("/login");
	}

	function RenderSideBar()
	{
		console.log("Is user Authenticated??"+ isAuthenticated)
		if(isAuthenticated)
			return <Sidebar></Sidebar>
		return <></>
	}

	return (
		<div className="App">
			<div>
				{NavBar({isAuthenticated, handleLogout, t})}
			</div>
			<AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
				<div className="mainpage spacing">
					<RenderSideBar/>
					<div className="maincontent">
						<Routes />
					</div>
				</div>
			</AppContext.Provider>
			<Footer></Footer>
		</div>
	);
}
export default App;
