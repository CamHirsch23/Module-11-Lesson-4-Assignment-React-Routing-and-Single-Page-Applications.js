// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import BrowseCharacters from './components/BrowseCharacters';
import CharacterDetails from './components/CharacterDetails';
import Comics from './components/Comics';
import MarvelCharacters from './components/MarvelCharacters';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/browse-characters" element={<BrowseCharacters />} />
                        <Route path="/character-details/:id" element={<CharacterDetails />} />
                        <Route path="/comics" element={<Comics />} />
                        <Route path="/marvel-characters" element={<MarvelCharacters />} />
                    </Routes>
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;

// src/components/Home.jsx
const Home = () => {
    return (
        <div>
            <h2>Home</h2>
            <p>Welcome to the Comic Book Library!</p>
        </div>
    );
};

export default Home;

// src/components/BrowseCharacters.jsx
import React from 'react';

const BrowseCharacters = () => {
    return (
        <div>
            <h2>Browse Characters</h2>
            <p>List of characters will be displayed here.</p>
        </div>
    );
};

export default BrowseCharacters;

// src/components/CharacterDetails.jsx
import React from 'react';

const CharacterDetails = () => {
    return (
        <div>
            <h2>Character Details</h2>
            <p>Details of the selected character will be displayed here.</p>
        </div>
    );
};

export default CharacterDetails;

// src/components/Comics.jsx
const Comics = () => {
    return (
        <div>
            <h2>Comics</h2>
            <p>This component is under construction. Check back later!</p>
        </div>
    );
};

export default Comics;

// src/components/MarvelCharacters.jsx
import React, { useEffect, useState } from 'react';
import md5 from 'md5';

const publicKey = 'YOUR_PUBLIC_API_KEY'; // Replace with your actual public API key
const privateKey = 'YOUR_PRIVATE_API_KEY'; // Replace with your actual private API key

async function fetchMarvelCharacters() {
    const ts = Date.now();
    const hash = md5(ts + privateKey + publicKey);
    const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data.results;
    } catch (error) {
        console.error('Fetching Marvel characters failed:', error);
        return null;
    }
}

const MarvelCharacters = () => {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        const updateUIWithMarvelCharacters = async () => {
            const fetchedCharacters = await fetchMarvelCharacters();
            setCharacters(fetchedCharacters);
        };

        updateUIWithMarvelCharacters();
        const intervalId = setInterval(updateUIWithMarvelCharacters, 5000);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
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

export default MarvelCharacters;

// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
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
}

export default ErrorBoundary;

// src/components/ExternalStyledComponent.jsx
import './ExternalStyledComponent.css';

const ExternalStyledComponent = () => (
    <div className="external-styled">
        This is an externally styled component.
    </div>
);

export default ExternalStyledComponent;

// src/components/ModuleStyledComponent.module.css
.moduleStyled {
    color: green;
    background-color: lightyellow;
}

// src/components/ModuleStyledComponent.jsx
import styles from './ModuleStyledComponent.module.css';

const ModuleStyledComponent = () => (
    <div className={styles.moduleStyled}>
        This is a module styled component.
    </div>
);

export default ModuleStyledComponent;

// src/components/StyledComponent.jsx
import styled from 'styled-components';

const StyledDiv = styled.div`
    color: red;
    background-color: lightblue;
`;

const StyledComponent = () => (
    <StyledDiv>
        This is a styled component.
    </StyledDiv>
);

export default StyledComponent;
