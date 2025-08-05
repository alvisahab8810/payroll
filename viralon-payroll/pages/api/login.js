// // pages/api/login.js
// import { serialize } from "cookie";

// export default function handler(req, res) {
//   const { username, password } = req.body;

//   if (username === "admin" && password === "admin123") {
//     const cookie = serialize("admin_auth", "true", {
//       path: "/",
//       httpOnly: true,
//       maxAge: 60 * 60 * 24, // 1 day
//     });

//     res.setHeader("Set-Cookie", cookie);
//     res.status(200).json({ success: true });
//   } else {
//     res.status(401).json({ success: false });
//   }
// }



// import { serialize } from "cookie";

// export default function handler(req, res) {
//   const { username, password } = req.body;

//   if (username === "admin" && password === "admin123") {
//     const isProd = process.env.NODE_ENV === "production";

//     const cookie = serialize("admin_auth", "true", {
//       path: "/",
//       httpOnly: true,
//       secure: isProd, // secure only on HTTPS
//       sameSite: "lax",
//       ...(isProd && { domain: "admin.viralon.in" }), // ✅ use domain only in production
//       maxAge: 60 * 60 * 24, // 1 day
//     });

//     res.setHeader("Set-Cookie", cookie);
//     return res.status(200).json({ success: true });
//   }

//   return res.status(401).json({ success: false });
// }




import { serialize } from "cookie";

export default function handler(req, res) {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    const cookie = serialize("admin_auth", "true", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: req.headers.host.includes("localhost") ? undefined : "admin.viralon.in",
      maxAge: 60 * 60 * 24,
    });

    console.log("✅ Setting cookie:", cookie);
    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ success: true });
  }

  console.log("❌ Invalid login attempt:", { username, password });
  return res.status(401).json({ success: false });
}
