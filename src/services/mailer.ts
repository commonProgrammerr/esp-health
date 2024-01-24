// import nodemailer, { SendMailOptions } from 'nodemailer'
import sgMail from '@sendgrid/mail'
import type { MailDataRequired } from '@sendgrid/helpers/classes/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import Bull, { Job } from 'bull'
const queue = new Bull('email', {
  redis: 'localhost:127.0.0.1'
})

// export const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: "andre.escorel@tronst.com.br",
//     pass: "123deOliveir@4",
//   },
// });

// export const mailOptions = {
//   from: 'andre.escorel@tronst.com.br', // sender address
//   to: 'gustavo.escorel@gmail.com', // receiver (use array of string for a list)
//   subject: 'Subject of your email', // Subject line
//   html: '<p>Your html here</p>'// plain text body
// };

export const MailerService = {

  async addToQueue(options: MailDataRequired) {
    console.log('Novo email adicionado a fila')
    return queue.add({ ...options })
  },

  start() {
    console.log('Iniciando email service...')
    queue.process(this.processQueue)
      .catch(console.error)
  },

  async processQueue(job: Job<MailDataRequired>) {

    const { to } = job.data
    console.log("Sending mail to %s", to);


    const [response] = await sgMail.send({ ...(job.data) });

    console.log("Message sent. status code %s", response.statusCode);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

}
