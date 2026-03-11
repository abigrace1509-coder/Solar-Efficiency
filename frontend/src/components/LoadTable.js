import { Badge, Button, Table } from 'react-bootstrap';

const priorityVariant = {
  high: 'success',
  medium: 'warning',
  low: 'danger'
};

export default function LoadTable({ loads, canControl, onToggle }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Load</th>
          <th>Priority</th>
          <th>Power (W)</th>
          <th>Status</th>
          <th>Manual Override</th>
        </tr>
      </thead>
      <tbody>
        {loads.map((load) => (
          <tr key={load._id}>
            <td>{load.name}</td>
            <td>
              <Badge bg={priorityVariant[load.priority]}>{load.priority.toUpperCase()}</Badge>
            </td>
            <td>{load.powerRating}</td>
            <td>{load.isOn ? 'ON' : 'OFF'}</td>
            <td>
              <Button
                variant={load.isOn ? 'outline-danger' : 'outline-success'}
                size="sm"
                disabled={!canControl}
                onClick={() => onToggle(load)}
              >
                {load.isOn ? 'Turn OFF' : 'Turn ON'}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
