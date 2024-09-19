import React from 'react';

const SmallSpinner = () => {
    return (
        <div className='border bg-primary'>
            <div className='loading-small component-loader'>
                <div className='effect-1 effects'></div>
                <div className='effect-2 effects'></div>
                <div className='effect-3 effects'></div>
            </div>
        </div>
    );
};

export default SmallSpinner;