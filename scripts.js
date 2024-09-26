
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer');


require('dotenv').config()

const app = express();

let me = {
    user: process.env.USER,
    pass:process.env.PASS
};
let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
     ...me
    }
});


let mailOptions = {
    from: '',
    to:me.user,
    subject: 'Hola',
    text: 'Hola mundo'
};

app.use(express.json())

app.use(express.urlencoded({ extended: false }));

app.use(cors({
 origin:'*'
}))

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    next(); 
})
app.set('PORT', 3000 || process.env.PORT)

app.post('/send-email',(req,res) =>{
    const {name,from,subject,description} = req.body;

    mailOptions = {
        ...mailOptions,
        from,
        subject:`${subject} - ${name}`,
        text:`De: ${from}\n${description}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.status(500).json({
                message: error,
                code:500
            });
        } else {
            res.status(200).json({
                message: 'Email enviado: ' + info.response,
                code:200
            });
        }
    });
})

app.listen(app.get('PORT'),() =>{
    console.log(`Server Listing On Port ${app.get('PORT')}...`)
})