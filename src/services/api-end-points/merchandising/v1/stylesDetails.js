/*
  Title: stylesDetails
  Description: stylesDetails.js
  Author: Iqbal Hossain
  Date: 04-August-2022
  Modified: 04-August-2022
*/

export const STYLES_DETAILS_API = {
  fetch_buyers: '/api/merchandising/buyers',
  fetch_department_by_buyer: buyerId => `/api/merchandising/buyers/${buyerId}/departments`,
  fetch_style_by_buyer: buyerId => `/api/reports/StyleDetails/GetStyle/Buyer/${buyerId}`,
  fetch_year_by_department: buyerDepartmentId => `/api/reports/StyleDetails/GetYear/Department/${buyerDepartmentId}`,
  fetch_season_by_buyer_department_year: ( buyerId ) => `/api/merchandising/buyers/${buyerId}/seasons`,
  fetch_style_by_buyer_department_year_season: `/api/merchandising/styles/grid`,
  fetch_styleDetails_by_style: styleId => `/api/reports/StyleDetails/GetStyleDetails/Style/${styleId}`,
  fetch_department_by_buyerIds: buyerIds => `/api/reports/StyleDetails/GetDepartment/Buyer/${buyerIds}`,

  // For RDLC Report
  fetch_styleDetails_by_styleId_rdlc: ( authUserId, styleId ) => `Reports/Merchandising/${authUserId}/${styleId}/StyleDetails`
};