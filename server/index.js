import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import Mysql from 'mysql2'
import nodemailer from 'nodemailer'
import ratelimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config({ path: './database.env' });
import bcrypt from 'bcryptjs'
import multer from 'multer'
import path from "path"

const port = 5000
const app = express();
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // <- Exact origin of your React app
    credentials: true                // <- Allow cookies to be sent
}));
app.use(cookieParser())
app.use(bodyParser.json())

const storage = multer.diskStorage({
    destination: "upload/",
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + file.originalname;
        cb(null, unique)
    }
})
const uploads = multer({ storage })
app.use('/upload', express.static('upload'));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "yournotesapp8@gmail.com",
        pass: 'xvhukglxqeflozfg',
    },
});

const otpLimiter = ratelimit({
    windowMs: 60 * 1000,
    max: 3,
    message: "Too many OTP requests. Try again Later.",
});

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const db1 = Mysql.createConnection({
    host: process.env.DB1_HOST,
    user: process.env.DB1_USER,
    password: process.env.DB1_PASSWORD,
    database: process.env.DB1_NAME,
    port: process.env.DB1_PORT,
    ssl: {
    rejectUnauthorized: false
  }

});
app.post('/send-otp', otpLimiter , async(req,res)=>{
    const {email} = req.body;
    if(!isValidEmail(email)){
        return res.status(400).json({message:"Invalid email format"});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try{
        await transporter.sendMail({
            from : 'sureshkumarsoni77913@gmail.com',
            to: email,
            subject: "Your OTP code",
            text: `Your OTP is: ${otp}`,
        });

        await db1.execute('INSERT INTO emailotps(emailo, otp) VALUES(?,?)', [email, otp]);

        res.json({message: "OTP sent successfully"});
    } catch(err){
        res.status(500).json({message:" Failed to send OTP", error: err.message});
    }
});

app.post('/verify-otp', async(req,res)=>{
    const {email, otp} = req.body;
     db1.execute('SELECT * FROM emailotps WHERE emailo=? AND otp=? ORDER BY created_at DESC LIMIT 1', [email, otp], (err,results) =>{
        if(err){
            return res.status(500).send("internal server errorr");
        }
        if(results.length === 0){
            return res.status(401).send("invalid otp");
        }

        const otpEntry= results[0];
        const otpTime = new Date(otpEntry.created_at);
    const now = new Date();
    const diffMinutes = (now -otpTime) / (1000 * 60);

    if(diffMinutes >5){
        db1.execute("DELETE FROM emailotps WHERE emailo=?",[email], (errexpi)=>{
            if(errexpi){
            console.error("error in deleting expiring otp");
            }
            return res.status(400).json({message:"OTP expired"});
        });
    }

    db1.execute("DELETE FROM emailotps WHERE emailo=?",
        [email],
        (deleteerr)=>{
            if(deleteerr){
                return res.status(500).send("error cleaning up OTP");
            }
            return res.status(200).send("OTP Verified Successfully");
        }
    );
    });
});





app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    db1.query('SELECT 1 FROM user WHERE emailUser = ?', [email], (err, results) => {
  if (err) return res.status(500).json({message:'Database error'});

  if (results.length > 0) {
    return res.status(200).json({message:'This email is already registered!. Please Login instead.'});
  } else {
    db1.query('INSERT INTO user(emailUser, passwordUser) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({message:'Database error'});;
      return res.status(200).json({message:'Signup successful!'});
    });
  }
});

})
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    // console.log(req.body);

    const sql = 'select * from user where emailUser = ?'
    const valuess = [email]
    db1.query(sql, valuess, async (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Internal error" });
        }

        if (result.length === 0) {
            // No user found
            return res.status(401).json({ message: "User not found" });
        }

        const user =  result[0];

        try {
            const isPasswordMatch =   bcrypt.compareSync(password, user.passwordUser);

            if (isPasswordMatch) {

                const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN);
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'Lax',
                    secure: false // Make true only in production with HTTPS
                }).json({ message: 'Login successful' });



            } else {
                return res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (compareError) {
            return res.status(500).json({ message: "Internal server error during password comparison" });
        }
    })


})


