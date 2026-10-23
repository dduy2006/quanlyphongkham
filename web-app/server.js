const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM patients');
    let html = `<h1>Hệ Thống Quản Lý Phòng Khám (Đề 8)</h1>`;
    html += `<h3>Danh sách bệnh nhân:</h3><ul>`;
    rows.forEach(p => {
      html += `<li>${p.name} - ${p.phone} - Lịch khám: ${p.appointment_date}</li>`;
    });
    html += `</ul><br><form method="POST" action="/add">
      Tên: <input type="text" name="name" required /> 
      SĐT: <input type="text" name="phone" required /> 
      Ngày khám: <input type="date" name="appointment_date" required />
      <button type="submit">Thêm bệnh nhân</button>
    </form>`;
    res.send(html);
  } catch (err) {
    res.send("Đang kết nối CSDL hoặc chưa khởi tạo bảng: " + err.message);
  }
});

app.post('/add', async (req, res) => {
  const { name, phone, appointment_date } = req.body;
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS patients (id SERIAL PRIMARY KEY, name VARCHAR(100), phone VARCHAR(20), appointment_date DATE)');
    await pool.query('INSERT INTO patients (name, phone, appointment_date) VALUES ($1, $2, $3)', [name, phone, appointment_date]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Clinic app listening on port ${port}`);
});