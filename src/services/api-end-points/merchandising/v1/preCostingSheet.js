/*
  Title: pre costing sheet
  Description: pre costing sheet
  Author: Iqbal Hossain
  Date: 21-August-2022
  Modified: 21-August-2022
*/
console.log( '/api/reports/PreCostingSheets/GetPreCostSheet/setStyles/{setStyleId}/Costings/{costingId}' );

export const PRE_COSTING_SHEET_API = {
  fetch_costing_by_style: styleId => `/api/merchandising/styles/${styleId}/costings`,
  fetch_pre_costing_sheet_by_style: ( styleId, costingId ) => `/api/reports/PreCostingSheets/GetPreCostSheet/styles/${styleId}/Costings/${costingId}`,
  fetch_pre_costing_sheet_by_set_style: ( setStyleId, costingId ) => `/api/reports/PreCostingSheets/GetPreCostSheet/setStyles/${setStyleId}/Costings/${costingId}`,

  //For RDLC Report
  fetch_pre_costing_sheet_by_costingId_rdlc: ( authUserId, costingId, stylesId ) => `Reports/Merchandising/${authUserId}/${costingId}/${stylesId}/CostingSheet`,
  fetch_pre_set_costing_sheet_by_costingId_rdlc: ( authUserId, costingId, stylesId ) => `Reports/Merchandising/${authUserId}/${costingId}/${stylesId}/SetCostingSheet`
};

console.log( '/api/reports/PreCostingSheets/GetPreCostSheet/styles/{styleId}/Costings/{costingId}' );