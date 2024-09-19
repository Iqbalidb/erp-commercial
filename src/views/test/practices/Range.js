import React, { useEffect, useRef, useState } from 'react';
import './range.scss';
const RangeSlider = ( {
    initialMin,
    initialMax,
    min,
    max,
    step,
    priceCap,
    getRanges
} ) => {
    const progressRef = useRef( null );
    const [minValue, setMinValue] = useState( initialMin );
    const [maxValue, setMaxValue] = useState( initialMax );

    const handleMin = ( e ) => {
        if ( maxValue - minValue >= priceCap && maxValue <= max ) {
            if ( parseInt( e.target.value ) > parseInt( maxValue ) ) {
                ///
            } else {
                setMinValue( parseInt( e.target.value ) );
            }
        } else {
            if ( parseInt( e.target.value ) < minValue ) {
                setMinValue( parseInt( e.target.value ) );
            }
        }
    };

    const handleMax = ( e ) => {
        if ( maxValue - minValue >= priceCap && maxValue <= max ) {
            if ( parseInt( e.target.value ) < parseInt( minValue ) ) {
                ///
            } else {
                setMaxValue( parseInt( e.target.value ) );
            }
        } else {
            if ( parseInt( e.target.value ) > maxValue ) {
                setMaxValue( parseInt( e.target.value ) );
            }
        }
    };

    useEffect( () => {
        progressRef.current.style.left = `${( minValue / max ) * step}%`;
        progressRef.current.style.right = `${( step - ( maxValue / max ) ) * step}%`;
    }, [minValue, maxValue, max, step] );

    //   useEffect(() => {
    //     getRanges(minValue, maxValue);
    //   }, [minValue, maxValue]);

    const onMouseUp = () => {

        getRanges( minValue, maxValue );
    };

    return (
        <div className='slider-container'>
            <div className="my-6  flex items-center justify-between">
                <div className="rounded-md">
                    <span className="p-2 font-semibold"> Min</span>
                    <input
                        onBlur={onMouseUp}
                        onChange={( e ) => setMinValue( Number( e.target.value ) )}
                        type="number"
                        value={minValue}
                        className="w-full rounded border-gray-300 px-3 py-1 text-sm text-gray-600 shadow-sm focus:border-primary focus:ring-0"
                    />
                </div>
                <div className="mx-3 "></div>
                <div className="rounded-md">
                    <span className="p-2 font-semibold"> Max</span>
                    <input
                        onBlur={onMouseUp}
                        onChange={( e ) => setMaxValue( Number( e.target.value ) )}
                        type="number"
                        value={maxValue}
                        className="w-full rounded border-gray-300 px-3 py-1 text-sm text-gray-600 shadow-sm focus:border-primary focus:ring-0"
                    />
                </div>
            </div>
            <div className="mb-4">
                <div className="slider relative h-1 rounded-md bg-gray-300">
                    <div
                        className="progress absolute h-1 rounded bg-secondary "
                        ref={progressRef}
                    ></div>
                </div>

                <div className="range-input relative  ">
                    <input
                        onChange={handleMin}
                        onMouseUp={onMouseUp}
                        type="range"
                        min={min}
                        step={step}
                        max={max}
                        value={minValue}
                        className="range-min pointer-events-none absolute  -top-1  h-1   w-full  appearance-none bg-transparent"
                    />

                    <input
                        onChange={handleMax}
                        onMouseUp={onMouseUp}
                        type="range"
                        min={min}
                        step={step}
                        max={max}
                        value={maxValue}
                        className="range-max pointer-events-none absolute  -top-1 h-1  w-full appearance-none  bg-transparent"
                    />
                </div>
            </div>
        </div>
    );
};

export default RangeSlider;
