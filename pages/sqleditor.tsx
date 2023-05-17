import Image from 'next/image'
import styles from '../Styles/page.module.css'
import { Grid, Input, Loading, Spacer, Table} from "@nextui-org/react";
import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import { Navbar, Button, Link, Text, Card, Radio } from "@nextui-org/react";
import { Layout } from '../components/Layout';

import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    port: 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
});
async function executeQuery( query:any, values:any ) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}


export default function Home(props: any) {
  const [databases, setDatabases] = useState(props.databases);
  const [currentDb, setCurrentDb] = useState(props.currentDatabase);
  const [checked, setChecked] = useState("");

  const [columns, setColumns] = useState([] as string[]);
  const [data, setData] = useState([[]] as any);

  const [isLoading, setIsLoading] = useState(false);

  const [refreshHidden, setRefreshHidden] = useState(true);
  const [query, setQuery] = useState("");

  const [showErrorDiv, setShowErrorDiv] = useState(false);
  const [showSuccessDiv, setShowSuccessDiv] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const doQuery = () => {
    setRefreshHidden(true);
    setIsLoading(true);
    console.log("refreshing data");
    fetch("/api/sqleditor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //setRefreshHidden(false);
        if(!data.results || data.results.length == 0) {
          setColumns(["Table is empty"]);
          setData([[]]);
          if(data?.error){
            setShowErrorDiv(true);
            setError(data.error.sqlMessage);
          }
          return;
        }
        try{
          let cols = Object.keys(data?.results[0]);
          if(cols.length > 0) {
            setIsLoading(false);
            setColumns(cols);
            setData(data.results);
          }
        } catch (error) {
          setShowSuccessDiv(true);
          setSuccess(data?.results?.message);
        }

      }).then(() => {
        setIsLoading(false);
      });
  };

  const logout = () => {
    deleteCookie("test");
    window.location.href = "/";
  };

  return (
        <>
        <Layout>
          <Navbar isBordered variant={"sticky"}>
              <Navbar.Brand>
                  <Text b color="inherit" hideIn="xs">
                      Database Manager
                  </Text>
              </Navbar.Brand>
              <Navbar.Content hideIn="xs">
                  <Navbar.Link href="/dashboard">DB Viewer</Navbar.Link>
                  <Navbar.Link isActive href="/sqleditor">SQL editor</Navbar.Link>
              </Navbar.Content>
              <Navbar.Content>
                  <Navbar.Item>
                      <Button auto flat as={Link} href="#" onPress={logout}>
                          Logout
                      </Button>
                  </Navbar.Item>
              </Navbar.Content>
          </Navbar>
      </Layout>
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} md={10}>
              {showErrorDiv ?<Card css={{ maxH: "600px" }} color='error'>
                 <Button size='lg' color='error' bordered onPress={() => setShowErrorDiv(false)}>{error}</Button> 
              </Card>: ""}
              {showSuccessDiv ?<Card css={{ maxH: "600px" }} color='success'>
                  <Button size='lg' color='success' bordered onPress={() => setShowSuccessDiv(false)}>{success}</Button>
              </Card>: ""}
        </Grid>
        <Grid xs={12} md={10}>
            <Card css={{ maxH: "600px" }}>
                <Card.Body>
                    <Input width="100%" placeholder="SQL query" onChange={(e) => {setQuery(e.target.value); setShowErrorDiv(false)}} />
                    <Spacer y={1} />
                    <Button auto flat as={Link} onPress={doQuery} hidden={refreshHidden}>Execute query</Button>
                </Card.Body>
            </Card>
        </Grid>
        <Grid xs={12} md={10}>
            <Card>
                <Card.Body>
                    <Text h5>Table Data</Text>
                    {isLoading ? <Loading size="xl"/> : ""}

                    {columns.length > 0 ? <Table
                      aria-label="Example table with dynamic content"
                      css={{
                        height: "auto",
                        minWidth: "100%",
                      }}
                    >
                      <Table.Header>
                        {columns.map((e) => (
                          <Table.Column key={e}>{e}</Table.Column>
                        ))}
                      </Table.Header>
                      <Table.Body>
                        {columns[0] !== "Table is empty" ? data.map((e:any, idx:any) => (
                          <Table.Row key={idx}>
                            {columns.map((f, idx2) => (
                              <Table.Cell key={idx2}>
                                {e[f]}
                              </Table.Cell>
                            ))}
                          </Table.Row>
                        )) : <Table.Row><Table.Cell>Nothing to see here</Table.Cell></Table.Row>}
                      </Table.Body>
                    </Table>
                  : ""}
                </Card.Body>
            </Card>
        </Grid>
        </Grid.Container>
                    
      </>
    )
}

export const getServerSideProps = async ( context: NextPageContext, req: NextApiRequest, res: NextApiResponse ) => {
    //Check if user is logged in and
    //Get database info

    let cookies = getCookies(context);
    if(!cookies || !cookies["test"]) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    

    let results:any = [];
    results = await executeQuery("SELECT DATABASE();", [] as any);
    let currentDatabase = results[0]["DATABASE()"];
    results = await executeQuery("SHOW TABLES;", [] as any);
    let databases = [];
    for (let i = 0; i < results.length; i++) {
      databases.push(results[i][`Tables_in_${currentDatabase}`]);
    }

    return { props: {databases, currentDatabase} };
  };
