import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle, BarChart3, Bell, CheckCircle2, Clock3, FileText,
  Gauge, Grid2X2, MapPin, Navigation, Play, Settings, Truck, Wrench,
} from 'lucide-react';

const EVENTS = [
  { type: 'Overspeeding', detail: 'MH 12 AB 1234 · 82 km/h', tone: 'red', Icon: Gauge },
  { type: 'Delay', detail: 'UP 16 GH 3456 · ETA +24 min', tone: 'amber', Icon: Clock3 },
  { type: 'Accident', detail: 'RJ 14 CD 5678 · Assistance notified', tone: 'red', Icon: AlertTriangle },
  { type: 'Reached Destination', detail: 'KA 03 EF 9012 · Delivery complete', tone: 'green', Icon: CheckCircle2 },
  { type: 'Trip Started', detail: 'GJ 01 KL 4421 · Ahmedabad route', tone: 'blue', Icon: Play },
];

const ROUTES = [
  [[28.61, 77.21], [27.18, 78.01], [26.85, 80.95], [25.59, 85.14]],
  [[19.08, 72.88], [21.17, 72.83], [22.31, 73.18], [23.02, 72.57]],
  [[22.57, 88.36], [23.35, 85.33], [25.59, 85.14], [26.14, 91.74]],
  [[17.39, 78.49], [18.52, 73.86], [19.08, 72.88], [21.15, 79.09]],
  [[12.97, 77.59], [13.08, 80.27], [17.69, 83.22], [20.30, 85.82]],
  [[26.91, 75.79], [23.26, 77.41], [21.15, 79.09], [20.94, 77.78]],
  [[30.73, 76.78], [32.73, 74.87], [31.10, 77.17], [28.61, 77.21]],
  [[23.02, 72.57], [22.72, 75.86], [23.26, 77.41], [26.45, 80.33]],
];

const interpolate = (route, progress) => {
  const scaled = progress * (route.length - 1);
  const index = Math.floor(scaled);
  const amount = scaled - index;
  const from = route[index];
  const to = route[Math.min(index + 1, route.length - 1)];
  return [from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount];
};

function getLimits() {
  const width = window.innerWidth;
  return { vehicles: width < 640 ? 4 : width < 1024 ? 6 : 8, popups: width < 640 ? 1 : 2 };
}

function Metric({ Icon, label, value, tone = 'blue' }) {
  return <article className={`control-map__metric control-map__metric--${tone}`}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong></div></article>;
}

