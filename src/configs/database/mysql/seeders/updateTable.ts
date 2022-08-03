import { User, Form, ProbationaryForm, AnnualReviewForm, FormStore } from '../models';
import { sequelize } from '../mysql.config';

async function updateTable() {
   try {
      new User();
      new Form();
      new FormStore();
      new ProbationaryForm();
      new AnnualReviewForm();
      sequelize.sync({ alter: true, benchmark: true, logging: true });
   } catch (error) {
      console.log(error);
   }
}
updateTable();
