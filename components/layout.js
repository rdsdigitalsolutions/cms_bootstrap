import { useTranslation } from 'next-i18next'
import { useSession } from "next-auth/react"

import { useRouter } from 'next/router';
import Footer from './footer'
import Navbar from './navbar'
import { Switch, useTheme, Container, Row, Col, Button, Link, Text, Card, Radio } from '@nextui-org/react';

import styles from '../styles/Home.module.css'

export default function Layout({ children, locale }) {
  const { t } = useTranslation('common')
  const { data: session, status } = useSession()
  const router = useRouter();

  return (
    <Container fluid>
      <main>
        <Navbar locale={locale}/>
        { status !== 'authenticated' && <main className={styles.main}>
          <h1 className={styles.title}>
          { `${t('welcome')} ${process.env.NEXT_PUBLIC_APP_NAME}` }
          </h1>

          <p>{ t('test') }</p>
        </main> }

        {status === 'authenticated' && children}
        <Footer />
      </main>
    </Container>
  )
}
