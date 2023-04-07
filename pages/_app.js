import { SSRProvider } from 'react-bootstrap';
import { useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  
  return (
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  )
}
