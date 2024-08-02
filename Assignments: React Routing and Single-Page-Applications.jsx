// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import md5 from 'md5';
import './App.css';
import './components/ExternalStyledComponent.css';
import styles from './components/ModuleStyledComponent.module.css';

// Navigation Component
const Navigation = () => {
  return (
    <nav>
      <NavLink exact to="/" activeClassName="active">Home</NavLink>
      <NavLink to="/browse-characters" activeClassName="active">Browse Characters</NavLink>
      <NavLink to="/comics" activeClassName="active">Comics</NavLink>
      <NavLink to="/marvel-characters" activeClassName="active">Marvel Characters</NavLink>
    </nav>
  );
};

// Home Component
const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to the Comic Book Library!</p>
    </div>
  );
};

// BrowseCharacters Component
const BrowseCharacters = () => {
  return (
    <div>
      <h2>Browse Characters</h2>
      <p>List of characters will be displayed here.</p>
    </div>
  );
};

// CharacterDetails Component
const CharacterDetails = () => {
  return (
    <div>
      <h2>Character Details</h2>
      <p>Details of the selected character will be displayed here.</p>
    </div>
  );
};

// Comics Component
const Comics = () => {
  return (
    <div>
      <h2>Comics</h2>
      <p>This component is under construction. Check back later!</p>
    </div>
  );
};

// MarvelCharacters Component
const MarvelCharacters = () => {
  const [characters, setCharacters] = React.useState([]);

  React.useEffect(() => {
    const fetchMarvelCharacters = async () => {
      const ts = Date.now();
      const hash = md5(ts + 'YOUR_PRIVATE_API_KEY' + 'YOUR_PUBLIC_API_KEY');
      const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=YOUR_PUBLIC_API_KEY&hash=${hash}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCharacters(data.data.results);
      } catch (error) {
        console.error('Fetching Marvel characters failed:', error);
      }
    };

    fetchMarvelCharacters();
  }, []);

  return (
    <div id="characters">
      {characters.map(character => (
        <div className="character" key={character.id}>
          <h3>{character.name}</h3>
          <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} />
          <p>{character.description}</p>
        </div>
      ))}
    </div>
  );
};

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
};

// ExternalStyledComponent using regular CSS
const ExternalStyledComponent = () => (
  <div className="external-styled">
    This is an externally styled component.
  </div>
);

// ModuleStyledComponent using CSS Modules
const ModuleStyledComponent = () => (
  <div className={styles.moduleStyled}>
    This is a module styled component.
  </div>
);

// App Component with Routing
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse-characters" element={<BrowseCharacters />} />
            <Route path="/character-details/:id" element={<CharacterDetails />} />
            <Route path="/comics" element={<Comics />} />
            <Route path="/marvel-characters" element={<MarvelCharacters />} />
            <Route path="*" element={<Home />} /> {/* Fallback to Home for undefined routes */}
          </Routes>
          <ExternalStyledComponent />
          <ModuleStyledComponent />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
