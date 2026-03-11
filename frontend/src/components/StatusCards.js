import { Card, Col, Row } from 'react-bootstrap';

export default function StatusCards({ energy }) {
  const cards = [
    { label: 'Solar Output', value: `${energy?.solarPower || 0} W` },
    { label: 'Battery SOC', value: `${energy?.batterySoc || 0} %` },
    { label: 'Demand', value: `${energy?.totalDemand || 0} W` },
    { label: 'Grid Usage', value: `${energy?.gridUsage || 0} W` }
  ];

  return (
    <Row className="g-3 mb-3">
      {cards.map((card) => (
        <Col md={3} key={card.label}>
          <Card>
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">{card.label}</Card.Subtitle>
              <Card.Title>{card.value}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
