const nodemailer = require('nodemailer');

module.exports = (data) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    })
    
    let mailoptions = {
        from: 'Sandeep Pokhrel',
        to: data.email,
        subject: data.subject,
        text: data.body
    }
    
    
    transporter.sendMail(mailoptions, (error, info) => {
        if (error){
            throw error
        }
        console.log('Message sent. Please check email')
    })
}






