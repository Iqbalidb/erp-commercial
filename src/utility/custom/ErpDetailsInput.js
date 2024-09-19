import { Input, Label, Table, UncontrolledTooltip } from 'reactstrap';

const ErpDetailsInput = ( props ) => {
     const { classNames, label, type = 'text', position = 'top', id, hasDetails = false, value, columnsToShow, detailsData = [], ...rest } = props;

     return (
          <>
               <div
                    className={`${classNames} erp-input-container `}

               >
                    <Label size='sm' className='font-weight-bolder'>{label}</Label>
                    <div className='d-flex align-items-center'>
                         <span className='mr-1 font-weight-bolder'>:</span>
                         <Input
                              id={id}
                              type={type}
                              className={`${type === 'number' && 'text-right'}`}
                              {...rest}
                              value={value || ''}
                              label={label}
                              bsSize='sm'
                              disabled
                         // onChange={( e ) => onChange( e )}

                         />

                    </div>
               </div>
               {
                    hasDetails ? <UncontrolledTooltip
                         placement={position}
                         target={id}
                         // isOpen={tooltipOpen}
                         autohide={false}
                         delay={{ hide: 155 }}
                         trigger="hover"
                         style={{
                              color: '#7367F0',
                              backgroundColor: 'white',
                              border: 'solid 1px #7367F0',
                              minWidth: '500px',
                              padding: '1rem'
                         }}
                    >
                         <Table size="sm" responsive>
                              <thead>
                                   <tr>
                                        {
                                             columnsToShow?.map( col => <th style={{ padding: 0 }} key={col} >{col}</th> )
                                        }
                                   </tr>
                              </thead>
                              <tbody>
                                   {
                                        detailsData?.map( d => {

                                             return (
                                                  <tr key={d.id}>
                                                       {
                                                            columnsToShow?.map( col => <td
                                                                 style={{ padding: 0, textTransform: 'uppercase' }}
                                                                 key={col}
                                                            >
                                                                 {d[col]}
                                                            </td> )
                                                       }
                                                  </tr>
                                             );
                                        } )
                                   }
                              </tbody>
                         </Table>

                    </UncontrolledTooltip > : null
               }
          </>
     );
};
export default ErpDetailsInput;