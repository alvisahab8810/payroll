


// import formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';
// import dbConnect from '../../../utils/dbConnect';
// import Application from '../../../models/Application';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, message: 'Method Not Allowed' });
//   }

//   const form = formidable({
//     multiples: false,
//     uploadDir: path.join(process.cwd(), '/public/uploads'),
//     keepExtensions: true,
//   });

//   // ✅ Ensure uploads folder exists
//   fs.mkdirSync(form.uploadDir, { recursive: true });

// form.parse(req, async (err, fields, files) => {
//   if (err) {
//     console.error('Formidable error:', err);
//     return res.status(500).json({ success: false, message: 'File upload failed' });
//   }

//   console.log('Files received:', files);

//   let { appliedPosition, name, email, mobile, portfolioLink } = fields;

//   appliedPosition = Array.isArray(appliedPosition) ? appliedPosition[0] : appliedPosition;
//   name = Array.isArray(name) ? name[0] : name;
//   email = Array.isArray(email) ? email[0] : email;
//   mobile = Array.isArray(mobile) ? mobile[0] : mobile;
//   portfolioLink = Array.isArray(portfolioLink) ? portfolioLink[0] : portfolioLink;

//   let resumePath = '';

//   if (files.resume) {
//     // Check if resume is an array (multiple files) or single object
//     const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;

//     if (file && file.filepath) {
//       //this is update const originalName = file.originalFilename || 'resume.pdf';
//       // const originalName = (file.originalFilename || 'resume.pdf').replace(/\s+/g, '_');
//       const originalName = (file.originalFilename || 'resume.pdf').replace(/\s+/g, '_').replace(/[^\w.-]/g, '');


//       const newFilename = Date.now() + '-' + originalName;
//       const newPath = path.join(form.uploadDir, newFilename);

//       fs.renameSync(file.filepath, newPath);

//       resumePath = '/uploads/' + newFilename;
//     } else {
//       console.error('File object does not have filepath');
//     }
//   } else {
//     console.error('No resume file uploaded');
//   }

//   const newApp = new Application({
//     appliedPosition,
//     name,
//     email,
//     mobile,
//     portfolioLink,
//      resumePath: resumePath,  // <-- use resumePath here, not resumeUrl
//   });

//   await newApp.save();

//   return res.status(200).json({
//     success: true,
//     message: 'Application submitted successfully',
//      resumePath: resumePath,  // <-- use resumePath here, not resumeUrl
//   });
// });


// }




import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../../utils/dbConnect';
import Application from '../../../models/Application';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), '/public/uploads'),
    keepExtensions: true,
  });

  fs.mkdirSync(form.uploadDir, { recursive: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ success: false, message: 'File upload failed' });
    }

    let { appliedPosition, name, email, mobile, portfolioLink } = fields;

    appliedPosition = Array.isArray(appliedPosition) ? appliedPosition[0] : appliedPosition;
    name = Array.isArray(name) ? name[0] : name;
    email = Array.isArray(email) ? email[0] : email;
    mobile = Array.isArray(mobile) ? mobile[0] : mobile;
    portfolioLink = Array.isArray(portfolioLink) ? portfolioLink[0] : portfolioLink;

    let resumePath = '';

    if (files.resume) {
      const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;

      if (file && file.filepath) {
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const MIN_SIZE = 1 * 1024;        // 1KB
        const ALLOWED_TYPES = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        // Validate size
        if (file.size > MAX_SIZE) {
          return res.status(400).json({
            success: false,
            message: 'Resume must be under 5MB.',
          });
        }

        if (file.size < MIN_SIZE) {
          return res.status(400).json({
            success: false,
            message: 'Resume file is too small or empty.',
          });
        }

        // Validate type
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: 'Only PDF or Word documents are allowed.',
          });
        }

        const originalName = (file.originalFilename || 'resume.pdf')
          .replace(/\s+/g, '_')
          .replace(/[^\w.-]/g, '');

        const newFilename = Date.now() + '-' + originalName;
        const newPath = path.join(form.uploadDir, newFilename);

        fs.renameSync(file.filepath, newPath);
        resumePath = '/uploads/' + newFilename;
      } else {
        return res.status(400).json({ success: false, message: 'Resume file is invalid.' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'No resume uploaded.' });
    }

    const newApp = new Application({
      appliedPosition,
      name,
      email,
      mobile,
      portfolioLink,
      resumePath,
    });

    await newApp.save();

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      resumePath,
    });
  });
}
