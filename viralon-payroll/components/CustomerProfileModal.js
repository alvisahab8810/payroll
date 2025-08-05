import React from "react";

export default function CustomerProfileDrawer({ customer, show, onClose }) {
  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 999,
          transition: "opacity 0.3s",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "400px",
          maxWidth: "100%",
          backgroundColor: "#fff",
          boxShadow: "-3px 0 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          transition: "transform 0.3s ease-out",
          transform: show ? "translateX(0)" : "translateX(100%)",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          {/* <h3 style={{ margin: 0 }}>Customer Profile</h3> */}
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Profile Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 25,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(90deg, #FF6F61 29%, #FBA065 95%)",

              color: "white",
              fontWeight: "bold",
              fontSize: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 15,
              userSelect: "none",
            }}
          >
            {customer.firstName?.[0]}
            {customer.lastName?.[0]}
          </div>
          <div>
            <h4 style={{ margin: 0 }}>
              {customer.salutation} {customer.firstName} {customer.lastName}
            </h4>
            <small style={{ color: "#6c757d" }}>
              {customer.companyName || "No company"}
            </small>
          </div>
          <div>
            <button
              onClick={onClose}
              style={{
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#ffffff",
                padding: 0,
                borderRadius: "50%",
                width: "30px",
                height: "30px",

                border: "1px solid #546e7a",
                 color: "rgb(84 110 122)",
                // border:""    
                background: "transparent",
                position: "absolute",
                top: "10px",
                right: "10px",
                lineHeight: "1.3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
         <hr/>
        {/* Contact Info */}
        <section >
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Contact Details
          </h6>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                // alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <i className="fas fa-envelope" style={{ color: "#555",  marginTop:"4px", fontSize: "13px" }}></i>
              <div>
                <strong>Email:</strong>
                <br />
                {customer.email || "-"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                // alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              {/* <i className="fas fa-phone" ></i> */}
              <i class="zmdi zmdi-account-box-phone" style={{ color: "#555",  marginTop:"4px", fontSize: "15px"}}></i>
              <div>
                <strong>Mobile:</strong>
                <br />
                {customer.mobile || "-"}
              </div>
            </div>
          </div>
        </section>

        {/* other details Address */}
         <hr/>

        <section >
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
           Other Details
          </h6>



          <div>
            <strong>PAN No:</strong>
            <br />
            {customer.pan || "-"}
          </div>

          <div>
            <strong>Business Type:</strong>
            <br />
            {customer.customerType || "-"}
          </div>
        </section>

         <hr/>


        {/* Billing Address */}
        <section>
          <h6
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Billing Address
          </h6>
          {customer.billingAddress ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 20px",
              }}
            >
              <div>
                <strong>Attention:</strong>
                <br />
                {customer.billingAddress.attention || "-"}
              </div>
              <div>
                <strong>Country:</strong>
                <br />
                {customer.billingAddress.country || "-"}
              </div>
              <div>
                <strong>Address Line 1:</strong>
                <br />
                {customer.billingAddress.address1 || "-"}
              </div>
              <div>
                <strong>Address Line 2:</strong>
                <br />
                {customer.billingAddress.address2 || "-"}
              </div>
              <div>
                <strong>City:</strong>
                <br />
                {customer.billingAddress.city || "-"}
              </div>
              <div>
                <strong>State:</strong>
                <br />
                {customer.billingAddress.state || "-"}
              </div>
              <div>
                <strong>Pincode:</strong>
                <br />
                {customer.billingAddress.pincode || "-"}
              </div>
              <div>
                <strong>Phone:</strong>
                <br />
                {customer.billingAddress.phone || "-"}
              </div>
              <div>
                <strong>Fax:</strong>
                <br />
                {customer.billingAddress.fax || "-"}
              </div>
            </div>
          ) : (
            <p style={{ color: "#6c757d" }}>No billing address provided.</p>
          )}
        </section>
      </div>
    </>
  );
}