export default function ControlTowerMap() {
  const rootRef = useRef(null);
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const popupRefs = useRef([]);
  const frameRef = useRef(0);
  const elapsedRef = useRef(0);
  const startedAtRef = useRef(0);
  const eventIndexRef = useRef(0);
  const limitsRef = useRef(getLimits());
  const [limits, setLimits] = useState(getLimits);
  const [active, setActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [alerts, setAlerts] = useState(() => EVENTS.slice(0, 4).map((event, id) => ({ ...event, id, time: 'Now' })));

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;
    const map = L.map(mapNodeRef.current, {
      center: [23.4, 80.5],
      zoom: 4.7,
      minZoom: 4,
      maxZoom: 12,
      zoomSnap: .25,
      zoomDelta: .5,
      wheelPxPerZoomLevel: 90,
      scrollWheelZoom: true,
      zoomControl: true,
      preferCanvas: true,
    });
    mapRef.current = map;
    map.createPane('routes');
    map.getPane('routes').style.zIndex = '430';
    map.createPane('vehicles');
    map.getPane('vehicles').style.zIndex = '620';
    map.createPane('events');
    map.getPane('events').style.zIndex = '680';

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      updateWhenIdle: false,
      keepBuffer: 4,
    }).addTo(map);

    ROUTES.forEach((route, index) => {
      L.polyline(route, {
        pane: 'routes',
        color: index % 3 === 1 ? '#34d399' : '#2784ff',
        weight: 2,
        opacity: .78,
        dashArray: '6 7',
        lineCap: 'round',
      }).addTo(map);
    });
    markerRefs.current = ROUTES.map((route, index) => L.marker(route[0], {
      pane: 'vehicles',
      interactive: false,
      icon: L.divIcon({
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        html: `<span class="control-map__leaflet-vehicle control-map__leaflet-vehicle--${index % 3}"><span>➜</span></span>`,
      }),
    }).addTo(map));
    window.setTimeout(() => map.invalidateSize({ pan: false }), 0);
    return () => {
      cancelAnimationFrame(frameRef.current);
      map.remove();
      mapRef.current = null;
      markerRefs.current = [];
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const next = getLimits();
      limitsRef.current = next;
      setLimits(next);
      markerRefs.current.forEach((marker, index) => {
        if (index < next.vehicles) marker.addTo(mapRef.current);
        else marker.remove();
      });
      mapRef.current?.invalidateSize({ pan: false });
    };
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting && !document.hidden), { threshold: .08 });
    if (rootRef.current) observer.observe(rootRef.current);
    const visibility = () => setActive(!document.hidden && Boolean(rootRef.current?.getBoundingClientRect().bottom > 0 && rootRef.current?.getBoundingClientRect().top < innerHeight));
    document.addEventListener('visibilitychange', visibility);
    return () => {
      media.removeEventListener('change', updateMotion);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (!active || reducedMotion) return undefined;
    startedAtRef.current = performance.now();
    const animate = (now) => {
      const elapsed = elapsedRef.current + now - startedAtRef.current;
      const visibleCount = limitsRef.current.vehicles;
      markerRefs.current.slice(0, visibleCount).forEach((marker, index) => {
        const progress = ((elapsed / 36000) + index / visibleCount) % 1;
        marker.setLatLng(interpolate(ROUTES[index], progress));
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      elapsedRef.current += performance.now() - startedAtRef.current;
      cancelAnimationFrame(frameRef.current);
    };
  }, [active, reducedMotion]);

  useEffect(() => {
    if (!active || !mapRef.current) return undefined;
    const addEvent = () => {
      const index = eventIndexRef.current % EVENTS.length;
      const event = EVENTS[index];
      eventIndexRef.current += 1;
      const id = Date.now();
      const route = ROUTES[eventIndexRef.current % limitsRef.current.vehicles];
      const position = route[2];
      const item = { ...event, id, time: 'Now' };
      setAlerts((current) => [item, ...current].slice(0, 6));

      const icon = L.divIcon({
        className: '',
        iconSize: [150, 44],
        iconAnchor: [75, 48],
        html: `<article class="control-map__leaflet-popup control-map__leaflet-popup--${event.tone}"><b>${event.type}</b><small>${event.detail}</small></article>`,
      });
      const popup = L.marker(position, { pane: 'events', icon, interactive: false }).addTo(mapRef.current);
      popupRefs.current.push(popup);
      while (popupRefs.current.length > limitsRef.current.popups) popupRefs.current.shift()?.remove();
      window.setTimeout(() => {
        popup.getElement()?.classList.add('is-leaving');
        window.setTimeout(() => {
          popup.remove();
          popupRefs.current = popupRefs.current.filter((entry) => entry !== popup);
        }, 450);
      }, 3500);
    };
    const timer = window.setInterval(addEvent, 5500);
    return () => window.clearInterval(timer);
  }, [active]);

  useEffect(() => {
    while (popupRefs.current.length > limits.popups) popupRefs.current.shift()?.remove();
  }, [limits.popups]);

  return (
    <div ref={rootRef} className="control-map" aria-label="Interactive Control Tower fleet map">
      <nav className="control-map__nav" aria-label="Control Tower navigation">
        {[Grid2X2, Truck, MapPin, BarChart3, FileText, Settings].map((Icon, index) => <button key={index} type="button" aria-label={`Dashboard view ${index + 1}`} className={index === 0 ? 'is-active' : ''}><Icon /></button>)}
      </nav>
      <header className="control-map__metrics">
        <Metric Icon={Truck} label="Total Vehicles" value="1,048" />
        <Metric Icon={Gauge} label="Active Trips" value="230" />
        <Metric Icon={Wrench} label="Service Due Soon" value="18" tone="red" />
        <Metric Icon={Bell} label="Alerts" value="24" tone="amber" />
      </header>
      <main className="control-map__live">
        <div ref={mapNodeRef} className="control-map__leaflet" />
      </main>
      <aside className="control-map__alerts" aria-label="Live alerts">
        <header><strong>Live Alerts</strong><span>{alerts.length}/6</span></header>
        <div>
          {alerts.map(({ id, type, detail, tone, Icon, time }) => (
            <article key={id} className={`control-map__alert control-map__alert--${tone}`}>
              <span><Icon /></span><div><strong>{type}</strong><small>{detail}</small></div><time>{time}</time>
            </article>
          ))}
        </div>
        <footer><Navigation /> Live fleet updates</footer>
      </aside>
      {!active && <span className="sr-only">Map animation paused</span>}
    </div>
  );
}
