import { User, Form, ProbationaryForm, AnnualReviewForm } from '../models';
import { sequelize } from '../mysql.config';

async function updateTable() {
   try {
      new User();
      new Form();
      new ProbationaryForm();
      new AnnualReviewForm();
      sequelize.sync({ alter: true, benchmark: true });
   } catch (error) {
      console.log(error);
   }
}
updateTable();
