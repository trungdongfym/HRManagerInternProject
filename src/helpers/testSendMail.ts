import { ISendMail } from '../commons/interfaces/sendMail';
import { sendMail } from '../libs/notify/sendMail.lib';

async function testSendMail() {
   try {
      const dataSend: ISendMail = {
         from: '👻 Đông',
         to: ['trungdongfym1@gmail.com', 'nguyenducanh.ldb@gmail.com'],
         subject: 'Kakaka',
         text: 'abcxyz?',
      };
      const info = await sendMail(dataSend);
      return info;
   } catch (error) {
      console.log(error);
   }
}

export default testSendMail;
