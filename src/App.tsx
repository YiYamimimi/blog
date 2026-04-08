import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import MarkdownViewer from './components/MarkdownViewer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogList" element={<BlogList />} />
        <Route path="/docs/*" element={<MarkdownViewer />} />
      </Routes>
    </BrowserRouter>
  )
}
