import Head from 'next/head'
import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Text, Table, Grid, Input, Button, Loading } from '@nextui-org/react';
import { getAll } from '../../repository/product'

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./../api/auth/[...nextauth]"

import Layout from '../../components/layout'

export default function ComponentHandler({ locale, originalProducts }) {
  const { t } = useTranslation('common');

  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(originalProducts);

  const handleReset = () => {
    setProcessing(true);
    setSearchTerm('');
    setProcessing(false);
    setProducts(originalProducts);
  }

  const handleSearch = () => {
    setProcessing(true);

    fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/product?seach-term=${searchTerm}`, {
      method: 'GET',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'same-origin',
    })
      .then((response) => response.json())
      .then((data) => {
        setProcessing(false);
        if (data) setProducts(data);
      })
      .catch((e) => console.log)
  }

  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true}>

        <Grid.Container gap={4} justify="center">
          <Grid xs={12} justify="center">
            <Text h1 size={60} css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%" }} weight="bold">{products.length} {t('product_title')}</Text>
          </Grid>
          <Grid xs={5} justify="center">
            <Input
              aria-label='searchTerm'
              name='searchTerm'
              size="md"
              fullWidth={true}
              type="text"
              clearable
              underlined
              labelPlaceholder={t('product_search')}
              initialValue={searchTerm}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              disabled={processing}
            />
            <Button auto flat color="success" onClick={() => handleSearch()}>{t('global_search')}</Button>
            <Button auto flat color="warning" onClick={() => handleReset()}>{t('global_reset')}</Button>
          </Grid>
          <Grid xs={12} md={12} justify="center">
            { processing && <Loading type="points" color="currentColor" size="sm" /> }
            { !processing && products.length > 0 && <Table
              lined
              color="secondary"
              aria-label="table"
              css={{
                height: "auto",
                minWidth: "100%",
              }}
            >
              <Table.Header>
                <Table.Column>{t('product_table_price')}</Table.Column>
                <Table.Column>{t('product_table_title')}</Table.Column>
                <Table.Column>{t('product_table_description')}</Table.Column>
              </Table.Header>
              <Table.Body>
                {products.map((product, index) => {
                  return <Table.Row key={index}>
                    <Table.Cell>{product.price.toFixed(2)}</Table.Cell>
                    <Table.Cell>{product.title}</Table.Cell>
                    <Table.Cell>{product.description.slice(0, 100)}...</Table.Cell>
                  </Table.Row>
                })}
              </Table.Body>
              <Table.Pagination
                shadow
                noMargin
                align="center"
                rowsPerPage={10}
              // onPageChange={(page) => console.log({ page })}
              />
            </Table>}
          </Grid>

        </Grid.Container>

      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions)

  const originalProducts = await getAll({ userId: session.user.id });

  return {
    props: { ...translations, locale, originalProducts },
  }
}
