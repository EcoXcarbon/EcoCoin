import { db } from './firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const snap = await db.collection('ecoContributions').get();
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, contributions: data });
    } catch (err) {
      console.error('🔥 GET Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, ecoPoints, verified, adminNote } = body;

      if (!id || ecoPoints === undefined) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const ref = db.collection('ecoContributions').doc(id);
      await ref.update({
        ecoPoints,
        verified: verified ?? true,
        adminNote: adminNote || '',
      });

      return res.status(200).json({ success: true, message: 'Updated successfully' });
    } catch (err) {
      console.error('🔥 PATCH Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
