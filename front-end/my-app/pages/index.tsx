import Image from 'next/image'
import styles from '../styles/page.module.css'
import { Button } from '@nextui-org/react';
import { Input, Spacer} from "@nextui-org/react";
import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next';
import { useState } from 'react';



export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login  = async () => {
    console.log("login")
    console.log(getCookies())
    fetch("http://localhost:3000/api/test", {
      method: "POST",
      headers: {'Content-Type': 'application/json','Accept': 'application/json'},
      body: JSON.stringify({
        login: username,
        password: password
      })
    }).then(response => response.json())
    .then(data => {
      console.log(data)
      if(data.name === "John Doe") {
        setCookie("test", "true");
        window.location.reload();
      }
    })
  }
  
  const loginViaGoogle  = () => {
    console.log("loginViaGoogle")
  }

  const handleLoginChange = (e:any) => {
    setUsername(e.target.value)
  }
  const handlePassChange = (e:any) => {
    setPassword(e.target.value)
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Zaloguj się</h1>
      <Spacer y={1.2} />
      <Input labelPlaceholder="Login" status='default' width='250px' onChange={handleLoginChange}/>
      <Spacer y={1.2} />
      <Input.Password labelPlaceholder="Password" width='250px' onChange={handlePassChange}/>
      <Spacer y={1.2} />
      <Button onClick={login}>Login</Button>
      <Spacer y={1.2} />
      <Button onClick={loginViaGoogle} disabled>Login via Google</Button>
    </main>
  )
}

export const getServerSideProps = async ( context: NextPageContext, req: NextApiRequest, res: NextApiResponse ) => {
    //Check if user is logged in and
    let cookies = getCookies(context)
    console.log(cookies.test)
    console.log(res)
    if(cookies.test != undefined) {
      // res.setHeader('location', '/test')
      // res.writeHead(301, { Location: '/test' })
      // res.end()
      return {redirect: {
        permanent: false,
        destination: '/dashboard'
      }}
    }
    return { props: {} };
  };
