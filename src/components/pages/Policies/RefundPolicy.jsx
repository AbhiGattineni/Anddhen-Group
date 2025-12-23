import React from 'react';

function RefundPolicy() {
  return (
    <div>
      <section className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 my-auto">
              <h4>Refund and Cancellation Policy</h4>
            </div>
            <div className="col-md-8 my-auto">
              <h6 className="float-end">Home/Refund and Cancellation Policy</h6>
            </div>
          </div>
        </div>
      </section>
      <section className="section border-bottom">
        <div className="container">
          <div className="policy-content" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
            <p>
              This refund and cancellation policy outlines how you can cancel or seek a refund for a
              product / service that you have purchased through the Platform. Under this policy:
            </p>
            <ol>
              <li>
                Cancellations will only be considered if the request is made 7 days of placing the
                order. However, cancellation requests may not be entertained if the orders have been
                communicated to such sellers / merchant(s) listed on the Platform and they have
                initiated the process of shipping them, or the product is out for delivery. In such
                an event, you may choose to reject the product at the doorstep. ANDDHEN does not
                accept cancellation requests for perishable items like flowers, eatables, etc.
                However, the refund / replacement can be made if the user establishes that the
                quality of the product delivered is not good.
              </li>
              <li>
                In case of receipt of damaged or defective items, please report to our customer
                service team. The request would be entertained once the seller/ merchant listed on
                the Platform, has checked and determined the same at its own end. This should be
                reported within 7 days of receipt of products.
              </li>
              <li>
                In case you feel that the product received is not as shown on the site or as per
                your expectations, you must bring it to the notice of our customer service within 7
                days of receiving the product. The customer service team after looking into your
                complaint will take an appropriate decision.
              </li>
              <li>
                In case of complaints regarding the products that come with a warranty from the
                manufacturers, please refer the issue to them.
              </li>
              <li>
                In case of any refunds approved by ANDDHEN, it will take 7 days for the refund to be
                processed to you.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RefundPolicy;
