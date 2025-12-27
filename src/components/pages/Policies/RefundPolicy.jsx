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
              This refund and cancellation policy outlines how you can cancel or seek a refund for
              services that you have purchased or subscribed to through the Platform. Under this
              policy:
            </p>
            <ol>
              <li>
                Service cancellations will only be considered if the request is made within 7 days
                of service initiation or payment, whichever is earlier. However, cancellation
                requests may not be entertained if the service has already been substantially
                delivered or completed. In such an event, no refund will be provided for the
                services already rendered.
              </li>
              <li>
                In case you are not satisfied with the quality of services delivered, please report
                to our customer service team within 7 days of service delivery. The request would be
                entertained once our team has reviewed and determined the validity of your
                complaint. We will investigate the matter and take appropriate action, which may
                include service correction, replacement service, or partial/full refund as deemed
                appropriate.
              </li>
              <li>
                In case you feel that the service received is not as per the agreed terms or your
                expectations, you must bring it to the notice of our customer service within 7 days
                of service delivery. The customer service team after looking into your complaint
                will take an appropriate decision.
              </li>
              <li>
                For services that involve ongoing subscriptions or recurring payments, cancellation
                requests must be made at least 7 days before the next billing cycle to avoid charges
                for that period. Once a billing cycle has been charged, refunds for that period will
                not be provided unless there is a service failure on our part.
              </li>
              <li>
                In case of any refunds approved by ANDDHEN, it will take 7-14 business days for the
                refund to be processed to the original payment method used for the transaction.
              </li>
              <li>
                Refunds will be processed only to the original payment source. We are not
                responsible for any delays in refund processing caused by payment gateway providers
                or banks.
              </li>
              <li>
                Any service-specific terms and conditions mentioned at the time of service purchase
                shall also apply in addition to this policy.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RefundPolicy;
