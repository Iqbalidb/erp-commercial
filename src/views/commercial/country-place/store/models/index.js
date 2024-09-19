import { randomIdGenerator } from "../../../../../utility/Utils";

export const countryPlaceModel = {
    country: null,
    places: [
        {
            id: randomIdGenerator(),
            status: true,
            placeName: ''
        }
    ]
};