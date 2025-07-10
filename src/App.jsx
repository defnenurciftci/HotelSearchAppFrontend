import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PageContainer from './container/pageContainer'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import './App.css'
import './index.css'
import LoginPage from './pages/LoginPage'
import SearchResults from './pages/SearchResultsPage'

function App() {
  return (
    <div>
      <PageContainer>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search-results" element={<SearchResults />} />
          </Routes>
        </Router>
      </PageContainer>
    </div>
  )
}

export default App
