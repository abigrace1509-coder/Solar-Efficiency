/**
 * Standalone IoT simulator for viva/demo explanation.
 * This mirrors the backend simulation logic in a compact script.
 */

const loads = [
  { name: 'Lights', priority: 'high', power: 120, isOn: true },
  { name: 'Fans', priority: 'high', power: 150, isOn: true },
  { name: 'TV', priority: 'medium', power: 200, isOn: true },
  { name: 'Computer', priority: 'medium', power: 250, isOn: true },
  { name: 'AC', priority: 'low', power: 1600, isOn: true },
  { name: 'Heater', priority: 'low', power: 1800, isOn: true }
];

let batterySoc = 60;

const solarByHour = (hour) => {
  if (hour < 6 || hour > 18) return 0;
  return Math.max(0, 4300 - Math.abs(12 - hour) * 550 + Math.floor(Math.random() * 300));
};

const tick = () => {
  const hour = new Date().getHours();
  const solar = solarByHour(hour);
  let demand = loads.filter((x) => x.isOn).reduce((sum, x) => sum + x.power, 0);
  const batteryPower = batterySoc > 10 ? Math.min(2000, (batterySoc / 100) * 3000) : 0;

  if (demand > solar + batteryPower) {
    for (const priority of ['low', 'medium']) {
      for (const load of loads.filter((x) => x.priority === priority && x.isOn)) {
        if (demand <= solar + batteryPower) break;
        load.isOn = false;
        demand -= load.power;
        console.log(`[${new Date().toISOString()}] Shed ${load.name}`);
      }
    }
  }

  const surplus = solar - demand;
  batterySoc = Math.max(0, Math.min(100, batterySoc + surplus / 6000 * 100));

  console.table({ solar, demand, batterySoc: batterySoc.toFixed(2) });
};

setInterval(tick, 5000);
