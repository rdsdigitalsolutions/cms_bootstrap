import { useState } from 'react';
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_getServerSession } from "next-auth/next"
import { useTranslation } from 'next-i18next'
import { Card, Grid, Input, Text, Button, Loading, Avatar } from '@nextui-org/react';
import { FaChevronRight } from "react-icons/fa";

import { authOptions } from "./../api/auth/[...nextauth]"
import Layout from '../../components/layout'

export default function ComponentHandler({ locale, session }) {
  const { t } = useTranslation('common');

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const [fullName, setFullName] = useState(session.user.name);
  const [username, setUsername] = useState(session.user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleForm = () => {
    setProcessing(true);
    setPassword('');
    setConfirmPassword('');

    if ((password || confirmPassword) && password !== confirmPassword) {
      setProcessing(false);
      setError(t('errors_paswrod_mismatch'))
    }

    // @todo: handle user update.
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true} >
        <Grid.Container gap={4} justify="center">
          <Grid xs={12} md={6} >
            <Card>

              <Card.Header>
                <Grid.Container css={{ pl: "$6" }}>
                  <Grid xs={12} justify="center">
                    <Avatar
                      bordered
                      color="primary"
                      size="xl"
                      src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${session.user.image}`}
                    />
                  </Grid>
                  <Grid xs={12} justify="center">
                    <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '4vw' }} weight="bold">{t('account_title')}</Text>
                  </Grid>
                </Grid.Container>
              </Card.Header>

              <Card.Body>
                <Grid xs={12}>
                  <Input
                    name='fullName'
                    size="md"
                    fullWidth={true}
                    type="text"
                    clearable
                    underlined
                    labelPlaceholder={t('global_full_name')}
                    // contentLeft={<FaUserCircle />}
                    initialValue={fullName}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    disabled={processing}
                  />
                </Grid>
                <Grid xs={12}>
                  <Input
                    name='username'
                    size="md"
                    fullWidth={true}
                    type="email"
                    clearable
                    underlined
                    labelPlaceholder={t('global_username')}
                    // contentLeft={<FaUserCircle />}
                    initialValue={username}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={processing}
                  />
                </Grid>
                <Grid xs={12}>
                  <Input.Password
                    name='password'
                    size="md"
                    fullWidth={true}
                    underlined
                    labelPlaceholder={t('global_password')}
                    // contentLeft={<FaLock />}
                    initialValue={password}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={processing}
                  />
                </Grid>
                <Grid xs={12}>
                  <Input.Password
                    name='confirmPassword'
                    size="md"
                    fullWidth={true}
                    underlined
                    labelPlaceholder={t('global_password_confirmation')}
                    // contentLeft={<FaLock />}
                    initialValue={password}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={processing}
                  />
                </Grid>

                {error && <Grid xs={12}>
                  <Text h6 color="error">{error}</Text>
                </Grid>}
              </Card.Body>

              <Card.Footer>
                <Grid xs={12} justify="right">
                  {/* <Button auto flat onClick={handleForm} disabled={processing}> */}
                  <Button auto flat onClick={handleForm} disabled={true}>
                    {processing ? <Loading type="points" color="currentColor" size="sm" /> : <>{t('global_save')} <FaChevronRight /></>}
                  </Button>
                </Grid>
              </Card.Footer>

            </Card>
          </Grid>
        </Grid.Container>
      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions)

  return {
    props: { ...translations, locale, session },
  }
}
