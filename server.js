const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post('/reserve', (req, res) => {
  const { name, phone, email, date, time, note } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'wendy021004@naver.com',
    subject: '새 예약 알림 - 모루몰루',
    text: `
      이름: ${name}
      연락처: ${phone}
      이메일: ${email}
      예약 날짜: ${date}
      예약 시간: ${time}
      요청 사항: ${note || '없음'}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.error(error);
      return res.status(500).send('이메일 발송 실패');
    }
    res.send('예약이 성공적으로 접수되었습니다.');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중 (포트 ${PORT})`);
});
