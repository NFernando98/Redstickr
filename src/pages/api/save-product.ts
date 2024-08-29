import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase';
import { addDoc, collection } from '@firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { productName, expirationDate, category } = req.body;

    try {
      await addDoc(collection(db, 'products'), {
        productName,
        expirationDate,
        category,
      });

      return res.status(200).json({ message: 'Product saved successfully' });
    } catch (error) {
      console.error('Error saving product: ', error);
      return res.status(500).json({ error: 'Failed to save product' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
