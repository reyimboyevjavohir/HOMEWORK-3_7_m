import * as nodemailer from 'nodemailer';

async function test() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'sotimovshixnazar8178@gmail.com', // o'zgartiring
      pass: 'ovab bgjo snnp cxwx', // App Password
    },
  });

  try {
    await transporter.verify();
    console.log('✅ Ulandi!');
  } catch (err) {
    console.error('❌ Xato:', err.message);
  }
}

test();
