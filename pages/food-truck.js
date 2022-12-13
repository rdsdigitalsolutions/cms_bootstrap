import { useState, useMemo } from "react";
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Text, Grid, Card, Row, Button, Dropdown, Spacer, Col, Badge } from '@nextui-org/react';
import { aggregateFilters } from '../repository/food-truck'

import Layout from '../components/layout'

export default function ComponentHandler({ locale, foodTruckFilters }) {
  const { t } = useTranslation('common');

  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const [food, setFood] = useState(new Set());
  const [business, setBusiness] = useState(new Set());
  const [facility, setFacility] = useState(new Set());

  const selectedFood = useMemo(() => Array.from(food).join(", "), [food]);
  const selectedBusiness = useMemo(() => Array.from(business).join(", "), [business]);
  const selectedFacility = useMemo(() => Array.from(facility).join(", "), [facility]);

  const handleSearch = () => {
    setProcessing(true);

    const [currentFood] = food;
    const [currentBusiness] = business;
    const [currentfacility] = facility;

    fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/food-truck?food=${currentFood||''}&business=${currentBusiness||''}&facility=${currentfacility||''}`, {
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
        if (data) setResults(data);
      })
      .catch((e) => console.log)
  }

  return (
    <>
      <Head>
        <title>Food Truck Data</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true}>
        <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '7vw' }} weight="bold">{t('Food Truck')}</Text>
        <Text h4 css={{ fontSize: '2vw' }} weight="bold">{results.length > 0 && `${results.length} of `} {t('the best places in San Francisco')}</Text>

        <Grid.Container gap={2} justify="center">
          <Grid xs={12} md={8}>
            <Card>
              <Card.Body>

                <Grid.Container gap={2} justify="center">

                  <Grid xs={12} sm>
                    <Dropdown>
                      <Dropdown.Button bordered color="primary" css={{ tt: "capitalize", width: '100%' }}>
                        {selectedFood}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Multiple selection actions"
                        color="primary"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={food}
                        onSelectionChange={setFood}
                      >
                        <Dropdown.Item key=""> </Dropdown.Item>
                        { foodTruckFilters.food.map( (data) => <Dropdown.Item key={data}>{`${data.slice(0, 20)}${data.length > 20 ? '...' : ''}`}</Dropdown.Item> ) }
                      </Dropdown.Menu>
                    </Dropdown>
                  </Grid>

                  <Grid xs={12} sm>
                    <Dropdown>
                      <Dropdown.Button bordered color="primary" css={{ tt: "capitalize", width: '100%' }}>
                        {selectedBusiness}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Multiple selection actions"
                        color="primary"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={business}
                        onSelectionChange={setBusiness}
                      >
                        <Dropdown.Item key=""> </Dropdown.Item>
                        { foodTruckFilters.business.map( (data) => <Dropdown.Item key={data}>{`${data.slice(0, 20)}${data.length > 20 ? '...' : ''}`}</Dropdown.Item> ) }
                      </Dropdown.Menu>
                    </Dropdown>
                  </Grid>

                  <Grid xs={12} sm>
                    <Dropdown>
                      <Dropdown.Button bordered color="primary" css={{ tt: "capitalize", width: '100%' }}>
                        {selectedFacility}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Multiple selection actions"
                        color="primary"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={facility}
                        onSelectionChange={setFacility}
                      >
                        <Dropdown.Item key=""> </Dropdown.Item>
                        { foodTruckFilters.facility.map( (data) => <Dropdown.Item key={data}>{data}</Dropdown.Item> ) }
                      </Dropdown.Menu>
                    </Dropdown>
                  </Grid>

                  <Grid xs={12} sm>
                    <Button auto flat color="primary" css={{ width: '100%' }} onClick={() => handleSearch()}>{t('global_search')}</Button>
                  </Grid>

                </Grid.Container>

              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>

        <Grid.Container gap={2} justify="center">

          { results.map( (result, idex) => <Grid xs={12} sm={3} key={idex}>
            <Card isHoverable>

              <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                <Col>
                  <Spacer y={1} />
                  <Badge disableOutline isSquared color="primary" variant="bordered" content={result.FacilityType} size="sm">
                    <Card css={{ bgBlur: "#ffffff66" }} isBlurred >
                      <Card.Body >

                        <Text h3 color="black" weight="bold">
                          {result.Applicant}
                        </Text>
                        <Text h4 color="white">
                          {(result.FoodItems || '').split(':').join(', ')}
                        </Text>

                      </Card.Body>
                    </Card>
                  </Badge>
                </Col>
              </Card.Header>

              <Card.Image
                src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/bg-place.jpeg`}
                objectFit="cover"
                width="100%"
                height={340}
                alt="Card image background"
              />
              <Card.Footer
                isBlurred
                css={{
                  // position: "absolute",
                  bgBlur: "#ffffff66",
                  borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                  bottom: 0,
                  zIndex: 1,
                }}
              >
                <Row>
                  <Col>
                    <Spacer y={0.5} />
                    <Text h4 color="#000" size={16}>
                    {result.Address}
                    </Text>
                  </Col>
                  <Col>
                    <Row justify="flex-end">
                      <Button flat auto rounded color="primary">
                        <Text
                          css={{ color: "inherit" }}
                          size={12}
                          weight="bold"
                          transform="uppercase"
                        >
                          {/* @todo: connect google maps here. */}
                          Open Maps
                        </Text>
                      </Button>
                    </Row>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>

          </Grid> ) }

        </Grid.Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }) {
  const translations = (await serverSideTranslations(locale, ['common']))
  const foodTruckFilters = await aggregateFilters();

  return {
    props: { ...translations, locale, foodTruckFilters },
  }
}
