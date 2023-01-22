import React from "react";
import "./App.css";
import Button from "./componenet/Button";
import Textfiled from "./componenet/Textfiled";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="logo01.png" alt="logo" className="Picture" />
        <p>
          <Textfiled></Textfiled>
        </p>
        <p>
          <Button> </Button>
        </p>
        <a
          className="App-link"
          href="https://tenor.com/bItJt.gif"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create Account
        </a>
        <a
          className="App-link"
          href="https://tenor.com/uQST.gif"
          target="_blank"
          rel="noopener noreferrer"
        >
          Forget Username or Password
        </a>
        ;
      </header>
    </div>
  );
}

export default App;
