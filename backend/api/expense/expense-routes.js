const ExpenseController = require('./expense-controller');
module.exports = class ExpenseRoute {
    static init(router) {
        router
            .route('/api/add-expense')
            .post(ExpenseController.addExpense);

        router
            .route('/api/update-expense')
            .post(ExpenseController.updateExpense);

        router
            .route('/api/delete-expense')
            .post(ExpenseController.deleteExpense);

        router
            .route('/api/get-today-expense')
            .post(ExpenseController.getTodayExpense);
    }
}