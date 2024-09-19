import { Activity, Archive, ArrowDownRight, Book, Briefcase, Calendar, Command, CreditCard, DollarSign, ExternalLink, GitBranch, GitCommit, GitMerge, GitPullRequest, Grid, HardDrive, Layers, Layout, Link, Link2, LogIn, LogOut, MapPin, Maximize2, MessageSquare, Minimize2, Package, Paperclip, Sidebar, Sliders, Sun, Truck, UserPlus } from "react-feather";

export const commercialNavigation = [
    // {
    //     id: 'test',
    //     title: 'Test',
    //     icon: <Home size={20} />,
    //     navLink: '/test2',
    //     hidden: false
    // },

    {
        id: 'basicSetup',
        title: 'Basic Setup',
        icon: <GitCommit size={20} />,
        hidden: false,
        children: [
            {
                id: 'tradeTerms',
                title: 'Trade Terms',
                icon: <Book size={20} />,
                hidden: false,
                children: [
                    {
                        id: 'incolist',
                        title: 'Incoterms',
                        icon: <Book size={20} />,
                        navLink: '/incolist',
                        hidden: false
                    },
                    {
                        id: 'costHeads',
                        title: 'Cost Heads',
                        icon: <Maximize2 size={20} />,
                        navLink: '/cost-heads',
                        hidden: false
                    }
                ]
            },

            {
                id: 'countrylist',
                title: 'Country and Places',
                icon: <MapPin size={20} />,
                navLink: '/countrylist',
                hidden: false
            },
            {
                id: 'insurancecompany',
                title: 'Insurance Companies',
                icon: <Sidebar size={20} />,
                navLink: '/insurancecompany',
                hidden: false
            },

            {
                id: 'bankManagement',
                title: 'Bank Profile Management',
                icon: <CreditCard size={20} />,
                className: "border-top-1",
                hidden: false,
                children: [
                    {
                        id: 'banks',
                        title: 'Banks',
                        icon: <Briefcase size={20} />,
                        navLink: '/commercial-bank-list',
                        hidden: false

                    },
                    {
                        id: 'branchs',
                        title: 'Branches',
                        icon: <Sliders size={20} />,
                        navLink: '/commercial-bank-branch-list',
                        hidden: false

                    },
                    {
                        id: 'accounts',
                        title: 'Bank Accounts',
                        icon: <UserPlus size={20} />,
                        navLink: '/commercial-bank-branch-account-list',
                        hidden: false
                    },

                    {
                        id: 'chargeHeads',
                        title: 'Bank Charge Heads',
                        icon: <Minimize2 size={20} />,
                        navLink: '/charge-heads',
                        hidden: false
                    }
                ]

            },
            {
                id: 'courierCompany',
                title: 'Courier Companies',
                icon: <Archive size={20} />,
                navLink: '/courier-company-list',
                hidden: false
            }


        ]
    },
    {
        id: 'exports',
        title: 'Exports',
        icon: <ExternalLink size={20} />,
        hidden: false,
        children: [
            {
                id: 'master-document',
                title: 'Master Documents',
                icon: <GitBranch size={20} />,
                navLink: '/master-document',
                hidden: false

            },

            {
                id: 'grouplclist',
                title: 'Group Master Documents',
                icon: <GitPullRequest size={20} />,
                navLink: '/grouplclist',
                hidden: false
            },
            {
                id: 'masterAmendments',
                title: 'Master Amendments',
                navLink: '/master-document-amendment-form',
                icon: <Link size={20} />
            },
            {
                id: 'contractConversion',
                title: 'Contract Conversion',
                navLink: '/sc-to-lc-conversion',
                icon: <MessageSquare size={20} />
            },
            {
                id: 'transferMasterDoc',
                title: 'Transfer Master Document ',
                navLink: '/master-document-transfer',
                icon: <LogOut size={20} />
            }
            // {
            //     id: 'exportInvoice',
            //     title: 'Export Invoice',
            //     icon: <Paperclip size={20} />
            // },
            // {
            //     id: 'payment',
            //     title: 'Payment Realization',
            //     icon: <DollarSign size={20} />
            // }


            // {
            //     id: 'back-to-back',
            //     title: 'Back To Back',
            //     icon: <GitMerge size={20} />,
            //     navLink: '/back-to-back',
            //     hidden: false

            // },
            // {
            //     id: 'documentform',
            //     title: 'Document Management',
            //     icon: <FileText size={20} />,
            //     navLink: '/documentform',
            //     hidden: false
            // }
            // {
            //     id: 'chargeAdvice',
            //     title: 'Charge Advice',
            //     icon: <DollarSign size={20} />,
            //     navLink: '/charge-advice',
            //     hidden: false
            // }

        ]
    },
    {
        id: 'imports',
        title: 'Imports',
        icon: <LogIn size={20} />,
        hidden: false,
        children: [

            {
                id: 'back-to-back',
                title: 'B2B Documents',
                icon: <GitMerge size={20} />,
                navLink: '/back-to-back',
                hidden: false

            },
            {
                id: 'generalImport',
                title: 'General Import',
                icon: <Link2 size={20} />,
                navLink: '/general-import-list',
                hidden: false
            },
            {
                id: 'freeOfCost',
                title: 'Free of Cost',
                icon: <ArrowDownRight size={20} />,
                navLink: '/free-of-cost-list',
                hidden: false
            },
            // {
            //     id: 'groupb2b',
            //     title: 'Group B2B Documents',
            //     icon: <FileText size={20} />,
            //     hidden: false
            // },

            {
                id: 'importInvoice',
                title: 'Import Commercial Invoice',
                icon: <Calendar size={20} />,
                navLink: '/commercial-invoice-list',
                hidden: false
            }
            // {
            //     id: 'payment',
            //     title: 'Payment TT/DD',
            //     icon: <DollarSign size={20} />,
            //     // navLink: '/documentform',
            //     hidden: false
            // },
        ]
    },
    {
        id: 'shippingLogistics',
        title: 'Shipping & Logistics',
        icon: <Truck size={20} />,
        hidden: false,
        children: [
            {
                id: 'cnf',
                title: 'CNF Agents',
                icon: <Activity size={20} />,
                hidden: false,
                navLink: '/c&f-agent-list'

            },
            {
                id: 'scheduling',
                title: 'Shipment Scheduling',
                icon: <Calendar size={20} />,
                children: [
                    {
                        id: 'importSchedule',
                        title: 'Import Schedule',
                        navLink: '/import-List',
                        icon: <Calendar size={20} />
                    },
                    {
                        id: 'exportSchedule',
                        title: 'Export Schedule',
                        navLink: '/export-List',
                        icon: <Calendar size={20} />
                    }
                ]
                // hidden: true
            },
            {
                id: 'booking',
                title: 'Booking',
                icon: <Book size={20} />
                // hidden: true
            },
            {
                id: 'inlandTransport',
                title: 'Inland Transport',
                icon: <HardDrive size={20} />
                // hidden: true
            }
            // {
            //     id: 'test',
            //     title: 'test',
            //     icon: <HardDrive size={20} />,
            //     navLink: '/test2'

            // }
        ]
    },
    {
        id: 'utilities',
        title: 'Utilities',
        icon: <Sun size={20} />,
        hidden: false,
        children: [
            {
                id: 'subcontracts',
                title: 'Manage Sub-Contracts',
                icon: <Package size={20} />,
                hidden: true
            },
            {
                id: 'documents',
                title: 'Manage Documents',
                icon: <Link size={20} />,
                navLink: '/documentform',
                hidden: false
            },
            {
                id: 'chargeAdvice',
                title: 'Charge Advices',
                icon: <Grid size={20} />,
                hidden: false,
                children: [
                    {
                        id: 'bankCharge',
                        title: 'Bank Charge Advices',
                        icon: <Briefcase size={20} />,
                        navLink: '/charge-advice',
                        hidden: false

                    },
                    {
                        id: 'general',
                        title: 'General Charge Advices',
                        icon: <Sliders size={20} />,
                        navLink: '/general-charge-advices',
                        hidden: false

                    }

                ]
            },

            {
                id: 'manageExportIncentives',
                title: 'Manage Export Incentives',
                icon: <CreditCard size={20} />,
                hidden: true
            },

            {
                id: 'certificationRenewal',
                title: 'Certification Renewal',
                icon: <Layout size={20} />,
                hidden: true
            },
            {
                id: 'declarations',
                title: 'Declarations & Permissions',
                icon: <Layers size={20} />,
                hidden: true
            },
            {
                id: 'utilization',
                title: 'Utilization Declaration',
                icon: <Layers size={20} />,
                hidden: false,
                navLink: '/utilization-declaration-list'

            },
            {
                id: 'exportInvoice',
                title: 'Export Invoice',
                icon: <Layout size={20} />,
                hidden: false,
                navLink: '/export-invoices-list'
            },
            {
                id: 'documentSubmission',
                title: 'Document Submission',
                icon: <Paperclip size={20} />,
                hidden: false,
                navLink: '/document-submission-list'
            },
            {
                id: 'paymentRealization',
                title: 'Payment Realization',
                icon: <DollarSign size={20} />,
                hidden: false,
                navLink: '/payment-realization-list'
            },
            {
                id: 'manageedf',
                title: 'EDF Loan',
                icon: <Command size={20} />,
                hidden: false,
                navLink: '/edf-list'

            }
        ]
    }

];