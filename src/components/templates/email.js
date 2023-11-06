import { email_emailJs } from "../../dataconfig";
import emailjs from 'emailjs-com';

export const sendEmail = (application) => {
    emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_TEMPLATE_ID, {
        to_email: email_emailJs,
        subject: 'Your email subject',
        message: `You have received a new application from ${application} application.`
    }, process.env.REACT_APP_EMAIL_USER_ID,)
        .then((response) => {
            console.log('Email sent:', response);
        })
        .catch((error) => {
            console.error('Email send error:', error);
        });
}