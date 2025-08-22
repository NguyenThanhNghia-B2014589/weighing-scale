import './App.css'
import Header from './components/Header';
import WeighingStation from './components/WeighingStation';

function App() {

  return (
    <div className="bg-sky-200 min-h-screen">
      <Header />
      <main className=" pt-[70px]">
        <WeighingStation />
      </main>
    </div>
  )
}

export default App
