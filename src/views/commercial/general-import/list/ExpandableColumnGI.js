import { Download } from "react-feather";
import { Button } from "reactstrap";

const ExpandableColumnGI = ( handleFileDownload ) => {
    const columns = [

        {
            name: 'Sl',
            cell: ( row, i ) => i + 1,
            width: '30px',
            center: true
        },
        {
            name: 'File Category',
            cell: row => row.category,
            selector: 'category',
            width: '200px'

        },
        {
            name: 'File Name',
            cell: row => row.name,
            width: '330px',
            selector: 'name'
        },
        {
            name: 'Extension',
            cell: row => row.fileExtension,
            selector: 'fileExtension',
            width: '100px'

        },
        // {
        //     name: 'File Url',
        //     cell: row => row.fileUrl
        // },
        {
            name: 'Actions',
            cell: row => <Button.Ripple
                onClick={() => { handleFileDownload( row.fileUrl ); }}
                className='btn-icon p-0' color='flat-primary'>
                <Download size={16} />
            </Button.Ripple>,
            width: '80px',
            center: true
        }

    ];
    return columns;
};

export default ExpandableColumnGI;