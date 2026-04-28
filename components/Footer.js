import Link from "next/link";

export default function Footer() {
  return (
    <div className="page-footer">
      © {new Date().getFullYear()} Sinja Commerce Pvt. Ltd.
    </div>
  );
}
