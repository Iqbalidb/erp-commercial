import { lazy } from 'react';
export const commercialRoutes = [
    {
        path: '/back-to-back',
        component: lazy( () => import( '../../views/commercial/backToBack/list' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/back-to-back-form',
        component: lazy( () => import( '../../views/commercial/backToBack/form' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/back-to-back-edit',
        component: lazy( () => import( '../../views/commercial/backToBack/form/EditForm' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/back-to-back-conversion',
        component: lazy( () => import( '../../views/commercial/backToBack/form/b2b-sc-to-lc/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/back-to-back-amendment',
        component: lazy( () => import( '../../views/commercial/backToBack/form/amendment' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/back-to-back-details',
        component: lazy( () => import( '../../views/commercial/backToBack/details' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/commercial',
        component: lazy( () => import( '../../views/commercial/bank/form/index.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-bank',
        component: lazy( () => import( '../../views/commercial/bank/form/BankEditForm.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/commercial-bank-list',
        component: lazy( () => import( '../../views/commercial/bank/list/index.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/commercial-bank-branch',
        component: lazy( () => import( '../../views/commercial/branch/form/index.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/commercial-bank-branch-list',
        component: lazy( () => import( '../../views/commercial/branch/list/index.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/commercial-bank-branch-account-list',
        component: lazy( () => import( '../../views/commercial/account/list/index.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/bank-details',
        component: lazy( () => import( '../../views/commercial/bank/details/index.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/branch-details',
        component: lazy( () => import( '../../views/commercial/branch/details/index.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/new-master-document-form',
        component: lazy( () => import( '../../views/commercial/masterDocument/form' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/edit-master-document-form',
        component: lazy( () => import( '../../views/commercial/masterDocument/form/edit/EditForm' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },

    {
        path: '/master-document-details',
        component: lazy( () => import( '../../views/commercial/masterDocument/details' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/master-document',
        component: lazy( () => import( '../../views/commercial/masterDocument/list/list' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/master-document-amendment-form',
        component: lazy( () => import( '../../views/commercial/masterDocument/form/amendment' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/master-document-transfer',
        component: lazy( () => import( '../../views/commercial/masterDocument/master-document-transfer/MasterDocumentTransferForm' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/incolist',
        component: lazy( () => import( '../../views/commercial/incoterms/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/countrylist',
        component: lazy( () => import( '../../views/commercial/country-place/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/documentform',
        component: lazy( () => import( '../../views/commercial/documentui/form' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/grouplclist',
        component: lazy( () => import( '../../views/commercial/grouplc/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/grouplcform',
        component: lazy( () => import( '../../views/commercial/grouplc/form' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/grouplcdetails',
        component: lazy( () => import( '../../views/commercial/grouplc/details' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/insurancecompany',
        component: lazy( () => import( '../../views/commercial/insurance-company/list/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/insurancecompanydetails',
        component: lazy( () => import( '../../views/commercial/insurance-company/details/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/sc-to-lc-conversion',
        component: lazy( () => import( '../../views/commercial/masterDocument/form/sc-to-lc/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/edit-group-lc',
        component: lazy( () => import( '../../views/commercial/grouplc/form/edit/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/charge-advice',
        component: lazy( () => import( '../../views/commercial/charge-advice/list/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/new-charge-advice',
        component: lazy( () => import( '../../views/commercial/charge-advice/form/ChargeAdviceForm' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/general-charge-advices',
        component: lazy( () => import( '../../views/commercial/general-charge-advice/list/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/new-general-charge-advice',
        component: lazy( () => import( '../../views/commercial/general-charge-advice/form/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/general-charge-advice-details',
        component: lazy( () => import( '../../views/commercial/general-charge-advice/details/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/edit-charge-advice',
        component: lazy( () => import( '../../views/commercial/charge-advice/form/ChargeAdviceEditForm' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/charge-advice-details',
        component: lazy( () => import( '../../views/commercial/charge-advice/details/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/cost-heads',
        component: lazy( () => import( '../../views/commercial/cost-Heads/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/charge-heads',
        component: lazy( () => import( '../../views/commercial/charge-heads/list/ChargeHeadList' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/import-List',
        component: lazy( () => import( '../../views/commercial/shipping-logistics/import/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/new-import-schedule',
        component: lazy( () => import( '../../views/commercial/shipping-logistics/import/form/AddForm' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/edit-import-schedule',
        component: lazy( () => import( '../../views/commercial/shipping-logistics/import/form/EditForm' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/import-schedule-details',
        component: lazy( () => import( '../../views/commercial/shipping-logistics/import/details/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/export-List',
        component: lazy( () => import( '../../views/commercial/shipping-logistics/export/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/new-export-schedule',
        component: lazy( () => import( '../../views/commercial/shipping-logistics/export/form/ExportAddForm' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/edit-export-schedule',
        component: lazy( () => import( '../../views/commercial/shipping-logistics/export/form/ExportEditForm' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/export-schedule-details',
        component: lazy( () => import( '../../views/commercial/shipping-logistics/export/details/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/c&f-agent-list',
        component: lazy( () => import( '../../views/commercial/c&f-agent/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/new-general-import',
        component: lazy( () => import( '../../views/commercial/general-import/form/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/general-import-list',
        component: lazy( () => import( '../../views/commercial/general-import/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/general-import-details',
        component: lazy( () => import( '../../views/commercial/general-import/details/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-general-import',
        component: lazy( () => import( '../../views/commercial/general-import/form/EditForm' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/general-import-amendment',
        component: lazy( () => import( '../../views/commercial/general-import/form/amendment/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/new-free-of-cost',
        component: lazy( () => import( '../../views/commercial/free-on-cost/form/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/free-of-cost-list',
        component: lazy( () => import( '../../views/commercial/free-on-cost/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-free-of-cost',
        component: lazy( () => import( '../../views/commercial/free-on-cost/form/EditFormFOC' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/free-of-cost-details',
        component: lazy( () => import( '../../views/commercial/free-on-cost/details/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/utilization-declaration-list',
        component: lazy( () => import( '../../views/commercial/utilization-declaration/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/new-utilization-declaration',
        component: lazy( () => import( '../../views/commercial/utilization-declaration/form/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-utilization-declaration',
        component: lazy( () => import( '../../views/commercial/utilization-declaration/form/EditFormUD' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/utilization-declaration-details',
        component: lazy( () => import( '../../views/commercial/utilization-declaration/details/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/utilization-declaration-amendment',
        component: lazy( () => import( '../../views/commercial/utilization-declaration/form/amendment/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-utilization-declaration-amendment',
        component: lazy( () => import( '../../views/commercial/utilization-declaration/form/amendment/AmendmentEdit' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/utilization-declaration-amendment-Details',
        component: lazy( () => import( '../../views/commercial/utilization-declaration/form/amendment/AmendmentDetails' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/export-invoices-list',
        component: lazy( () => import( '../../views/commercial/export-invoice/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/new-export-invoice',
        component: lazy( () => import( '../../views/commercial/export-invoice/form/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-export-invoice',
        component: lazy( () => import( '../../views/commercial/export-invoice/form/EditFormEI' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/export-invoice-details',
        component: lazy( () => import( '../../views/commercial/export-invoice/details/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/document-submission-list',
        component: lazy( () => import( '../../views/commercial/document-submission/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/new-document-submission',
        component: lazy( () => import( '../../views/commercial/document-submission/form/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-document-submission',
        component: lazy( () => import( '../../views/commercial/document-submission/form/EditFormDocSub' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/document-submission-details',
        component: lazy( () => import( '../../views/commercial/document-submission/details/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/courier-company-list',
        component: lazy( () => import( '../../views/commercial/courier-companies/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/payment-realization-list',
        component: lazy( () => import( '../../views/commercial/payment-realization/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/new-payment-realization',
        component: lazy( () => import( '../../views/commercial/payment-realization/form/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-payment-realization',
        component: lazy( () => import( '../../views/commercial/payment-realization/form/EditFormPR' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/payment-realization-details',
        component: lazy( () => import( '../../views/commercial/payment-realization/details/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edf-list',
        component: lazy( () => import( '../../views/commercial/manage-edf/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/new-edf',
        component: lazy( () => import( '../../views/commercial/manage-edf/form/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-edf',
        component: lazy( () => import( '../../views/commercial/manage-edf/form/EditFormEDF' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edf-details',
        component: lazy( () => import( '../../views/commercial/manage-edf/details/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/commercial-invoice-list',
        component: lazy( () => import( '../../views/commercial/import-commercial-invoice/list/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/new-commercial-invoice',
        component: lazy( () => import( '../../views/commercial/import-commercial-invoice/form/index.js' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/edit-commercial-invoice',
        component: lazy( () => import( '../../views/commercial/import-commercial-invoice/form/EditFormCI' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/commercial-invoice-details',
        component: lazy( () => import( '../../views/commercial/import-commercial-invoice/details/index' ) ),
        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/test2',
        component: lazy( () => import( '../../views/test/button/index' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    }
];