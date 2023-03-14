import { useContext, useEffect, useState } from 'react';
import { globalContext } from './store/globalState'
import { Container } from '@mui/material';
import CryptoTable from './components/CryptoTable';
function App() {
  const { setCrypto } = useContext(globalContext)

  useEffect(() => {
    const savedCryptoData = JSON.parse(localStorage.getItem("crypto-data") || '[]')
    setCrypto(savedCryptoData)
  }, [])

  return (
    <Container maxWidth="lg">
      <CryptoTable />
    </Container>
  );
}

export default App;
