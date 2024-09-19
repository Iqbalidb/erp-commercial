import DataTable from "react-data-table-component";
import { Card, CardBody } from "reactstrap";

const TestDesign = () => {
    const colors = [
        {
            name: 'Amendment',
            color: '#ea5455'
        },
        {
            name: 'Transferred',
            color: '#16a085'
        },
        {
            name: 'Converted',
            color: '#4e14ff'
        },
        {
            name: 'Group',
            color: '#22668d'
        }
    ];


    const column = [
        {
            name: 'Action',
            cell: row => row.action
        },
        {
            name: 'Icons',
            // width: '100px',
            center: true,
            cell: row => {
                return <>
                    <div className="availability-icons-container">
                        <div className="flex-container">
                            <div>
                                A
                            </div>
                            <div>T</div>
                        </div>
                        <div className="flex-container">
                            <div>C</div>
                            <div>G</div>
                        </div>
                    </div>
                </>;
            }
        },
        {
            name: 'Details',
            cell: row => row.details
        }
    ];
    const data = [
        {
            action: 'none',
            details: 'lorem ipsum dolor sit amet, consectetur adipiscing'
        },
        {
            action: 'none',
            details: 'lorem ipsum dolor sit amet, consectetur adipiscing'
        },
        {
            action: 'none',
            details: 'lorem ipsum dolor sit amet, consectetur adipiscing'
        },
        {
            action: 'none',
            details: 'lorem ipsum dolor sit amet, consectetur adipiscing'
        }
    ];
    return (
        <>
            <Card>
                <CardBody>
                    <DataTable columns={column} data={data} className="react-custom-dataTable" />
                </CardBody>
            </Card>
        </>
    );
};
export default TestDesign;