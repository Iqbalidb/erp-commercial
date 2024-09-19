import { Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap';


const Home = () => {
  const baseModule = localStorage.getItem( 'module' );

  return (
    <div>


      <Card>
        <CardHeader>
          <CardTitle>Welcome to {baseModule} Module</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            We are working .....
          </CardText>
          {/* <div style={{ width: '100px' }} className='d-flex justify-content-between font-weight-bold border'>
            <div>
              <div>
                {sessionTime?.hour}
              </div>
              <div>
                Hr
              </div>
            </div>
            <div>
              <div>
                {sessionTime?.minute}
              </div>
              <div>
                Min
              </div>
            </div>
            <div>
              <div>
                {sessionTime?.second}
              </div>
              <div>
                Sec
              </div>
            </div>
          </div> */}

        </CardBody>
      </Card>

    </div>
  );
};

export default Home;
