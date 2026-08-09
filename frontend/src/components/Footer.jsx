const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="display" style={{ color: "#fff", fontSize: 22 }}>
            GIGO <span style={{ color: "var(--amber)" }}>Food</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginTop: 10 }}>
            Fast, reliable food delivery — order from your favourite local
            kitchens and pay easily with MTN Mobile Money.
          </p>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Delivery</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li>+257 79 000 0000</li>
            <li>hello@gigofood.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 GIGO Food. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
