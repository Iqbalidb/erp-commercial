/*
  Title: Materail Status Style and Po Wise
  Description: Materail Status Style and Po Wise
  Author: Iqbal Hossain
  Date: 27-September-2022
  Modified: 27-September-2022
*/

export const MATERIAL_STATUS_STYLE_AND_PO_WISE_API = {
  fetch_purchase_orders_by_buyer_style_id: ( buyerId, styleId ) => `/api/merchandising/buyers/${buyerId}/styles/${styleId}/purchaseOrders`,
  fetch_material_status_style_po_wise: styleId => `/api/reports/MaterialStatus/GetMaterialStatus/Style/${styleId}`,
  fetch_material_status_style_po_item_details: ( styleId, itemCatetoryId ) => `/api/reports/MaterialStatus/GetMaterialStatus/Style/${styleId}/ItemCategory/${itemCatetoryId}`,

  // For RDLC Report
  fetch_material_status_style_po_wise_rdlc: ( authUserId, styleId, orderId ) => `Reports/Merchandising/${authUserId}/Style/${styleId}/PO/${orderId}/MaterialStatusStyleAndPOWise`
};
