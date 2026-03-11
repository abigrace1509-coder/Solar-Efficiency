import { useEffect, useState } from 'react';
import { Badge, Button, Container, Navbar, Spinner } from 'react-bootstrap';
import { io } from 'socket.io-client';
import EnergyChart from '../components/EnergyChart';
import LoadTable from '../components/LoadTable';
import StatusCards from '../components/StatusCards';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', { autoConnect: false });

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [energy, setEnergy] = useState(null);
  const [loads, setLoads] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitial = async () => {
    const [{ data: live }, { data: historical }] = await Promise.all([
      api.get('/energy/live'),
      api.get('/energy/history?limit=30')
    ]);

    setEnergy(live.energy);
    setLoads(live.loads);
    setHistory(historical);
    setLoading(false);
  };

  const toggleLoad = async (load) => {
    await api.post('/load/control', { loadId: load._id, isOn: !load.isOn, manualOverride: true });
    setLoads((prev) => prev.map((item) => (item._id === load._id ? { ...item, isOn: !item.isOn, manualOverride: true } : item)));
  };

  useEffect(() => {
    fetchInitial().catch(() => setLoading(false));

    socket.connect();
    socket.on('energy:update', (payload) => {
      setEnergy(payload);
      setLoads(payload.loads || []);
      setHistory((prev) => [...prev.slice(-29), { ...payload, createdAt: new Date().toISOString() }]);
    });

    return () => {
      socket.off('energy:update');
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="mb-3">
        <Container>
          <Navbar.Brand>Smart Grid Home Dashboard</Navbar.Brand>
          <div className="d-flex gap-3 align-items-center">
            <Badge bg="secondary">{user?.role?.toUpperCase()}</Badge>
            <Button size="sm" variant="outline-light" onClick={logout}>
              Logout
            </Button>
          </div>
        </Container>
      </Navbar>
      <Container>
        <StatusCards energy={energy} />
        <EnergyChart history={history} />
        <h5>Load Priority & Manual Control</h5>
        <LoadTable loads={loads} canControl={user?.role === 'admin'} onToggle={toggleLoad} />
      </Container>
    </>
  );
}
