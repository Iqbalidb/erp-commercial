import { Badge } from "reactstrap";

export const columns = [
    {
        name: 'Places',
        selector: row => row.placeName
    },
    {
        name: 'Status',
        selector: row => ( <Badge pill className="text-capitalize" color={`${row.status ? 'light-success' : 'light-secondary'}`}>
            {row.status ? 'active' : 'inactive'}
        </Badge> )
    }
];