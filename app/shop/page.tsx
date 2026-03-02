import Link from 'next/link';

export default function ShopPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif text-gray-900 mb-4">Set up your shop</h1>
      <p className="text-gray-600 mb-6">
        Sell your designs (verse art, tees, mugs, and more) with no inventory. You design; a third party prints and ships when someone buys. You keep the margin.
      </p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">How it works</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>You design — art, quote, verse, or graphic.</li>
            <li>You list the product on a store (Printful, Etsy, or Shopify) and connect a print-on-demand partner.</li>
            <li>Customer buys; the partner prints and ships. You never pack or ship.</li>
            <li>You keep the difference between sale price and product cost.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Options</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <strong>Printful (easiest)</strong> — Free store at yourname.printful.com. Upload designs, set prices; they handle the rest.{' '}
              <a href="https://www.printful.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Printful</a>
            </li>
            <li>
              <strong>Etsy + Printful/Printify</strong> — More traffic; connect your Etsy shop to a POD partner.{' '}
              <a href="https://www.etsy.com/sell" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Etsy Sell</a>
              {' · '}
              <a href="https://www.printify.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Printify</a>
            </li>
            <li>
              <strong>Shopify + Printful/Printify</strong> — Your own brand and domain; monthly fee.{' '}
              <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Shopify</a>
            </li>
          </ul>
        </section>

        <p className="text-sm text-gray-500 border-t border-gray-200 pt-6">
          Once your store is live, add your store URL in <Link href="/dashboard/settings" className="text-teal-600 hover:underline">Dashboard → Settings</Link> (Shop URL). The Shop link in the header and on the home page will then point to your store.
        </p>
      </div>
    </main>
  );
}
