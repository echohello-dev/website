export const dynamic = "force-static";

export default function Icon() {
  return new Response(
    `<svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="8" y="8" width="104" height="104" rx="24" fill="#FFA217"/>
<path d="M85 45C85 38.9249 80.0751 34 74 34C67.9249 34 63 38.9249 63 45C63 51.0751 67.9249 56 74 56C80.0751 56 85 51.0751 85 45Z" fill="white"/>
<path d="M57 75C57 70.5817 53.4183 67 49 67C44.5817 67 41 70.5817 41 75C41 79.4183 44.5817 83 49 83C53.4183 83 57 79.4183 57 75Z" fill="white"/>
</svg>`,
    {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    }
  );
}
