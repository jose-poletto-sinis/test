import React from 'react';
import { Link, useLocation } from 'react-router';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/local-data', label: 'Local Data' },
  { to: '/atributos', label: 'Atributos' },
  { to: '/kendo', label: 'Kendo' },
  { to: '/updateatributo', label: 'Update Atributo' },
  // Agrega más rutas si lo necesitas
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav style={{
      display: 'flex',
      gap: 16,
      padding: '12px 24px',
      background: '#f5f5f5',
      borderBottom: '1px solid #ddd',
      alignItems: 'center',
      marginBottom: 24,
    }}>
      {navLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          style={{
            color: location.pathname === link.to ? '#1976d2' : '#333',
            textDecoration: 'none',
            fontWeight: location.pathname === link.to ? 'bold' : 'normal',
            fontSize: 16,
            padding: '4px 10px',
            borderRadius: 4,
            background: location.pathname === link.to ? '#e3f2fd' : 'transparent',
            transition: 'background 0.2s',
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
