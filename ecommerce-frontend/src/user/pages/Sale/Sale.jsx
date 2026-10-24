import { Navigate } from "react-router-dom";

/** Sale currently shares the shop experience; keep route for nav/SEO. */
export default function Sale() {
  return <Navigate to="/shop?sort=discount" replace />;
}
