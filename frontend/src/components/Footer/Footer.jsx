
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} GUIDOC. Simplifying Document Guidance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