app.post('/dashboard/create', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Token missing' });

    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        const userId = decoded.userId;
        const { text, title, action } = req.body;
        if (action === 'create') {
            const sql = 'INSERT INTO notes(content, title, user_id) VALUES (?, ?, ?)';
            const values = [text, title, userId];
            db1.query(sql, values, (err, result) => {
                if (err) {
                    console.log("data isn't stored")
                }

                return res.status(200).json({ message: 'notes saved' })
            })
        } else {
            return res.status(401).json({ message: 'error comes' });
        }

    })
})
app.get('/dashboard/save', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'token not found' });
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoder) => {
        if (err) return res.status(403).json({ message: 'not verified' });
        const userId = decoder.userId;
        const query = 'select content, title from notes where user_id=?'
        db1.execute(query, [userId], (errr, results) => {
            if (errr) return res.status(500).json({ message: 'Database error' });
            else res.json(results);
        })
    })

});
app.post('/dashboard/save', (req, res) => {
    const { c, t, action } = req.body;
    console.log(c, t);
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'token not found' });
    jwt.verify(token, process.env.JWT_TOKEN, (errrr, decoder) => {
        if (errrr) return res.status(403).json({ message: 'not verified' });
        const userId = decoder.userId;
        if (action === 'delete') {
            const query = 'delete from notes where content=? and title=? and user_id=?'
            db1.query(query, [c, t, userId], (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                else return res.status(200).json({ message: 'Notes deleted' });
            })
        }
        else if (action === 'favourite') {
            const query2 = 'update notes set favourite= true where content=? and title=? and user_id=?'
            db1.query(query2, [c, t, userId], (errr, results) => {
                if (errr) return res.status(500).json({ message: 'Database error' });
                else return res.status(200).json({ message: 'database marked' });
            })
        } else if (action === 'edit') {
            const sql = 'update notes set edit=? where content=? and title=? and user_id=?'
            db1.query(sql, [true , c, t, userId], (err, result) => {
                if (err) {
                    return console.log("data isn't stored");
                }
                return res.status(200).json({ message: 'edit update' });
            })
        }
        else if (action === 'clearEdit') {
            const sql = 'UPDATE notes SET edit = false WHERE user_id = ?';
            db1.query(sql, [userId], (err, result) => {
                if (err) return res.status(500).json({ message: 'Failed to clear edit flag' });
                return res.status(200).json({ message: 'Edit flag cleared' });
            });
        }
        else {
            return res.status(401).json({ message: 'error comes' });
        }

    })
})
app.post("/dashboard/profile", uploads.single('profile'), (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Token not found" })
    }
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) return res.status(401).json({ message: "you have no rights" })
        const file = req.file?.filename;
        const userid = decoded.userId;
        const sql = 'update user set profilePic = ? where id = ?'
        db1.query(sql, [file, userid], (errr, result) => {
            if (errr) return res.status(500).json({ message: "database error" })
            res.json({ message: 'Picture saved', file });
        })
    })
})
app.get('/dashboard/profile', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Token missing' });

    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        const userId = decoded.userId;
        const sql = 'SELECT profilePic , emailUser FROM user WHERE id = ?';
        db1.query(sql, [userId], (errr, result) => {
            if (errr || result.length === 0) return res.status(500).json({ message: 'Failed to retrieve image' });
            res.json({ profilePic: result[0].profilePic, emailUser: result[0].emailUser });
        });
    });
});
app.post("/logout", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "token not found" })
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) return res.status(401).json({ message: "user not found" })
        const userid = decoded.userId;
        const sql = `delete from user where id = ?`
        const sql2 = `delete from notes where user_id = ?`

        db1.query(sql, [userid], (errr, result) => {
            if (errr) return res.status(500).json({ message: "database error" })
            db1.query(sql2, [userid], (errr, result) => {
                if (errr) return res.status(500).json({ message: "database error" })
                res.clearCookie('token')
                res.json({ message: 'User account deleted successfully' });
            })
        })

    })
})

app.get('/dashboard/favourite', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'token not found' });
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoder) => {
        if (err) return res.status(403).json({ message: 'not verified' });
        const userId = decoder.userId;
        const isFavourite = decoder.favourite;
        const query = 'select content, title from notes where favourite=? and user_id=?'
        db1.query(query, [true, userId], (errr, results) => {
            if (errr) return res.status(500).json({ message: 'Database error' });
            else res.json(results);
        })
    })

})

app.post('/dashboard/favourite', (req, res) => {
    const token = req.cookies.token;
    console.log(req.body)

    const { c, t } = req.body;
    if (!token) return res.status(401).json({ message: 'token not found' });
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoder) => {
        if (err) return res.status(403).json({ message: 'not verified' });
        const userId = decoder.userId;
        const isFavourite = decoder.favourite;
        const query = 'update notes set favourite=? where user_id=? and content=? '
        db1.query(query, [false, userId, c], (errr, results) => {
            if (errr) return res.status(500).json({ message: 'Database error' });
            else res.status(200).json({ message: 'notes unmarked' });
        })
    })

})
app.get("/dashboard/create", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'token not found' });
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoder) => {
        if (err) return res.status(403).json({ message: 'not verified' });
        const userId = decoder.userId;
        const query = 'select content, title from notes where edit=? and user_id=?'
        db1.query(query, [true, userId], (errr, results) => {
            if (errr) return res.status(500).json({ message: 'Database error' });
            res.json(results);
        })
    })
})

app.post('/feedback',(req,res)=>{
    const {e , f} = req.body;
    const sql='insert into feed(feedbacks, email) values(?,?)'
    db1.query(sql,[f, e],(err,result)=>{
        if(err){
          return  res.status(500).json({message:'Database error'})
        }
        res.status(200).json({message:'Done'})
    })
})
app.listen(port, () => {
    console.log("server is running")
})