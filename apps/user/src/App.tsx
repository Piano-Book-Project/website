import PlayerBar from './features/player/components/PlayerBar';
import SideNav from './components/SideNav';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#171719' }}>
      <SideNav />
      <PlayerBar />
    </div>
  );
}

export default App;
