import { emailJs_email } from "../../dataconfig";
import emailjs from 'emailjs-com';

export const sendEmail = (application) => {
    emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_TEMPLATE_ID, {
        to_email : emailJs_email,
        message: `You have received a new application from ${application} application.`
    }, process.env.REACT_APP_EMAIL_USER_ID)
        .then((response) => {
            console.log('Email sent to:', emailJs_email);
        })
        .catch((error) => {
            console.error('Email send error:', error);
        });
}