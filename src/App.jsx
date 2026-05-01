import { useState } from "react";
import "./App.css";
import Search from "./components/Search";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Image" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Love!
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
      </div>
    </main>
  );
}

export default App;
