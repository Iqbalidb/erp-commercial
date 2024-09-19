import React, { useState } from 'react';
import RangeSlider from './test/practices/Range';

const TestPage = () => {
    const [filterObj, setFilterObj] = useState( {
        name: '',
        brands: [],
        categories: [],
        subCatagories: [],
        minPrice: 0,
        maxPrice: 8000
    } );

    const getRanges = ( minValue, maxValue ) => {
        setFilterObj( {
            ...filterObj,
            minPrice: Number( minValue ),
            maxPrice: Number( maxValue )
        } );
    };
    return (
        <div>
            <RangeSlider
                initialMin={filterObj.minPrice}
                initialMax={filterObj.maxPrice}
                min={0}
                max={10000}
                step={100}
                priceCap={400}
                getRanges={getRanges}
            />
        </div>
    );
};

export default TestPage;