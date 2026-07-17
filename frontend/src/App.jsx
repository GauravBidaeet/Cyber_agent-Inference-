import CyberBackground from './components/CyberBackground'
import CursorTrail from './components/CursorTrail'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeatureCards from './components/FeatureCards'
import ChatSection from './components/ChatSection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="relative min-h-screen bg-cyber-bg">
      <CyberBackground />
      <CursorTrail />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <FeatureCards />
        <ChatSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
