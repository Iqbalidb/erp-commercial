import '../../../../assets/scss/basic/active-status.scss';

const colors = {
    amendment: '#ea5455',
    transferred: '#16a085',
    converted: '#4e14ff',
    group: '#22668d',
    disable: '#d3d3d3'
};
export const activeStatusColors = {
    activeStatus: '#16a085',
    inactiveStatus: '#d3d3d3'
};

export const AvailableStatus = ( { row } ) => {
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
                {/* <CustomToolTip id='transfer-status' value='Transferred' /> */}
                <div
                    id='transfer-status'
                    // disabled={!( row.noOfBeneficiary > 1 || !row.ownBeneficiary )}
                    disabled={!( row.noOfBeneficiary > 1 || !row.ownBeneficiary ) || row.isDraft === true}
                    style={{ backgroundColor: colors.transferred }}
                >
                    T
                </div>
            </div>
            <div className="flex-container">
                {/* <CustomToolTip id='convert-status' value='Converted' /> */}

                <div
                    id='convert-status'
                    disabled={!row.isConvertedLC}
                    style={{ backgroundColor: colors.converted }}>C</div>
                {/* <CustomToolTip id='group-status' value='Group' /> */}
                <div
                    id='group-status'
                    disabled={row.onGroup < 1}
                    style={{ backgroundColor: colors.group }}>
                    G
                </div>
            </div>
        </div>
    );
};

export const StatusColors = () => {
    return (
        <>
            <div className="list-status-colors mb-2">
                <div className="flex-container">
                    <div style={{ backgroundColor: colors.amendment }}></div>
                    Amended
                </div>
                <div className="flex-container">
                    <div style={{ backgroundColor: colors.transferred }}></div>
                    Transferred
                </div>
                <div className="flex-container">
                    <div style={{ backgroundColor: colors.converted }}></div>
                    Converted
                </div>
                <div className="flex-container">
                    <div style={{ backgroundColor: colors.group }}></div>
                    Grouped
                </div>

            </div>
        </>
    );
};