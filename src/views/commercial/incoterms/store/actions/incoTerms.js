
// export const getIncoTerms = () => ( dispatch ) => {
//     const apiEndpoint = "http://localhost:3004/incoterms";
//     axios.get( apiEndpoint )
//         .then( ( response ) => {
//             console.log( 'response from action', response );
//             dispatch( {
//                 type: GET_INCO_TERMS,
//                 incoterms: response.data
//             } );
//         } );
// };

// export const addIncoTerms = ( data ) => dispatch => {
//     const apiEndpoint = "http://localhost:3004/incoterms";
//     axios.post( apiEndpoint, data )
//         .then( ( res ) => {
//             dispatch( getIncoTerms() );
//         } )
//         .catch( ( error ) => console.log( error ) );

// };

// export const deleteIncoTerms = ( id ) => dispatch => {
//     const apiEndpoint = `http://localhost:3004/incoterms/${id}`;
//     axios.delete( apiEndpoint )
//         .then( ( response ) => {
//             dispatch( getIncoTerms() );
//         } )
//         .catch( ( error ) => console.log( error ) );
// };
