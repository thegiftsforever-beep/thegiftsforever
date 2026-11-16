# TheGiftsForever

Gift shop for Pakistan. One repo, two Next.js 15 (App Router, JavaScript, Tailwind v4) apps that share one MongoDB database.

| Folder   | App                 | Dev port | Live                        |
| -------- | ------------------- | -------- | --------------------------- |
| `web/`   | Customer storefront | 3000     | https://www.thegiftsforever.com |
| `admin/` | Admin panel         | 3001     | separate Vercel project     |

Repo: `zoxen-digital/thegirftsforver` (push as the `zoxen-digital` GitHub account). Each app is its own Vercel project, with Root Directory `web` or `admin`; pushing to `main` redeploys both.

## Commands

Run inside `web/` or `admin/`:

- `npm run dev`: start the dev server
- `npx next build`: production build. Run it for both apps before pushing.
- `npm run seed` (admin only): seeds demo data, only when there are no products. `-- --fresh` wipes catalog and content first; orders and uploads are kept.

Windows PowerShell 5.1 does not support `&&`; use `;` instead.

## Environment

Both apps read `.env.local`, which git ignores. Never commit it.

- Both: `MONGODB_URI`, `MONGODB_DB=thegifts`, `NEXT_PUBLIC_SITE_URL`
- Admin also: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `ADMIN_SECRET`

Use the same database values in both apps. On Vercel, admin's `NEXT_PUBLIC_SITE_URL` must be the storefront URL, not localhost.

## Code that is copied in both apps

`lib/models.js`, `lib/utils.js` (`salePrice`, `slugify`, `money`), `lib/db.js` and `lib/uploads.js` exist in `web/` and in `admin/`. A schema change must go into both `models.js` files.

## How things work

- **Uploads:** images are stored inside MongoDB (`StoredUpload`) and served from `/api/uploads/<folder>/<file>` by both apps. Both apps shrink images in the browser before upload, because Vercel rejects request bodies over 4.5MB. Storefront `<Image>` tags pass `unoptimized` for `/api/uploads/` URLs.
- **Admin CRUD is config driven:** server settings live in `admin/lib/resources.js` and the screens in `admin/lib/resourceUi.js` (columns, filters, form fields). Field types include `repeater`, `variations`, `richtext`, `gallery`, `multiselect` and `flags`. Most new admin fields only need a config entry.
- **Admin login:** an HMAC-signed cookie (`lib/auth.js`). A password saved from the Change Password page (`AdminCredential`, scrypt hash) replaces `ADMIN_PASSWORD`.
- **Prices:** the customer pays the entered `price`. `discount` (admin "Discount %") is a label only, shown as "10% off"; it never changes the price. `comparePrice` is unused. The order API (`web/app/api/orders/route.js`) recomputes every price, modifier and delivery fee on the server; never trust prices sent by the client.
- **Delivery and payment:** both come from the first active `Website` document, edited in admin under Websites (`deliveryOptions`, `freeDeliveryOver`, `paymentMethods`). `getSite()` in `web/lib/data.js` supplies defaults when these are empty. Checkout shows a Copy button for each `Label: value` line in payment details. The payment screenshot is optional.
- **Currency:** display only, through `web/components/Currency.js` and `<Price>`. Orders are always stored in PKR.
- **Order alert:** the admin shell polls for orders with status `new`, shows a badge and plays a chime until each one is moved to another status.

## Client conventions

- Website theme colour `#D8A2A2` (`wine` token; `wine-ink` #8C4A4A for text, dark ink text on pink). Admin keeps `#740000` (`brand`). Headings use Poppins, hero titles Dancing Script.
- Do not show cash on delivery or order tracking; the client removed both.
- Every product page shows the line: "💝 Please Read: If an item is unavailable, we may include a similar item of the same value."
- The footer credit "Designed & Developed by Zoxen Digital" links to https://zoxendigital.com. Keep it.
- The client asked for a display-only "% off" label. Remind them to use it only where the product really was sold at the higher price.

## Open items

- The admin order page should follow a design the client sent earlier. That screenshot was lost, so ask the client for it before changing the page.
- The cart page (step 1) does not copy the reference site yet; this needs a screenshot from the client.
- Card payment needs a bank payment gateway account and is not built.
