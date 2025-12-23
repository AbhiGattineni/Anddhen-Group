import React from 'react';

function ShippingPolicy() {
  return (
    <div>
      <section className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 my-auto">
              <h4>Shipping Policy</h4>
            </div>
            <div className="col-md-8 my-auto">
              <h6 className="float-end">Home/Shipping Policy</h6>
            </div>
          </div>
        </div>
      </section>
      <section className="section border-bottom">
        <div className="container">
          <div className="policy-content" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
            <p>
              The orders for the user are shipped through registered domestic courier companies
              and/or speed post only. Orders are shipped within 7 days from the date of the order
              and/or payment or as per the delivery date agreed at the time of order confirmation
              and delivering of the shipment, subject to courier company / post office norms.
              Platform Owner shall not be liable for any delay in delivery by the courier company /
              postal authority. Delivery of all orders will be made to the address provided by the
              buyer at the time of purchase. Delivery of our services will be confirmed on your
              email ID as specified at the time of registration. If there are any shipping cost(s)
              levied by the seller or the Platform Owner (as the case be), the same is not
              refundable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShippingPolicy;
