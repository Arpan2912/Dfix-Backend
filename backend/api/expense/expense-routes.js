const ExpenseController = require('./expense-controller');
module.exports = class ExpenseRoute {
    static init(router) {
        //add expense
        router
            .route('/api/add-expense')
            .post(ExpenseController.addExpense);

        //update expense
        router
            .route('/api/update-expense')
            .post(ExpenseController.updateExpense);

        // delete expense
        router
            .route('/api/delete-expense')
            .post(ExpenseController.deleteExpense);

        //get today expenses
        router
            .route('/api/get-today-expense')
            .post(ExpenseController.getTodayExpense);

        //get all expenses
        router
            .route('/api/getExpense')
            .get(ExpenseController.getExpense)
    }
}
