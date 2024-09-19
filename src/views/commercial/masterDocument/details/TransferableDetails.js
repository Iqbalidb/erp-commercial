import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import FormContentLayout from "utility/custom/FormContentLayout";
import FormLayout from "utility/custom/FormLayout";
import Beneficiary from "../form/general/Beneficiary";

export default function TransferableDetails( { masterDocument } ) {

    const {
        transferableList
    } = useSelector( ( { masterDocumentReducers } ) => masterDocumentReducers );
    console.log( { transferableList } );
    return (
        <>
            <FormLayout isNested={true} classNames="app-min-height">

                <Row>

                    <Col >

                        <FormContentLayout title={`Beneficiary List`} >

                            <Col >
                                {
                                    transferableList.map( ( el, i ) => (
                                        <FormContentLayout marginTop key={el?.rowId} title={`Beneficiary ${i + 1}`}>
                                            <Beneficiary fromTransferDetails={true} beneficiaryRow={el} />

                                        </FormContentLayout>
                                    ) )
                                }

                            </Col>

                        </FormContentLayout>

                    </Col>
                </Row>
            </FormLayout>
        </>
    );
}
