/*
  Title: budgetSheet
  Description: budgetSheet
  Author: Iqbal Hossain
  Date: 18-August-2022
  Modified: 18-August-2022
*/

export const BUDGET_SHEET_API = {
  fetch_budget_by_buyerId: buyerId => `/api/merchandising/buyers/${buyerId}/budgets`,
  fetch_budget_sheet_by_Id: budgetId => `/api/reports/BudgetSheets/Budgets/${budgetId}/BudgetSheet`,

  //For RDLC Report
  fetch_budget_sheet_by_Id_rdlc: ( authUserId, budgetId ) => `Reports/Merchandising/${authUserId}/${budgetId}/BudgetSheet`
};
