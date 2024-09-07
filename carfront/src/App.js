import "./App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Login from "./components/Login";
import logo from "./images/miners.png"; // 이미지를 직접 import

function App() {
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ marginRight: "10px", width: "150px" }}
                    />
                </Toolbar>
            </AppBar>
            <Login />
        </div>
    );
}

export default App;
