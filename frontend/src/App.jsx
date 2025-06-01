import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './Layout';
import './index.css'

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
