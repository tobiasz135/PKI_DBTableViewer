import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/dist/client/components/headers";
import { getCookie, hasCookie, setCookie } from "cookies-next";

export default function handler (
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if(req.body?.login === 'admin' && req.body?.password === 'admin') {
        return res.status(200).json({ name: 'John Doe' })  
      }
    console.log(req.body)
    return res.status(401).json({ name: 'unauthorized' })  
  }