import { useState } from 'react'
import './App.css'

function App() {
  const [showCards, setShowCards] = useState(false)

  const handleButtonClick = () => {
    setShowCards(true)
  }

  return (
    <div className="app-container">
      {!showCards ? (
        <button className="center-button" onClick={handleButtonClick}>
          Create Cards
        </button>
      ) : (
        <div className="cards-container">
          <div className="card">
            <div className="card-corner top-left">A♠</div>
            <div className="card-center">♠</div>
            <div className="card-corner bottom-right">A♠</div>
          </div>
          <div className="card">
            <div className="card-corner top-left">K♥</div>
            <div className="card-center">♥</div>
            <div className="card-corner bottom-right">K♥</div>
          </div>
          <div className="card">
            <div className="card-corner top-left">Q♦</div>
            <div className="card-center">♦</div>
            <div className="card-corner bottom-right">Q♦</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
