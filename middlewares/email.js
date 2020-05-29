const nodemailer = require('nodemailer');

module.exports = (data) => {
    let transporter = nodemailer.createTransport({
        host: 'bootwal.com',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    
    let mailoptions = {
        from: process.env.EMAIL_USERNAME,
        to: data.email,
        subject: data.subject,
        text: data.body
    }
    
    
    transporter.sendMail(mailoptions, (error, info) => {
        if (error){
            throw error
        }
        console.log('Message sent to: '+ data.email +'. Please check email')
    })
}






