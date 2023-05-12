import { SessionProvider } from "next-auth/react"
import { SSRProvider } from 'react-bootstrap';
import { useRouter } from "next/router";
import React from 'react';

import Layout from "@/components/Layout";

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()
  
  const layoutDisable = router.pathname.startsWith('/signin')
  const LayoutComponent = layoutDisable?React.Fragment:Layout
  
  return (
    <SessionProvider session={session}>
      <SSRProvider>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </SSRProvider>
    </SessionProvider>
  )
}
