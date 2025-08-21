import './App.css'
import Header from './components/Header';
import WeighingStation from './components/WeighingStation';

function App() {

  return (
    <>
      <Header />
      <main className="pt-[70px]"> {/* Padding top để không bị Header che */}
        <WeighingStation />
      </main>
    </>
  )
}

export default App
