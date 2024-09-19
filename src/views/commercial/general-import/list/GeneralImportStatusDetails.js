import '../../../../assets/scss/basic/active-status.scss';


// export const colors = [
//     {
//         name: 'Amendment',
//         color: '#ea5455'
//     },
//     {
//         name: 'Transferred',
//         color: '#16a085'
//     },
//     {
//         name: 'Converted',
//         color: '#4e14ff'
//     },
//     {
//         name: 'Group',
//         color: '#22668d'
//     }


// ];
const colors = {
    amendment: '#ea5455',
    shipped: '#16a085',
    converted: '#4e14ff',
    appliedOnly: '#16a085',
    group: '#22668d',
    disable: '#d3d3d3'
};
export const activeStatusColors = {
    activeStatus: '#16a085',
    inactiveStatus: '#d3d3d3'
};

export const GIStatusDetails = ( { row } ) => {
    return (
        <div className="availability-icons-container ">
            <div className="flex-container">
                {/* <CustomToolTip id='amendment-status' value='Amendment' /> */}

                <div
                    disabled={row.amendmentDate === null}
                    id='amendment-status'
                    style={{ backgroundColor: colors.amendment }}>
                    A
                </div>
                {/* <CustomToolTip id='convert-status' value='Converted' /> */}

                <div
                    disabled={!row.isApplied}
                    id='shipped-status'
                    style={{ backgroundColor: colors.appliedOnly }}>
                    AP
                </div>
                {/* <div
                    id='convert-status'
                    disabled={!row.isConverted}
                    style={{ backgroundColor: colors.converted }}>
                    C
                </div> */}

            </div>
            {/* <div className="flex-container">


            </div> */}

        </div>
    );
};

export const GIStatusColors = () => {
    return (
        <>
            <div className="list-status-colors mb-2">
                <div className="flex-container">
                    <div style={{ backgroundColor: colors.amendment }}></div>
                    Amended
                </div>
                {/* <div className="flex-container">
                    <div style={{ backgroundColor: colors.shipped }}></div>
                    Shipped
                </div> */}
                {/* <div className="flex-container">
                    <div style={{ backgroundColor: colors.converted }}></div>
                    Converted
                </div> */}
                <div className="flex-container">
                    <div style={{ backgroundColor: colors.appliedOnly }}></div>
                    Apply Only
                </div>
                {/* <div className="flex-container">
                    <div style={{ backgroundColor: colors.group }}></div>
                    Grouped
                </div> */}

            </div>
        </>
    );
};