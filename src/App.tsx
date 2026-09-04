import { Background } from './components/Background'
import { BootScreen } from './components/BootScreen'
import { BurstCanvas } from './components/BurstCanvas'
import { DagRail } from './components/DagRail'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Credentials } from './components/sections/Credentials'
import { Experience } from './components/sections/Experience'
import { Footer } from './components/sections/Footer'
import { Hero } from './components/sections/Hero'
import { Pipelines } from './components/sections/Pipelines'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { StatusBar } from './components/StatusBar'
import { Toast } from './components/Toast'
import { TopBar } from './components/TopBar'
import { NotebookProvider } from './notebook/NotebookProvider'
import { ThemeProvider } from './notebook/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <NotebookProvider>
        <Background />
        <BurstCanvas />
        <Toast />
        <BootScreen />
        <TopBar />
        <DagRail />
        <main className="relative z-[1] mx-auto max-w-[960px] px-[clamp(16px,3vw,32px)] pt-[calc(var(--chrome-top)+44px)] pb-[calc(var(--chrome-bottom)+90px)] rail:ml-[calc(var(--rail-w)+60px)]">
          <Hero />
          <About />
          <Experience />
          <Pipelines />
          <Skills />
          <Projects />
          <Credentials />
          <Contact />
          <Footer />
        </main>
        <StatusBar />
      </NotebookProvider>
    </ThemeProvider>
  )
}
