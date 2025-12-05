import Home from './pages/Home';
import AboutMeMain from './pages/AboutMe';
import MarkdownViewerPage from './pages/MarkdownViewerPage';
import Blog from './pages/Blog';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about-me/" element={<AboutMeMain />}/>
        <Route path="/blog" element={<Blog />} />
        <Route path="/article/:id" element={<MarkdownViewerPage />} />
      </Routes>
    </Router>
  );
}