/*
  Title: exportPoWithColorAndSize
  Description: exportPoWithColorAndSize
  Author: Iqbal Hossain
  Date: 07-August-2022
  Modified: 07-August-2022
*/

export const EXPORT_PO_WITH_COLOR_AND_SIZE_API = {
  fetch_season_by_buyer_Ids: ( buyerIds ) => `/api/reports/ExportPoWithColorAndSizes/GetSeason/${buyerIds}/Buyer`,
  fetch_season_by_buyer_department: ( buyerIds, buyerDepartmentIds ) => `/api/reports/ExportPoWithColorAndSizes/GetSeason/Buyer/${buyerIds}/Department/${buyerDepartmentIds}`,
  fetch_style_by_buyer_department_season: ( buyerIds, buyerDepartmentIds, seasonIds ) => `/api/reports/ExportPoWithColorAndSizes/GetStyle/Buyer/${buyerIds}/Department/${buyerDepartmentIds}/Season/${seasonIds}`,
  fetch_export_po_with_color_size_by_style: ( styleIds, fromDate, toDate ) => `/api/reports/ExportPoWithColorAndSizes/GetPoWithcolorAndSize/Style/${styleIds}/FromDate/${fromDate}/ToDate/${toDate}`,

  //For RDLC Report
  fetch_buyer_po_with_color_size_by_style_rdlc: ( authUserId, styleIds, fromDate, toDate ) => `Reports/Merchandising/${authUserId}/Styles/${styleIds}/FromDate/${fromDate}/ToDate/${toDate}/BuyerPOWithColorSizes`,
  fetch_buyer_set_po_with_color_size_by_style_rdlc: ( authUserId, styleIds, fromDate, toDate ) => `Reports/Merchandising/${authUserId}/Styles/${styleIds}/FromDate/${fromDate}/ToDate/${toDate}/BuyerSetPOWithColorSizes`
};