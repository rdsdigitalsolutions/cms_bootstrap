import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Text } from '@nextui-org/react';

import Layout from '../../components/layout'

export default function ComponentHandler({ locale }) {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true}>
          <Text h1 size={110} css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%" }} weight="bold">{t('settings_title')}</Text>
          <Text h6>{t('global_test')}</Text>
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }) {
  const translations = (await serverSideTranslations(locale, ['common']))

  return {
    props: { ...translations, locale },
  }
}
