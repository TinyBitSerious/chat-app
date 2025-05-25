import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ClothingSite from './ClothingSite'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClothingSite />
  </React.StrictMode>
)
const { useState, useEffect } = React

const clothes = [
  {
    name: "VoidTech Hoodie",
    price: "$85",
    img: "/images/voidtech-hoodie.png",
  },
  {
    name: "DreamHack Cargo",
    price: "$70",
    img: "/images/dreamhack-cargo.png",
  },
  {
    name: "404 Mesh Shirt",
    price: "$55",
    img: "/images/404-mesh.png",
  },
]

function ClothingSite() {
  return React.createElement(
    'div',
    { style: { backgroundColor: 'black', minHeight: '100vh', color: 'white', fontFamily: 'monospace' } },
    React.createElement('header', { style: { display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #333' } },
      React.createElement('div', { style: { fontSize: '1.5rem', letterSpacing: '0.2rem' } }, 'AURA'),
      React.createElement('nav', { style: { display: 'flex', gap: '1rem', alignItems: 'center' } },
        React.createElement('input', { placeholder: 'search drop...', style: { backgroundColor: '#111', color: 'white', border: '1px solid #444', padding: '0.3rem 0.5rem', fontSize: '0.9rem' } }),
        React.createElement('div', { style: { cursor: 'pointer' } }, '🛒'),
        React.createElement('div', { style: { cursor: 'pointer' } }, '☰')
      )
    ),
    React.createElement('main', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1rem', padding: '1rem' } },
      clothes.map((item, i) =>
        React.createElement('div', { key: i, style: { backgroundColor: '#111', borderRadius: '1rem', border: '1px solid #333', overflow: 'hidden', boxShadow: '0 0 10px #000' } },
          React.createElement('img', { src: item.img, alt: item.name, style: { width: '100%', height: '250px', objectFit: 'cover' } }),
          React.createElement('div', { style: { padding: '0.8rem' } },
            React.createElement('div', { style: { fontSize: '1.1rem', marginBottom: '0.3rem' } }, item.name),
            React.createElement('div', { style: { color: '#888', fontSize: '0.9rem' } }, item.price),
            React.createElement('button', { style: { marginTop: '0.6rem', width: '100%', backgroundColor: 'white', color: 'black', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' } }, 'add to ritual')
          )
        )
      )
    ),
    React.createElement('footer', { style: { padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#666', borderTop: '1px solid #333' } }, '© 2025 AURA. no gods no masters')
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(ClothingSite))
