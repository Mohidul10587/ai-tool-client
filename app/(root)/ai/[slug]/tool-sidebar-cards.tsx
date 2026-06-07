import type { Tool } from "./types";

export function PricingCard({ pricingInfo }: { pricingInfo: NonNullable<Tool["pricing_info"]> }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-black mb-4">Pricing</h2>
      <div className="space-y-3">
        {pricingInfo.model && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Pricing model</p>
            <p className="text-sm font-medium text-black">{pricingInfo.model}</p>
          </div>
        )}
        {pricingInfo.paidFrom && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Paid option from</p>
            <p className="text-sm font-medium text-black">{pricingInfo.paidFrom}</p>
          </div>
        )}
        {pricingInfo.billingFrequency && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Billing frequency</p>
            <p className="text-sm font-medium text-black">{pricingInfo.billingFrequency}</p>
          </div>
        )}
        {pricingInfo.freeTrial && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Free Trial</p>
            <p className="text-sm font-medium text-black">{pricingInfo.freeTrial}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ToolInfoCard({ tool }: { tool: Tool }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-black mb-4">Tool Info</h2>
      <div className="space-y-3">
        {tool.url && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Website</p>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black hover:underline">
              {new URL(tool.url).hostname}
            </a>
          </div>
        )}
        {tool.platform && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Platform</p>
            <p className="text-sm font-medium text-black">{tool.platform}</p>
          </div>
        )}
        {tool.subcategory_snapshot && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Category</p>
            <p className="text-sm font-medium text-black">{tool.subcategory_snapshot}</p>
          </div>
        )}
      </div>
    </div>
  );
}
