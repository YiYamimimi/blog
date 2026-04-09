import { Routes, Route, HashRouter } from 'react-router-dom'
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import MarkdownViewer from './components/MarkdownViewer'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogList" element={<BlogList />} />
        <Route path="/docs/*" element={<MarkdownViewer />} />
      </Routes>
    </HashRouter>
  )
}
