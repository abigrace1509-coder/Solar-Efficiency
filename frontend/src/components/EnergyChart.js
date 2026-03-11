import { Card } from 'react-bootstrap';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function EnergyChart({ history }) {
  const data = history.map((item) => ({
    time: new Date(item.createdAt).toLocaleTimeString(),
    solar: item.solarPower,
    demand: item.totalDemand,
    battery: item.batterySoc
  }));

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Historical Trends</Card.Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="solar" stroke="#f59f00" />
            <Line type="monotone" dataKey="demand" stroke="#0d6efd" />
            <Line type="monotone" dataKey="battery" stroke="#20c997" />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
