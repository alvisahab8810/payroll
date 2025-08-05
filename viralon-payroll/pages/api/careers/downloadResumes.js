
// // pages/api/careers/downloadResumes.js
// import fs from 'fs';
// import path from 'path';
// import archiver from 'archiver';
// import { promisify } from 'util';
// import Application from '../../../models/Application';
// import dbConnect from '../../../utils/dbConnect';

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   try {
//     const { appliedPosition, startDate, endDate } = req.body;

//     let query = {};
//     if (appliedPosition) query.appliedPosition = appliedPosition;
//     if (startDate && endDate) {
//       query.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     const applications = await Application.find(query);

//     if (applications.length === 0) {
//       return res.status(404).json({ message: 'No resumes found for filter.' });
//     }

//     const zip = archiver('zip', { zlib: { level: 9 } });

//     res.setHeader('Content-Type', 'application/zip');
//     res.setHeader('Content-Disposition', 'attachment; filename=resumes.zip');

//     zip.pipe(res);

//     applications.forEach((app) => {
//       if (app.resumePath) {
//         const filePath = path.join(process.cwd(), 'public', app.resumePath);
//         if (fs.existsSync(filePath)) {
//           zip.file(filePath, { name: path.basename(filePath) });
//         }
//       }
//     });

//     await zip.finalize();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// }
